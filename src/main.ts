/* The main file, which contains the definitions of the React components for the API Explorer, as
   well as a little bit of code that runs at startup.

   Each component is defined as an ES6 class extending the ReactComponent class. First, we declare
   the property types of the class, and then we declare the class itself.
 */

import * as react from 'react';
import * as reactDom from 'react-dom';
import * as endpoints from './endpoints';
import * as utils from './utils';
import * as apicalls from './apicalls';
import * as codeview from './codeview';
import {
  SelectorParam,
  Parameter,
  VoidParam,
  StructParam,
  Dict,
  UnionParam,
  FileParam,
  ListParam,
  List,
  RootUnionParam,
  Header,
  Endpoint,
} from './utils';

import ReactElement = react.ReactElement;
import HTMLAttributes = react.HTMLAttributes;

// A few definitions to make code less verbose

interface FileElement extends HTMLElement {
    files: File[]
}

const ce = react.createElement;

const developerPage = 'https://www.dropbox.com/developers';
const displayNone = { style: { display: 'none' } };

/* Element for text field in page table.
 */
const tableText = (text: string): react.DetailedReactHTMLElement<any, any> => ce('td', { className: 'label' },
  ce('div', { className: 'text' }, text));

/* Map between client id and associated permission type.
 */
const clientIdMap: Dict = {
  vyjzkx2chlpsooc: 'Team Information',
  pq2bj4ll002gohi: 'Team Auditing',
  j3zzv20pgxds87u: 'Team Member File Access',
  oq1ywlcgrto51qk: 'Team Member Management',
};

/* Get client id from local storage. If doesn't exist. Use default value instead.
 */
const getClientId = (): string => {
  const clientId = utils.getClientId();

  if (clientId != null) {
    return clientId;
  }

  return utils.getAuthType() == utils.AuthType.User
    ? 'cg750anjts67v15'
    : 'vyjzkx2chlpsooc';
};

/* The dropdown menu to select app permission type for business endpoints. For each
business endpoint. Only certain permission type would work and this component maps each
permission type to associated client id.
 */
class AppPermissionInputProps {
    handler: (e: react.FormEvent) => void;
}
class AppPermissionInput extends react.Component<AppPermissionInputProps, any> {
  constructor(props: AppPermissionInputProps) { super(props); }

  public render() {
    const options: react.DetailedReactHTMLElement<any, any>[] = [];
    const clientId = getClientId();

    for (const id in clientIdMap) {
      const value : string = clientIdMap[id];
      const selected : boolean = id == clientId;
      options.push(ce('option', { selected, className: null, children: null }, value));
    }

    return ce('tr', null,
      tableText('App Permission'),
      ce('td', null,
        ce('select', { style: { 'margin-top': '5px' }, onChange: this.props.handler }, options)));
  }
}

/* The TokenInput area governs the authentication token used to issue requests. The user can enter
   a token or click to get a one, and can click another button to toggle showing/hiding the token.
 */
interface TokenInputProps {
    showToken: boolean;
    toggleShow: () => void,
    callback: (value: string) => void
}
class TokenInput extends react.Component<TokenInputProps, any> {
  constructor(props: TokenInputProps) { super(props); }

    handleEdit = (event: react.FormEvent): void => {
      const { value } = <HTMLInputElement>event.target;
      this.props.callback(value);
    };

    // This function handles the initial part of the OAuth2 token flow for the user.
    retrieveAuth = () => {
      const clientId = getClientId();

      const state = `${utils.getHashDict().__ept__}!${utils.createCsrfToken()}`;
      const params: Dict = {
        response_type: 'token',
        client_id: clientId,
        redirect_uri: utils.strippedCurrentURL(),
        state,
        token_access_type: 'online',
      };

      let urlWithParams = 'https://www.dropbox.com/oauth2/authorize?';
      for (const key in params) {
        urlWithParams += `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}&`;
      }
      window.location.assign(urlWithParams);
    };

    public render() {
      return ce('tr', null,
        tableText('Access Token'),
        ce('td', null,
          ce('input', {
            type: this.props.showToken ? 'text' : 'password',
            id: 'token-input',
            defaultValue: utils.getToken(),
            onChange: this.handleEdit,
            placeholder: 'If you don\'t have an access token, click the "Get Token" button to obtain one.',
          }),
          ce('div', { className: 'align-right' },
            ce('button', { onClick: this.retrieveAuth }, 'Get Token'),
            ce('button', { onClick: this.props.toggleShow },
              this.props.showToken ? 'Hide Token' : 'Show Token'))));
    }
}

/* Input component for single parameter.
   A value handler is responsible for value update and signal for specific parameter.
   Every time a field value gets updated, the update method of its corresponding value
   handler should be called.
 */

class ValueHandler {
    // Signal react render.
    update = (): void => null;

    // Update value for current parameter.
    updateValue = (value: any): void => null;
}

/*  Type of value handler which can contain child value handlers.
 */
class ParentValueHandler extends ValueHandler {
    // Create a child value handler based on parameter type.
    getChildHandler = (param: Parameter): ValueHandler => {
      if (param instanceof FileParam) {
        return new FileValueHandler(<FileParam>param, <RootValueHandler><unknown> this);
      }
      if (param instanceof RootUnionParam) {
        return new RootUnionValueHandler(<RootUnionParam>param, <RootValueHandler><unknown> this);
      }
      if (param instanceof UnionParam) {
        return new UnionValueHandler(<UnionParam>param, this);
      }
      if (param instanceof StructParam) {
        return new StructValueHandler(<StructParam>param, this);
      }
      if (param instanceof ListParam) {
        return new ListValueHandler(<ListParam>param, this);
      }

      return new ChildValueHandler<Parameter, ParentValueHandler>(param, this);
    };

    getOrCreate = (name: string, defaultValue: any): any => {
      const dict: Dict = this.current();
      if (name in dict) {
        return dict[name];
      }

      dict[name] = defaultValue;
      return dict[name];
    };

    hasChild = (name: string): boolean => {
      const dict:Dict = this.current();

      if (name in dict) {
        return true;
      }

      return false;
    };

    value = (key: string): any => {
      const dict: Dict = this.current();
      if (key in dict) {
        return dict[key];
      }

      return null;
    };

    updateChildValue = (name: string, value: any): void => {
      const dict:Dict = this.current();

      if (value == null) {
        delete dict[name];
      } else {
        dict[name] = value;
      }
    };

    current = (): Dict|List => { throw new Error('Not implemented.'); };
}

/* Value handler for struct type.
 */
class StructValueHandler extends ParentValueHandler {
    param: StructParam;

    parent: ParentValueHandler;

    constructor(param: StructParam, parent: ParentValueHandler) {
      super();
      this.param = param;
      this.parent = parent;
    }

    add = (): void => {
      if (!this.param.optional) {
        throw new Error('Add is only support for optional parameter.');
      }

      this.current();
      this.update();
    };

    reset = (): void => {
      if (!this.param.optional) {
        throw new Error('Reset is only support for optional parameter.');
      }

      this.parent.updateChildValue(this.param.name, this.param.defaultValue());
      this.update();
    };

    current = (): Dict => this.parent.getOrCreate(this.param.name, {});

    update = (): void => this.parent.update();
}

/* Value handler for union type.
 */
class UnionValueHandler extends StructValueHandler {
  constructor(param: UnionParam, parent: ParentValueHandler) {
    super(param, parent);
  }

    getTag = (): string => {
      if (this.parent.hasChild(this.param.name)) {
        return this.value('.tag');
      }

      return null;
    };

    updateTag = (tag: string): void => {
      this.parent.updateChildValue(this.param.name, this.param.optional ? null : {});

      if (tag != null) {
        this.updateChildValue('.tag', tag);
      }
    };

    getTagHandler = (): TagValueHandler => new TagValueHandler(this)
}

/* Special case when root type is a union.
 */
class RootUnionValueHandler extends UnionValueHandler {
  constructor(param: RootUnionParam, handler: RootValueHandler) {
    super(param, handler);
  }

    getTag = (): string => this.value('.tag');

    updateTag = (tag: string): void => {
      const dict: Dict = this.current();

      for (const name in dict) {
        delete dict[name];
      }

      if (tag != null) {
        dict['.tag'] = tag;
      }
    };

    current = (): Dict => this.parent.current();

    update = (): void => this.parent.update();

    getTagHandler = (): TagValueHandler => new TagValueHandler(this)
}

/* Value handler for list type.
 */
class ListValueHandler extends ParentValueHandler {
    param: ListParam;

    parent: ParentValueHandler;

    constructor(param: ListParam, parent: ParentValueHandler) {
      super();
      this.param = param;
      this.parent = parent;
    }

    addItem = (): void => {
      const list: List = this.current();
      const param: Parameter = this.param.createItem(0);
      list.push(param.defaultValue());
      this.update();
    };

    reset = (): void => {
      this.parent.updateChildValue(this.param.name, this.param.defaultValue());
      this.update();
    };

    getOrCreate = (name: string, defaultValue: any): any => this.current()[+name];

    hasChild = (name: string) => true;

    value =
      (key: string): any => this.current()[+name]; // eslint-disable-line no-restricted-globals

    updateChildValue = (name: string, value: any): void => {
      this.current()[+name] = value;
    };

    current = (): List => this.parent.getOrCreate(this.param.name, []);

    update = (): void => this.parent.update();
}

/* Value handler for primitive types.
 */
class ChildValueHandler<T extends Parameter, S extends ParentValueHandler> extends ValueHandler {
    param: T;

    parent: S;

    constructor(param: T, parent: S) {
      super();
      this.param = param;
      this.parent = parent;
    }

    updateValue = (value: any): void => {
      this.parent.updateChildValue(this.param.name, value);
    };

    update = (): void => this.parent.update();
}

/* Value handler for file parameter.
 */
class FileValueHandler extends ChildValueHandler<FileParam, RootValueHandler> {
  constructor(param: FileParam, parent: RootValueHandler) {
    super(param, parent);
  }

    // Update value of current parameter.
    updateValue = (value: any): void => {
      this.parent.updateFile(value);
    }
}

/* Value handler for union tag.
 */
class TagValueHandler extends ChildValueHandler<Parameter, UnionValueHandler> {
  constructor(parent: UnionValueHandler) {
    super(null, parent);
  }

    updateValue = (value: any): void => {
      this.parent.updateTag(value);
    }
}

/* Value handler for root.
 */
class RootValueHandler extends ParentValueHandler {
    paramVals: Dict;

    fileVals: Dict;

    callback: (params: Dict, file: Dict) => void;

    constructor(paramVals: Dict, fileVals: Dict, callback: (params: Dict, files: Dict) => void) {
      super();
      this.paramVals = paramVals;
      this.fileVals = fileVals;
      this.callback = callback;
    }

    current = ():Dict => this.paramVals;

    update = (): void => this.callback(this.paramVals, this.fileVals);

    updateFile = (value: string) => this.fileVals.file = value;
}

class ParamInput<P> extends react.Component<P, any> {
  constructor(props: P) {
    super(props);
  }

  public render(): any { // eslint-disable-line class-methods-use-this
    throw new Error('Not implemented.');
  }
}

// The ParamInput area handles the input field of a single parameter to an endpoint.
interface SingleParamInputProps {
    key: string;
    handler: ValueHandler;
    param: Parameter
}

/* Input component for single parameter.
 */
class SingleParamInput extends ParamInput<SingleParamInputProps> {
  constructor(props: SingleParamInputProps) {
    super(props);
  }

    // When the field is edited, its value is parsed and the state is updated.
    handleEdit = (event: Event) => {
      let valueToReturn: any = null;
      // special case: the target isn't an HTMLInputElement
      if (this.props.param.name === '__file__') {
        const fileTarget: FileElement = <FileElement>event.target;
        if (fileTarget.files.length > 0) valueToReturn = fileTarget.files[0];
      } else {
        const target: HTMLInputElement = <HTMLInputElement>event.target;
        /* If valueToReturn is left as null, it signals an optional value that should be
             deleted from the dict of param values.
             */
        if (target.value !== '' || !this.props.param.optional) {
          valueToReturn = this.props.param.getValue(target.value);
        }
      }
      this.props.handler.updateValue(valueToReturn);
      this.props.handler.update();
    };

    public render() {
      return this.props.param.asReact({ onChange: this.handleEdit }, this.props.key);
    }
}

/* Some parameters are structs of other parameters, e.g. in upload_session/finish. In the input
   field, structs are treated as just a list of parameters. This means we currently can't really
   signal optional structs to the user. Moreover, nested structs are currently not possible.
 */
interface StructParamInputProps {
    key: string;
    handler: StructValueHandler;
    param: utils.StructParam;
}
class StructParamInput extends ParamInput<StructParamInputProps> {
  constructor(props: StructParamInputProps) {
    super(props);
    this.state = { display: !props.param.optional };
  }

    add = () => {
      this.props.handler.add();
      this.setState({ display: true });
    };

    reset = () => {
      this.props.handler.reset();
      this.setState({ display: false });
    };

    public render() {
      return ce('tr', null,
        this.props.param.getNameColumn(),
        ce('td', null,
          ce('table', null,
            ce('tbody', null, this.renderItems()))));
    }

    renderItems = (): react.DetailedReactHTMLElement<any, any>[] => {
      const ret: react.DetailedReactHTMLElement<any, any>[] = [];

      if (this.state.display || !this.props.param.optional) {
        for (const p of this.props.param.fields) {
          const input = ParamClassChooser.getParamInput(p, {
            key: `${this.props.key}_${this.props.param.name}_${p.name}`,
            handler: this.props.handler.getChildHandler(p),
            param: p,
          });

          ret.push(input);
        }
      }

      if (this.props.param.optional) {
        const button = this.state.display
          ? ce('button', { onClick: this.reset }, 'Clear')
          : ce('button', { onClick: this.add }, 'Add');

        ret.push(ce('tr', { className: 'struct-param-actions' },
          ce('td', null, button)));
      }

      return ret;
    }
}

interface UnionParamInputProps {
    key: string;
    handler: UnionValueHandler;
    param: utils.UnionParam;
}
class UnionParamInput extends ParamInput<UnionParamInputProps> {
  constructor(props: UnionParamInputProps) {
    super(props);
  }

    getParam = (): StructParam => {
      const tag: string = this.props.handler.getTag();
      let fields: Parameter[] = null;
      if (tag == null) {
        fields = [];
      } else {
        const param: Parameter = this.props.param.fields.filter((t) => t.name == tag)[0];

        if (param instanceof StructParam) {
          fields = (<StructParam>param).fields;
        } else if (param instanceof VoidParam) {
          fields = [];
        } else {
          fields = [param];
        }
      }

      return new StructParam(this.props.param.name, false, fields);
    };

    public render() {
      const selectParamProps: SingleParamInputProps = {
        key: `${this.props.key}_selector`,
        handler: this.props.handler.getTagHandler(),
        param: this.props.param.getSelectorParam(this.props.handler.getTag()),
      };

      const param = this.getParam();

      if (param.fields.length == 0) {
        return ce(SingleParamInput, selectParamProps);
      }

      const structParam = new StructParamInput({
        key: `${this.props.key}_${param.name}`,
        handler: this.props.handler,
        param,
      });

      return ce('tr', null,
        this.props.param.getNameColumn(),
        ce('td', null,
          ce('table', null,
            ce('tbody', null, [<any>ce(SingleParamInput, selectParamProps)].concat(structParam.renderItems())))));
    }
}

interface ListParamInputProps {
    key: string;
    handler: ListValueHandler;
    param: utils.ListParam;
}
class ListParamInput extends ParamInput<ListParamInputProps> {
  constructor(props: ListParamInputProps) {
    super(props);
    this.state = { count: 0 };
  }

    addItem = (): void => {
      this.props.handler.addItem();
      this.setState({ count: this.state.count + 1 });
    };

    reset = (): void => {
      this.props.handler.reset();
      this.setState({ count: 0 });
    };

    public render() {
      return ce('tr', null,
        this.props.param.getNameColumn(),
        ce('td', null,
          ce('table', null,
            ce('tbody', null, this.renderItems()))));
    }

    renderItems = (): react.DetailedReactHTMLElement<any, any>[] => {
      const ret: react.DetailedReactHTMLElement<any, any>[] = [];
      for (let i = 0; i < this.state.count; i++) {
        const param: Parameter = this.props.param.createItem(i);
        const item: react.DetailedReactHTMLElement<any, any> = ParamClassChooser
          .getParamInput(param, {
            key: `${this.props.key}_${this.props.param.name}_${i.toString()}`,
            handler: this.props.handler.getChildHandler(param),
            param,
          });

        ret.push(item);
      }

      ret.push(ce('tr', { className: 'list-param-actions' },
        ce('td', null,
          ce('button', { onClick: this.addItem }, 'Add'),
          ce('button', { onClick: this.reset }, 'Clear'))));

      return ret;
    }
}

// Picks the correct React class for a parameter, depending on whether it's a struct.
class ParamClassChooser {
  public static getParamInput(param: Parameter, props: any): any {
    if (param instanceof utils.UnionParam) {
      return ce(UnionParamInput, <UnionParamInputProps>props);
    }
    if (param instanceof utils.StructParam) {
      return ce(StructParamInput, <StructParamInputProps>props);
    }
    if (param instanceof utils.ListParam) {
      return ce(ListParamInput, <ListParamInputProps>props);
    }

    return ce(SingleParamInput, <SingleParamInputProps>props);
  }
}

/* The code view section of the API Explorer. This component manages a selector which chooses what
   format to display the code in, as well as the div that contains the code view itself.
 */
interface CodeAreaProps {
    ept: Endpoint;
    paramVals: Dict;
    headerVals: Header[],
    __file__: File,
    token: string
}
class CodeArea extends react.Component<CodeAreaProps, any> {
  constructor(props: CodeAreaProps) {
    super(props);
    this.state = { formatter: codeview.formats.curl };
  }

    changeFormat = (event: react.FormEvent) => {
      const newFormat = (<HTMLInputElement>event.target).value;
      this.setState({ formatter: codeview.formats[newFormat] });
    };

    public render() {
      return ce('span', { id: 'code-area' },
        ce('p', null, 'View request as ', codeview.getSelector(this.changeFormat)),
        ce('span', null, codeview.render(this.state.formatter, this.props.ept, this.props.token,
          this.props.paramVals, this.props.headerVals, this.props.__file__)));
    }
}

/* A component handling all the main user-input areas of the document: the token area, the
   parameter areas, and the code view. Because of this, it holds a lot of state: the token and
   whether to show or hide it; the paramVals and file that are passed to the code viewer or
   submitted; and any error messages.
 */
interface RequestAreaProps {
    currEpt: Endpoint;
    APICaller: (paramsData: string, ept: Endpoint, token: string,
                 headers: Header[], responseFn: apicalls.Callback, file: File) => void;
    inProgress: boolean
}
class RequestArea extends react.Component<RequestAreaProps, any> {
  constructor(props: RequestAreaProps) {
    super(props);
    this.state = {
      paramVals: utils.initialValues(this.props.currEpt),
      headerVals: [],
      fileVals: { file: null }, // a signal that no file has been chosen
      errMsg: null,
      showToken: true,
      showCode: false,
      showHeaders: false,
    };
  }

    updateParamValues = (paramVals: Dict, fileVals: Dict) => {
      this.setState({ paramVals, fileVals });
      this.forceUpdate();
    };

    updateHeaderValues = (headerVals: Header[]) => {
      this.setState({ headerVals });
      this.forceUpdate();
    };

    updateTokenValue = (tokenValue: string) => {
      // This is called only to trigger live update. Use utils.getToken
      // to get latest token.
      utils.putToken(tokenValue);
      this.forceUpdate();
    };

    /* Called when a new endpoint is chosen or the user updates the token. If a new endpoint is
       chosen, we should initialize its parameter values; if a new token is chosen, any error
       message about the token no longer applies.
     */
    componentWillReceiveProps = (newProps: RequestAreaProps) => {
      if (newProps.currEpt !== this.props.currEpt) {
        this.updateParamValues(utils.initialValues(newProps.currEpt), { file: null });
      }

      this.setState({ errMsg: null });
    };

    /* Submits a call to the API. This function handles the display logic (e.g. whether or not to
       display an error message for a missing token), and the APICaller prop actually sends the
       request.
     */
    submit = () => {
      const token = utils.getToken();
      const { currEpt } = this.props;
      const authType = currEpt.getAuthType();

      if (authType == utils.AuthType.App) {
        this.setState({
          errMsg: 'Error: Making API call for app auth endpoint is not supported. Please run the code using credential of your own app.',
        });
      } else if (authType != utils.AuthType.None && (token == null || token === '')) {
        this.setState({
          errMsg: 'Error: missing token. Please enter a token above or click the "Get Token" button.',
        });
      } else {
        this.setState({ errMsg: null });
        const responseFn = apicalls.chooseCallback(currEpt.getEndpointKind(),
          utils.getDownloadName(currEpt, this.state.paramVals));
        this.props.APICaller(JSON.stringify(this.state.paramVals), currEpt,
          token, this.state.headerVals, responseFn, this.state.fileVals.file);
      }
    };

    // Toggles whether the token is hidden, or visible on the screen.
    showOrHide = () => this.setState({ showToken: !this.state.showToken });

    // Toggles whether code block is visible.
    showOrHideCode = () => this.setState({ showCode: !this.state.showCode });

    // Toggles whether header block is visible.
    showOrHideHeaders = () => this.setState({ showHeaders: !this.state.showHeaders });

    // Update client id when app permission change.
    updateClientId = (e: react.FormEvent): void => {
      const { value } = <HTMLOptionElement>(e.target);
      for (const id in clientIdMap) {
        if (clientIdMap[id] == value) {
          utils.putClientId(id);
          return;
        }
      }
    };

    public render() {
      let errMsg: any = [];

      if (this.state.errMsg != null) {
        errMsg = [ce('span', { style: { color: 'red' } }, this.state.errMsg)];
      }

      const name = this.props.currEpt.name.replace('/', '-');
      const documentation = `${developerPage}/documentation/http/documentation#${this.props.currEpt.ns}-${name}`;
      const handler = new RootValueHandler(this.state.paramVals,
        this.state.fileVals, this.updateParamValues);
      const headerHandler = new RequestHeaderRootHandler(this.state.headerVals,
        this.updateHeaderValues);

      return ce('span', { id: 'request-area' },
        ce('table', { className: 'page-table' },
          ce('tbody', null,
            utils.getAuthType() == utils.AuthType.Team
              ? ce(AppPermissionInput, { handler: this.updateClientId })
              : null,
            ce(TokenInput, {
              toggleShow: this.showOrHide,
              showToken: this.state.showToken,
              callback: this.updateTokenValue,
            }),
            ce('tr', null,
              tableText('Request'),
              ce('td', null,
                ce('div', { className: 'align-right' },
                  ce('a', { href: documentation },
                    'Documentation')),
                ce('table', { id: 'parameter-list' },
                  ce('tbody', null,
                    this.props.currEpt.params.map(
                      (param: Parameter) => ParamClassChooser.getParamInput(param, {
                        key: this.props.currEpt.name + param.name,
                        handler: handler.getChildHandler(param),
                        param,
                      }),
                    ))),
                ce('div', null,
                  ce('button', { onClick: this.showOrHideHeaders }, this.state.showHeaders ? 'Hide Headers' : 'Show Headers'),
                  ce('button', { onClick: this.showOrHideCode }, this.state.showCode ? 'Hide Code' : 'Show Code'),
                  ce('button', { onClick: this.submit, disabled: this.props.inProgress }, 'Submit Call'),
                  ce('img', {
                    src: 'https://www.dropbox.com/static/images/icons/ajax-loading-small.gif',
                    hidden: !this.props.inProgress,
                    style: { position: 'relative', top: '2px', left: '10px' },
                  }),
                  errMsg))),
            ce('tr', this.state.showHeaders ? null : displayNone,
              tableText('Headers'),
              ce('td', null,
                ce('div', { id: 'request-headers' },
                  ce(RequestHeaderArea, { handler: headerHandler })))),
            ce('tr', this.state.showCode ? null : displayNone,
              tableText('Code'),
              ce('td', null,
                ce('div', { id: 'request-container' },
                  ce(CodeArea, {
                    ept: this.props.currEpt,
                    paramVals: this.state.paramVals,
                    headerVals: this.state.headerVals,
                    __file__: this.state.fileVals.file,
                    token: this.state.showToken ? utils.getToken() : '<access-token>',
                  })))))));
    }
}

interface RequestHeaderAreaProps {
    handler: RequestHeaderRootHandler
}

class RequestHeaderArea extends react.Component<RequestHeaderAreaProps, any> {
  constructor(props: RequestHeaderAreaProps) {
    super(props);
  }

  public render() {
    const { handler } = this.props;

    return ce('span', { id: 'request-header-area' },
      ce('div', null, ce('button', { onClick: handler.add }, 'Add Header')),
      ce('table', null,
        ce('tbody', null,
          handler.getHeaders().map(
            (header: Header) => ce(RequestHeaderInput, {
              header,
              handler: new RequestHeaderHandler(handler),
            }),
          ))));
  }
}

class RequestHeaderRootHandler {
    headers: Header[];

    callBack: (headers: Header[]) => void;

    constructor(headers: Header[], callback: (headers: Header[]) => void) {
      this.headers = headers;
      this.callBack = callback;
    }

    remove = (header: Header): void => {
      const index = this.headers.indexOf(header);
      this.headers.splice(index, 1);
      this.callBack(this.headers);
    };

    add = (): void => {
      this.headers.push(new Header());
      this.callBack(this.headers);
    };

    update = (): void => {
      this.callBack(this.headers);
    };

    getHeaders = (): Header[] => this.headers
}

class RequestHeaderHandler {
    parentHandler: RequestHeaderRootHandler;

    constructor(parentHandler: RequestHeaderRootHandler) {
      this.parentHandler = parentHandler;
    }

    onChange = (header: Header, removed: boolean) => {
      if (removed) {
        this.parentHandler.remove(header);
      } else {
        this.parentHandler.update();
      }
    };
}

interface RequestHeaderInputProps {
    header: Header,
    handler: RequestHeaderHandler
}

class RequestHeaderInput extends react.Component<RequestHeaderInputProps, any> {
  constructor(props: RequestHeaderInputProps) {
    super(props);
  }

  public render() {
    return this.props.header.asReact(this.props.handler.onChange);
  }
}

/* A small component governing an endpoint on the sidebar, to bold it when it's selected and
   handle the logic when it is clicked.
 */
interface EndpointChoiceProps {
    key: string;
    ept: Endpoint;
    handleClick: (ept: Endpoint) => void;
    isSelected: boolean
}
class EndpointChoice extends react.Component<EndpointChoiceProps, any> {
  constructor(props: EndpointChoiceProps) { super(props); }

    onClick = () => this.props.handleClick(this.props.ept);

    public render() {
      return (this.props.isSelected)
        ? ce('li', null, ce('b', null, this.props.ept.name), ce('br', null))
        : ce('li', null, ce('a', { onClick: this.onClick }, this.props.ept.name), ce('br', null));
    }
}

/* The EndpointSelector component governs the list of endpoints on the sidebar, and propagates the
   information of which one is currently selected.
 */
interface EndpointSelectorProps {
    eptChanged: (ept: Endpoint) => void;
    currEpt: Endpoint
}
class EndpointSelector extends react.Component<EndpointSelectorProps, any> {
  constructor(props: EndpointSelectorProps) { super(props); }

    filter = (ept: Endpoint): boolean => {
      if (ept.params.length > 0 && ept.params.indexOf(null) >= 0) {
        // Skip not implemented endpoints.
        return true;
      }

      const eptAuthType = ept.getAuthType() == utils.AuthType.Team
        ? utils.AuthType.Team
        : utils.AuthType.User;

      if (eptAuthType != utils.getAuthType()) {
        // Skip endpoints with different auth type.
        return true;
      }

      return false;
    };

    // Renders the logo and the list of endpoints
    public render() {
      const groups: {[ns: string]: Endpoint[]} = {};
      const namespaces: string[] = [];

      endpoints.endpointList.forEach((ept: Endpoint) => {
        if (this.filter(ept)) {
          return;
        }

        if (groups[ept.ns] == undefined) {
          groups[ept.ns] = [ept];
          namespaces.push(ept.ns);
        } else {
          groups[ept.ns].push(ept);
        }
      });

      return ce('div', { id: 'sidebar' },
        ce('p', { style: { marginLeft: '35px', marginTop: '12px' } },
          ce('a', { onClick: () => window.location.href = developerPage },
            ce('img', {
              src: 'https://cfl.dropboxstatic.com/static/images/logo_catalog/blue_dropbox_glyph_m1-vflZvZxbS.png',
              width: 36,
              className: 'home-icon',
            }))),
        ce('div', { id: 'endpoint-list' },
          namespaces.sort().map((ns: string) => ce('div', null,
            ce('li', null, ns),
            groups[ns].map((ept: Endpoint) => ce(EndpointChoice, {
              key: ept.name,
              ept,
              handleClick: this.props.eptChanged,
              isSelected: this.props.currEpt == ept,
            }))))));
    }
}

/* The React component for resposne area).
 */
interface ResponseAreaProps {
    hide: boolean;
    responseText: string;
    downloadButton: any;
}
class ResponseArea extends react.Component<ResponseAreaProps, any> {
  constructor(props: ResponseAreaProps) {
    super(props);
  }

  public render() {
    return ce('span', { id: 'response-area' },
      ce('table', { className: 'page-table' },
        ce('tbody', this.props.hide ? displayNone : null,
          ce('tr', null,
            tableText('Response'),
            ce('td', null,
              ce('div', { id: 'response-container' },
                ce(utils.Highlight, { className: 'json', children: null }, this.props.responseText)),
              ce('div', null, this.props.downloadButton))))));
  }
}

/* The top-level React component for the API Explorer (except text-based pages, such as the intro
   page and the error pages).
 */
interface APIExplorerProps {
    initEpt: Endpoint
}
class APIExplorer extends react.Component<APIExplorerProps, any> {
  constructor(props: APIExplorerProps) {
    super(props);
    this.state = {
      ept: this.props.initEpt,
      downloadURL: '',
      responseText: '',
      inProgress: false,
    };
  }

    componentWillReceiveProps = (newProps: APIExplorerProps) => this.setState({
      ept: newProps.initEpt,
      downloadURL: '',
      responseText: '',
    });

    APICaller = (paramsData: string, endpt: Endpoint, token: string,
      headers: Header[], responseFn: apicalls.Callback, file: File) => {
      this.setState({ inProgress: true });

      const responseFn_wrapper: apicalls.Callback = (component: any, resp: XMLHttpRequest) => {
        this.setState({ inProgress: false });
        responseFn(component, resp);
      };

      apicalls.APIWrapper(paramsData, endpt, token, headers, responseFn_wrapper, this, file);
    };

    public render() {
      // This button pops up only on download
      const downloadButton = (this.state.downloadURL !== '')
        ? ce('a', {
          href: this.state.downloadURL,
          download: this.state.downloadFilename,
        }, ce('button', null, `Download ${this.state.downloadFilename}`))
        : null;

      const props: MainPageProps = {
        currEpt: this.state.ept,
        header: ce('span', null, `Dropbox API Explorer • ${this.state.ept.name}`),
        messages: [
          ce(RequestArea, {
            currEpt: this.state.ept,
            APICaller: this.APICaller,
            inProgress: this.state.inProgress,
          }),
          ce(ResponseArea, {
            hide: this.state.inProgress || this.state.responseText == '',
            responseText: this.state.responseText,
            downloadButton,
          }),
        ],
      };

      return ce(MainPage, props);
    }
}

/* This class renders the main page which contains endpoint selector
   sidebar and main content page.
 */
interface MainPageProps {
    currEpt: Endpoint;
    header: react.ReactElement<any>;
    messages: react.ReactElement<any>[];
}
class MainPage extends react.Component<MainPageProps, any> {
  constructor(props: MainPageProps) { super(props); }

    getAuthSwitch = (): react.DetailedReactHTMLElement<any, any> => {
      if (utils.getAuthType() == utils.AuthType.User) {
        return ce('a', { id: 'auth-switch', href: `${utils.currentURL()}team/` }, 'Switch to Business endpoints');
      }

      return ce('a', { id: 'auth-switch', href: '../' }, 'Switch to User endpoints');
    };

    public render() {
      return ce('span', null,
        ce(EndpointSelector, {
          eptChanged: (endpt: Endpoint) => window.location.hash = `#${endpt.getFullName()}`,
          currEpt: this.props.currEpt,
        }),
        ce('h1', { id: 'header' }, this.props.header, this.getAuthSwitch()),
        ce('div', { id: 'page-content' },
          this.props.messages));
    }
}

/* This class renders a text page (the intro page and error messages). Then, each page is an
   instance of TextPage.
 */
interface TextPageProps {
    message: react.DetailedReactHTMLElement<any, any>;
}
class TextPage extends react.Component<TextPageProps, any> {
  constructor(props: TextPageProps) { super(props); }

  public render() {
    return ce(MainPage, {
      currEpt: new Endpoint('', '', null),
      header: ce('span', null, 'Dropbox API Explorer'),
      messages: [this.props.message],
    });
  }
}

// Introductory page, which people see when they first open the webpage
const introPage: react.ReactElement<TextPageProps> = ce(TextPage, {
  message:
            ce('span', null,
              ce('p', null, 'Welcome to the Dropbox API Explorer!'),
              ce('p', null,
                'This API Explorer is a tool to help you learn about the ',
                ce('a', { href: developerPage }, 'Dropbox API v2'),
                ' and test your own examples. For each endpoint, you\'ll be able to submit an API call ',
                'with your own parameters and see the code for that call, as well as the API response.'),
              ce('p', null,
                'Click on an endpoint on your left to get started, or check out ',
                ce('a', { href: `${developerPage}/documentation` },
                  'the documentation'),
                ' for more information on the API.')),
});

/* The endpoint name (supplied via the URL's hash) doesn't correspond to any actual endpoint. Right
   now, this can only happen if the user edits the URL hash.
   React sanitizes its inputs, so displaying the hash below is safe.
 */
const endpointNotFound: react.ReactElement<TextPageProps> = ce(TextPage, {
  message:
            ce('span', null,
              ce('p', null, 'Welcome to the Dropbox API Explorer!'),
              ce('p', null,
                'Unfortunately, there doesn\'t seem to be an endpoint called ',
                ce('b', null, window.location.hash.substr(1)),
                '. Try clicking on an endpoint on the left instead.'),
              ce('p', null, 'If you think you received this message in error, please get in contact with us.')),
});

/* Error when the state parameter of the hash isn't what was expected, which could be due to an
   XSRF attack.
 */
const stateError: react.ReactElement<TextPageProps> = ce(TextPage, {
  message:
            ce('span', null,
              ce('p', null, ''),
              ce('p', null,
                'Unfortunately, there was a problem retrieving your OAuth2 token; please try again. ',
                'If this error persists, you may be using an insecure network.'),
              ce('p', null, 'If you think you received this message in error, please get in contact with us.')),
});

/* The hash of the URL determines which page to render; no hash renders the intro page, and
   'auth_error!' (the ! chosen so it's less likely to have a name clash) renders the stateError
   page when the state parameter isn't what was expected.
 */
const renderGivenHash = (hash: string): void => {
  if (hash === '' || hash === undefined) {
    reactDom.render(introPage, document.body);
  } else if (hash === 'xkcd') {
    window.location.href = 'https://xkcd.com/1481/';
  } else if (hash === 'auth_error!') {
    reactDom.render(stateError, document.body);
  } else {
    const currEpt = utils.getEndpoint(endpoints.endpointList, decodeURIComponent(hash));
    if (currEpt === null) {
      reactDom.render(endpointNotFound, document.body);
    } else {
      reactDom.render(ce(APIExplorer, { initEpt: currEpt }), document.body);
    }
  }
};

const checkCsrf = (state: string): string => {
  if (state === null) return null;
  const div = state.indexOf('!');
  if (div < 0) return null;
  const csrfToken = state.substring(div + 1);
  if (!utils.checkCsrfToken(csrfToken)) return null;
  return state.substring(0, div); // The part before the CSRF token.
};

/* Things that need to be initialized at the start.
    1. Set up the listener for hash changes.
    2. Process the initial hash. This only occurs when the user goes through token flow, which
       redirects the page back to the API Explorer website, but with a hash that contains the
       token and some extra state (to check against XSRF attacks).
 */
const main = (): void => {
  window.onhashchange = (e: any) => {
    // first one works everywhere but IE, second one works everywhere but Firefox 40
    renderGivenHash(e.newURL ? e.newURL.split('#')[1] : window.location.hash.slice(1));
  };

  const hashes = utils.getHashDict();
  if ('state' in hashes) { // completing token flow, and checking the state is OK
    const state = checkCsrf(hashes.state);
    if (state === null) {
      window.location.hash = '#auth_error!';
    } else {
      utils.putToken(hashes.access_token);
      window.location.href = `${utils.currentURL()}#${state}`;
    }
  } else if ('__ept__' in hashes) { // no token, but an endpoint selected
    renderGivenHash(hashes.__ept__);
  } else { // no endpoint selected: render the intro page
    reactDom.render(introPage, document.body);
  }
};

main();

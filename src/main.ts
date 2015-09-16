/* The main file, which contains the definitions of the React components for the API Explorer, as
   well as a little bit of code that runs at startup.

   Each component is defined as an ES6 class extending the ReactComponent class. First, we declare
   the property types of the class, and then we declare the class itself.
 */

import react = require('react');

import endpoints = require('./endpoints');
import utils = require('./utils');
import apicalls = require('./apicalls');
import codeview = require('./codeview');

// A few definitions to make code less verbose
type ValueHandler = (key: string, value: any) => void;
interface FileElement extends HTMLElement {
    files: File[]
}

const ce = react.createElement;
const  d = react.DOM;
const pt = react.PropTypes;

/* The TokenInput area governs the authentication token used to issue requests. The user can enter
   a token or click to get a one, and can click another button to toggle showing/hiding the token.
 */
interface TokenInputProps {
    showToken:    boolean;
    toggleShow:   () => void
}
class TokenInput extends react.Component<TokenInputProps, void> {
    constructor(props: TokenInputProps) { super(props); }

    handleEdit = (event: react.FormEvent): void =>
        utils.putToken((<HTMLInputElement>event.target).value);

    // This function handles the initial part of the OAuth2 token flow for the user.
    retrieveAuth = () => {
        const state = utils.getHashDict()['__ept__'] + '!' + utils.createCsrfToken();
        const params: utils.Dict = {
            response_type: 'token',
            client_id:     'cg750anjts67v15',
            redirect_uri:  utils.currentURL(),
            state:         state,
        }
        let urlWithParams = 'https://www.dropbox.com/1/oauth2/authorize?';
        for (let key in params) {
            urlWithParams += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&';
        }
        window.location.assign(urlWithParams);
    }
    public render() {
        return d.p(null,
            "Please paste your access token here. If you don't have an access token, click the ",
            '"Get Token" button to obtain one.', d.br(null),
            d.input({
                type:         this.props.showToken? 'text' : 'password',
                id:           'auth',
                size:         75,
                defaultValue: utils.getToken(),
                onChange:     this.handleEdit
            }),
            ' ',
            d.button({onClick: this.retrieveAuth}, 'Get Token'),
            ' ',
            d.button({onClick: this.props.toggleShow},
                this.props.showToken? 'Hide Token' : 'Show Token'
            )
        );
    }
}

// The ParamInput area handles the input field of a single parameter to an endpoint.
interface ParamInputProps {
    key:      string;
    onChange: ValueHandler;
    param:    utils.Parameter
}
class ParamInput extends react.Component<ParamInputProps, any> {
    constructor(props: ParamInputProps) {
        super(props);
        this.state = {text: ''};
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
            this.setState({text: target.value});
            /* If valueToReturn is left as null, it signals an optional value that should be
               deleted from the dict of param values.
             */
            if (target.value !== '' || !this.props.param.optional) {
                valueToReturn = this.props.param.getValue(target.value);
            }
        }
        this.props.onChange(this.props.param.name, valueToReturn);
    }

    shouldComponentUpdate = (_: ParamInputProps, newState: utils.Dict) =>
        this.state.text !== newState['text'];

    /* Since different kinds of parameters have to render differently, this render method is a
       wrapper to the parameter's own method.
    */
    public render() {
        return this.props.param.asReact({onChange: this.handleEdit});
    }
}

/* Some parameters are structs of other parameters, e.g. in upload_session/finish. In the input
   field, structs are treated as just a list of parameters. This means we currently can't really
   signal optional structs to the user. Moreover, nested structs are currently not possible.
 */
interface StructInputProps {
    key:             string;
    onChange:        ValueHandler;
    param:           utils.StructParam;
    componentEdited: ValueHandler
}
class StructParamInput extends react.Component<StructInputProps, any> {
    constructor(props: StructInputProps) {
        super(props);
        this.state = {fields: this.props.param.defaultValue()};
    }
    // Updates the whole struct
    componentEdited = (name: string, value: any) => {
        let newFields: utils.Dict = this.state.fields;
        if (value === null) delete newFields[name];
        else newFields[name] = value;
        this.setState({fields: newFields});
        this.props.onChange(this.props.param.name, newFields);
    }
    // Updates a specific field
    fieldEdited = (param: utils.Parameter, event: Event) => {
        const target: HTMLInputElement = <HTMLInputElement>event.target;
        // If valueToReturn is null, it signifies that the value should be removed from the list
        const valueToReturn: any = (target.value !== '' || !param.optional)?
            param.getValue(target.value) : null;
        this.props.componentEdited(param.name, valueToReturn);
    }
    public render() {
        return d.span(null,
            utils.Dict.map(this.props.param.fields, (name: string, value: utils.Parameter) =>
                ce(ParamInput, {
                    key:      this.props.param.name + '_' + name,
                    onChange: this.componentEdited,
                    param:    value
                })
            )
        );
    }
}

// Picks the correct React class for a parameter, depending on whether it's a struct.
const paramClassChooser = (param: utils.Parameter) => param.isStructParam?
    StructParamInput : ParamInput;

/* The code view section of the API Explorer. This component manages a selector which chooses what
   format to display the code in, as well as the div that contains the code view itself.
 */
interface CodeAreaProps {
    ept:       utils.Endpoint;
    paramVals: utils.Dict;
    __file__:  File,
    token:     string
}
class CodeArea extends react.Component<CodeAreaProps, any> {
    constructor(props: CodeAreaProps) {
        super(props);
        this.state = {formatter: codeview.formats['curl']};
    }
    changeFormat = (event: react.FormEvent) => {
        const newFormat = (<HTMLInputElement>event.target).value;
        this.setState({formatter: codeview.formats[newFormat]});
    }

    public render() {
        return d.span({id: 'codearea'},
            d.p(null, 'View request as ', codeview.getSelector(this.changeFormat)),
            d.span(null, codeview.render(this.state.formatter, this.props.ept, this.props.token,
                                         this.props.paramVals, this.props.__file__))
        );
    }
}
/* A component handling all the main user-input areas of the document: the token area, the
   parameter areas, and the code view. Because of this, it holds a lot of state: the token and
   whether to show or hide it; the paramVals and file that are passed to the code viewer or
   submitted; and any error messages.
 */
interface RequestAreaProps {
    currEpt:   utils.Endpoint;
    APICaller: (paramsData: string, ept: utils.Endpoint, token: string,
               responseFn: apicalls.Callback, file: File) => void;
}
class RequestArea extends react.Component<RequestAreaProps, any> {
    constructor(props: RequestAreaProps) {
        super(props);
        this.state = {
            paramVals:   utils.initialValues(this.props.currEpt),
            __file__:    null, // a signal that no file has been chosen
            errMsg:      d.span(null),
            showToken:   false
        };
    }
    updateParamValues = (key: string, value: any) => {
        if (key === '__file__') {
            this.setState({__file__: value});
        } else {
            let newVals: utils.Dict = this.state.paramVals;
            // null is used as a signal to delete the value
            if (value === null) delete newVals[key];
            else newVals[key] = value;
            this.setState({paramVals: newVals});
        }
    }
    /* Called when a new endpoint is chosen or the user updates the token. If a new endpoint is
       chosen, we should initialize its parameter values; if a new token is chosen, any error
       message about the token no longer applies.
     */
    componentWillReceiveProps = (newProps: RequestAreaProps) => {
        if (newProps.currEpt !== this.props.currEpt) {
            this.setState({paramVals: utils.initialValues(newProps.currEpt)});
        }
        this.setState({__file__: null, errMsg: d.span(null)});
    }
    /* Submits a call to the API. This function handles the display logic (e.g. whether or not to
       display an error message for a missing token), and the APICaller prop actually sends the
       request.
     */
    submit = () => {
        const token = utils.getToken();
        if (token === '') {
            this.setState({errMsg: d.span({style: {color: 'red'}},
                'Error: missing token. Please enter a token above or click the "Get Token" button.'
            )});
        } else {
            this.setState({errMsg: d.span(null)});
            const responseFn = apicalls.chooseCallback(this.props.currEpt.kind,
                utils.getDownloadName(this.props.currEpt, this.state.paramVals));
            this.props.APICaller(JSON.stringify(this.state.paramVals), this.props.currEpt,
                                token, responseFn, this.state.__file__);
        }
    }
    // Toggles whether the token is hidden, or visible on the screen.
    showOrHide = () => this.setState({showToken: !this.state.showToken});

    public render() {
        return d.span({className: 'request'},
            d.h1(null, 'Dropbox API Explorer'),
            ce(TokenInput, {
                toggleShow:   this.showOrHide,
                showToken:    this.state.showToken
            }),
            d.div({id: 'container'},
                d.div({id: 'request'},
                    d.h4(null, 'Request'),
                    d.p(null,
                        'API Endpoint: ',
                        d.b(null, this.props.currEpt.name)
                    ),
                    d.div(null, this.props.currEpt.params.map((param: utils.Parameter) =>
                        ce(paramClassChooser(param), {
                            key:      this.props.currEpt.name + param.name,
                            onChange: this.updateParamValues,
                            param:    param
                       }))
                    )
                ),
                ce(CodeArea, {
                    ept:       this.props.currEpt,
                    paramVals: this.state.paramVals,
                    __file__:  this.state.__file__,
                    token:     this.state.showToken? utils.getToken() : '<access-token>'
                })
            ),
            d.p(null, d.button({onClick: this.submit}, 'Submit Call')),
            d.p(null, this.state.errMsg)
        )
    }
}

/* A small component governing an endpoint on the sidebar, to bold it when it's selected and
   handle the logic when it is clicked.
 */
interface EndpointChoiceProps {
    key:         string;
    ept:         utils.Endpoint;
    handleClick: (ept: utils.Endpoint) => void;
    isSelected:  boolean
}
class EndpointChoice extends react.Component<EndpointChoiceProps, void> {
    constructor(props: EndpointChoiceProps) { super(props); }
    onClick = () => this.props.handleClick(this.props.ept);

    public render() {
        return (this.props.isSelected)?
            d.span(null, d.b(null, this.props.ept.name), d.br(null)) :
            d.span(null, d.a({onClick: this.onClick}, this.props.ept.name), d.br(null)
        );
    }
}

/* The EndpointSelector component governs the list of endpoints on the sidebar, and propagates the
   information of which one is currently selected.
 */
interface EndpointSelectorProps {
    eptChanged: (ept: utils.Endpoint) => void;
    currEpt:    string
}
class EndpointSelector extends react.Component<EndpointSelectorProps, void> {
    constructor(props: EndpointSelectorProps) { super(props); }

    // Renders the logo and the list of endpoints
    public render() {
        return d.div({'id': 'sidebar'},
            d.p({style: {marginLeft: '35px', marginTop: '12px'}},
                d.a({onClick: () => window.location.hash = ''},
                    d.img({
                        src:       'logo.jpeg',
                        width:     70,
                        className: 'home-icon'
                    })
                )
            ),
            d.div({style: {marginLeft: '25px'}},
              endpoints.endpointList.map((ept: utils.Endpoint) =>
                ce(EndpointChoice, {
                    key:         ept.name,
                    ept:         ept,
                    handleClick: this.props.eptChanged,
                    isSelected:  this.props.currEpt == ept.name
                }))
            )
        );
    }
}

/* The top-level React component for the API Explorer (except text-based pages, such as the intro
   page and the error pages).
 */
interface APIExplorerProps {
    initEpt:   utils.Endpoint
}
class APIExplorer extends react.Component<APIExplorerProps, any> {
    constructor(props: APIExplorerProps) {
        super(props);
        this.state = {
            ept:          this.props.initEpt,
            downloadURL:  '',
            responseText: ''
        };
    }
    componentWillReceiveProps = (newProps: APIExplorerProps) => this.setState({
        ept:          newProps.initEpt,
        downloadURL:  '',
        responseText: ''
    });

    eptChanged = (ept: utils.Endpoint) => window.location.hash = '#' + encodeURIComponent(ept.name);

    APICaller = (paramsData: string, endpt: utils.Endpoint, token: string,
                 responseFn: apicalls.Callback, file: File) =>
        apicalls.APIWrapper(paramsData, endpt, token, responseFn, this, file);

    public render() {
        // This button pops up only on download
        const downloadButton: react.HTMLElement = (this.state.downloadURL !== '')?
            d.a({
                href: this.state.downloadURL,
                download: this.state.downloadFilename
            }, d.button(null, 'Download ' + this.state.downloadFilename)) :
            null;

        return d.span(null,
            ce(EndpointSelector, {
                eptChanged: this.eptChanged,
                currEpt:    (<utils.Endpoint>this.state.ept).name // type hint to compiler
            }),
            ce(RequestArea, {
                currEpt:   this.state.ept,
                APICaller: this.APICaller
            }),
            d.div({id: 'response'},
                d.h4(null, 'Response'),
                ce(utils.Highlight, {className: 'json'}, this.state.responseText),
                downloadButton
            )
        );
    }
}

/* This class renders a text page (the intro page and error messages). Then, each page is an
   instance of TextPage.
 */
interface TextPageProps {
    message: react.HTMLElement
}
class TextPage extends react.Component<TextPageProps, void> {
    constructor(props: TextPageProps) { super(props); }

    public render() {
        return d.span(null,
            ce(EndpointSelector, {
                eptChanged: (endpt: utils.Endpoint) => window.location.hash = '#' + endpt.name,
                currEpt:    '' // no endpoint should be highlighted in this case
            }),
            d.span({style: {float: 'left', width: '80%'}},
                d.h1(null, 'Dropbox API Explorer'),
                this.props.message
            )
        );
    }
}

// Introductory page, which people see when they first open the webpage
const introPage: react.ReactElement<TextPageProps> = ce(TextPage, {message:
    d.span(null,
        d.p(null, 'Welcome to the Dropbox API Explorer!'),
        d.p(null,
            'This API Explorer is a tool to help you learn about the ',
            d.a({href: 'https://www.dropbox.com/developers-preview'}, 'Dropbox API v2'),
            " and test your own examples. For each endpoint, you'll be able to submit an API call ",
            'with your own parameters and see the code for that call, as well as the API response.'
        ),
        d.p(null,
            'Click on an endpoint on your left to get started, or check out ',
            d.a({href: 'https://www.dropbox.com/developers-preview/documentation'},
                'the documentation'),
            ' for more information on the API.'
        )
    )}
);

/* The endpoint name (supplied via the URL's hash) doesn't correspond to any actual endpoint. Right
   now, this can only happen if the user edits the URL hash.
   React sanitizes its inputs, so displaying the hash below is safe.
 */
const endpointNotFound: react.ReactElement<TextPageProps> = ce(TextPage, {message:
    d.span(null,
        d.p(null, 'Welcome to the Dropbox API Explorer!'),
        d.p(null,
            "Unfortunately, there doesn't seem to be an endpoint called ",
            d.b(null, window.location.hash.substr(1)),
            '. Try clicking on an endpoint on the left instead.'
        ),
        d.p(null, 'If you think you received this message in error, please get in contact with us.')
    )}
);

/* Error when the state parameter of the hash isn't what was expected, which could be due to an
   XSRF attack.
 */
const stateError: react.ReactElement<TextPageProps> = ce(TextPage, {message:
    d.span(null,
        d.p(null, ''),
        d.p(null,
            'Unfortunately, there was a problem retrieving your OAuth2 token; please try again. ',
            'If this error persists, you may be using an insecure network.'
        ),
        d.p(null, 'If you think you received this message in error, please get in contact with us.')
    )}
);

/* The hash of the URL determines which page to render; no hash renders the intro page, and
   'auth_error!' (the ! chosen so it's less likely to have a name clash) renders the stateError
   page when the state parameter isn't what was expected.
 */
const renderGivenHash = (hash: string): void => {
    if (hash === '' || hash === undefined) {
        react.render(introPage, document.body);
    } else if (hash === 'xkcd') {
        window.location.href = 'https://xkcd.com/1481/';
    } else if (hash === 'auth_error!') {
        react.render(stateError, document.body);
    } else {
        const currEpt = utils.getEndpoint(endpoints.endpointList, decodeURIComponent(hash));
        if (currEpt === null) {
            react.render(endpointNotFound, document.body);
        } else {
            react.render(ce(APIExplorer, {initEpt: currEpt}), document.body);
        }
    }
}

const checkCsrf = (state: string): string => {
    if (state === null) return null;
    const div = state.indexOf('!')
    if (div < 0) return null;
    const csrfToken = state.substring(div+1);
    if (!utils.checkCsrfToken(csrfToken)) return null;
    return state.substring(0, div);  // The part before the CSRF token.
}

/* Things that need to be initialized at the start.
    1. Set up the listener for hash changes.
    2. Process the initial hash. This only occurs when the user goes through token flow, which
       redirects the page back to the API Explorer website, but with a hash that contains the
       token and some extra state (to check against XSRF attacks).
 */
const main = (): void => {
    window.onhashchange = (e: any) => renderGivenHash(e.newURL.split('#')[1]);

    const hashes = utils.getHashDict();
    if ('state' in hashes) { // completing token flow, and checking the state is OK
        const state = checkCsrf(hashes['state'])
        if (state === null) {
            window.location.hash = '#auth_error!';
        } else {
            utils.putToken(hashes['access_token']);
            window.location.href = utils.currentURL() + '#' + state;
        }
    } else if ('__ept__' in hashes) { // no token, but an endpoint selected
        renderGivenHash(hashes['__ept__']);
    } else { // no endpoint selected: render the intro page
        react.render(introPage, document.body);
    }
}

main();

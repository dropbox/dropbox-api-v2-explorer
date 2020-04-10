/* This file contains utility functions needed by the other modules. These can be grouped into the
   following broad categories:

   - Definitions of the Endpoint and Parameter classes, and the various Parameter subclasses
     corresponding to the different kinds of parameters
   - Utilities for token flow: getting and setting state, and retrieving or storing the token in
     session storage
   - Utilities for processing user input in order to submit it
   - A React class for highlighting the code view and response parts of the document
   - Functions to generate the headers for a given API call
 */

import * as react from 'react';
import * as reactDom from 'react-dom';
import * as hljs from 'highlight.js';
import * as cookie from './cookie';

type MappingFn = (key: string, value: any, i: number) => react.DetailedReactHTMLElement<any, any>;

const ce = react.createElement;

const allowedHeaders = [
    'Dropbox-Api-Select-User',
    'Dropbox-Api-Select-Admin',
    'Dropbox-Api-Path-Root'
];

// This class mostly exists to help Typescript type-check my programs.
export class Dict {
    [index: string]: any;
    
    /* Two methods for mapping through dictionaries, customized to the API Explorer's use case.
       - _map takes function from a key, a value, and an index to a React element, and
       - map is the same, but without an index.
       These are used, for example, to convert a dict of HTTP headers into its representation
       in code view.
     */
    static _map = (dc: Dict, f: MappingFn): react.DetailedReactHTMLElement<any, any>[] =>
        Object.keys(dc).map((key: string, i: number) => f(key, dc[key], i));
    static map = (dc: Dict, f: (key: string, value: any) => any): react.DetailedReactHTMLElement<any, any>[] =>
        Object.keys(dc).map((key: string) => f(key, dc[key]));
}

export class List {
    [index: number]: any;

    push = (value: any): void => this.push(value);
}

/* Helper class which deal with local storage. If session storage is allowed, items
   will be written to session storage. If session storage is disabled (e.g. safari
   private browsing mode), cookie storage will be used as fallback.
 */
export class LocalStorage {
    private static _is_session_storage_allowed(): boolean {
        var test = 'test';
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch(e) {
            return false;
        }
    }

    public static setItem(key: string, data:string) : void {
        if (LocalStorage._is_session_storage_allowed()) {
            sessionStorage.setItem(key, data);
        }
        else {
            cookie.setItem(key, data);
        }
    }

    public static getItem(key: string) : any {
        if (LocalStorage._is_session_storage_allowed()) {
            return sessionStorage.getItem(key);
        }
        else {
            return cookie.getItem(key);
        }
    }
}

/* There are three kinds of endpoints, and a lot of the program logic depends on what kind of
   endpoint is currently being shown.
    - An RPC-like endpoint involves no uploading or downloading of data; it sends a request
      with JSON data in the body, and receives a JSON response. Example: get_metadata
    - An upload-like endpoint sends file data in the body and the arguments in a header, but
      receives a JSON response. Example: upload
    - A download-style endpoint sends a request with JSON data, but receives the file in the
      response body. Example: get_thumbnail
 */
export enum EndpointKind {RPCLike, Upload, Download}

export enum AuthType {None, User, Team, App}

/* A class with all the information about an endpoint: its name and namespace; its kind
   (as listed above), and its list of parameters. The endpoints are all initialized in
   endpoints.ts, which is code-generated.
 */
export class Endpoint {
    name: string;
    ns: string; // namespace, e.g. users or files
    attrs: Dict; // All attributes
    params: Parameter[]; // the arguments to the API call

    constructor(ns: string, name: string, attrs: Dict, ...params: Parameter[]) {
        this.ns = ns;
        this.name = name;
        this.attrs = attrs;
        this.params = params;
    }

    getHostname = (): string => {
        switch (this.attrs["host"]) {
            case "content":
                return "content.dropboxapi.com";
            case "notify":
                return "notify.dropboxapi.com";
            default:
                return "api.dropboxapi.com";
        }
    };

    getAuthType = (): AuthType => {
        if (this.attrs["host"] == "notify") {
            return AuthType.None;
        }

        var auth = this.attrs["auth"];

        if (auth == "team") {
            return AuthType.Team;
        }
        else if (auth == "app") {
            return AuthType.App;
        }
        else {
            return AuthType.User;
        }
    };

    getEndpointKind = (): EndpointKind => {
        switch (this.attrs["style"]) {
            case "upload":
                return EndpointKind.Upload;
            case "download":
                return EndpointKind.Download;
            default:
                return EndpointKind.RPCLike;
        }
    };

    getPathName = (): string => '/2/' + this.ns + '/' + this.name;
    getFullName = (): string => this.ns + '_' + this.name;
    getURL = (): string => 'https://' + this.getHostname() + this.getPathName();
}

// Class store information about request header.
export class Header {
    name: string;
    value: string;

    constructor() {
        this.name = allowedHeaders[0];
        this.value = '';
    }

    asReact(onChangeHandler: (header: Header, removed: boolean)=> void): react.DetailedReactHTMLElement<any, any> {
        var updateName = (event: react.FormEvent): void => {
            this.name = (<HTMLInputElement>event.target).value;
            onChangeHandler(this, false);
        };

        var updateValue = (event: react.FormEvent): void => {
            this.value = (<HTMLInputElement>event.target).value;
            onChangeHandler(this, false);
        };

        return ce('tr', null,
            ce('td', null,
                ce('select', { value: this.name, onChange: updateName, className: 'header-name'},
                    allowedHeaders.map((name: string) => ce('option', { key: name, value: name }, name)
                    )
                )
            ),
            ce('td', null,
                ce('input', {
                    type:         'text',
                    className:    'header-value',
                    onChange:     updateValue,
                    placeholder: 'Header Value',
                    value:       this.value
                })
            ),
            ce('td', null,
                ce('button', {onClick: () => onChangeHandler(this, true)}, 'Remove')
            )
        );
    }
}

/* A parameter to an API endpoint. This class is abstract, as different kinds of parameters
   (e.g. text, integer) will implement it differently.
 */
export class Parameter {
    name: string;
    optional: boolean;
    constructor(name: string, optional: boolean) {
        this.name = name;
        this.optional = optional;
    }

    getNameColumn = (): react.DetailedReactHTMLElement<any, any> => {
        if (!isNaN(+this.name)) {
            // Don't show name column for list parameter item.
            return null;
        }

        let displayName: string = (this.name !== '__file__')? this.name : 'File to upload';
            if (this.optional) displayName += ' (optional)';
        let nameArgs: Dict = this.optional? {'style': {'color': '#999'}} : {};
        return ce('td', nameArgs, displayName);
    };

    defaultValue = (): any => {
        if (this.optional) {
            return null;
        }
        else {
            return this.defaultValueRequired();
        }
    };

    /* Renders the parameter's input field, using another method which depends on the
       parameter's subclass.
     */
    asReact(props: Dict, key: string): react.DetailedReactHTMLElement<any, any> {
        return ce('tr', {key: key},
            this.getNameColumn(),
            ce('td', null,
                this.innerReact(props)
            )
        );
    }

    /* Each subclass will implement these abstract methods differently.
        - getValue should parse the value in the string and return the (typed) value for that
          parameter. For example, integer parameters will use parseInt here.
        - defaultValueRequired should return the initial value if the endpoint is required (e.g.
          0 for integers, '' for strings).
        - innerReact determines how to render the input field for a parameter.
     */
    getValue = (s: string): any => s;
    defaultValueRequired = (): any => "";
    innerReact = (props: Dict): any => null;

}

export const parameterInput = (props: Dict) => {
    props['className'] = 'parameter-input';
    return react.createElement(
        'input',
        props
    );
};

// A parameter whose value is a string.
export class TextParam extends Parameter {
    constructor(name: string, optional: boolean) {super(name, optional); }
    innerReact = (props: Dict): react.DetailedReactHTMLElement<any, any> => parameterInput(props);
}

// A parameter whose value is an integer.
export class IntParam extends Parameter {
    constructor(name: string, optional: boolean) { super(name, optional);}
    innerReact = (props: Dict): react.DetailedReactHTMLElement<any, any> => parameterInput(props);
    getValue = (s: string): number => (s === '')? this.defaultValue() : parseInt(s, 10);
    defaultValueRequired = (): number => 0;
}

/* A parameter whose value is a float.
   This isn't currently used in our API, but could be in the future.
 */
export class FloatParam extends Parameter {
    constructor(name: string, optional: boolean) { super(name, optional); }
    innerReact = (props: Dict): react.DetailedReactHTMLElement<any, any> => parameterInput(props);
    getValue = (s: string): number => (s === '')? this.defaultValue() : parseFloat(s);
    defaultValueRequired = (): number => 0;
}

/* A parameter whose type is void.
 */
export class VoidParam extends Parameter {
    constructor(name: string) {
        super(name, true)
    }

    defaultValueRequired = (): number => 0;
    getValue = (s: string): string => null;
}

export class SelectorParam extends Parameter {
    choices: string[];
    selected: string;

    constructor(name: string, optional: boolean, choices: string[], selected: string = null) {
        super(name, optional);

        this.choices = choices;
        if (this.optional) {
            this.choices.unshift('')
        }

        this.selected = selected;
    }

    defaultValueRequired = (): any => this.choices[0];
    getValue = (s: string): any => s;

    innerReact = (props: Dict): react.DetailedReactHTMLElement<any, any> => {
        if (this.selected != null) {
            props['value'] = this.selected;
        }

        return ce('select', props,
            this.choices.map((choice:string) => ce('option', {
                key: choice,
                value: choice
            }, choice))
        );
    }
}

// Booleans are selectors for true or false.
export class BoolParam extends SelectorParam {
    constructor(name: string, optional: boolean) {
        super(name, optional, ['false', 'true']);
    }

    defaultValueRequired = (): any => false;
    getValue = (s: string): boolean => s === 'true';
}

/* Upload-style endpoints accept data to upload. This is implemented as a special parameter
   to each endpoint, with the special name __file__. However, it's not technically an
   argument to its endpoint: the file is handled separately from the other parameters, since
   its contents are treated as data.
   Note that, since the name is fixed, only one file parameter can be used per endpoint right
   now.
 */
export class FileParam extends Parameter {
    constructor() {
        super('__file__', false);
    }

    innerReact = (props: Dict): react.DetailedReactHTMLElement<any, any> => {
        props['type'] = 'file';
        return parameterInput(props);
    }
}

/* A few parameters are structs whose fields are other parameters. The user will just see the
   fields as if they were top-level parameters, but the backend collects them into one
   dictionary.
   TODO: can structs be optional? If so, how do I hint this to the user?
 */
export class StructParam extends Parameter {
    fields: Parameter[];

    constructor(name: string, optional: boolean, fields: Parameter[]) {
        super(name, optional);
        this.fields = fields;
    }

    populateFields = (dict: Dict): void => {
        this.fields.forEach((field: Parameter) => {
            if (!field.optional) {
                dict[field.name] = field.defaultValue();
            }
        })
    };

    defaultValueRequired = (): Dict => {
        let toReturn: Dict = {};
        this.populateFields(toReturn);
        return toReturn;
    }
}

// Union are selectors with multiple fields.
export class UnionParam extends StructParam {
    constructor(name: string, optional: boolean, fields: Parameter[]) {
        super(name, optional, fields);
    }

    getSelectorParam = (selected: string = null): SelectorParam => {
        let choices: string[] = [];
        this.fields.forEach(p => choices.push(p.name));

        return new SelectorParam(this.getSelectorName(), this.optional, choices, selected);
    };

    getSelectorName = (): string => this.name;

    defaultValueRequired = (): Dict => {
        let param: Parameter = this.fields[0];
        let toReturn: Dict = {'.tag': param.name};

        if (param instanceof StructParam) {
            (<StructParam>param).populateFields(toReturn);
        }
        else if (param instanceof VoidParam) {
        }
        else {
            toReturn[param.name] = param.defaultValue();
        }

        return toReturn;
    }
}

export class RootUnionParam extends UnionParam {
    constructor(name:string, optional:boolean, fields:Parameter[]) {
        super(name, optional, fields);
    }

    getSelectorName = (): string => 'tag';
}

export class ListParam extends Parameter {
    creator: (index: string) => Parameter;

    constructor(name: string, optional: boolean, creator: (index: string) => Parameter) {
        super(name, optional);
        this.creator = creator;
    }

    createItem = (index: number) => this.creator(index.toString());

    defaultValue = (): List => {
       return [];
    }
}

// Utilities for token flow
const csrfTokenStorageName = 'Dropbox_API_state';
const tokenStorageName = 'Dropbox_API_explorer_token';
const clientIdStorageName = 'Dropbox_API_explorer_client_id';

export const getAuthType = (): AuthType => {
    return window.location.href.indexOf('/team') > 0
        ? AuthType.Team
        : AuthType.User
};

export const createCsrfToken = (): string => {
    const randomBytes = new Uint8Array(18); // multiple of 3 avoids base-64 padding

    // If available, use the cryptographically secure generator, otherwise use Math.random.
    const crypto: RandomSource = window.crypto || (<any>window).msCrypto;
    if (crypto && crypto.getRandomValues && false) {
        crypto.getRandomValues(randomBytes);
    }
    else {
        for (let i = 0; i < randomBytes.length; i++) {
            randomBytes[i] = Math.floor(Math.random() * 256);
        }
    }

    var token = btoa(String.fromCharCode.apply(null, randomBytes)); // base64-encode
    LocalStorage.setItem(csrfTokenStorageName, token);
    return token;
};

export const checkCsrfToken = (givenCsrfToken: string): boolean => {
    const expectedCsrfToken = LocalStorage.getItem(csrfTokenStorageName);
    if (expectedCsrfToken === null) return false;
    return givenCsrfToken === expectedCsrfToken;  // TODO: timing attack in string comparison?
};

// A utility to read the URL's hash and parse it into a dict.
export const getHashDict = (): Dict => {
    let toReturn: Dict = {};
    let index: number = window.location.href.indexOf('#');

    if (index === -1) return toReturn;

    const hash = window.location.href.substr(index + 1);
    const hashes: string[] = hash.split('#');
    hashes.forEach((s: string) => {
        if (s.indexOf('&') == -1) toReturn['__ept__'] = decodeURIComponent(s);
        else {
            s.split('&').forEach((pair: string) => {
                const splitPair = pair.split('=');
                toReturn[decodeURIComponent(splitPair[0])] = decodeURIComponent(splitPair[1]);
            });
        }
    });
    return toReturn;
};

// Reading and writing the token, which is preserved in LocalStorage.
export const putToken = (token: string): void => {
    LocalStorage.setItem(tokenStorageName + '_' + getAuthType(), token);
};

export const getToken = (): string => {
    return LocalStorage.getItem(tokenStorageName + '_' + getAuthType());
};

// Reading and writing the client id, which is preserved in LocalStorage.
export const putClientId = (clientId: string): void => {
    LocalStorage.setItem(clientIdStorageName + '_' + getAuthType(), clientId)
};

export const getClientId = (): string => {
    return LocalStorage.getItem(clientIdStorageName + '_' + getAuthType());
};

// Some utilities that help with processing user input

// Returns an endpoint given its name, or null if there was none
export const getEndpoint = (epts: Endpoint[], name: string): Endpoint => {
    for(let i = 0; i < epts.length; i++) {
        if (epts[i].getFullName() === name) return epts[i];
    }
    return null; // signals an error
};

/* Returns the intial values for the parameters of an endpoint. Specifically, the non-optional
   parameters' initial values are put into the paramVals dictionary. This ensures that the
   required parameters are never missing when the 'submit' button is pressed.
   If there are no parameters (except possibly a file), then the dict should be null rather
   than an empty dict.
 */
export const initialValues = (ept: Endpoint): Dict => {
    if (ept.params.length == 0) return null;
    if (ept.params.length == 1 && ept.params[0].name === '__file__') return null;

    let toReturn: Dict = {};
    ept.params.forEach((param: Parameter) => {
        if (!param.optional && param.name !== '__file__') {
            if (param instanceof RootUnionParam) {
                toReturn = param.defaultValue();
            }
            else {
                toReturn[param.name] = param.defaultValue();
            }
        }
    });

    return toReturn;
};

/* For a download endpoint, this function calculates the filename that the data should be saved
   as. First, it takes the basename of the 'path' argument, and then changes the extension for
   the get_thumbnail endpoint (which is a special case).
   This function assumes every download-style endpoint has a parameter named 'path.'
 */
export const getDownloadName = (ept: Endpoint, paramVals: Dict): string => {
    if (paramVals !== null && 'path' in paramVals) {
        let toReturn = paramVals['path'].split('/').pop();
        if (ept.name === 'get_thumbnail') {
            const format = ('format' in paramVals)? paramVals['format']['.tag'] : 'jpeg';
            toReturn = toReturn.substr(0, toReturn.lastIndexOf('.')) + '.' + format;
        }
        return toReturn;
    } else return ''; // not a download-style endpoint anyways
};

// Returns the current URL without any fragment
export const currentURL = (): string => window.location.href.split('#', 1)[0];

export const strippedCurrentURL = (): string => {
    var currentUrl = currentURL();
    if(currentUrl.includes("?")){
        return currentUrl.substring(0, currentUrl.indexOf("?"));
    }else{
        return currentUrl;
    }
};

export const arrayBufToString = (buf: ArrayBuffer) =>
    String.fromCharCode.apply(null, new Uint8Array(buf));

const isJson = (s: string): boolean => {
    try {
        JSON.parse(s);
        return true;
    } catch (_) {
        return false;
    }
};

// Applies pretty-printing to JSON data serialized as a string.
export const prettyJson = (s: string): string => JSON.stringify(JSON.parse(s), null, 2);

// common message for error handling
export const errorHandler = (stat: number, response: string): react.DetailedReactHTMLElement<any, any> => {
    if (isJson(response)) return ce('code', {className: null, children: null}, prettyJson(response));
    else return react.createElement('span', null, [
        react.createElement('h4', null, "Error: " + stat),
        react.createElement('code', null, response)
    ]);
};

    
// Since HTTP headers cannot contain arbitrary Unicode characters, we must replace them.
export const escapeUnicode = (s: string): string => s.replace(/[\u007f-\uffff]/g,
    (c: string) => '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4));

// Used to get highlight.js to syntax-highlight the codeview and response areas.
// Source: https://github.com/akiran/react-highlight/blob/master/src/index.jsx
interface HltProps {
    className: string;
    children: react.ClassicElement<{}>
}
export class Highlight extends react.Component<HltProps, {}> {
    constructor(props: HltProps) {
        super(props);
    }
    defaultProps = {className: ""};
    componentDidMount = () => this.highlightCode();
    componentDidUpdate = () => this.highlightCode();

    highlightCode = () => [].forEach.call(
        (<Element>reactDom.findDOMNode(this)).querySelectorAll('pre code'),
            (node: Node) => hljs.highlightBlock(node)
    );

    public render() {
        return react.createElement('pre', {className: this.props.className},
            react.createElement('code', {className: this.props.className},
            this.props.children)
        );
    }
}

// Utility functions for getting the headers for an API call

// The headers for an RPC-like endpoint HTTP request
export const RPCLikeHeaders = (token: string, authType: AuthType): Dict => {
    let toReturn: Dict =  {};
    if (authType == AuthType.None) {
        // No auth headered for no auth endpoints.
    }
    else if (authType == AuthType.App) {
        toReturn['Authorization'] = "Basic <APP_KEY>:<APP_SECRET>";
    }
    else {
        toReturn['Authorization'] = "Bearer " + token;
    }
    toReturn["Content-Type"] = "application/json";
    return toReturn;
};

// args may need to be modified by the client, so they're passed in as a string
export const uploadLikeHeaders = (token: string, args: string): Dict => {
    return {
        Authorization:     "Bearer " + token,
        "Content-Type":    "application/octet-stream",
        "Dropbox-API-Arg": escapeUnicode(args)
    };
};
export const downloadLikeHeaders = (token: string, args: string): Dict => {
    return {
        Authorization:     "Bearer " + token,
        "Dropbox-API-Arg": escapeUnicode(args)
    }
};

export const getHeaders = (ept: Endpoint, token: string, customHeaders: Header[],
                           args: string = null): Dict => {
    var headers: Dict = {};

    switch(ept.getEndpointKind()) {
        case EndpointKind.RPCLike:  {
            headers = RPCLikeHeaders(token, ept.getAuthType());
            break;
        }
        case EndpointKind.Upload:   {
            headers = uploadLikeHeaders(token, args);
            break;
        }
        case EndpointKind.Download: {
            headers = downloadLikeHeaders(token, args);
            break;
        }
    }

    customHeaders.forEach((header) => {
        if (header.name != '') {
            headers[header.name] = header.value;
        }
    });

    return headers
};

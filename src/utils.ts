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

import react = require('react');
import hljs = require('highlight.js');
import cookie = require('./cookie');

type MappingFn = (key: string, value: any, i: number) => react.ClassicElement<{}>;

const ce = react.createElement;
const d = react.DOM;

// This class mostly exists to help Typescript type-check my programs.
export class Dict {
    [index: string]: any;
    
    /* Two methods for mapping through dictionaries, customized to the API Explorer's use case.
       - _map takes function from a key, a value, and an index to a React element, and
       - map is the same, but without an index.
       These are used, for example, to convert a dict of HTTP headers into its representation
       in code view.
     */
    static _map = (dc: Dict, f: MappingFn): react.ClassicElement<{}>[] =>
        Object.keys(dc).map((key: string, i: number) => f(key, dc[key], i));
    static map = (dc: Dict, f: (key: string, value: any) => any): react.ClassicElement<{}>[] =>
        Object.keys(dc).map((key: string) => f(key, dc[key]));
}
// Useful for composites such as StructParam
interface ParamDict {
    [index: string]: Parameter
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
export enum EndpointKind {RPCLike, Upload, Download};

/* A class with all the information about an endpoint: its name and namespace; its kind
   (as listed above), and its list of parameters. The endpoints are all initialized in
   endpoints.ts, which is code-generated.
 */
export class Endpoint {
    name: string;
    ns: string; // namespace, e.g. users or files
    kind: EndpointKind;
    params: Parameter[]; // the arguments to the API call

    constructor(ns: string, name: string, kind: EndpointKind, ...params: Parameter[]) {
        this.ns = ns;
        this.name = name;
        this.kind = kind;
        this.params = params;
    }

    getHostname = (): string => (this.kind !== EndpointKind.RPCLike)?
        'content.dropboxapi.com' : 'api.dropboxapi.com';

    getPathname = (): string => '/2-beta-2/' + this.ns + '/' + this.name;
    getURL = (): string => 'https://' + this.getHostname() + this.getPathname();
}

/* A parameter to an API endpoint. This class is abstract, as different kinds of parameters
   (e.g. text, integer) will implement it differently.
 */
export class Parameter {
    name: string;
    optional: boolean;

    isStructParam: boolean = false;

    constructor(name: string, optional: boolean) {
        this.name = name;
        this.optional = optional;
    }

    /* Renders the parameter's input field, using another method which depends on the
       parameter's subclass.
     */
    asReact(props: Dict): react.HTMLElement {
        const nameArgs: Dict = this.optional? {'style': {'color': '#999'}} : {};
        let displayName: string = (this.name !== '__file__')? this.name : 'File to upload';
        if (this.optional) displayName += ' (optional)';
        return d.tr(null,
            d.td(nameArgs, displayName),
            d.td(null,
                this.innerReact(props)
            )
        );
    }

    /* Each subclass will implement these abstract methods differently.
        - getValue should parse the value in the string and return the (typed) value for that
          parameter. For example, integer parameters will use parseInt here.
        - defaultValue should return the initial value if the endpoint is required (e.g.
          0 for integers, '' for strings).
        - innerReact determines how to render the input field for a parameter.
     */
    getValue = (s: string): any => s;
    defaultValue = (): any => "";
    innerReact = (props: Dict): any => null;
}

export const parameterInput = (props: Dict) => {
    props['className'] = 'parameter-input'
    return d.input(props)
}

// A parameter whose value is a string.
export class TextParam extends Parameter {
    constructor(name: string, optional: boolean) {super(name, optional); }
    innerReact = (props: Dict): react.HTMLElement => parameterInput(props);
}

// A parameter whose value is an integer.
export class IntParam extends Parameter {
    constructor(name: string, optional: boolean) { super(name, optional);}
    innerReact = (props: Dict): react.HTMLElement => parameterInput(props);
    getValue = (s: string): number => (s === '')? this.defaultValue() : parseInt(s, 10);
    defaultValue = (): number => 0;
}

/* A parameter whose value is a float.
   This isn't currently used in our API, but could be in the future.
 */
export class FloatParam extends Parameter {
    constructor(name: string, optional: boolean) { super(name, optional); }
    innerReact = (props: Dict): react.HTMLElement => parameterInput(props);
    getValue = (s: string): number => (s === '')? this.defaultValue() : parseFloat(s);
    defaultValue = (): number => 0;
}

/* An enumerated type, e.g. simple unions or booleans.
   TODO: more complicated unions (i.e. of more than just unit types) are currently not
   supported. For example, the mode argument to the upload endpoint has a union of two
   void types and a string; we would like to be able to support these, but haven't gotten
   around to it yet.
 */
export class SelectorParam extends Parameter {
    choices: string[];

    constructor(name: string, choices: string[], optional: boolean) {
        super(name, optional);
        this.choices = choices;
        if (this.optional) {
            this.choices.unshift(''); // signals leaving an optional parameter out
        }
    }

    innerReact = (props: Dict): react.HTMLElement => d.select(props,
        this.choices.map((choice: string) => d.option({
            key:   choice,
            value: choice
        }, choice))
    );
    defaultValue = (): string => this.choices[0];
}

// Booleans are selectors for true or false.
export class BoolParam extends SelectorParam {
    constructor(name: string, optional: boolean) {
        super(name, ['false', 'true'], optional);
    }

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

    innerReact = (props: Dict): react.HTMLElement => {
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
    fields: ParamDict;

    isStructParam = true;

    constructor(name: string, optional: boolean,
                ...fields: Parameter[]) {
        super(name, optional);
        this.fields = {};
        fields.forEach((nextField: Parameter) => this.fields[nextField.name] = nextField);
    }

    defaultValue = (): Dict => {
        let toReturn: Dict = {};
        for(let name in this.fields) {
            if (!this.fields[name].optional) {
                toReturn[name] = this.fields[name].defaultValue();
            }
        }
        return toReturn;
    }
}

// Utilities for token flow
const csrfTokenStorageName = 'Dropbox_API_state';
const tokenStorageName = 'Dropbox_API_explorer_token';

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
}

export const checkCsrfToken = (givenCsrfToken: string): boolean => {
    const expectedCsrfToken = LocalStorage.getItem(csrfTokenStorageName);
    if (expectedCsrfToken === null) return false;
    return givenCsrfToken === expectedCsrfToken;  // TODO: timing attack in string comparison?
}

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
}

// Reading and writing the token, which is preserved in LocalStorage.
export const putToken = (token: string): void =>
    LocalStorage.setItem(tokenStorageName, token);
export const getToken = (): string => LocalStorage.getItem(tokenStorageName);

// Some utilities that help with processing user input

// Returns an endpoint given its name, or null if there was none
export const getEndpoint = (epts: Endpoint[], name: string): Endpoint => {
    for(let i = 0; i < epts.length; i++) {
        if (epts[i].name === name) return epts[i];
    }
    return null; // signals an error
}

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
            toReturn[param.name] = param.defaultValue();
        }
    })
    return toReturn;
}

/* For a download endpoint, this function calculates the filename that the data should be saved
   as. First, it takes the basename of the 'path' argument, and then changes the extension for
   the get_thumbnail endpoint (which is a special case).
   This function assumes every download-style endpoint has a parameter named 'path.'
 */
export const getDownloadName = (ept: Endpoint, paramVals: Dict): string => {
    if (paramVals !== null && 'path' in paramVals) {
        let toReturn = paramVals['path'].split('/').pop();
        if (ept.name === 'get_thumbnail') {
            const format = ('format' in paramVals)? paramVals['format'] : 'jpeg'
            toReturn = toReturn.substr(0, toReturn.lastIndexOf('.')) + '.' + format;
        }
        return toReturn;
    } else return ''; // not a download-style endpoint anyways
}

// Returns the current URL without any fragment
export const currentURL = (): string => window.location.href.split('#', 1)[0]

export const arrayBufToString = (buf: ArrayBuffer) =>
    String.fromCharCode.apply(null, new Uint8Array(buf));

const isJson = (s: string): boolean => {
    try {
        JSON.parse(s);
        return true;
    } catch (_) {
        return false;
    }
}

// Applies pretty-printing to JSON data serialized as a string.
export const prettyJson = (s: string): string => JSON.stringify(JSON.parse(s), null, 2);

// common message for error handling
export const errorHandler = (stat: number, response: string): react.HTMLElement => {
    if (isJson(response)) return d.code(null, prettyJson(response));
    else return d.span(null,
        d.h4(null, "Error: " + stat),
        d.code(null, response)
    );
}

    
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
        react.findDOMNode(this).querySelectorAll('pre code'),
            (node: Node) => hljs.highlightBlock(node)
    )

    public render() {
        return d.pre({className: this.props.className},
            d.code({className: this.props.className},
            this.props.children)
        );
    }
}

// Utility functions for getting the headers for an API call

// The headers for an RPC-like endpoint HTTP request
export const RPCLikeHeaders = (token: string): Dict => {
    return {
        Authorization:  "Bearer " + token,
        "Content-Type": "application/json"
    };
}
// args may need to be modified by the client, so they're passed in as a string
export const uploadLikeHeaders = (token: string, args: string): Dict => {
    return {
        Authorization:     "Bearer " + token,
        "Content-Type":    "application/octet-stream",
        "Dropbox-API-Arg": escapeUnicode(args)
    };
}
export const downloadLikeHeaders = (token: string, args: string): Dict => {
    return {
        Authorization:     "Bearer " + token,
        "Dropbox-API-Arg": escapeUnicode(args)
    }
};

export const getHeaders = (ept: Endpoint, token: string, args: string): Dict => {
    switch(ept.kind) {
        case EndpointKind.RPCLike:  return RPCLikeHeaders(token);
        case EndpointKind.Upload:   return uploadLikeHeaders(token, args);
        case EndpointKind.Download: return downloadLikeHeaders(token, args);
    }
}

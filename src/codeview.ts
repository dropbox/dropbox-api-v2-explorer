/* The functions that handle the code view part of the interface: taking the input and
   representing it as an HTTP request or code to generate that request.
 */

import react = require('react');
import utils = require('./utils');

const ce = react.createElement;
const d = react.DOM;

type Renderer = (endpoint: utils.Endpoint, token: string, paramVals: utils.Dict) => react.ReactElement<{}>
type UploadRenderer = (endpoint: utils.Endpoint, token: string,
                       paramVals: utils.Dict, file: File) => react.ReactElement<{}>

/* Something which I wish I had more time to fix: in this file, "upload" and "download" have the wrong
   meanings. Specifically, here, "upload" means a call with a file attached, and "download" means a
   non-RPC-like call without a file (e.g. empty uploads and downloads). This might be confusing. I
   originally did this because it makes more of a difference in what the code viewer looks like.
 */

// An object that handles a particular kind of code view for each kind of endpoint.
interface CodeViewer {
    syntax: string;
    description: string; // text of the option in the selector

    /* Calls for the three kinds of endpoints: RPC-like (data neither uploaded nor downloaded),
       upload-like (data uploaded as the body of the request), and download-like (no data uploaded,
       but not RPC-like). If you upload with no data, it should thus be treated as download-like, which
       is a bit counterintuitive.
     */
    renderRPCLike: Renderer;
    renderUploadLike: UploadRenderer;
    renderDownloadLike: Renderer;
}

const syntaxHighlight = (syntax: string, text: react.HTMLElement): react.ReactElement<{}> =>
        ce(utils.Highlight, {className: syntax}, text);

// Applies f to each element of the dict, and then appends the separator to all but the last result.
// Subsequent list elements are separated by newlines.
const joinWithNewlines = (dc: utils.Dict, f: (k: string, v: string) => string, sep: string = ','):
    react.ClassicElement<{}>[] => utils.Dict._map(dc, (k: string, v: string, i: number) => {
        const maybeSep = (i === Object.keys(dc).length - 1)?
            "\n" : sep + "\n";
        return d.span({key: "" + i}, f(k, v), maybeSep);
    }
);

// the minor differences between JSON and Python's notation
const pythonStringify = (val: any): string => {
    if (val === true) {
        return "True";
    } else if (val === false) {
        return "False";
    } else if (val === null || (val !== val)) {
        return "None";
    } else {
        return JSON.stringify(val);
    }
}

// Representation of a dict, or null if the passed-in dict is also null
const dictToPython = (name: string, dc: utils.Dict): react.HTMLElement => d.span(null,
    name + ' = ',
    (dc === null)?
    'None' : d.span(null,
        '{\n',
        joinWithNewlines(dc, (k: string, v: any) => '    "' + k + '": ' + pythonStringify(v)),
        '}'
    ), '\n\n'
);

// For curl calls, we need to escape single quotes, and sometimes also double quotes.
const shellEscape = (val: any, inQuotes: boolean = false): string => {
    const toReturn = JSON.stringify(val).replace(/'/g, "'\\''");
    if (inQuotes) return toReturn.replace(/\\/g, '\\\\').replace(/"/g, '\\\"');
    else return toReturn;
}

// Generates the functions that make up the Python Requests code viewer
const RequestsCodeViewer = (): CodeViewer => {
    const syntax = "python";

    // common among all three parts
    const preamble = (endpt: utils.Endpoint): react.HTMLElement => d.span(null,
        'import requests\n', 'import json\n\n',
        'url = "' + endpt.getURL() + '"\n\n'
    );


    const requestsTemplate = (endpt: utils.Endpoint, headers: utils.Dict,
                              dataReader: string|react.HTMLElement, call: string) =>
        syntaxHighlight(syntax, d.span(null,
            preamble(endpt), dictToPython('headers', headers), dataReader, call));

    const requestsRPCLike = (endpt: utils.Endpoint, token: string,
                             paramVals: utils.Dict): react.ReactElement<{}> =>
        requestsTemplate(endpt, utils.RPCLikeHeaders(token), dictToPython('data', paramVals),
            'r = requests.post(url, headers=headers, data=json.dumps(data))');

    const requestsUploadLike = (endpt: utils.Endpoint, token: string, paramVals: utils.Dict,
                                file: File): react.ReactElement<{}> =>
        requestsTemplate(endpt, utils.uploadLikeHeaders(token, JSON.stringify(paramVals)),
            'data = open(' + JSON.stringify(file.name) + ', "rb").read()\n\n',
            'r = requests.post(url, headers=headers, data=data)');

    const requestsDownloadLike = (endpt: utils.Endpoint, token: string,
                                  paramVals: utils.Dict): react.ReactElement<{}> =>
        requestsTemplate(endpt, utils.getHeaders(endpt, token, JSON.stringify(paramVals)),
            '', 'r = requests.post(url, headers=headers)');

    return {
        syntax:             syntax,
        description:        "Python request (requests library)",
        renderRPCLike:      requestsRPCLike,
        renderUploadLike:   requestsUploadLike,
        renderDownloadLike: requestsDownloadLike
    };
}

// Python's httplib library (which is also the urllib backend)
const HttplibCodeViewer = (): CodeViewer => {
    const syntax = "python";

    const preamble = d.span(null,
        'import sys\nimport json\n',
        'if (3,0) <= sys.version_info < (4,0):\n',
        '    import http.client as httplib\n',
        'elif (2,6) <= sys.version_info < (3,0):\n',
        '    import httplib\n\n'
    );

    const httplibTemplate = (endpt: utils.Endpoint, headers: utils.Dict,
                             dataReader: string|react.HTMLElement, dataArg: string): react.ReactElement<{}> =>
        syntaxHighlight(syntax, d.span(null,
            preamble,
            dictToPython('headers', headers),
            dataReader,
            'c = httplib.HTTPSConnection("' + endpt.getHostname() + '")\n',
            'c.request("POST", "' + endpt.getPathname() + '", ' + dataArg + ', headers)\n',
            'r = c.getresponse()'
        )
    );

    const httplibRPCLike = (endpt: utils.Endpoint, token: string,
                            paramVals: utils.Dict): react.ReactElement<{}> =>
        httplibTemplate(endpt, utils.RPCLikeHeaders(token),
                        dictToPython('params', paramVals), 'json.dumps(params)');

    const httplibUploadLike = (endpt: utils.Endpoint, token: string, paramVals: utils.Dict,
                               file: File): react.ReactElement<{}> =>
        httplibTemplate(endpt, utils.uploadLikeHeaders(token, JSON.stringify(paramVals)),
            'data = open(' + JSON.stringify(file.name) + ', "rb")\n\n', 'data');

    const httplibDownloadLike = (endpt: utils.Endpoint, token: string,
                                 paramVals: utils.Dict): react.ReactElement<{}> =>
        httplibTemplate(endpt, utils.getHeaders(endpt, token, JSON.stringify(paramVals)), '', '""');

    return {
        syntax:             syntax,
        description:        "Python request (standard library)",
        renderRPCLike:      httplibRPCLike,
        renderUploadLike:   httplibUploadLike,
        renderDownloadLike: httplibDownloadLike
    };
}

const CurlCodeViewer = (): CodeViewer => {
    const syntax = 'bash';
    const urlArea = (endpt: utils.Endpoint) => 'curl -X POST ' + endpt.getURL() + ' \\\n';

    const makeHeaders = (headers: utils.Dict): react.HTMLElement => d.span(null,
        utils.Dict._map(headers, (k: string, v: string, i: number): react.HTMLElement => {
            let sep = '\\\n';
            if (i == Object.keys(headers).length - 1) sep = '';
            return d.span({key: "" + i}, "  --header '" + k + ': ' + v + "' " + sep);
        })
    );

    // The general model of the curl call, populated with the arguments.
    const curlTemplate = (endpt: utils.Endpoint, headers: utils.Dict,
                          data: string): react.ReactElement<{}> =>
        syntaxHighlight(syntax, d.span(null, urlArea(endpt), makeHeaders(headers), data));

    const curlRPCLike = (endpt: utils.Endpoint, token: string, paramVals: utils.Dict):
            react.ReactElement<{}> =>
        curlTemplate(endpt, utils.RPCLikeHeaders(token),
                     "\\\n  --data '" + shellEscape(paramVals) + "'");

    const curlUploadLike = (endpt: utils.Endpoint, token: string,
                            paramVals: utils.Dict, file: File): react.ReactElement<{}> => {
        const headers = utils.uploadLikeHeaders(token, shellEscape(paramVals, false));
        return curlTemplate(endpt, headers,
            "\\\n  --data-binary @'" + file.name.replace(/'/g, "'\\''") + "'");
    }

    const curlDownloadLike = (endpt: utils.Endpoint, token: string,
                              paramVals: utils.Dict): react.ReactElement<{}> =>
        curlTemplate(endpt, utils.getHeaders(endpt, token, shellEscape(paramVals, false)), '');

    return {
        syntax:             syntax,
        description:        "curl request",
        renderRPCLike:      curlRPCLike,
        renderUploadLike:   curlUploadLike,
        renderDownloadLike: curlDownloadLike
    };
}

const HTTPCodeViewer = (): CodeViewer => {
    const syntax = 'http';

    const httpTemplate = (endpt: utils.Endpoint, headers: utils.Dict,
                          body: string): react.ReactElement<{}> =>
        syntaxHighlight(syntax, d.span(null,
            'POST ' + endpt.getPathname() + "\n",
            'Host: https://' + endpt.getHostname() + "\n",
            'User-Agent: api-explorer-client\n',
            utils.Dict.map(headers, (key: string, value: string) => d.span({key: key},
                key + ": " + value + "\n"
            )),
            body
        )
    );

    const httpRPCLike = (endpt: utils.Endpoint, token: string, paramVals: utils.Dict):
                        react.ReactElement<{}> => {
        const body = JSON.stringify(paramVals, null, 4);
        const headers = utils.RPCLikeHeaders(token);

        // TODO: figure out how to determine the UTF-8 encoded length
        //headers['Content-Length'] = ...

        return httpTemplate(endpt, headers, "\n" + body);
    }

    const httpUploadLike = (endpt: utils.Endpoint, token: string, paramVals: utils.Dict,
                            file: File) => {
        const headers = utils.uploadLikeHeaders(token, JSON.stringify(paramVals));
        headers['Content-Length'] = file.size;
        return httpTemplate(endpt, headers,
                            "\n--- (content of " + file.name + " goes here) ---");
    }

    const httpDownloadLike = (endpt: utils.Endpoint, token: string, paramVals: utils.Dict):
                             react.ReactElement<{}> => {
        const headers = utils.getHeaders(endpt, token, JSON.stringify(paramVals))
        return httpTemplate(endpt, headers, '');
    }

    return {
        syntax:             syntax,
        description:        'HTTP request',
        renderRPCLike:      httpRPCLike,
        renderUploadLike:   httpUploadLike,
        renderDownloadLike: httpDownloadLike
    }
}

export const formats: utils.Dict = {
    'curl': CurlCodeViewer(),
    'requests': RequestsCodeViewer(),
    'httplib': HttplibCodeViewer(),
    'http': HTTPCodeViewer()
}

export const getSelector = (onChange: (e: react.FormEvent) => void): react.HTMLElement => d.select(
    {onChange: onChange},
    utils.Dict.map(formats, (key: string, cv: CodeViewer) =>
        d.option({key: key, value: key}, cv.description))
);

export const render = (cv: CodeViewer, endpt: utils.Endpoint, token: string,
                       paramVals: utils.Dict, file: File): react.ReactElement<{}> => {
    if (endpt.kind === utils.EndpointKind.RPCLike) {
        return cv.renderRPCLike(endpt, token, paramVals);
    } else if (file !== null) {
        return cv.renderUploadLike(endpt, token, paramVals, file);
    } else {
        return cv.renderDownloadLike(endpt, token, paramVals);
    }
}

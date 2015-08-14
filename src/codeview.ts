/* The functions that handle the code view part of the interface: taking the input and
   representing it as an HTTP request or code to generate that request.
 */

import React = require('react');
import Utils = require('./utils');

const ce = React.createElement;
const d = React.DOM;

type Renderer = (endpoint: Utils.Endpoint, token: string, paramVals: Utils.Dict) => React.ReactElement<{}>
type UploadRenderer = (endpoint: Utils.Endpoint, token: string,
                       paramVals: Utils.Dict, file: File) => React.ReactElement<{}>

/* Something which I wish I had more time to fix: in this file, "upload" and "download" have the wrong
   meanings. Specifically, here, "upload" means a call with a file attached, and "download" means a
   non-RPC-like call without a file (e.g. empty uploads and downloads). This might be confusing. I
   originally did this because it makes more of a difference in what the code viewer looks like.
 */

module CodeView {
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

    const syntaxHighlight = (syntax: string, text: React.HTMLElement): React.ReactElement<{}> =>
            ce(Utils.Highlight, {className: syntax}, text);

    // Applies f to each element of the dict, and then appends the separator to all but the last result.
    // Subsequent list elements are separated by newlines.
    const joinWithNewlines = (dc: Utils.Dict, f: (k: string, v: string) => string, sep: string = ','):
        React.ClassicElement<{}>[] => Utils.Dict._map(dc, (k: string, v: string, i: number) => {
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
    const dictToPython = (name: string, dc: Utils.Dict): React.HTMLElement => d.span(null,
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
        const preamble = (endpt: Utils.Endpoint): React.HTMLElement => d.span(null,
            'import requests\n', 'import json\n\n',
            'url = "' + endpt.getURL() + '"\n\n'
        );


        const requestsTemplate = (endpt: Utils.Endpoint, headers: Utils.Dict,
                                dataReader: string|React.HTMLElement, call: string) =>
            syntaxHighlight(syntax, d.span(null,
                preamble(endpt), dictToPython('headers', headers), dataReader, call));

        const requestsRPCLike = (endpt: Utils.Endpoint, token: string,
                               paramVals: Utils.Dict): React.ReactElement<{}> =>
            requestsTemplate(endpt, Utils.RPCLikeHeaders(token), dictToPython('data', paramVals),
                'r = requests.post(url, headers=headers, data=json.dumps(data))');

        const requestsUploadLike = (endpt: Utils.Endpoint, token: string, paramVals: Utils.Dict,
                                  file: File): React.ReactElement<{}> =>
            requestsTemplate(endpt, Utils.uploadLikeHeaders(token, JSON.stringify(paramVals)),
                'data = open(' + JSON.stringify(file.name) + ', "rb").read()\n\n',
                'r = requests.post(url, headers=headers, data=data)');

        const requestsDownloadLike = (endpt: Utils.Endpoint, token: string,
                                    paramVals: Utils.Dict): React.ReactElement<{}> =>
            requestsTemplate(endpt, Utils.getHeaders(endpt, token, JSON.stringify(paramVals)),
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

        const httplibTemplate = (endpt: Utils.Endpoint, headers: Utils.Dict,
                    dataReader: string|React.HTMLElement, dataArg: string): React.ReactElement<{}> =>
            syntaxHighlight(syntax, d.span(null,
                preamble,
                dictToPython('headers', headers),
                dataReader,
                'c = httplib.HTTPSConnection("' + endpt.getHostname() + '")\n',
                'c.request("POST", "' + endpt.getPathname() + '", ' + dataArg + ', headers)\n',
                'r = c.getresponse()'
            )
        );

        const httplibRPCLike = (endpt: Utils.Endpoint, token: string,
                                paramVals: Utils.Dict): React.ReactElement<{}> =>
            httplibTemplate(endpt, Utils.RPCLikeHeaders(token),
                            dictToPython('params', paramVals), 'json.dumps(params)');

        const httplibUploadLike = (endpt: Utils.Endpoint, token: string, paramVals: Utils.Dict,
                                   file: File): React.ReactElement<{}> =>
            httplibTemplate(endpt, Utils.uploadLikeHeaders(token, JSON.stringify(paramVals)),
                'data = open(' + JSON.stringify(file.name) + ', "rb")\n\n', 'data');

        const httplibDownloadLike = (endpt: Utils.Endpoint, token: string,
                                     paramVals: Utils.Dict): React.ReactElement<{}> =>
            httplibTemplate(endpt, Utils.getHeaders(endpt, token, JSON.stringify(paramVals)), '', '""');

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
        const urlArea = (endpt: Utils.Endpoint) => 'curl -X POST ' + endpt.getURL() + ' \\\n';

        const makeHeaders = (headers: Utils.Dict): React.HTMLElement => d.span(null,
            Utils.Dict._map(headers, (k: string, v: string, i: number): React.HTMLElement => {
                let sep = '\\\n';
                if (i == Object.keys(headers).length - 1) sep = '';
                return d.span({key: "" + i}, "  --header '" + k + ': ' + v + "' " + sep);
            })
        );

        // The general model of the curl call, populated with the arguments.
        const curlTemplate = (endpt: Utils.Endpoint, headers: Utils.Dict,
                              data: string): React.ReactElement<{}> =>
            syntaxHighlight(syntax, d.span(null, urlArea(endpt), makeHeaders(headers), data));

        const curlRPCLike = (endpt: Utils.Endpoint, token: string, paramVals: Utils.Dict):
                React.ReactElement<{}> =>
            curlTemplate(endpt, Utils.RPCLikeHeaders(token),
                         "\\\n  --data '" + shellEscape(paramVals) + "'");

        const curlUploadLike = (endpt: Utils.Endpoint, token: string,
                        paramVals: Utils.Dict, file: File): React.ReactElement<{}> => {
            const headers = Utils.uploadLikeHeaders(token, shellEscape(paramVals, false));
            return curlTemplate(endpt, headers,
                "\\\n  --data-binary @'" + file.name.replace(/'/g, "'\\''") + "'");
        }

        const curlDownloadLike = (endpt: Utils.Endpoint, token: string,
                                  paramVals: Utils.Dict): React.ReactElement<{}> =>
            curlTemplate(endpt, Utils.getHeaders(endpt, token, shellEscape(paramVals, false)), '');

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

        const httpTemplate = (endpt: Utils.Endpoint, headers: Utils.Dict,
                              body: string): React.ReactElement<{}> =>
            syntaxHighlight(syntax, d.span(null,
                'POST ' + endpt.getPathname() + "\n",
                'Host: https://' + endpt.getHostname() + "\n",
                'User-Agent: api-explorer-client\n',
                Utils.Dict.map(headers, (key: string, value: string) => d.span({key: key},
                    key + ": " + value + "\n"
                )),
                body
            )
        );

        const httpRPCLike = (endpt: Utils.Endpoint, token: string, paramVals: Utils.Dict):
                            React.ReactElement<{}> => {
            const body = JSON.stringify(paramVals, null, 4);
            const headers = Utils.RPCLikeHeaders(token);

            // TODO: figure out how to determine the UTF-8 encoded length
            //headers['Content-Length'] = ...

            return httpTemplate(endpt, headers, "\n" + body);
        }

        const httpUploadLike = (endpt: Utils.Endpoint, token: string, paramVals: Utils.Dict,
                                file: File) => {
            const headers = Utils.uploadLikeHeaders(token, JSON.stringify(paramVals));
            headers['Content-Length'] = file.size;
            return httpTemplate(endpt, headers,
                                "\n--- (content of " + file.name + " goes here) ---");
        }

        const httpDownloadLike = (endpt: Utils.Endpoint, token: string, paramVals: Utils.Dict):
                                 React.ReactElement<{}> => {
            const headers = Utils.getHeaders(endpt, token, JSON.stringify(paramVals))
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

    export const formats: Utils.Dict = {
        'curl': CurlCodeViewer(),
        'requests': RequestsCodeViewer(),
        'httplib': HttplibCodeViewer(),
        'http': HTTPCodeViewer()
    }

    export const getSelector = (onChange: (e: React.FormEvent) => void): React.HTMLElement => d.select(
        {onChange: onChange},
        Utils.Dict.map(formats, (key: string, cv: CodeViewer) =>
            d.option({key: key, value: key}, cv.description))
    );

    export const render = (cv: CodeViewer, endpt: Utils.Endpoint, token: string,
           paramVals: Utils.Dict, file: File): React.ReactElement<{}> => {
        if (endpt.kind === Utils.EndpointKind.RPCLike) {
            return cv.renderRPCLike(endpt, token, paramVals);
        } else if (file !== null) {
            return cv.renderUploadLike(endpt, token, paramVals, file);
        } else {
            return cv.renderDownloadLike(endpt, token, paramVals);
        }
    }
}

export = CodeView;

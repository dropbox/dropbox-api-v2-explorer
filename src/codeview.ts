/* The functions that handle the code view part of the interface: taking the input and
   representing it as an HTTP request or code to generate that request.
 */

import * as react from 'react';
import * as utils from './utils';

const ce = react.createElement;

type Renderer = (endpoint: utils.Endpoint, token: string, paramVals: utils.Dict,
                 headerVals: utils.Header[]) => react.ReactElement<{}>
type UploadRenderer = (endpoint: utils.Endpoint, token: string, paramVals: utils.Dict,
                       headerVals: utils.Header[], file: File) => react.ReactElement<{}>

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

const syntaxHighlight = (syntax: string, text: react.DetailedReactHTMLElement<any, any>): react.ReactElement<{}> => ce(utils.Highlight, { className: syntax, children: null }, text);

// Applies f to each element of the dict, and then appends the separator to all but the last result.
// Subsequent list elements are separated by newlines.
const joinWithNewlines = (dc: utils.Dict, f: (k: string, v: string) => string, sep = ','):
react.DetailedReactHTMLElement<any, any>[] => utils.Dict._map(dc, (k: string, v: string, i: number) => {
  const maybeSep = (i === Object.keys(dc).length - 1)
    ? '\n' : `${sep}\n`;
  return ce('span', { key: `${i}` }, f(k, v), maybeSep);
});

// the minor differences between JSON and Python's notation
const pythonStringify = (val: any): string => {
  if (val === true) {
    return 'True';
  } if (val === false) {
    return 'False';
  } if (val === null || (val !== val)) {
    return 'None';
  }
  return JSON.stringify(val);
};

// Representation of a dict, or null if the passed-in dict is also null
const dictToPython = (name: string, dc: utils.Dict): react.DetailedReactHTMLElement<any, any> => ce('span', null,
  `${name} = `,
  (dc === null)
    ? 'None' : ce('span', null,
      '{\n',
      joinWithNewlines(dc, (k: string, v: any) => `    "${k}": ${pythonStringify(v)}`),
      '}'), '\n\n');

// For curl calls, we need to escape single quotes, and sometimes also double quotes.
const shellEscape = (val: any, inQuotes = false): string => {
  const toReturn = JSON.stringify(val).replace(/'/g, '\'\\\'\'');
  if (inQuotes) return toReturn.replace(/\\/g, '\\\\').replace(/"/g, '\\\"');
  return toReturn;
};

// Generates the functions that make up the Python Requests code viewer
const RequestsCodeViewer = (): CodeViewer => {
  const syntax = 'python';

  // common among all three parts
  const preamble = (endpt: utils.Endpoint): react.DetailedReactHTMLElement<any, any> => ce('span', null, [
    'import requests\n', 'import json\n\n',
    `url = "${endpt.getURL()}"\n\n`,
  ]);

  const requestsTemplate = (endpt: utils.Endpoint, headers: utils.Dict,
    dataReader: string|react.DetailedReactHTMLElement<any, any>, call: string) => syntaxHighlight(syntax, ce('span', null,
    preamble(endpt), dictToPython('headers', headers), dataReader, call));

  const requestsRPCLike: Renderer = (endpt, token, paramVals, headerVals) => requestsTemplate(endpt, utils.getHeaders(endpt, token, headerVals), dictToPython('data', paramVals),
    'r = requests.post(url, headers=headers, data=json.dumps(data))');

  const requestsUploadLike: UploadRenderer = (endpt, token, paramVals, headerVals, file) => requestsTemplate(endpt, utils.getHeaders(endpt, token, headerVals, JSON.stringify(paramVals)),
    `data = open(${JSON.stringify(file.name)}, "rb").read()\n\n`,
    'r = requests.post(url, headers=headers, data=data)');

  const requestsDownloadLike: Renderer = (endpt, token, paramVals, headerVals) => requestsTemplate(endpt, utils.getHeaders(endpt, token, headerVals, JSON.stringify(paramVals)),
    '', 'r = requests.post(url, headers=headers)');

  return {
    syntax,
    description: 'Python request (requests library)',
    renderRPCLike: requestsRPCLike,
    renderUploadLike: requestsUploadLike,
    renderDownloadLike: requestsDownloadLike,
  };
};

// Python's httplib library (which is also the urllib backend)
const HttplibCodeViewer = (): CodeViewer => {
  const syntax = 'python';

  const preamble = ce('span', null,
    'import sys\nimport json\n',
    'if (3,0) <= sys.version_info < (4,0):\n',
    '    import http.client as httplib\n',
    'elif (2,6) <= sys.version_info < (3,0):\n',
    '    import httplib\n\n');

  const httplibTemplate = (endpt: utils.Endpoint, headers: utils.Dict,
    dataReader: string|react.DetailedReactHTMLElement<any, any>, dataArg: string): react.ReactElement<{}> => syntaxHighlight(syntax, ce('span', null,
    preamble,
    dictToPython('headers', headers),
    dataReader,
    `c = httplib.HTTPSConnection("${endpt.getHostname()}")\n`,
    `c.request("POST", "${endpt.getPathName()}", ${dataArg}, headers)\n`,
    'r = c.getresponse()'));

  const httplibRPCLike: Renderer = (endpt, token, paramVals, headerVals) => httplibTemplate(endpt, utils.getHeaders(endpt, token, headerVals),
    dictToPython('params', paramVals), 'json.dumps(params)');

  const httplibUploadLike: UploadRenderer = (endpt, token, paramVals, headerVals, file) => httplibTemplate(endpt, utils.getHeaders(endpt, token, headerVals, JSON.stringify(paramVals)),
    `data = open(${JSON.stringify(file.name)}, "rb")\n\n`, 'data');

  const httplibDownloadLike: Renderer = (endpt, token, paramVals, headerVals) => httplibTemplate(endpt, utils.getHeaders(endpt, token, headerVals, JSON.stringify(paramVals)), '', '""');

  return {
    syntax,
    description: 'Python request (standard library)',
    renderRPCLike: httplibRPCLike,
    renderUploadLike: httplibUploadLike,
    renderDownloadLike: httplibDownloadLike,
  };
};

const CurlCodeViewer = (): CodeViewer => {
  const syntax = 'bash';
  const urlArea = (endpt: utils.Endpoint) => `curl -X POST ${endpt.getURL()} \\\n`;

  const makeHeaders = (headers: utils.Dict): react.DetailedReactHTMLElement<any, any> => ce('span', null,
    utils.Dict._map(headers, (k: string, v: string, i: number): react.DetailedReactHTMLElement<any, any> => {
      let sep = '\\\n';
      if (i == Object.keys(headers).length - 1) sep = '';
      return ce('span', { key: `${i}` }, `  --header '${k}: ${v}' ${sep}`);
    }));

  // The general model of the curl call, populated with the arguments.
  const curlTemplate = (endpt: utils.Endpoint, headers: utils.Dict,
    data: string): react.ReactElement<{}> => syntaxHighlight(syntax, ce('span', null, urlArea(endpt), makeHeaders(headers), data));

  const curlRPCLike: Renderer = (endpt, token, paramVals, headerVals) => curlTemplate(endpt, utils.getHeaders(endpt, token, headerVals),
    `\\\n  --data '${shellEscape(paramVals)}'`);

  const curlUploadLike: UploadRenderer = (endpt, token, paramVals, headerVals, file) => {
    const headers = utils.getHeaders(endpt, token, headerVals, shellEscape(paramVals, false));
    return curlTemplate(endpt, headers,
      `\\\n  --data-binary @'${file.name.replace(/'/g, '\'\\\'\'')}'`);
  };

  const curlDownloadLike: Renderer = (endpt, token, paramVals, headerVals) => curlTemplate(endpt, utils.getHeaders(endpt, token, headerVals, shellEscape(paramVals, false)), '');

  return {
    syntax,
    description: 'curl request',
    renderRPCLike: curlRPCLike,
    renderUploadLike: curlUploadLike,
    renderDownloadLike: curlDownloadLike,
  };
};

const HTTPCodeViewer = (): CodeViewer => {
  const syntax = 'http';

  const httpTemplate = (endpt: utils.Endpoint, headers: utils.Dict,
    body: string): react.ReactElement<{}> => syntaxHighlight(syntax, ce('span', null,
    `POST ${endpt.getPathName()}\n`,
    `Host: https://${endpt.getHostname()}\n`,
    'User-Agent: api-explorer-client\n',
    utils.Dict.map(headers, (key: string, value: string) => ce('span', { key },
      `${key}: ${value}\n`)),
    body));

  const httpRPCLike: Renderer = (endpt, token, paramVals, headerVals) => {
    const body = JSON.stringify(paramVals, null, 4);
    const headers = utils.getHeaders(endpt, token, headerVals);

    // TODO: figure out how to determine the UTF-8 encoded length
    // headers['Content-Length'] = ...

    return httpTemplate(endpt, headers, `\n${body}`);
  };

  const httpUploadLike: UploadRenderer = (endpt, token, paramVals, headerVals, file) => {
    const headers = utils.getHeaders(endpt, token, headerVals, JSON.stringify(paramVals));
    headers['Content-Length'] = file.size;
    return httpTemplate(endpt, headers,
      `\n--- (content of ${file.name} goes here) ---`);
  };

  const httpDownloadLike: Renderer = (endpt, token, paramVals, headerVals) => {
    const headers = utils.getHeaders(endpt, token, headerVals, JSON.stringify(paramVals));
    return httpTemplate(endpt, headers, '');
  };

  return {
    syntax,
    description: 'HTTP request',
    renderRPCLike: httpRPCLike,
    renderUploadLike: httpUploadLike,
    renderDownloadLike: httpDownloadLike,
  };
};

export const formats: utils.Dict = {
  curl: CurlCodeViewer(),
  requests: RequestsCodeViewer(),
  httplib: HttplibCodeViewer(),
  http: HTTPCodeViewer(),
};

export const getSelector = (onChange: (e: react.FormEvent) => void): react.DetailedReactHTMLElement<any, any> => ce('select',
  { onChange },
  utils.Dict.map(formats, (key: string, cv: CodeViewer) => ce('option', { key, value: key }, cv.description)));

export const render = (cv: CodeViewer, endpt: utils.Endpoint,
  token: string, paramVals: utils.Dict,
  headerVals: utils.Header[], file: File): react.ReactElement<{}> => {
  if (endpt.getEndpointKind() === utils.EndpointKind.RPCLike) {
    return cv.renderRPCLike(endpt, token, paramVals, headerVals);
  } if (file !== null) {
    return cv.renderUploadLike(endpt, token, paramVals, headerVals, file);
  }
  return cv.renderDownloadLike(endpt, token, paramVals, headerVals);
};

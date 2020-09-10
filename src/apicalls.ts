/* This file contains a module for functions that make calls to the API and their associated
   helper functions.
 */

import * as react from 'react';
import * as utils from './utils';

export type Callback = (component: react.Component<any, any>, req: XMLHttpRequest) => void;

/* Listener functions for the API calls; since downloads have a non-JSON response, they need a
   separate listener.
 */
const JSONListener: Callback = (component, resp) => {
  const response: string = resp.responseText;
  if (resp.status !== 200) {
    component.setState({ responseText: utils.errorHandler(resp.status, response) });
  } else {
    component.setState({ responseText: utils.prettyJson(response) });
  }
};

const DownloadCallListener = (component: any, resp: XMLHttpRequest, path: string) => {
  if (resp.status !== 200) {
    component.setState({
      responseText:
            utils.errorHandler(resp.status, utils.arrayBufToString(resp.response)),
    });
  } else {
    const response: string = resp.getResponseHeader('dropbox-api-result');
    component.setState({ responseText: utils.prettyJson(response) });

    const toDownload: Blob = new Blob([resp.response], { type: 'application/octet-stream' });
    component.setState({
      downloadURL: URL.createObjectURL(toDownload),
      downloadFilename: path,
    });
  }
};

/* Utility for determining the correct callback function given an endpoint's kind
   Since the download listener needs to know the filename (for saving the file), it's
   passed through this function.
 */
export const chooseCallback = (k: utils.EndpointKind, path: string): Callback => {
  switch (k) {
    case utils.EndpointKind.Download:
      return (component, resp) => DownloadCallListener(component, resp, path);
    default: return JSONListener;
  }
};

const initRequest = (endpt: utils.Endpoint, token: string, data: string,
  customHeaders: utils.Header[], listener: Callback,
  component: any): XMLHttpRequest => {
  const request = new XMLHttpRequest();
  request.onload = (_: Event) => listener(component, request);
  request.open('POST', endpt.getURL(), true);
  const headers = utils.getHeaders(endpt, token, customHeaders, data);
  for (const key in headers) {
    let value: any = headers[key];

    if (key == 'Content-Type' && endpt.getEndpointKind() == utils.EndpointKind.RPCLike) {
      value = 'text/plain; charset=dropbox-cors-hack';
    }

    request.setRequestHeader(key, value);
  }
  return request;
};

const beginRequest = (component: any) => {
  component.setState({ inProgress: true });
  component.setState({ hideResponse: true });
};

const endRequest = (component: any) => {
  component.setState({ inProgress: false });
  component.setState({ hideResponse: false });
};

/* This function actually makes the API call. There are three different paths, based on whether
   the endpoint is upload-like, download-like, or RPC-like.
   The file parameter will be null unless the user specified a file on an upload-like endpoint.
 */
const utf8Encode = (data: string, request: XMLHttpRequest) => {
  const blob: Blob = new Blob([data]);
  const reader: FileReader = new FileReader();
  reader.onloadend = () => {
    let sendable_blob: Uint8Array = null;
    if (reader.result instanceof ArrayBuffer) {
      sendable_blob = new Uint8Array(<ArrayBuffer>reader.result);
    } else {
      sendable_blob = new TextEncoder().encode(<string>reader.result);
    }
    request.send(sendable_blob);
  };
  reader.readAsArrayBuffer(blob);
};

export const APIWrapper = (data: string, endpt: utils.Endpoint, token: string,
  headers: utils.Header[], listener: Callback,
  component: any, file: File): void => {
  beginRequest(component);

  const listener_wrapper: Callback = (component, resp) => {
    endRequest(component);
    listener(component, resp);
  };

  switch (endpt.getEndpointKind()) {
    case utils.EndpointKind.RPCLike:
      var request = initRequest(endpt, token, data, headers, listener_wrapper, component);
      utf8Encode(data, request);
      break;
    case utils.EndpointKind.Upload:
      var request = initRequest(endpt, token, data, headers, listener_wrapper, component);
      if (file !== null) {
        const reader = new FileReader();
        reader.onload = () => request.send(reader.result);
        reader.readAsArrayBuffer(file);
      } else {
        request.send();
      }
      break;
    case utils.EndpointKind.Download:
      var request = initRequest(endpt, token, data, headers, listener_wrapper, component);
      // Binary files shouldn't be accessed as strings
      request.responseType = 'arraybuffer';
      request.send();
      break;
  }
};

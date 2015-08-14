/* This file contains a module for functions that make calls to the API and their associated
   helper functions.
 */

import React = require('react');
import Utils = require('./utils');

module APICalls {
    export type Callback = (component: React.Component<any, any>, req: XMLHttpRequest) => void;

    /* Listener functions for the API calls; since downloads have a non-JSON response, they need a
       separate listener.
     */
    const JSONListener = (component: any, resp: XMLHttpRequest) => {
        const response: string = resp.responseText;
        if (resp.status !== 200) {
            component.setState({responseText: Utils.errorHandler(resp.status, response)});
        } else {
            component.setState({responseText: Utils.prettyJson(response)});
        }
    }
    const DownloadCallListener = (component: any, resp: XMLHttpRequest, path: string) => {
        if (resp.status !== 200) {
            component.setState({responseText:
                Utils.errorHandler(resp.status, Utils.arrayBufToString(resp.response))
            });
        } else {
            const response: string = resp.getResponseHeader('dropbox-api-result');
            component.setState({responseText: Utils.prettyJson(response)});

            const toDownload: Blob = new Blob([resp.response], {type: 'application/octet-stream'});
            component.setState({
                downloadURL:      URL.createObjectURL(toDownload),
                downloadFilename: path
            })
        }
    }

    /* Utility for determining the correct callback function given an endpoint's kind
       Since the download listener needs to know the filename (for saving the file), it's
       passed through this function.
     */
    export const chooseCallback = (k: Utils.EndpointKind, path: string) => {
        switch(k) {
            case Utils.EndpointKind.Download:
                return (component: any, resp: XMLHttpRequest) =>
                    DownloadCallListener(component, resp, path);
            default: return JSONListener;
        }
    }

    const initRequest = (endpt: Utils.Endpoint, headers: Utils.Dict,
                         listener: Callback, component: any): XMLHttpRequest => {
        let request = new XMLHttpRequest();
        request.onload = (_: Event) => listener(component, request);
        request.open('POST', endpt.getURL(), true);
        for (let key in headers) {
            request.setRequestHeader(key, headers[key]);
        }
        return request;
    }

    /* This function actually makes the API call. There are three different paths, based on whether
       the endpoint is upload-like, download-like, or RPC-like.
       The file parameter will be null unless the user specified a file on an upload-like endpoint.
     */
    export const APIWrapper = (data: string, endpt: Utils.Endpoint, token: string,
                               listener: Callback, component: any, file: File): void => {
        switch (endpt.kind) {
            case Utils.EndpointKind.RPCLike:
                var request = initRequest(endpt, Utils.RPCLikeHeaders(token), listener, component);
                request.send(data);
                break;
            case Utils.EndpointKind.Upload:
                var request = initRequest(endpt, Utils.uploadLikeHeaders(token, data),
                                          listener, component);
                if (file !== null) {
                    let reader = new FileReader();
                    reader.onload = () => request.send(reader.result);
                    reader.readAsArrayBuffer(file);
                } else {
                    request.send();
                }
                break;
            case Utils.EndpointKind.Download:
                var request = initRequest(endpt, Utils.downloadLikeHeaders(token, data),
                                          listener, component);
                // Binary files shouldn't be accessed as strings
                request.responseType = 'arraybuffer';
                request.send();
                break;
        }
    }
}

export = APICalls;

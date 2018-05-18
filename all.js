(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* This file contains a module for functions that make calls to the API and their associated
   helper functions.
 */
var utils = require('./utils');
/* Listener functions for the API calls; since downloads have a non-JSON response, they need a
   separate listener.
 */
var JSONListener = function (component, resp) {
    var response = resp.responseText;
    if (resp.status !== 200) {
        component.setState({ responseText: utils.errorHandler(resp.status, response) });
    }
    else {
        component.setState({ responseText: utils.prettyJson(response) });
    }
};
var DownloadCallListener = function (component, resp, path) {
    if (resp.status !== 200) {
        component.setState({ responseText: utils.errorHandler(resp.status, utils.arrayBufToString(resp.response))
        });
    }
    else {
        var response = resp.getResponseHeader('dropbox-api-result');
        component.setState({ responseText: utils.prettyJson(response) });
        var toDownload = new Blob([resp.response], { type: 'application/octet-stream' });
        component.setState({
            downloadURL: URL.createObjectURL(toDownload),
            downloadFilename: path
        });
    }
};
/* Utility for determining the correct callback function given an endpoint's kind
   Since the download listener needs to know the filename (for saving the file), it's
   passed through this function.
 */
exports.chooseCallback = function (k, path) {
    switch (k) {
        case utils.EndpointKind.Download:
            return function (component, resp) { return DownloadCallListener(component, resp, path); };
        default: return JSONListener;
    }
};
var initRequest = function (endpt, token, data, customHeaders, listener, component) {
    var request = new XMLHttpRequest();
    request.onload = function (_) { return listener(component, request); };
    request.open('POST', endpt.getURL(), true);
    var headers = utils.getHeaders(endpt, token, customHeaders, data);
    for (var key in headers) {
        var value = headers[key];
        if (key == "Content-Type" && endpt.getEndpointKind() == utils.EndpointKind.RPCLike) {
            value = "text/plain; charset=dropbox-cors-hack";
        }
        request.setRequestHeader(key, value);
    }
    return request;
};
var beginRequest = function (component) {
    component.setState({ inProgress: true });
    component.setState({ hideResponse: true });
};
var endRequest = function (component) {
    component.setState({ inProgress: false });
    component.setState({ hideResponse: false });
};
/* This function actually makes the API call. There are three different paths, based on whether
   the endpoint is upload-like, download-like, or RPC-like.
   The file parameter will be null unless the user specified a file on an upload-like endpoint.
 */
var utf8Encode = function (data, request) {
    var blob = new Blob([data]);
    var reader = new FileReader();
    reader.onloadend = function () { return request.send(new Uint8Array(reader.result)); };
    reader.readAsArrayBuffer(blob);
};
exports.APIWrapper = function (data, endpt, token, headers, listener, component, file) {
    beginRequest(component);
    var listener_wrapper = function (component, resp) {
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
                var reader = new FileReader();
                reader.onload = function () { return request.send(reader.result); };
                reader.readAsArrayBuffer(file);
            }
            else {
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

},{"./utils":6}],2:[function(require,module,exports){
(function (global){
/* The functions that handle the code view part of the interface: taking the input and
   representing it as an HTTP request or code to generate that request.
 */
var react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var utils = require('./utils');
var ce = react.createElement;
var d = react.DOM;
var syntaxHighlight = function (syntax, text) {
    return ce(utils.Highlight, { className: syntax }, text);
};
// Applies f to each element of the dict, and then appends the separator to all but the last result.
// Subsequent list elements are separated by newlines.
var joinWithNewlines = function (dc, f, sep) {
    if (sep === void 0) { sep = ','; }
    return utils.Dict._map(dc, function (k, v, i) {
        var maybeSep = (i === Object.keys(dc).length - 1) ?
            "\n" : sep + "\n";
        return d.span({ key: "" + i }, f(k, v), maybeSep);
    });
};
// the minor differences between JSON and Python's notation
var pythonStringify = function (val) {
    if (val === true) {
        return "True";
    }
    else if (val === false) {
        return "False";
    }
    else if (val === null || (val !== val)) {
        return "None";
    }
    else {
        return JSON.stringify(val);
    }
};
// Representation of a dict, or null if the passed-in dict is also null
var dictToPython = function (name, dc) { return d.span(null, name + ' = ', (dc === null) ?
    'None' : d.span(null, '{\n', joinWithNewlines(dc, function (k, v) { return '    "' + k + '": ' + pythonStringify(v); }), '}'), '\n\n'); };
// For curl calls, we need to escape single quotes, and sometimes also double quotes.
var shellEscape = function (val, inQuotes) {
    if (inQuotes === void 0) { inQuotes = false; }
    var toReturn = JSON.stringify(val).replace(/'/g, "'\\''");
    if (inQuotes)
        return toReturn.replace(/\\/g, '\\\\').replace(/"/g, '\\\"');
    else
        return toReturn;
};
// Generates the functions that make up the Python Requests code viewer
var RequestsCodeViewer = function () {
    var syntax = "python";
    // common among all three parts
    var preamble = function (endpt) { return d.span(null, 'import requests\n', 'import json\n\n', 'url = "' + endpt.getURL() + '"\n\n'); };
    var requestsTemplate = function (endpt, headers, dataReader, call) {
        return syntaxHighlight(syntax, d.span(null, preamble(endpt), dictToPython('headers', headers), dataReader, call));
    };
    var requestsRPCLike = function (endpt, token, paramVals, headerVals) {
        return requestsTemplate(endpt, utils.getHeaders(endpt, token, headerVals), dictToPython('data', paramVals), 'r = requests.post(url, headers=headers, data=json.dumps(data))');
    };
    var requestsUploadLike = function (endpt, token, paramVals, headerVals, file) {
        return requestsTemplate(endpt, utils.getHeaders(endpt, token, headerVals, JSON.stringify(paramVals)), 'data = open(' + JSON.stringify(file.name) + ', "rb").read()\n\n', 'r = requests.post(url, headers=headers, data=data)');
    };
    var requestsDownloadLike = function (endpt, token, paramVals, headerVals) {
        return requestsTemplate(endpt, utils.getHeaders(endpt, token, headerVals, JSON.stringify(paramVals)), '', 'r = requests.post(url, headers=headers)');
    };
    return {
        syntax: syntax,
        description: "Python request (requests library)",
        renderRPCLike: requestsRPCLike,
        renderUploadLike: requestsUploadLike,
        renderDownloadLike: requestsDownloadLike
    };
};
// Python's httplib library (which is also the urllib backend)
var HttplibCodeViewer = function () {
    var syntax = "python";
    var preamble = d.span(null, 'import sys\nimport json\n', 'if (3,0) <= sys.version_info < (4,0):\n', '    import http.client as httplib\n', 'elif (2,6) <= sys.version_info < (3,0):\n', '    import httplib\n\n');
    var httplibTemplate = function (endpt, headers, dataReader, dataArg) {
        return syntaxHighlight(syntax, d.span(null, preamble, dictToPython('headers', headers), dataReader, 'c = httplib.HTTPSConnection("' + endpt.getHostname() + '")\n', 'c.request("POST", "' + endpt.getPathName() + '", ' + dataArg + ', headers)\n', 'r = c.getresponse()'));
    };
    var httplibRPCLike = function (endpt, token, paramVals, headerVals) {
        return httplibTemplate(endpt, utils.getHeaders(endpt, token, headerVals), dictToPython('params', paramVals), 'json.dumps(params)');
    };
    var httplibUploadLike = function (endpt, token, paramVals, headerVals, file) {
        return httplibTemplate(endpt, utils.getHeaders(endpt, token, headerVals, JSON.stringify(paramVals)), 'data = open(' + JSON.stringify(file.name) + ', "rb")\n\n', 'data');
    };
    var httplibDownloadLike = function (endpt, token, paramVals, headerVals) {
        return httplibTemplate(endpt, utils.getHeaders(endpt, token, headerVals, JSON.stringify(paramVals)), '', '""');
    };
    return {
        syntax: syntax,
        description: "Python request (standard library)",
        renderRPCLike: httplibRPCLike,
        renderUploadLike: httplibUploadLike,
        renderDownloadLike: httplibDownloadLike
    };
};
var CurlCodeViewer = function () {
    var syntax = 'bash';
    var urlArea = function (endpt) { return 'curl -X POST ' + endpt.getURL() + ' \\\n'; };
    var makeHeaders = function (headers) { return d.span(null, utils.Dict._map(headers, function (k, v, i) {
        var sep = '\\\n';
        if (i == Object.keys(headers).length - 1)
            sep = '';
        return d.span({ key: "" + i }, "  --header '" + k + ': ' + v + "' " + sep);
    })); };
    // The general model of the curl call, populated with the arguments.
    var curlTemplate = function (endpt, headers, data) {
        return syntaxHighlight(syntax, d.span(null, urlArea(endpt), makeHeaders(headers), data));
    };
    var curlRPCLike = function (endpt, token, paramVals, headerVals) {
        return curlTemplate(endpt, utils.getHeaders(endpt, token, headerVals), "\\\n  --data '" + shellEscape(paramVals) + "'");
    };
    var curlUploadLike = function (endpt, token, paramVals, headerVals, file) {
        var headers = utils.getHeaders(endpt, token, headerVals, shellEscape(paramVals, false));
        return curlTemplate(endpt, headers, "\\\n  --data-binary @'" + file.name.replace(/'/g, "'\\''") + "'");
    };
    var curlDownloadLike = function (endpt, token, paramVals, headerVals) {
        return curlTemplate(endpt, utils.getHeaders(endpt, token, headerVals, shellEscape(paramVals, false)), '');
    };
    return {
        syntax: syntax,
        description: "curl request",
        renderRPCLike: curlRPCLike,
        renderUploadLike: curlUploadLike,
        renderDownloadLike: curlDownloadLike
    };
};
var HTTPCodeViewer = function () {
    var syntax = 'http';
    var httpTemplate = function (endpt, headers, body) {
        return syntaxHighlight(syntax, d.span(null, 'POST ' + endpt.getPathName() + "\n", 'Host: https://' + endpt.getHostname() + "\n", 'User-Agent: api-explorer-client\n', utils.Dict.map(headers, function (key, value) { return d.span({ key: key }, key + ": " + value + "\n"); }), body));
    };
    var httpRPCLike = function (endpt, token, paramVals, headerVals) {
        var body = JSON.stringify(paramVals, null, 4);
        var headers = utils.getHeaders(endpt, token, headerVals);
        // TODO: figure out how to determine the UTF-8 encoded length
        //headers['Content-Length'] = ...
        return httpTemplate(endpt, headers, "\n" + body);
    };
    var httpUploadLike = function (endpt, token, paramVals, headerVals, file) {
        var headers = utils.getHeaders(endpt, token, headerVals, JSON.stringify(paramVals));
        headers['Content-Length'] = file.size;
        return httpTemplate(endpt, headers, "\n--- (content of " + file.name + " goes here) ---");
    };
    var httpDownloadLike = function (endpt, token, paramVals, headerVals) {
        var headers = utils.getHeaders(endpt, token, headerVals, JSON.stringify(paramVals));
        return httpTemplate(endpt, headers, '');
    };
    return {
        syntax: syntax,
        description: 'HTTP request',
        renderRPCLike: httpRPCLike,
        renderUploadLike: httpUploadLike,
        renderDownloadLike: httpDownloadLike
    };
};
exports.formats = {
    'curl': CurlCodeViewer(),
    'requests': RequestsCodeViewer(),
    'httplib': HttplibCodeViewer(),
    'http': HTTPCodeViewer()
};
exports.getSelector = function (onChange) { return d.select({ onChange: onChange }, utils.Dict.map(exports.formats, function (key, cv) {
    return d.option({ key: key, value: key }, cv.description);
})); };
exports.render = function (cv, endpt, token, paramVals, headerVals, file) {
    if (endpt.getEndpointKind() === utils.EndpointKind.RPCLike) {
        return cv.renderRPCLike(endpt, token, paramVals, headerVals);
    }
    else if (file !== null) {
        return cv.renderUploadLike(endpt, token, paramVals, headerVals, file);
    }
    else {
        return cv.renderDownloadLike(endpt, token, paramVals, headerVals);
    }
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./utils":6}],3:[function(require,module,exports){
/* The files contains helper functions to interact with cookie storage. This will be
   used a fallback when session/local storage is not allowed (safari private browsing
   mode etc.)
 */
exports.setItem = function (key, item) {
    document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(item);
};
exports.getItem = function (key) {
    var dict = exports.getAll();
    return dict[key];
};
exports.getAll = function () {
    var dict = {};
    var cookies = document.cookie.split('; ');
    cookies.forEach(function (value) {
        if (value.length > 0) {
            var items = value.split('=');
            dict[decodeURIComponent(items[0])] = decodeURIComponent(items[1]);
        }
    });
    return dict;
};

},{}],4:[function(require,module,exports){
// Automatically generated code; do not edit
var Utils = require('./utils');
var Endpoints;
(function (Endpoints) {
    var auth_token_from_oauth1_endpt = new Utils.Endpoint("auth", "token/from_oauth1", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "app",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("oauth1_token", false), new Utils.TextParam("oauth1_token_secret", false));
    var auth_token_revoke_endpt = new Utils.Endpoint("auth", "token/revoke", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    });
    var file_properties_properties_add_endpt = new Utils.Endpoint("file_properties", "properties/add", {
        style: "rpc",
        api_group: "properties",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("path", false), new Utils.ListParam("property_groups", false, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("template_id", false), new Utils.ListParam("fields", false, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("value", false)]); })]); }));
    var file_properties_properties_overwrite_endpt = new Utils.Endpoint("file_properties", "properties/overwrite", {
        style: "rpc",
        api_group: "properties",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("path", false), new Utils.ListParam("property_groups", false, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("template_id", false), new Utils.ListParam("fields", false, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("value", false)]); })]); }));
    var file_properties_properties_remove_endpt = new Utils.Endpoint("file_properties", "properties/remove", {
        style: "rpc",
        api_group: "properties",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("path", false), new Utils.ListParam("property_template_ids", false, function (index) { return new Utils.TextParam(index, false); }));
    var file_properties_properties_search_endpt = new Utils.Endpoint("file_properties", "properties/search", {
        style: "rpc",
        api_group: "properties",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.ListParam("queries", false, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("query", false), new Utils.UnionParam("mode", false, [new Utils.TextParam("field_name", false), new Utils.VoidParam("other")]), new Utils.UnionParam("logical_operator", true, [new Utils.VoidParam("or_operator"), new Utils.VoidParam("other")])]); }), new Utils.UnionParam("template_filter", true, [new Utils.ListParam("filter_some", false, function (index) { return new Utils.TextParam(index, false); }), new Utils.VoidParam("other"), new Utils.VoidParam("filter_none")]));
    var file_properties_properties_search_continue_endpt = new Utils.Endpoint("file_properties", "properties/search/continue", {
        style: "rpc",
        api_group: "properties",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("cursor", false));
    var file_properties_properties_update_endpt = new Utils.Endpoint("file_properties", "properties/update", {
        style: "rpc",
        api_group: "properties",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("path", false), new Utils.ListParam("update_property_groups", false, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("template_id", false), new Utils.ListParam("add_or_update_fields", true, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("value", false)]); }), new Utils.ListParam("remove_fields", true, function (index) { return new Utils.TextParam(index, false); })]); }));
    var file_properties_templates_add_for_team_endpt = new Utils.Endpoint("file_properties", "templates/add_for_team", {
        style: "rpc",
        api_group: "properties",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("name", false), new Utils.TextParam("description", false), new Utils.ListParam("fields", false, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("description", false), new Utils.UnionParam("type", false, [new Utils.VoidParam("string"), new Utils.VoidParam("other")])]); }));
    var file_properties_templates_add_for_user_endpt = new Utils.Endpoint("file_properties", "templates/add_for_user", {
        style: "rpc",
        api_group: "properties",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("name", false), new Utils.TextParam("description", false), new Utils.ListParam("fields", false, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("description", false), new Utils.UnionParam("type", false, [new Utils.VoidParam("string"), new Utils.VoidParam("other")])]); }));
    var file_properties_templates_get_for_team_endpt = new Utils.Endpoint("file_properties", "templates/get_for_team", {
        style: "rpc",
        api_group: "properties",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("template_id", false));
    var file_properties_templates_get_for_user_endpt = new Utils.Endpoint("file_properties", "templates/get_for_user", {
        style: "rpc",
        api_group: "properties",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("template_id", false));
    var file_properties_templates_list_for_team_endpt = new Utils.Endpoint("file_properties", "templates/list_for_team", {
        style: "rpc",
        api_group: "properties",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    });
    var file_properties_templates_list_for_user_endpt = new Utils.Endpoint("file_properties", "templates/list_for_user", {
        style: "rpc",
        api_group: "properties",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    });
    var file_properties_templates_remove_for_team_endpt = new Utils.Endpoint("file_properties", "templates/remove_for_team", {
        style: "rpc",
        api_group: "properties",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("template_id", false));
    var file_properties_templates_remove_for_user_endpt = new Utils.Endpoint("file_properties", "templates/remove_for_user", {
        style: "rpc",
        api_group: "properties",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("template_id", false));
    var file_properties_templates_update_for_team_endpt = new Utils.Endpoint("file_properties", "templates/update_for_team", {
        style: "rpc",
        api_group: "properties",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("template_id", false), new Utils.TextParam("name", true), new Utils.TextParam("description", true), new Utils.ListParam("add_fields", true, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("description", false), new Utils.UnionParam("type", false, [new Utils.VoidParam("string"), new Utils.VoidParam("other")])]); }));
    var file_properties_templates_update_for_user_endpt = new Utils.Endpoint("file_properties", "templates/update_for_user", {
        style: "rpc",
        api_group: "properties",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("template_id", false), new Utils.TextParam("name", true), new Utils.TextParam("description", true), new Utils.ListParam("add_fields", true, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("description", false), new Utils.UnionParam("type", false, [new Utils.VoidParam("string"), new Utils.VoidParam("other")])]); }));
    var file_requests_create_endpt = new Utils.Endpoint("file_requests", "create", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("title", false), new Utils.TextParam("destination", false), new Utils.StructParam("deadline", true, [new Utils.TextParam("deadline", false), new Utils.UnionParam("allow_late_uploads", true, [new Utils.VoidParam("one_day"), new Utils.VoidParam("two_days"), new Utils.VoidParam("seven_days"), new Utils.VoidParam("thirty_days"), new Utils.VoidParam("always"), new Utils.VoidParam("other")])]), new Utils.BoolParam("open", true));
    var file_requests_get_endpt = new Utils.Endpoint("file_requests", "get", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("id", false));
    var file_requests_list_endpt = new Utils.Endpoint("file_requests", "list", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    });
    var file_requests_update_endpt = new Utils.Endpoint("file_requests", "update", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("id", false), new Utils.TextParam("title", true), new Utils.TextParam("destination", true), new Utils.UnionParam("deadline", true, [new Utils.VoidParam("no_update"), new Utils.StructParam("update", true, [new Utils.TextParam("deadline", false), new Utils.UnionParam("allow_late_uploads", true, [new Utils.VoidParam("one_day"), new Utils.VoidParam("two_days"), new Utils.VoidParam("seven_days"), new Utils.VoidParam("thirty_days"), new Utils.VoidParam("always"), new Utils.VoidParam("other")])]), new Utils.VoidParam("other")]), new Utils.BoolParam("open", true));
    var files_copy_batch_endpt = new Utils.Endpoint("files", "copy_batch", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.ListParam("entries", false, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("from_path", false), new Utils.TextParam("to_path", false)]); }), new Utils.BoolParam("allow_shared_folder", true), new Utils.BoolParam("autorename", true), new Utils.BoolParam("allow_ownership_transfer", true));
    var files_copy_batch_check_endpt = new Utils.Endpoint("files", "copy_batch/check", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("async_job_id", false));
    var files_copy_reference_get_endpt = new Utils.Endpoint("files", "copy_reference/get", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("path", false));
    var files_copy_reference_save_endpt = new Utils.Endpoint("files", "copy_reference/save", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("copy_reference", false), new Utils.TextParam("path", false));
    var files_copy_v2_endpt = new Utils.Endpoint("files", "copy_v2", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("from_path", false), new Utils.TextParam("to_path", false), new Utils.BoolParam("allow_shared_folder", true), new Utils.BoolParam("autorename", true), new Utils.BoolParam("allow_ownership_transfer", true));
    var files_create_folder_batch_endpt = new Utils.Endpoint("files", "create_folder_batch", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.ListParam("paths", false, function (index) { return new Utils.TextParam(index, false); }), new Utils.BoolParam("autorename", true), new Utils.BoolParam("force_async", true));
    var files_create_folder_batch_check_endpt = new Utils.Endpoint("files", "create_folder_batch/check", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("async_job_id", false));
    var files_create_folder_v2_endpt = new Utils.Endpoint("files", "create_folder_v2", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("path", false), new Utils.BoolParam("autorename", true));
    var files_delete_batch_endpt = new Utils.Endpoint("files", "delete_batch", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.ListParam("entries", false, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("path", false), new Utils.TextParam("parent_rev", true)]); }));
    var files_delete_batch_check_endpt = new Utils.Endpoint("files", "delete_batch/check", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("async_job_id", false));
    var files_delete_v2_endpt = new Utils.Endpoint("files", "delete_v2", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("path", false), new Utils.TextParam("parent_rev", true));
    var files_download_endpt = new Utils.Endpoint("files", "download", {
        style: "download",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "whole_team",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "content",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("path", false), new Utils.TextParam("rev", true));
    var files_download_zip_endpt = new Utils.Endpoint("files", "download_zip", {
        style: "download",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "content",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("path", false));
    var files_get_metadata_endpt = new Utils.Endpoint("files", "get_metadata", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "whole_team",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "True",
        is_web_alpha: "False"
    }, new Utils.TextParam("path", false), new Utils.BoolParam("include_media_info", true), new Utils.BoolParam("include_deleted", true), new Utils.BoolParam("include_has_explicit_shared_members", true), new Utils.UnionParam("include_property_groups", true, [new Utils.ListParam("filter_some", false, function (index) { return new Utils.TextParam(index, false); }), new Utils.VoidParam("other")]));
    var files_get_preview_endpt = new Utils.Endpoint("files", "get_preview", {
        style: "download",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "whole_team",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "content",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("path", false), new Utils.TextParam("rev", true));
    var files_get_temporary_link_endpt = new Utils.Endpoint("files", "get_temporary_link", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("path", false));
    var files_get_thumbnail_endpt = new Utils.Endpoint("files", "get_thumbnail", {
        style: "download",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "whole_team",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "content",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("path", false), new Utils.UnionParam("format", true, [new Utils.VoidParam("jpeg"), new Utils.VoidParam("png")]), new Utils.UnionParam("size", true, [new Utils.VoidParam("w32h32"), new Utils.VoidParam("w64h64"), new Utils.VoidParam("w128h128"), new Utils.VoidParam("w256h256"), new Utils.VoidParam("w480h320"), new Utils.VoidParam("w640h480"), new Utils.VoidParam("w960h640"), new Utils.VoidParam("w1024h768"), new Utils.VoidParam("w2048h1536")]), new Utils.UnionParam("mode", true, [new Utils.VoidParam("strict"), new Utils.VoidParam("bestfit"), new Utils.VoidParam("fitone_bestfit")]));
    var files_get_thumbnail_batch_endpt = new Utils.Endpoint("files", "get_thumbnail_batch", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "whole_team",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "content",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.ListParam("entries", false, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("path", false), new Utils.UnionParam("format", true, [new Utils.VoidParam("jpeg"), new Utils.VoidParam("png")]), new Utils.UnionParam("size", true, [new Utils.VoidParam("w32h32"), new Utils.VoidParam("w64h64"), new Utils.VoidParam("w128h128"), new Utils.VoidParam("w256h256"), new Utils.VoidParam("w480h320"), new Utils.VoidParam("w640h480"), new Utils.VoidParam("w960h640"), new Utils.VoidParam("w1024h768"), new Utils.VoidParam("w2048h1536")]), new Utils.UnionParam("mode", true, [new Utils.VoidParam("strict"), new Utils.VoidParam("bestfit"), new Utils.VoidParam("fitone_bestfit")])]); }));
    var files_list_folder_endpt = new Utils.Endpoint("files", "list_folder", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "whole_team",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("path", false), new Utils.BoolParam("recursive", true), new Utils.BoolParam("include_media_info", true), new Utils.BoolParam("include_deleted", true), new Utils.BoolParam("include_has_explicit_shared_members", true), new Utils.BoolParam("include_mounted_folders", true), new Utils.IntParam("limit", true), new Utils.StructParam("shared_link", true, [new Utils.TextParam("url", false), new Utils.TextParam("password", true)]), new Utils.UnionParam("include_property_groups", true, [new Utils.ListParam("filter_some", false, function (index) { return new Utils.TextParam(index, false); }), new Utils.VoidParam("other")]));
    var files_list_folder_continue_endpt = new Utils.Endpoint("files", "list_folder/continue", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "whole_team",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("cursor", false));
    var files_list_folder_get_latest_cursor_endpt = new Utils.Endpoint("files", "list_folder/get_latest_cursor", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "whole_team",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("path", false), new Utils.BoolParam("recursive", true), new Utils.BoolParam("include_media_info", true), new Utils.BoolParam("include_deleted", true), new Utils.BoolParam("include_has_explicit_shared_members", true), new Utils.BoolParam("include_mounted_folders", true), new Utils.IntParam("limit", true), new Utils.StructParam("shared_link", true, [new Utils.TextParam("url", false), new Utils.TextParam("password", true)]), new Utils.UnionParam("include_property_groups", true, [new Utils.ListParam("filter_some", false, function (index) { return new Utils.TextParam(index, false); }), new Utils.VoidParam("other")]));
    var files_list_folder_longpoll_endpt = new Utils.Endpoint("files", "list_folder/longpoll", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "whole_team",
        feature: "None",
        auth: "noauth",
        cluster: "meta-api",
        host: "notify",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("cursor", false), new Utils.IntParam("timeout", true));
    var files_list_revisions_endpt = new Utils.Endpoint("files", "list_revisions", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "whole_team",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("path", false), new Utils.UnionParam("mode", true, [new Utils.VoidParam("path"), new Utils.VoidParam("id"), new Utils.VoidParam("other")]), new Utils.IntParam("limit", true));
    var files_move_batch_endpt = new Utils.Endpoint("files", "move_batch", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.ListParam("entries", false, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("from_path", false), new Utils.TextParam("to_path", false)]); }), new Utils.BoolParam("allow_shared_folder", true), new Utils.BoolParam("autorename", true), new Utils.BoolParam("allow_ownership_transfer", true));
    var files_move_batch_check_endpt = new Utils.Endpoint("files", "move_batch/check", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("async_job_id", false));
    var files_move_v2_endpt = new Utils.Endpoint("files", "move_v2", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("from_path", false), new Utils.TextParam("to_path", false), new Utils.BoolParam("allow_shared_folder", true), new Utils.BoolParam("autorename", true), new Utils.BoolParam("allow_ownership_transfer", true));
    var files_permanently_delete_endpt = new Utils.Endpoint("files", "permanently_delete", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("path", false), new Utils.TextParam("parent_rev", true));
    var files_restore_endpt = new Utils.Endpoint("files", "restore", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("path", false), new Utils.TextParam("rev", false));
    var files_save_url_endpt = new Utils.Endpoint("files", "save_url", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("path", false), new Utils.TextParam("url", false));
    var files_save_url_check_job_status_endpt = new Utils.Endpoint("files", "save_url/check_job_status", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("async_job_id", false));
    var files_search_endpt = new Utils.Endpoint("files", "search", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("path", false), new Utils.TextParam("query", false), new Utils.IntParam("start", true), new Utils.IntParam("max_results", true), new Utils.UnionParam("mode", true, [new Utils.VoidParam("filename"), new Utils.VoidParam("filename_and_content"), new Utils.VoidParam("deleted_filename")]));
    var files_upload_endpt = new Utils.Endpoint("files", "upload", {
        style: "upload",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "upload_api_rate_limit",
        auth: "user",
        cluster: "meta-api",
        host: "content",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.FileParam(), new Utils.TextParam("path", false), new Utils.UnionParam("mode", true, [new Utils.VoidParam("add"), new Utils.VoidParam("overwrite"), new Utils.TextParam("update", false)]), new Utils.BoolParam("autorename", true), new Utils.TextParam("client_modified", true), new Utils.BoolParam("mute", true), new Utils.ListParam("property_groups", true, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("template_id", false), new Utils.ListParam("fields", false, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("value", false)]); })]); }));
    var files_upload_session_append_v2_endpt = new Utils.Endpoint("files", "upload_session/append_v2", {
        style: "upload",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "upload_api_rate_limit",
        auth: "user",
        cluster: "meta-api",
        host: "content",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.FileParam(), new Utils.StructParam("cursor", false, [new Utils.TextParam("session_id", false), new Utils.IntParam("offset", false)]), new Utils.BoolParam("close", true));
    var files_upload_session_finish_endpt = new Utils.Endpoint("files", "upload_session/finish", {
        style: "upload",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "upload_api_rate_limit",
        auth: "user",
        cluster: "meta-api",
        host: "content",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.FileParam(), new Utils.StructParam("cursor", false, [new Utils.TextParam("session_id", false), new Utils.IntParam("offset", false)]), new Utils.StructParam("commit", false, [new Utils.TextParam("path", false), new Utils.UnionParam("mode", true, [new Utils.VoidParam("add"), new Utils.VoidParam("overwrite"), new Utils.TextParam("update", false)]), new Utils.BoolParam("autorename", true), new Utils.TextParam("client_modified", true), new Utils.BoolParam("mute", true), new Utils.ListParam("property_groups", true, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("template_id", false), new Utils.ListParam("fields", false, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("value", false)]); })]); })]));
    var files_upload_session_finish_batch_endpt = new Utils.Endpoint("files", "upload_session/finish_batch", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "upload_api_rate_limit",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.ListParam("entries", false, function (index) { return new Utils.StructParam(index, false, [new Utils.StructParam("cursor", false, [new Utils.TextParam("session_id", false), new Utils.IntParam("offset", false)]), new Utils.StructParam("commit", false, [new Utils.TextParam("path", false), new Utils.UnionParam("mode", true, [new Utils.VoidParam("add"), new Utils.VoidParam("overwrite"), new Utils.TextParam("update", false)]), new Utils.BoolParam("autorename", true), new Utils.TextParam("client_modified", true), new Utils.BoolParam("mute", true), new Utils.ListParam("property_groups", true, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("template_id", false), new Utils.ListParam("fields", false, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("value", false)]); })]); })])]); }));
    var files_upload_session_finish_batch_check_endpt = new Utils.Endpoint("files", "upload_session/finish_batch/check", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("async_job_id", false));
    var files_upload_session_start_endpt = new Utils.Endpoint("files", "upload_session/start", {
        style: "upload",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "upload_api_rate_limit",
        auth: "user",
        cluster: "meta-api",
        host: "content",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.FileParam(), new Utils.BoolParam("close", true));
    var paper_docs_archive_endpt = new Utils.Endpoint("paper", "docs/archive", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "paper-eng",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("doc_id", false));
    var paper_docs_create_endpt = new Utils.Endpoint("paper", "docs/create", {
        style: "upload",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "paper-eng",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.FileParam(), new Utils.UnionParam("import_format", false, [new Utils.VoidParam("html"), new Utils.VoidParam("markdown"), new Utils.VoidParam("plain_text"), new Utils.VoidParam("other")]), new Utils.TextParam("parent_folder_id", true));
    var paper_docs_download_endpt = new Utils.Endpoint("paper", "docs/download", {
        style: "download",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "paper-eng",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("doc_id", false), new Utils.UnionParam("export_format", false, [new Utils.VoidParam("html"), new Utils.VoidParam("markdown"), new Utils.VoidParam("other")]));
    var paper_docs_folder_users_list_endpt = new Utils.Endpoint("paper", "docs/folder_users/list", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "paper-eng",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("doc_id", false), new Utils.IntParam("limit", true));
    var paper_docs_folder_users_list_continue_endpt = new Utils.Endpoint("paper", "docs/folder_users/list/continue", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "paper-eng",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("doc_id", false), new Utils.TextParam("cursor", false));
    var paper_docs_get_folder_info_endpt = new Utils.Endpoint("paper", "docs/get_folder_info", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "paper-eng",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("doc_id", false));
    var paper_docs_list_endpt = new Utils.Endpoint("paper", "docs/list", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "paper-eng",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.UnionParam("filter_by", true, [new Utils.VoidParam("docs_accessed"), new Utils.VoidParam("docs_created"), new Utils.VoidParam("other")]), new Utils.UnionParam("sort_by", true, [new Utils.VoidParam("accessed"), new Utils.VoidParam("modified"), new Utils.VoidParam("created"), new Utils.VoidParam("other")]), new Utils.UnionParam("sort_order", true, [new Utils.VoidParam("ascending"), new Utils.VoidParam("descending"), new Utils.VoidParam("other")]), new Utils.IntParam("limit", true));
    var paper_docs_list_continue_endpt = new Utils.Endpoint("paper", "docs/list/continue", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "paper-eng",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("cursor", false));
    var paper_docs_permanently_delete_endpt = new Utils.Endpoint("paper", "docs/permanently_delete", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "paper-eng",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("doc_id", false));
    var paper_docs_sharing_policy_get_endpt = new Utils.Endpoint("paper", "docs/sharing_policy/get", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "paper-eng",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("doc_id", false));
    var paper_docs_sharing_policy_set_endpt = new Utils.Endpoint("paper", "docs/sharing_policy/set", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "paper-eng",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("doc_id", false), new Utils.StructParam("sharing_policy", false, [new Utils.UnionParam("public_sharing_policy", true, [new Utils.VoidParam("people_with_link_can_edit"), new Utils.VoidParam("people_with_link_can_view_and_comment"), new Utils.VoidParam("invite_only"), new Utils.VoidParam("disabled")]), new Utils.UnionParam("team_sharing_policy", true, [new Utils.VoidParam("people_with_link_can_edit"), new Utils.VoidParam("people_with_link_can_view_and_comment"), new Utils.VoidParam("invite_only")])]));
    var paper_docs_update_endpt = new Utils.Endpoint("paper", "docs/update", {
        style: "upload",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "paper-eng",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.FileParam(), new Utils.TextParam("doc_id", false), new Utils.UnionParam("doc_update_policy", false, [new Utils.VoidParam("append"), new Utils.VoidParam("prepend"), new Utils.VoidParam("overwrite_all"), new Utils.VoidParam("other")]), new Utils.IntParam("revision", false), new Utils.UnionParam("import_format", false, [new Utils.VoidParam("html"), new Utils.VoidParam("markdown"), new Utils.VoidParam("plain_text"), new Utils.VoidParam("other")]));
    var paper_docs_users_add_endpt = new Utils.Endpoint("paper", "docs/users/add", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "paper-eng",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("doc_id", false), new Utils.ListParam("members", false, function (index) { return new Utils.StructParam(index, false, [new Utils.UnionParam("member", false, [new Utils.TextParam("dropbox_id", false), new Utils.TextParam("email", false), new Utils.VoidParam("other")]), new Utils.UnionParam("permission_level", true, [new Utils.VoidParam("edit"), new Utils.VoidParam("view_and_comment"), new Utils.VoidParam("other")])]); }), new Utils.TextParam("custom_message", true), new Utils.BoolParam("quiet", true));
    var paper_docs_users_list_endpt = new Utils.Endpoint("paper", "docs/users/list", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "paper-eng",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("doc_id", false), new Utils.IntParam("limit", true), new Utils.UnionParam("filter_by", true, [new Utils.VoidParam("visited"), new Utils.VoidParam("shared"), new Utils.VoidParam("other")]));
    var paper_docs_users_list_continue_endpt = new Utils.Endpoint("paper", "docs/users/list/continue", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "paper-eng",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("doc_id", false), new Utils.TextParam("cursor", false));
    var paper_docs_users_remove_endpt = new Utils.Endpoint("paper", "docs/users/remove", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "paper-eng",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("doc_id", false), new Utils.UnionParam("member", false, [new Utils.TextParam("dropbox_id", false), new Utils.TextParam("email", false), new Utils.VoidParam("other")]));
    var sharing_add_file_member_endpt = new Utils.Endpoint("sharing", "add_file_member", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "sharing",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("file", false), new Utils.ListParam("members", false, function (index) { return new Utils.UnionParam(index, false, [new Utils.TextParam("dropbox_id", false), new Utils.TextParam("email", false), new Utils.VoidParam("other")]); }), new Utils.TextParam("custom_message", true), new Utils.BoolParam("quiet", true), new Utils.UnionParam("access_level", true, [new Utils.VoidParam("owner"), new Utils.VoidParam("editor"), new Utils.VoidParam("viewer"), new Utils.VoidParam("viewer_no_comment"), new Utils.VoidParam("other")]), new Utils.BoolParam("add_message_as_comment", true));
    var sharing_add_folder_member_endpt = new Utils.Endpoint("sharing", "add_folder_member", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("shared_folder_id", false), new Utils.ListParam("members", false, function (index) { return new Utils.StructParam(index, false, [new Utils.UnionParam("member", false, [new Utils.TextParam("dropbox_id", false), new Utils.TextParam("email", false), new Utils.VoidParam("other")]), new Utils.UnionParam("access_level", true, [new Utils.VoidParam("owner"), new Utils.VoidParam("editor"), new Utils.VoidParam("viewer"), new Utils.VoidParam("viewer_no_comment"), new Utils.VoidParam("other")])]); }), new Utils.BoolParam("quiet", true), new Utils.TextParam("custom_message", true));
    var sharing_check_job_status_endpt = new Utils.Endpoint("sharing", "check_job_status", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("async_job_id", false));
    var sharing_check_remove_member_job_status_endpt = new Utils.Endpoint("sharing", "check_remove_member_job_status", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("async_job_id", false));
    var sharing_check_share_job_status_endpt = new Utils.Endpoint("sharing", "check_share_job_status", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("async_job_id", false));
    var sharing_create_shared_link_with_settings_endpt = new Utils.Endpoint("sharing", "create_shared_link_with_settings", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "sharing",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("path", false), new Utils.StructParam("settings", true, [new Utils.UnionParam("requested_visibility", true, [new Utils.VoidParam("public"), new Utils.VoidParam("team_only"), new Utils.VoidParam("password")]), new Utils.TextParam("link_password", true), new Utils.TextParam("expires", true)]));
    var sharing_get_file_metadata_endpt = new Utils.Endpoint("sharing", "get_file_metadata", {
        style: "rpc",
        api_group: "truelink-alpha",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "sharing",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("file", false), new Utils.ListParam("actions", true, function (index) { return new Utils.UnionParam(index, false, [new Utils.VoidParam("disable_viewer_info"), new Utils.VoidParam("edit_contents"), new Utils.VoidParam("enable_viewer_info"), new Utils.VoidParam("invite_viewer"), new Utils.VoidParam("invite_viewer_no_comment"), new Utils.VoidParam("unshare"), new Utils.VoidParam("relinquish_membership"), new Utils.VoidParam("share_link"), new Utils.VoidParam("create_link"), new Utils.VoidParam("other")]); }));
    var sharing_get_file_metadata_batch_endpt = new Utils.Endpoint("sharing", "get_file_metadata/batch", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "sharing",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.ListParam("files", false, function (index) { return new Utils.TextParam(index, false); }), new Utils.ListParam("actions", true, function (index) { return new Utils.UnionParam(index, false, [new Utils.VoidParam("disable_viewer_info"), new Utils.VoidParam("edit_contents"), new Utils.VoidParam("enable_viewer_info"), new Utils.VoidParam("invite_viewer"), new Utils.VoidParam("invite_viewer_no_comment"), new Utils.VoidParam("unshare"), new Utils.VoidParam("relinquish_membership"), new Utils.VoidParam("share_link"), new Utils.VoidParam("create_link"), new Utils.VoidParam("other")]); }));
    var sharing_get_folder_metadata_endpt = new Utils.Endpoint("sharing", "get_folder_metadata", {
        style: "rpc",
        api_group: "truelink-alpha",
        is_preview: "False",
        select_admin_mode: "whole_team",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("shared_folder_id", false), new Utils.ListParam("actions", true, function (index) { return new Utils.UnionParam(index, false, [new Utils.VoidParam("change_options"), new Utils.VoidParam("disable_viewer_info"), new Utils.VoidParam("edit_contents"), new Utils.VoidParam("enable_viewer_info"), new Utils.VoidParam("invite_editor"), new Utils.VoidParam("invite_viewer"), new Utils.VoidParam("invite_viewer_no_comment"), new Utils.VoidParam("relinquish_membership"), new Utils.VoidParam("unmount"), new Utils.VoidParam("unshare"), new Utils.VoidParam("leave_a_copy"), new Utils.VoidParam("share_link"), new Utils.VoidParam("create_link"), new Utils.VoidParam("set_access_inheritance"), new Utils.VoidParam("other")]); }));
    var sharing_get_shared_link_file_endpt = new Utils.Endpoint("sharing", "get_shared_link_file", {
        style: "download",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "content",
        allow_app_folder_app: "True",
        owner: "sharing",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("url", false), new Utils.TextParam("path", true), new Utils.TextParam("link_password", true));
    var sharing_get_shared_link_metadata_endpt = new Utils.Endpoint("sharing", "get_shared_link_metadata", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "sharing",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("url", false), new Utils.TextParam("path", true), new Utils.TextParam("link_password", true));
    var sharing_list_file_members_endpt = new Utils.Endpoint("sharing", "list_file_members", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "sharing",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("file", false), new Utils.ListParam("actions", true, function (index) { return new Utils.UnionParam(index, false, [new Utils.VoidParam("leave_a_copy"), new Utils.VoidParam("make_editor"), new Utils.VoidParam("make_owner"), new Utils.VoidParam("make_viewer"), new Utils.VoidParam("make_viewer_no_comment"), new Utils.VoidParam("remove"), new Utils.VoidParam("other")]); }), new Utils.BoolParam("include_inherited", true), new Utils.IntParam("limit", true));
    var sharing_list_file_members_batch_endpt = new Utils.Endpoint("sharing", "list_file_members/batch", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "sharing",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.ListParam("files", false, function (index) { return new Utils.TextParam(index, false); }), new Utils.IntParam("limit", true));
    var sharing_list_file_members_continue_endpt = new Utils.Endpoint("sharing", "list_file_members/continue", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "sharing",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("cursor", false));
    var sharing_list_folder_members_endpt = new Utils.Endpoint("sharing", "list_folder_members", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "whole_team",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("shared_folder_id", false), new Utils.ListParam("actions", true, function (index) { return new Utils.UnionParam(index, false, [new Utils.VoidParam("leave_a_copy"), new Utils.VoidParam("make_editor"), new Utils.VoidParam("make_owner"), new Utils.VoidParam("make_viewer"), new Utils.VoidParam("make_viewer_no_comment"), new Utils.VoidParam("remove"), new Utils.VoidParam("other")]); }), new Utils.IntParam("limit", true));
    var sharing_list_folder_members_continue_endpt = new Utils.Endpoint("sharing", "list_folder_members/continue", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "whole_team",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("cursor", false));
    var sharing_list_folders_endpt = new Utils.Endpoint("sharing", "list_folders", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.IntParam("limit", true), new Utils.ListParam("actions", true, function (index) { return new Utils.UnionParam(index, false, [new Utils.VoidParam("change_options"), new Utils.VoidParam("disable_viewer_info"), new Utils.VoidParam("edit_contents"), new Utils.VoidParam("enable_viewer_info"), new Utils.VoidParam("invite_editor"), new Utils.VoidParam("invite_viewer"), new Utils.VoidParam("invite_viewer_no_comment"), new Utils.VoidParam("relinquish_membership"), new Utils.VoidParam("unmount"), new Utils.VoidParam("unshare"), new Utils.VoidParam("leave_a_copy"), new Utils.VoidParam("share_link"), new Utils.VoidParam("create_link"), new Utils.VoidParam("set_access_inheritance"), new Utils.VoidParam("other")]); }));
    var sharing_list_folders_continue_endpt = new Utils.Endpoint("sharing", "list_folders/continue", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("cursor", false));
    var sharing_list_mountable_folders_endpt = new Utils.Endpoint("sharing", "list_mountable_folders", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.IntParam("limit", true), new Utils.ListParam("actions", true, function (index) { return new Utils.UnionParam(index, false, [new Utils.VoidParam("change_options"), new Utils.VoidParam("disable_viewer_info"), new Utils.VoidParam("edit_contents"), new Utils.VoidParam("enable_viewer_info"), new Utils.VoidParam("invite_editor"), new Utils.VoidParam("invite_viewer"), new Utils.VoidParam("invite_viewer_no_comment"), new Utils.VoidParam("relinquish_membership"), new Utils.VoidParam("unmount"), new Utils.VoidParam("unshare"), new Utils.VoidParam("leave_a_copy"), new Utils.VoidParam("share_link"), new Utils.VoidParam("create_link"), new Utils.VoidParam("set_access_inheritance"), new Utils.VoidParam("other")]); }));
    var sharing_list_mountable_folders_continue_endpt = new Utils.Endpoint("sharing", "list_mountable_folders/continue", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("cursor", false));
    var sharing_list_received_files_endpt = new Utils.Endpoint("sharing", "list_received_files", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "sharing",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.IntParam("limit", true), new Utils.ListParam("actions", true, function (index) { return new Utils.UnionParam(index, false, [new Utils.VoidParam("disable_viewer_info"), new Utils.VoidParam("edit_contents"), new Utils.VoidParam("enable_viewer_info"), new Utils.VoidParam("invite_viewer"), new Utils.VoidParam("invite_viewer_no_comment"), new Utils.VoidParam("unshare"), new Utils.VoidParam("relinquish_membership"), new Utils.VoidParam("share_link"), new Utils.VoidParam("create_link"), new Utils.VoidParam("other")]); }));
    var sharing_list_received_files_continue_endpt = new Utils.Endpoint("sharing", "list_received_files/continue", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "sharing",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("cursor", false));
    var sharing_list_shared_links_endpt = new Utils.Endpoint("sharing", "list_shared_links", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "sharing",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("path", true), new Utils.TextParam("cursor", true), new Utils.BoolParam("direct_only", true));
    var sharing_modify_shared_link_settings_endpt = new Utils.Endpoint("sharing", "modify_shared_link_settings", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "sharing",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("url", false), new Utils.StructParam("settings", false, [new Utils.UnionParam("requested_visibility", true, [new Utils.VoidParam("public"), new Utils.VoidParam("team_only"), new Utils.VoidParam("password")]), new Utils.TextParam("link_password", true), new Utils.TextParam("expires", true)]), new Utils.BoolParam("remove_expiration", true));
    var sharing_mount_folder_endpt = new Utils.Endpoint("sharing", "mount_folder", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("shared_folder_id", false));
    var sharing_relinquish_file_membership_endpt = new Utils.Endpoint("sharing", "relinquish_file_membership", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "sharing",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("file", false));
    var sharing_relinquish_folder_membership_endpt = new Utils.Endpoint("sharing", "relinquish_folder_membership", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("shared_folder_id", false), new Utils.BoolParam("leave_a_copy", true));
    var sharing_remove_file_member_2_endpt = new Utils.Endpoint("sharing", "remove_file_member_2", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "sharing",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("file", false), new Utils.UnionParam("member", false, [new Utils.TextParam("dropbox_id", false), new Utils.TextParam("email", false), new Utils.VoidParam("other")]));
    var sharing_remove_folder_member_endpt = new Utils.Endpoint("sharing", "remove_folder_member", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("shared_folder_id", false), new Utils.UnionParam("member", false, [new Utils.TextParam("dropbox_id", false), new Utils.TextParam("email", false), new Utils.VoidParam("other")]), new Utils.BoolParam("leave_a_copy", false));
    var sharing_revoke_shared_link_endpt = new Utils.Endpoint("sharing", "revoke_shared_link", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "sharing",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("url", false));
    var sharing_set_access_inheritance_endpt = new Utils.Endpoint("sharing", "set_access_inheritance", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("shared_folder_id", false), new Utils.UnionParam("access_inheritance", true, [new Utils.VoidParam("inherit"), new Utils.VoidParam("no_inherit"), new Utils.VoidParam("other")]));
    var sharing_share_folder_endpt = new Utils.Endpoint("sharing", "share_folder", {
        style: "rpc",
        api_group: "truelink-alpha",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("path", false), new Utils.UnionParam("acl_update_policy", true, [new Utils.VoidParam("owner"), new Utils.VoidParam("editors"), new Utils.VoidParam("other")]), new Utils.BoolParam("force_async", true), new Utils.UnionParam("member_policy", true, [new Utils.VoidParam("team"), new Utils.VoidParam("anyone"), new Utils.VoidParam("other")]), new Utils.UnionParam("shared_link_policy", true, [new Utils.VoidParam("anyone"), new Utils.VoidParam("team"), new Utils.VoidParam("members"), new Utils.VoidParam("other")]), new Utils.UnionParam("viewer_info_policy", true, [new Utils.VoidParam("enabled"), new Utils.VoidParam("disabled"), new Utils.VoidParam("other")]), new Utils.ListParam("actions", true, function (index) { return new Utils.UnionParam(index, false, [new Utils.VoidParam("change_options"), new Utils.VoidParam("disable_viewer_info"), new Utils.VoidParam("edit_contents"), new Utils.VoidParam("enable_viewer_info"), new Utils.VoidParam("invite_editor"), new Utils.VoidParam("invite_viewer"), new Utils.VoidParam("invite_viewer_no_comment"), new Utils.VoidParam("relinquish_membership"), new Utils.VoidParam("unmount"), new Utils.VoidParam("unshare"), new Utils.VoidParam("leave_a_copy"), new Utils.VoidParam("share_link"), new Utils.VoidParam("create_link"), new Utils.VoidParam("set_access_inheritance"), new Utils.VoidParam("other")]); }), new Utils.StructParam("link_settings", true, [new Utils.UnionParam("access_level", true, [new Utils.VoidParam("owner"), new Utils.VoidParam("editor"), new Utils.VoidParam("viewer"), new Utils.VoidParam("viewer_no_comment"), new Utils.VoidParam("other")]), new Utils.UnionParam("audience", true, [new Utils.VoidParam("public"), new Utils.VoidParam("team"), new Utils.VoidParam("members"), new Utils.VoidParam("other")]), new Utils.UnionParam("expiry", true, [new Utils.VoidParam("remove_expiry"), new Utils.TextParam("set_expiry", false), new Utils.VoidParam("other")]), new Utils.UnionParam("password", true, [new Utils.VoidParam("remove_password"), new Utils.TextParam("set_password", false), new Utils.VoidParam("other")])]));
    var sharing_transfer_folder_endpt = new Utils.Endpoint("sharing", "transfer_folder", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("shared_folder_id", false), new Utils.TextParam("to_dropbox_id", false));
    var sharing_unmount_folder_endpt = new Utils.Endpoint("sharing", "unmount_folder", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("shared_folder_id", false));
    var sharing_unshare_file_endpt = new Utils.Endpoint("sharing", "unshare_file", {
        style: "rpc",
        api_group: "truelink-alpha",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "sharing",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("file", false));
    var sharing_unshare_folder_endpt = new Utils.Endpoint("sharing", "unshare_folder", {
        style: "rpc",
        api_group: "truelink-alpha",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("shared_folder_id", false), new Utils.BoolParam("leave_a_copy", true));
    var sharing_update_file_member_endpt = new Utils.Endpoint("sharing", "update_file_member", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "sharing",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("file", false), new Utils.UnionParam("member", false, [new Utils.TextParam("dropbox_id", false), new Utils.TextParam("email", false), new Utils.VoidParam("other")]), new Utils.UnionParam("access_level", false, [new Utils.VoidParam("owner"), new Utils.VoidParam("editor"), new Utils.VoidParam("viewer"), new Utils.VoidParam("viewer_no_comment"), new Utils.VoidParam("other")]));
    var sharing_update_folder_member_endpt = new Utils.Endpoint("sharing", "update_folder_member", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("shared_folder_id", false), new Utils.UnionParam("member", false, [new Utils.TextParam("dropbox_id", false), new Utils.TextParam("email", false), new Utils.VoidParam("other")]), new Utils.UnionParam("access_level", false, [new Utils.VoidParam("owner"), new Utils.VoidParam("editor"), new Utils.VoidParam("viewer"), new Utils.VoidParam("viewer_no_comment"), new Utils.VoidParam("other")]));
    var sharing_update_folder_policy_endpt = new Utils.Endpoint("sharing", "update_folder_policy", {
        style: "rpc",
        api_group: "truelink-alpha",
        is_preview: "False",
        select_admin_mode: "team_admin",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("shared_folder_id", false), new Utils.UnionParam("member_policy", true, [new Utils.VoidParam("team"), new Utils.VoidParam("anyone"), new Utils.VoidParam("other")]), new Utils.UnionParam("acl_update_policy", true, [new Utils.VoidParam("owner"), new Utils.VoidParam("editors"), new Utils.VoidParam("other")]), new Utils.UnionParam("viewer_info_policy", true, [new Utils.VoidParam("enabled"), new Utils.VoidParam("disabled"), new Utils.VoidParam("other")]), new Utils.UnionParam("shared_link_policy", true, [new Utils.VoidParam("anyone"), new Utils.VoidParam("team"), new Utils.VoidParam("members"), new Utils.VoidParam("other")]), new Utils.StructParam("link_settings", true, [new Utils.UnionParam("access_level", true, [new Utils.VoidParam("owner"), new Utils.VoidParam("editor"), new Utils.VoidParam("viewer"), new Utils.VoidParam("viewer_no_comment"), new Utils.VoidParam("other")]), new Utils.UnionParam("audience", true, [new Utils.VoidParam("public"), new Utils.VoidParam("team"), new Utils.VoidParam("members"), new Utils.VoidParam("other")]), new Utils.UnionParam("expiry", true, [new Utils.VoidParam("remove_expiry"), new Utils.TextParam("set_expiry", false), new Utils.VoidParam("other")]), new Utils.UnionParam("password", true, [new Utils.VoidParam("remove_password"), new Utils.TextParam("set_password", false), new Utils.VoidParam("other")])]), new Utils.ListParam("actions", true, function (index) { return new Utils.UnionParam(index, false, [new Utils.VoidParam("change_options"), new Utils.VoidParam("disable_viewer_info"), new Utils.VoidParam("edit_contents"), new Utils.VoidParam("enable_viewer_info"), new Utils.VoidParam("invite_editor"), new Utils.VoidParam("invite_viewer"), new Utils.VoidParam("invite_viewer_no_comment"), new Utils.VoidParam("relinquish_membership"), new Utils.VoidParam("unmount"), new Utils.VoidParam("unshare"), new Utils.VoidParam("leave_a_copy"), new Utils.VoidParam("share_link"), new Utils.VoidParam("create_link"), new Utils.VoidParam("set_access_inheritance"), new Utils.VoidParam("other")]); }));
    var team_devices_list_member_devices_endpt = new Utils.Endpoint("team", "devices/list_member_devices", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "tools-and-insights",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("team_member_id", false), new Utils.BoolParam("include_web_sessions", true), new Utils.BoolParam("include_desktop_clients", true), new Utils.BoolParam("include_mobile_clients", true));
    var team_devices_list_members_devices_endpt = new Utils.Endpoint("team", "devices/list_members_devices", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "tools-and-insights",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("cursor", true), new Utils.BoolParam("include_web_sessions", true), new Utils.BoolParam("include_desktop_clients", true), new Utils.BoolParam("include_mobile_clients", true));
    var team_devices_revoke_device_session_endpt = new Utils.Endpoint("team", "devices/revoke_device_session", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "tools-and-insights",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.RootUnionParam('', false, [new Utils.StructParam("web_session", false, [new Utils.TextParam("session_id", false), new Utils.TextParam("team_member_id", false)]), new Utils.StructParam("desktop_client", false, [new Utils.TextParam("session_id", false), new Utils.TextParam("team_member_id", false), new Utils.BoolParam("delete_on_unlink", true)]), new Utils.StructParam("mobile_client", false, [new Utils.TextParam("session_id", false), new Utils.TextParam("team_member_id", false)])]));
    var team_devices_revoke_device_session_batch_endpt = new Utils.Endpoint("team", "devices/revoke_device_session_batch", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "tools-and-insights",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.ListParam("revoke_devices", false, function (index) { return new Utils.UnionParam(index, false, [new Utils.StructParam("web_session", false, [new Utils.TextParam("session_id", false), new Utils.TextParam("team_member_id", false)]), new Utils.StructParam("desktop_client", false, [new Utils.TextParam("session_id", false), new Utils.TextParam("team_member_id", false), new Utils.BoolParam("delete_on_unlink", true)]), new Utils.StructParam("mobile_client", false, [new Utils.TextParam("session_id", false), new Utils.TextParam("team_member_id", false)])]); }));
    var team_features_get_values_endpt = new Utils.Endpoint("team", "features/get_values", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.ListParam("features", false, function (index) { return new Utils.UnionParam(index, false, [new Utils.VoidParam("upload_api_rate_limit"), new Utils.VoidParam("has_team_shared_dropbox"), new Utils.VoidParam("has_team_file_events"), new Utils.VoidParam("has_team_selective_sync"), new Utils.VoidParam("other")]); }));
    var team_get_info_endpt = new Utils.Endpoint("team", "get_info", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    });
    var team_groups_create_endpt = new Utils.Endpoint("team", "groups/create", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("group_name", false), new Utils.TextParam("group_external_id", true), new Utils.UnionParam("group_management_type", true, [new Utils.VoidParam("user_managed"), new Utils.VoidParam("company_managed"), new Utils.VoidParam("system_managed"), new Utils.VoidParam("other")]));
    var team_groups_delete_endpt = new Utils.Endpoint("team", "groups/delete", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.RootUnionParam('', false, [new Utils.TextParam("group_id", false), new Utils.TextParam("group_external_id", false)]));
    var team_groups_get_info_endpt = new Utils.Endpoint("team", "groups/get_info", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.RootUnionParam('', false, [new Utils.ListParam("group_ids", false, function (index) { return new Utils.TextParam(index, false); }), new Utils.ListParam("group_external_ids", false, function (index) { return new Utils.TextParam(index, false); })]));
    var team_groups_job_status_get_endpt = new Utils.Endpoint("team", "groups/job_status/get", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("async_job_id", false));
    var team_groups_list_endpt = new Utils.Endpoint("team", "groups/list", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.IntParam("limit", true));
    var team_groups_list_continue_endpt = new Utils.Endpoint("team", "groups/list/continue", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("cursor", false));
    var team_groups_members_add_endpt = new Utils.Endpoint("team", "groups/members/add", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.UnionParam("group", false, [new Utils.TextParam("group_id", false), new Utils.TextParam("group_external_id", false)]), new Utils.ListParam("members", false, function (index) { return new Utils.StructParam(index, false, [new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]), new Utils.UnionParam("access_type", false, [new Utils.VoidParam("member"), new Utils.VoidParam("owner")])]); }), new Utils.BoolParam("return_members", true));
    var team_groups_members_list_endpt = new Utils.Endpoint("team", "groups/members/list", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.UnionParam("group", false, [new Utils.TextParam("group_id", false), new Utils.TextParam("group_external_id", false)]), new Utils.IntParam("limit", true));
    var team_groups_members_list_continue_endpt = new Utils.Endpoint("team", "groups/members/list/continue", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("cursor", false));
    var team_groups_members_remove_endpt = new Utils.Endpoint("team", "groups/members/remove", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.UnionParam("group", false, [new Utils.TextParam("group_id", false), new Utils.TextParam("group_external_id", false)]), new Utils.ListParam("users", false, function (index) { return new Utils.UnionParam(index, false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]); }), new Utils.BoolParam("return_members", true));
    var team_groups_members_set_access_type_endpt = new Utils.Endpoint("team", "groups/members/set_access_type", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.UnionParam("group", false, [new Utils.TextParam("group_id", false), new Utils.TextParam("group_external_id", false)]), new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]), new Utils.UnionParam("access_type", false, [new Utils.VoidParam("member"), new Utils.VoidParam("owner")]), new Utils.BoolParam("return_members", true));
    var team_groups_update_endpt = new Utils.Endpoint("team", "groups/update", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.UnionParam("group", false, [new Utils.TextParam("group_id", false), new Utils.TextParam("group_external_id", false)]), new Utils.BoolParam("return_members", true), new Utils.TextParam("new_group_name", true), new Utils.TextParam("new_group_external_id", true), new Utils.UnionParam("new_group_management_type", true, [new Utils.VoidParam("user_managed"), new Utils.VoidParam("company_managed"), new Utils.VoidParam("system_managed"), new Utils.VoidParam("other")]));
    var team_linked_apps_list_member_linked_apps_endpt = new Utils.Endpoint("team", "linked_apps/list_member_linked_apps", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "tools-and-insights",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("team_member_id", false));
    var team_linked_apps_list_members_linked_apps_endpt = new Utils.Endpoint("team", "linked_apps/list_members_linked_apps", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "tools-and-insights",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("cursor", true));
    var team_linked_apps_revoke_linked_app_endpt = new Utils.Endpoint("team", "linked_apps/revoke_linked_app", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "tools-and-insights",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("app_id", false), new Utils.TextParam("team_member_id", false), new Utils.BoolParam("keep_app_folder", true));
    var team_linked_apps_revoke_linked_app_batch_endpt = new Utils.Endpoint("team", "linked_apps/revoke_linked_app_batch", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "tools-and-insights",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.ListParam("revoke_linked_app", false, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("app_id", false), new Utils.TextParam("team_member_id", false), new Utils.BoolParam("keep_app_folder", true)]); }));
    var team_member_space_limits_excluded_users_add_endpt = new Utils.Endpoint("team", "member_space_limits/excluded_users/add", {
        style: "rpc",
        api_group: "None",
        is_preview: "True",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "tools-and-insights",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.ListParam("users", true, function (index) { return new Utils.UnionParam(index, false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]); }));
    var team_member_space_limits_excluded_users_list_endpt = new Utils.Endpoint("team", "member_space_limits/excluded_users/list", {
        style: "rpc",
        api_group: "None",
        is_preview: "True",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "tools-and-insights",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.IntParam("limit", true));
    var team_member_space_limits_excluded_users_list_continue_endpt = new Utils.Endpoint("team", "member_space_limits/excluded_users/list/continue", {
        style: "rpc",
        api_group: "None",
        is_preview: "True",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "tools-and-insights",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("cursor", false));
    var team_member_space_limits_excluded_users_remove_endpt = new Utils.Endpoint("team", "member_space_limits/excluded_users/remove", {
        style: "rpc",
        api_group: "None",
        is_preview: "True",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "tools-and-insights",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.ListParam("users", true, function (index) { return new Utils.UnionParam(index, false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]); }));
    var team_member_space_limits_get_custom_quota_endpt = new Utils.Endpoint("team", "member_space_limits/get_custom_quota", {
        style: "rpc",
        api_group: "None",
        is_preview: "True",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "tools-and-insights",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.ListParam("users", false, function (index) { return new Utils.UnionParam(index, false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]); }));
    var team_member_space_limits_remove_custom_quota_endpt = new Utils.Endpoint("team", "member_space_limits/remove_custom_quota", {
        style: "rpc",
        api_group: "None",
        is_preview: "True",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "tools-and-insights",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.ListParam("users", false, function (index) { return new Utils.UnionParam(index, false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]); }));
    var team_member_space_limits_set_custom_quota_endpt = new Utils.Endpoint("team", "member_space_limits/set_custom_quota", {
        style: "rpc",
        api_group: "None",
        is_preview: "True",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "tools-and-insights",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.ListParam("users_and_quotas", false, function (index) { return new Utils.StructParam(index, false, [new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]), new Utils.IntParam("quota_gb", false)]); }));
    var team_members_add_endpt = new Utils.Endpoint("team", "members/add", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.ListParam("new_members", false, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("member_email", false), new Utils.TextParam("member_given_name", true), new Utils.TextParam("member_surname", true), new Utils.TextParam("member_external_id", true), new Utils.TextParam("member_persistent_id", true), new Utils.BoolParam("send_welcome_email", true), new Utils.UnionParam("role", true, [new Utils.VoidParam("team_admin"), new Utils.VoidParam("user_management_admin"), new Utils.VoidParam("support_admin"), new Utils.VoidParam("member_only")])]); }), new Utils.BoolParam("force_async", true));
    var team_members_add_job_status_get_endpt = new Utils.Endpoint("team", "members/add/job_status/get", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("async_job_id", false));
    var team_members_get_info_endpt = new Utils.Endpoint("team", "members/get_info", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.ListParam("members", false, function (index) { return new Utils.UnionParam(index, false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]); }));
    var team_members_list_endpt = new Utils.Endpoint("team", "members/list", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.IntParam("limit", true), new Utils.BoolParam("include_removed", true));
    var team_members_list_continue_endpt = new Utils.Endpoint("team", "members/list/continue", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("cursor", false));
    var team_members_recover_endpt = new Utils.Endpoint("team", "members/recover", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "tools-and-insights",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]));
    var team_members_remove_endpt = new Utils.Endpoint("team", "members/remove", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]), new Utils.BoolParam("wipe_data", true), new Utils.UnionParam("transfer_dest_id", true, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]), new Utils.UnionParam("transfer_admin_id", true, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]), new Utils.BoolParam("keep_account", true));
    var team_members_remove_job_status_get_endpt = new Utils.Endpoint("team", "members/remove/job_status/get", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("async_job_id", false));
    var team_members_send_welcome_email_endpt = new Utils.Endpoint("team", "members/send_welcome_email", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "onboarding-intent",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.RootUnionParam('', false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]));
    var team_members_set_admin_permissions_endpt = new Utils.Endpoint("team", "members/set_admin_permissions", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]), new Utils.UnionParam("new_role", false, [new Utils.VoidParam("team_admin"), new Utils.VoidParam("user_management_admin"), new Utils.VoidParam("support_admin"), new Utils.VoidParam("member_only")]));
    var team_members_set_profile_endpt = new Utils.Endpoint("team", "members/set_profile", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "identity",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]), new Utils.TextParam("new_email", true), new Utils.TextParam("new_external_id", true), new Utils.TextParam("new_given_name", true), new Utils.TextParam("new_surname", true), new Utils.TextParam("new_persistent_id", true));
    var team_members_suspend_endpt = new Utils.Endpoint("team", "members/suspend", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]), new Utils.BoolParam("wipe_data", true));
    var team_members_unsuspend_endpt = new Utils.Endpoint("team", "members/unsuspend", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]));
    var team_namespaces_list_endpt = new Utils.Endpoint("team", "namespaces/list", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.IntParam("limit", true));
    var team_namespaces_list_continue_endpt = new Utils.Endpoint("team", "namespaces/list/continue", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("cursor", false));
    var team_reports_get_activity_endpt = new Utils.Endpoint("team", "reports/get_activity", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "audit-log-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("start_date", true), new Utils.TextParam("end_date", true));
    var team_reports_get_devices_endpt = new Utils.Endpoint("team", "reports/get_devices", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "tools-and-insights",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("start_date", true), new Utils.TextParam("end_date", true));
    var team_reports_get_membership_endpt = new Utils.Endpoint("team", "reports/get_membership", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "teams-and-groups",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("start_date", true), new Utils.TextParam("end_date", true));
    var team_reports_get_storage_endpt = new Utils.Endpoint("team", "reports/get_storage", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "identity",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("start_date", true), new Utils.TextParam("end_date", true));
    var team_team_folder_activate_endpt = new Utils.Endpoint("team", "team_folder/activate", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("team_folder_id", false));
    var team_team_folder_archive_endpt = new Utils.Endpoint("team", "team_folder/archive", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("team_folder_id", false), new Utils.BoolParam("force_async_off", true));
    var team_team_folder_archive_check_endpt = new Utils.Endpoint("team", "team_folder/archive/check", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("async_job_id", false));
    var team_team_folder_create_endpt = new Utils.Endpoint("team", "team_folder/create", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("name", false), new Utils.UnionParam("sync_setting", true, [new Utils.VoidParam("default"), new Utils.VoidParam("not_synced"), new Utils.VoidParam("other")]));
    var team_team_folder_get_info_endpt = new Utils.Endpoint("team", "team_folder/get_info", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.ListParam("team_folder_ids", false, function (index) { return new Utils.TextParam(index, false); }));
    var team_team_folder_list_endpt = new Utils.Endpoint("team", "team_folder/list", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.IntParam("limit", true));
    var team_team_folder_list_continue_endpt = new Utils.Endpoint("team", "team_folder/list/continue", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("cursor", false));
    var team_team_folder_permanently_delete_endpt = new Utils.Endpoint("team", "team_folder/permanently_delete", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("team_folder_id", false));
    var team_team_folder_rename_endpt = new Utils.Endpoint("team", "team_folder/rename", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("team_folder_id", false), new Utils.TextParam("name", false));
    var team_team_folder_update_sync_settings_endpt = new Utils.Endpoint("team", "team_folder/update_sync_settings", {
        style: "rpc",
        api_group: "None",
        is_preview: "True",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "company-dropbox-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("team_folder_id", false), new Utils.UnionParam("sync_setting", true, [new Utils.VoidParam("default"), new Utils.VoidParam("not_synced"), new Utils.VoidParam("other")]), new Utils.ListParam("content_sync_settings", true, function (index) { return new Utils.StructParam(index, false, [new Utils.TextParam("id", false), new Utils.UnionParam("sync_setting", false, [new Utils.VoidParam("default"), new Utils.VoidParam("not_synced"), new Utils.VoidParam("other")])]); }));
    var team_token_get_authenticated_admin_endpt = new Utils.Endpoint("team", "token/get_authenticated_admin", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    });
    var team_log_get_events_endpt = new Utils.Endpoint("team_log", "get_events", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "audit-log-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.IntParam("limit", true), new Utils.TextParam("account_id", true), new Utils.StructParam("time", true, [new Utils.TextParam("start_time", true), new Utils.TextParam("end_time", true)]), new Utils.UnionParam("category", true, [new Utils.VoidParam("apps"), new Utils.VoidParam("comments"), new Utils.VoidParam("devices"), new Utils.VoidParam("domains"), new Utils.VoidParam("file_operations"), new Utils.VoidParam("file_requests"), new Utils.VoidParam("groups"), new Utils.VoidParam("logins"), new Utils.VoidParam("members"), new Utils.VoidParam("paper"), new Utils.VoidParam("passwords"), new Utils.VoidParam("reports"), new Utils.VoidParam("sharing"), new Utils.VoidParam("showcase"), new Utils.VoidParam("sso"), new Utils.VoidParam("team_folders"), new Utils.VoidParam("team_policies"), new Utils.VoidParam("team_profile"), new Utils.VoidParam("tfa"), new Utils.VoidParam("other")]));
    var team_log_get_events_continue_endpt = new Utils.Endpoint("team_log", "get_events/continue", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "team",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "False",
        owner: "audit-log-team",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("cursor", false));
    var users_get_account_endpt = new Utils.Endpoint("users", "get_account", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.TextParam("account_id", false));
    var users_get_account_batch_endpt = new Utils.Endpoint("users", "get_account_batch", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    }, new Utils.ListParam("account_ids", false, function (index) { return new Utils.TextParam(index, false); }));
    var users_get_current_account_endpt = new Utils.Endpoint("users", "get_current_account", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "whole_team",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "api-platform",
        takes_path_root: "False",
        is_web_alpha: "False"
    });
    var users_get_space_usage_endpt = new Utils.Endpoint("users", "get_space_usage", {
        style: "rpc",
        api_group: "None",
        is_preview: "False",
        select_admin_mode: "None",
        feature: "None",
        auth: "user",
        cluster: "meta-api",
        host: "api",
        allow_app_folder_app: "True",
        owner: "identity",
        takes_path_root: "False",
        is_web_alpha: "False"
    });
    Endpoints.endpointList = [auth_token_from_oauth1_endpt,
        auth_token_revoke_endpt,
        file_properties_properties_add_endpt,
        file_properties_properties_overwrite_endpt,
        file_properties_properties_remove_endpt,
        file_properties_properties_search_endpt,
        file_properties_properties_search_continue_endpt,
        file_properties_properties_update_endpt,
        file_properties_templates_add_for_team_endpt,
        file_properties_templates_add_for_user_endpt,
        file_properties_templates_get_for_team_endpt,
        file_properties_templates_get_for_user_endpt,
        file_properties_templates_list_for_team_endpt,
        file_properties_templates_list_for_user_endpt,
        file_properties_templates_remove_for_team_endpt,
        file_properties_templates_remove_for_user_endpt,
        file_properties_templates_update_for_team_endpt,
        file_properties_templates_update_for_user_endpt,
        file_requests_create_endpt,
        file_requests_get_endpt,
        file_requests_list_endpt,
        file_requests_update_endpt,
        files_copy_batch_endpt,
        files_copy_batch_check_endpt,
        files_copy_reference_get_endpt,
        files_copy_reference_save_endpt,
        files_copy_v2_endpt,
        files_create_folder_batch_endpt,
        files_create_folder_batch_check_endpt,
        files_create_folder_v2_endpt,
        files_delete_batch_endpt,
        files_delete_batch_check_endpt,
        files_delete_v2_endpt,
        files_download_endpt,
        files_download_zip_endpt,
        files_get_metadata_endpt,
        files_get_preview_endpt,
        files_get_temporary_link_endpt,
        files_get_thumbnail_endpt,
        files_get_thumbnail_batch_endpt,
        files_list_folder_endpt,
        files_list_folder_continue_endpt,
        files_list_folder_get_latest_cursor_endpt,
        files_list_folder_longpoll_endpt,
        files_list_revisions_endpt,
        files_move_batch_endpt,
        files_move_batch_check_endpt,
        files_move_v2_endpt,
        files_permanently_delete_endpt,
        files_restore_endpt,
        files_save_url_endpt,
        files_save_url_check_job_status_endpt,
        files_search_endpt,
        files_upload_endpt,
        files_upload_session_append_v2_endpt,
        files_upload_session_finish_endpt,
        files_upload_session_finish_batch_endpt,
        files_upload_session_finish_batch_check_endpt,
        files_upload_session_start_endpt,
        paper_docs_archive_endpt,
        paper_docs_create_endpt,
        paper_docs_download_endpt,
        paper_docs_folder_users_list_endpt,
        paper_docs_folder_users_list_continue_endpt,
        paper_docs_get_folder_info_endpt,
        paper_docs_list_endpt,
        paper_docs_list_continue_endpt,
        paper_docs_permanently_delete_endpt,
        paper_docs_sharing_policy_get_endpt,
        paper_docs_sharing_policy_set_endpt,
        paper_docs_update_endpt,
        paper_docs_users_add_endpt,
        paper_docs_users_list_endpt,
        paper_docs_users_list_continue_endpt,
        paper_docs_users_remove_endpt,
        sharing_add_file_member_endpt,
        sharing_add_folder_member_endpt,
        sharing_check_job_status_endpt,
        sharing_check_remove_member_job_status_endpt,
        sharing_check_share_job_status_endpt,
        sharing_create_shared_link_with_settings_endpt,
        sharing_get_file_metadata_endpt,
        sharing_get_file_metadata_batch_endpt,
        sharing_get_folder_metadata_endpt,
        sharing_get_shared_link_file_endpt,
        sharing_get_shared_link_metadata_endpt,
        sharing_list_file_members_endpt,
        sharing_list_file_members_batch_endpt,
        sharing_list_file_members_continue_endpt,
        sharing_list_folder_members_endpt,
        sharing_list_folder_members_continue_endpt,
        sharing_list_folders_endpt,
        sharing_list_folders_continue_endpt,
        sharing_list_mountable_folders_endpt,
        sharing_list_mountable_folders_continue_endpt,
        sharing_list_received_files_endpt,
        sharing_list_received_files_continue_endpt,
        sharing_list_shared_links_endpt,
        sharing_modify_shared_link_settings_endpt,
        sharing_mount_folder_endpt,
        sharing_relinquish_file_membership_endpt,
        sharing_relinquish_folder_membership_endpt,
        sharing_remove_file_member_2_endpt,
        sharing_remove_folder_member_endpt,
        sharing_revoke_shared_link_endpt,
        sharing_set_access_inheritance_endpt,
        sharing_share_folder_endpt,
        sharing_transfer_folder_endpt,
        sharing_unmount_folder_endpt,
        sharing_unshare_file_endpt,
        sharing_unshare_folder_endpt,
        sharing_update_file_member_endpt,
        sharing_update_folder_member_endpt,
        sharing_update_folder_policy_endpt,
        team_devices_list_member_devices_endpt,
        team_devices_list_members_devices_endpt,
        team_devices_revoke_device_session_endpt,
        team_devices_revoke_device_session_batch_endpt,
        team_features_get_values_endpt,
        team_get_info_endpt,
        team_groups_create_endpt,
        team_groups_delete_endpt,
        team_groups_get_info_endpt,
        team_groups_job_status_get_endpt,
        team_groups_list_endpt,
        team_groups_list_continue_endpt,
        team_groups_members_add_endpt,
        team_groups_members_list_endpt,
        team_groups_members_list_continue_endpt,
        team_groups_members_remove_endpt,
        team_groups_members_set_access_type_endpt,
        team_groups_update_endpt,
        team_linked_apps_list_member_linked_apps_endpt,
        team_linked_apps_list_members_linked_apps_endpt,
        team_linked_apps_revoke_linked_app_endpt,
        team_linked_apps_revoke_linked_app_batch_endpt,
        team_member_space_limits_excluded_users_add_endpt,
        team_member_space_limits_excluded_users_list_endpt,
        team_member_space_limits_excluded_users_list_continue_endpt,
        team_member_space_limits_excluded_users_remove_endpt,
        team_member_space_limits_get_custom_quota_endpt,
        team_member_space_limits_remove_custom_quota_endpt,
        team_member_space_limits_set_custom_quota_endpt,
        team_members_add_endpt,
        team_members_add_job_status_get_endpt,
        team_members_get_info_endpt,
        team_members_list_endpt,
        team_members_list_continue_endpt,
        team_members_recover_endpt,
        team_members_remove_endpt,
        team_members_remove_job_status_get_endpt,
        team_members_send_welcome_email_endpt,
        team_members_set_admin_permissions_endpt,
        team_members_set_profile_endpt,
        team_members_suspend_endpt,
        team_members_unsuspend_endpt,
        team_namespaces_list_endpt,
        team_namespaces_list_continue_endpt,
        team_reports_get_activity_endpt,
        team_reports_get_devices_endpt,
        team_reports_get_membership_endpt,
        team_reports_get_storage_endpt,
        team_team_folder_activate_endpt,
        team_team_folder_archive_endpt,
        team_team_folder_archive_check_endpt,
        team_team_folder_create_endpt,
        team_team_folder_get_info_endpt,
        team_team_folder_list_endpt,
        team_team_folder_list_continue_endpt,
        team_team_folder_permanently_delete_endpt,
        team_team_folder_rename_endpt,
        team_team_folder_update_sync_settings_endpt,
        team_token_get_authenticated_admin_endpt,
        team_log_get_events_endpt,
        team_log_get_events_continue_endpt,
        users_get_account_endpt,
        users_get_account_batch_endpt,
        users_get_current_account_endpt,
        users_get_space_usage_endpt];
})(Endpoints || (Endpoints = {}));
module.exports = Endpoints;

},{"./utils":6}],5:[function(require,module,exports){
(function (global){
/* The main file, which contains the definitions of the React components for the API Explorer, as
   well as a little bit of code that runs at startup.

   Each component is defined as an ES6 class extending the ReactComponent class. First, we declare
   the property types of the class, and then we declare the class itself.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var endpoints = require('./endpoints');
var utils = require('./utils');
var apicalls = require('./apicalls');
var codeview = require('./codeview');
var utils_1 = require("./utils");
var utils_2 = require("./utils");
var utils_3 = require("./utils");
var utils_4 = require("./utils");
var utils_5 = require("./utils");
var utils_6 = require("./utils");
var utils_7 = require("./utils");
var utils_8 = require("./utils");
var ce = react.createElement;
var d = react.DOM;
var developerPage = 'https://www.dropbox.com/developers';
var displayNone = { style: { display: 'none' } };
/* Element for text field in page table.
 */
var tableText = function (text) {
    return d.td({ className: 'label' }, d.div({ className: 'text' }, text));
};
/* Map between client id and associated permission type.
 */
var clientIdMap = {
    'vyjzkx2chlpsooc': 'Team Information',
    'pq2bj4ll002gohi': 'Team Auditing',
    'j3zzv20pgxds87u': 'Team Member File Access',
    'oq1ywlcgrto51qk': 'Team Member Management'
};
/* Get client id from local storage. If doesn't exist. Use default value instead.
 */
var getClientId = function () {
    var clientId = utils.getClientId();
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
var AppPermissionInputProps = (function () {
    function AppPermissionInputProps() {
    }
    return AppPermissionInputProps;
})();
var AppPermissionInput = (function (_super) {
    __extends(AppPermissionInput, _super);
    function AppPermissionInput(props) {
        _super.call(this, props);
    }
    AppPermissionInput.prototype.render = function () {
        var options = [];
        var clientId = getClientId();
        for (var id in clientIdMap) {
            var value = clientIdMap[id];
            var selected = id == clientId;
            options.push(d.option({ selected: selected }, value));
        }
        return d.tr(null, tableText('App Permission'), d.td(null, d.select({ style: { 'margin-top': '5px' }, onChange: this.props.handler }, options)));
    };
    return AppPermissionInput;
})(react.Component);
var TokenInput = (function (_super) {
    __extends(TokenInput, _super);
    function TokenInput(props) {
        var _this = this;
        _super.call(this, props);
        this.handleEdit = function (event) {
            var value = event.target.value;
            _this.props.callback(value);
        };
        // This function handles the initial part of the OAuth2 token flow for the user.
        this.retrieveAuth = function () {
            var clientId = getClientId();
            var state = utils.getHashDict()['__ept__'] + '!' + utils.createCsrfToken();
            var params = {
                response_type: 'token',
                client_id: clientId,
                redirect_uri: utils.currentURL(),
                state: state
            };
            var urlWithParams = 'https://www.dropbox.com/1/oauth2/authorize?';
            for (var key in params) {
                urlWithParams += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&';
            }
            window.location.assign(urlWithParams);
        };
    }
    TokenInput.prototype.render = function () {
        return d.tr(null, tableText('Access Token'), d.td(null, d.input({
            type: this.props.showToken ? 'text' : 'password',
            id: 'token-input',
            defaultValue: utils.getToken(),
            onChange: this.handleEdit,
            placeholder: 'If you don\'t have an access token, click the "Get Token" button to obtain one.'
        }), d.div({ className: 'align-right' }, d.button({ onClick: this.retrieveAuth }, 'Get Token'), d.button({ onClick: this.props.toggleShow }, this.props.showToken ? 'Hide Token' : 'Show Token'))));
    };
    return TokenInput;
})(react.Component);
/* Input component for single parameter.
   A value handler is responsible for value update and signal for specific parameter.
   Every time a field value gets updated, the update method of its corresponding value
   handler should be called.
 */
var ValueHandler = (function () {
    function ValueHandler() {
        // Signal react render.
        this.update = function () { return null; };
        // Update value for current parameter.
        this.updateValue = function (value) { return null; };
    }
    return ValueHandler;
})();
/*  Type of value handler which can contain child value handlers.
 */
var ParentValueHandler = (function (_super) {
    __extends(ParentValueHandler, _super);
    function ParentValueHandler() {
        var _this = this;
        _super.apply(this, arguments);
        // Create a child value handler based on parameter type.
        this.getChildHandler = function (param) {
            if (param instanceof utils_4.FileParam) {
                return new FileValueHandler(param, _this);
            }
            else if (param instanceof utils_6.RootUnionParam) {
                return new RootUnionValueHandler(param, _this);
            }
            else if (param instanceof utils_3.UnionParam) {
                return new UnionValueHandler(param, _this);
            }
            else if (param instanceof utils_2.StructParam) {
                return new StructValueHandler(param, _this);
            }
            else if (param instanceof utils_5.ListParam) {
                return new ListValueHandler(param, _this);
            }
            else {
                return new ChildValueHandler(param, _this);
            }
        };
        this.getOrCreate = function (name, defaultValue) {
            var dict = _this.current();
            if (name in dict) {
                return dict[name];
            }
            else {
                dict[name] = defaultValue;
                return dict[name];
            }
        };
        this.hasChild = function (name) {
            var dict = _this.current();
            if (name in dict) {
                return true;
            }
            else {
                return false;
            }
        };
        this.value = function (key) {
            var dict = _this.current();
            if (key in dict) {
                return dict[key];
            }
            else {
                return null;
            }
        };
        this.updateChildValue = function (name, value) {
            var dict = _this.current();
            if (value == null) {
                delete dict[name];
            }
            else {
                dict[name] = value;
            }
        };
        this.current = function () { throw new Error('Not implemented.'); };
    }
    return ParentValueHandler;
})(ValueHandler);
/* Value handler for struct type.
 */
var StructValueHandler = (function (_super) {
    __extends(StructValueHandler, _super);
    function StructValueHandler(param, parent) {
        var _this = this;
        _super.call(this);
        this.current = function () { return _this.parent.getOrCreate(_this.param.name, {}); };
        this.update = function () { return _this.parent.update(); };
        this.param = param;
        this.parent = parent;
    }
    return StructValueHandler;
})(ParentValueHandler);
/* Value handler for union type.
 */
var UnionValueHandler = (function (_super) {
    __extends(UnionValueHandler, _super);
    function UnionValueHandler(param, parent) {
        var _this = this;
        _super.call(this, param, parent);
        this.getTag = function () {
            if (_this.parent.hasChild(_this.param.name)) {
                return _this.value('.tag');
            }
            else {
                return null;
            }
        };
        this.updateTag = function (tag) {
            _this.parent.updateChildValue(_this.param.name, _this.param.optional ? null : {});
            if (tag != null) {
                _this.updateChildValue('.tag', tag);
            }
        };
        this.getTagHandler = function () {
            return new TagValueHandler(_this);
        };
    }
    return UnionValueHandler;
})(StructValueHandler);
/* Special case when root type is a union.
 */
var RootUnionValueHandler = (function (_super) {
    __extends(RootUnionValueHandler, _super);
    function RootUnionValueHandler(param, handler) {
        var _this = this;
        _super.call(this, param, handler);
        this.getTag = function () {
            return _this.value('.tag');
        };
        this.updateTag = function (tag) {
            var dict = _this.current();
            for (var name_1 in dict) {
                delete dict[name_1];
            }
            if (tag != null) {
                dict['.tag'] = tag;
            }
        };
        this.current = function () { return _this.parent.current(); };
        this.update = function () { return _this.parent.update(); };
        this.getTagHandler = function () {
            return new TagValueHandler(_this);
        };
    }
    return RootUnionValueHandler;
})(UnionValueHandler);
/* Value handler for list type.
 */
var ListValueHandler = (function (_super) {
    __extends(ListValueHandler, _super);
    function ListValueHandler(param, parent) {
        var _this = this;
        _super.call(this);
        this.addItem = function () {
            var list = _this.current();
            var param = _this.param.createItem(0);
            list.push(param.defaultValue());
            _this.update();
        };
        this.reset = function () {
            _this.parent.updateChildValue(_this.param.name, _this.param.defaultValue());
            _this.update();
        };
        this.getOrCreate = function (name, defaultValue) {
            return _this.current()[+name];
        };
        this.hasChild = function (name) {
            return true;
        };
        this.value = function (key) {
            return _this.current()[+name];
        };
        this.updateChildValue = function (name, value) {
            _this.current()[+name] = value;
        };
        this.current = function () { return _this.parent.getOrCreate(_this.param.name, []); };
        this.update = function () { return _this.parent.update(); };
        this.param = param;
        this.parent = parent;
    }
    return ListValueHandler;
})(ParentValueHandler);
/* Value handler for primitive types.
 */
var ChildValueHandler = (function (_super) {
    __extends(ChildValueHandler, _super);
    function ChildValueHandler(param, parent) {
        var _this = this;
        _super.call(this);
        this.updateValue = function (value) {
            _this.parent.updateChildValue(_this.param.name, value);
        };
        this.update = function () { return _this.parent.update(); };
        this.param = param;
        this.parent = parent;
    }
    return ChildValueHandler;
})(ValueHandler);
/* Value handler for file parameter.
 */
var FileValueHandler = (function (_super) {
    __extends(FileValueHandler, _super);
    function FileValueHandler(param, parent) {
        var _this = this;
        _super.call(this, param, parent);
        // Update value of current parameter.
        this.updateValue = function (value) {
            _this.parent.updateFile(value);
        };
    }
    return FileValueHandler;
})(ChildValueHandler);
/* Value handler for union tag.
 */
var TagValueHandler = (function (_super) {
    __extends(TagValueHandler, _super);
    function TagValueHandler(parent) {
        var _this = this;
        _super.call(this, null, parent);
        this.updateValue = function (value) {
            _this.parent.updateTag(value);
        };
    }
    return TagValueHandler;
})(ChildValueHandler);
/* Value handler for root.
 */
var RootValueHandler = (function (_super) {
    __extends(RootValueHandler, _super);
    function RootValueHandler(paramVals, fileVals, callback) {
        var _this = this;
        _super.call(this);
        this.current = function () { return _this.paramVals; };
        this.update = function () { return _this.callback(_this.paramVals, _this.fileVals); };
        this.updateFile = function (value) { return _this.fileVals['file'] = value; };
        this.paramVals = paramVals;
        this.fileVals = fileVals;
        this.callback = callback;
    }
    return RootValueHandler;
})(ParentValueHandler);
var ParamInput = (function (_super) {
    __extends(ParamInput, _super);
    function ParamInput(props) {
        _super.call(this, props);
    }
    ParamInput.prototype.render = function () {
        throw new Error('Not implemented.');
    };
    return ParamInput;
})(react.Component);
/* Input component for single parameter.
 */
var SingleParamInput = (function (_super) {
    __extends(SingleParamInput, _super);
    function SingleParamInput(props) {
        var _this = this;
        _super.call(this, props);
        // When the field is edited, its value is parsed and the state is updated.
        this.handleEdit = function (event) {
            var valueToReturn = null;
            // special case: the target isn't an HTMLInputElement
            if (_this.props.param.name === '__file__') {
                var fileTarget = event.target;
                if (fileTarget.files.length > 0)
                    valueToReturn = fileTarget.files[0];
            }
            else {
                var target = event.target;
                /* If valueToReturn is left as null, it signals an optional value that should be
                 deleted from the dict of param values.
                 */
                if (target.value !== '' || !_this.props.param.optional) {
                    valueToReturn = _this.props.param.getValue(target.value);
                }
            }
            _this.props.handler.updateValue(valueToReturn);
            _this.props.handler.update();
        };
    }
    SingleParamInput.prototype.render = function () {
        return this.props.param.asReact({ onChange: this.handleEdit }, this.props.key);
    };
    return SingleParamInput;
})(ParamInput);
var StructParamInput = (function (_super) {
    __extends(StructParamInput, _super);
    function StructParamInput(props) {
        var _this = this;
        _super.call(this, props);
        this.renderItems = function () {
            return _this.props.param.fields.map(function (p) {
                return ParamClassChooser.getParamInput(p, {
                    key: _this.props.key + '_' + _this.props.param.name + '_' + p.name,
                    handler: _this.props.handler.getChildHandler(p),
                    param: p
                });
            });
        };
    }
    StructParamInput.prototype.render = function () {
        return d.tr(null, this.props.param.getNameColumn(), d.td(null, d.table(null, d.tbody(null, this.renderItems()))));
    };
    return StructParamInput;
})(ParamInput);
var UnionParamInput = (function (_super) {
    __extends(UnionParamInput, _super);
    function UnionParamInput(props) {
        var _this = this;
        _super.call(this, props);
        this.getParam = function () {
            var tag = _this.props.handler.getTag();
            var fields = null;
            if (tag == null) {
                fields = [];
            }
            else {
                var param = _this.props.param.fields.filter(function (t) { return t.name == tag; })[0];
                if (param instanceof utils_2.StructParam) {
                    fields = param.fields;
                }
                else if (param instanceof utils_1.VoidParam) {
                    fields = [];
                }
                else {
                    fields = [param];
                }
            }
            return new utils_2.StructParam(_this.props.param.name, false, fields);
        };
    }
    UnionParamInput.prototype.render = function () {
        var selectParamProps = {
            key: this.props.key + '_selector',
            handler: this.props.handler.getTagHandler(),
            param: this.props.param.getSelectorParam(this.props.handler.getTag())
        };
        var param = this.getParam();
        if (param.fields.length == 0) {
            return ce(SingleParamInput, selectParamProps);
        }
        var structParam = new StructParamInput({
            key: this.props.key + '_' + param.name,
            handler: this.props.handler,
            param: param
        });
        return d.tr(null, this.props.param.getNameColumn(), d.td(null, d.table(null, d.tbody(null, [ce(SingleParamInput, selectParamProps)].concat(structParam.renderItems())))));
    };
    return UnionParamInput;
})(ParamInput);
var ListParamInput = (function (_super) {
    __extends(ListParamInput, _super);
    function ListParamInput(props) {
        var _this = this;
        _super.call(this, props);
        this.addItem = function () {
            _this.props.handler.addItem();
            _this.setState({ 'count': _this.state.count + 1 });
        };
        this.reset = function () {
            _this.props.handler.reset();
            _this.setState({ 'count': 0 });
        };
        this.renderItems = function () {
            var ret = [];
            for (var i = 0; i < _this.state.count; i++) {
                var param = _this.props.param.createItem(i);
                var item = ParamClassChooser.getParamInput(param, {
                    key: _this.props.key + '_' + _this.props.param.name + '_' + i.toString(),
                    handler: _this.props.handler.getChildHandler(param),
                    param: param
                });
                ret.push(item);
            }
            ret.push(d.tr({ className: 'list-param-actions' }, d.td(null, d.button({ onClick: _this.addItem }, 'Add'), d.button({ onClick: _this.reset }, 'Clear'))));
            return ret;
        };
        this.state = { 'count': 0 };
    }
    ListParamInput.prototype.render = function () {
        return d.tr(null, this.props.param.getNameColumn(), d.td(null, d.table(null, d.tbody(null, this.renderItems()))));
    };
    return ListParamInput;
})(ParamInput);
// Picks the correct React class for a parameter, depending on whether it's a struct.
var ParamClassChooser = (function () {
    function ParamClassChooser() {
    }
    ParamClassChooser.getParamInput = function (param, props) {
        if (param instanceof utils.UnionParam) {
            return ce(UnionParamInput, props);
        }
        else if (param instanceof utils.StructParam) {
            return ce(StructParamInput, props);
        }
        else if (param instanceof utils.ListParam) {
            return ce(ListParamInput, props);
        }
        else {
            return ce(SingleParamInput, props);
        }
    };
    return ParamClassChooser;
})();
var CodeArea = (function (_super) {
    __extends(CodeArea, _super);
    function CodeArea(props) {
        var _this = this;
        _super.call(this, props);
        this.changeFormat = function (event) {
            var newFormat = event.target.value;
            _this.setState({ formatter: codeview.formats[newFormat] });
        };
        this.state = { formatter: codeview.formats['curl'] };
    }
    CodeArea.prototype.render = function () {
        return d.span({ id: 'code-area' }, d.p(null, 'View request as ', codeview.getSelector(this.changeFormat)), d.span(null, codeview.render(this.state.formatter, this.props.ept, this.props.token, this.props.paramVals, this.props.headerVals, this.props.__file__)));
    };
    return CodeArea;
})(react.Component);
var RequestArea = (function (_super) {
    __extends(RequestArea, _super);
    function RequestArea(props) {
        var _this = this;
        _super.call(this, props);
        this.updateParamValues = function (paramVals, fileVals) {
            _this.setState({ paramVals: paramVals, fileVals: fileVals });
        };
        this.updateHeaderValues = function (headerVals) {
            _this.setState({ headerVals: headerVals });
        };
        this.updateTokenValue = function (tokenValue) {
            // This is called only to trigger live update. Use utils.getToken
            // to get latest token.
            utils.putToken(tokenValue);
            _this.forceUpdate();
        };
        /* Called when a new endpoint is chosen or the user updates the token. If a new endpoint is
           chosen, we should initialize its parameter values; if a new token is chosen, any error
           message about the token no longer applies.
         */
        this.componentWillReceiveProps = function (newProps) {
            if (newProps.currEpt !== _this.props.currEpt) {
                _this.updateParamValues(utils.initialValues(newProps.currEpt), { 'file': null });
            }
            _this.setState({ errMsg: null });
        };
        /* Submits a call to the API. This function handles the display logic (e.g. whether or not to
           display an error message for a missing token), and the APICaller prop actually sends the
           request.
         */
        this.submit = function () {
            var token = utils.getToken();
            var currEpt = _this.props.currEpt;
            var authType = currEpt.getAuthType();
            if (authType == utils.AuthType.App) {
                _this.setState({
                    errMsg: "Error: Making API call for app auth endpoint is not supported. Please run the code using credential of your own app."
                });
            }
            else if (authType != utils.AuthType.None && (token == null || token === '')) {
                _this.setState({
                    errMsg: 'Error: missing token. Please enter a token above or click the "Get Token" button.'
                });
            }
            else {
                _this.setState({ errMsg: null });
                var responseFn = apicalls.chooseCallback(currEpt.getEndpointKind(), utils.getDownloadName(currEpt, _this.state.paramVals));
                _this.props.APICaller(JSON.stringify(_this.state.paramVals), currEpt, token, _this.state.headerVals, responseFn, _this.state.fileVals['file']);
            }
        };
        // Toggles whether the token is hidden, or visible on the screen.
        this.showOrHide = function () { return _this.setState({ showToken: !_this.state.showToken }); };
        // Toggles whether code block is visible.
        this.showOrHideCode = function () { return _this.setState({ showCode: !_this.state.showCode }); };
        // Toggles whether header block is visible.
        this.showOrHideHeaders = function () { return _this.setState({ showHeaders: !_this.state.showHeaders }); };
        // Update client id when app permission change.
        this.updateClientId = function (e) {
            var value = (e.target).value;
            for (var id in clientIdMap) {
                if (clientIdMap[id] == value) {
                    utils.putClientId(id);
                    return;
                }
            }
        };
        this.state = {
            paramVals: utils.initialValues(this.props.currEpt),
            headerVals: [],
            fileVals: { 'file': null },
            errMsg: null,
            showToken: true,
            showCode: false,
            showHeaders: false
        };
    }
    RequestArea.prototype.render = function () {
        var _this = this;
        var errMsg = [];
        if (this.state.errMsg != null) {
            errMsg = [d.span({ style: { color: 'red' } }, this.state.errMsg)];
        }
        var name = this.props.currEpt.name.replace('/', '-');
        var documentation = developerPage + "/documentation/http/documentation#" + this.props.currEpt.ns + "-" + name;
        var handler = new RootValueHandler(this.state.paramVals, this.state.fileVals, this.updateParamValues);
        var headerHandler = new RequestHeaderRootHandler(this.state.headerVals, this.updateHeaderValues);
        return d.span({ id: 'request-area' }, d.table({ className: 'page-table' }, d.tbody(null, utils.getAuthType() == utils.AuthType.Team
            ? ce(AppPermissionInput, { handler: this.updateClientId })
            : null, ce(TokenInput, {
            toggleShow: this.showOrHide,
            showToken: this.state.showToken,
            callback: this.updateTokenValue
        }), d.tr(null, tableText('Request'), d.td(null, d.div({ className: 'align-right' }, d.a({ href: documentation }, 'Documentation')), d.table({ id: 'parameter-list' }, d.tbody(null, this.props.currEpt.params.map(function (param) {
            return ParamClassChooser.getParamInput(param, {
                key: _this.props.currEpt.name + param.name,
                handler: handler.getChildHandler(param),
                param: param
            });
        }))), d.div(null, d.button({ onClick: this.showOrHideHeaders }, this.state.showHeaders ? 'Hide Headers' : 'Show Headers'), d.button({ onClick: this.showOrHideCode }, this.state.showCode ? 'Hide Code' : 'Show Code'), d.button({ onClick: this.submit, disabled: this.props.inProgress }, 'Submit Call'), d.img({
            src: 'https://www.dropbox.com/static/images/icons/ajax-loading-small.gif',
            hidden: !this.props.inProgress,
            style: { position: 'relative', top: '2px', left: '10px' }
        }), errMsg))), d.tr(this.state.showHeaders ? null : displayNone, tableText('Headers'), d.td(null, d.div({ id: 'request-headers' }, ce(RequestHeaderArea, { handler: headerHandler })))), d.tr(this.state.showCode ? null : displayNone, tableText('Code'), d.td(null, d.div({ id: 'request-container' }, ce(CodeArea, {
            ept: this.props.currEpt,
            paramVals: this.state.paramVals,
            headerVals: this.state.headerVals,
            __file__: this.state.fileVals['file'],
            token: this.state.showToken ? utils.getToken() : '<access-token>'
        })))))));
    };
    return RequestArea;
})(react.Component);
var RequestHeaderArea = (function (_super) {
    __extends(RequestHeaderArea, _super);
    function RequestHeaderArea(props) {
        _super.call(this, props);
    }
    RequestHeaderArea.prototype.render = function () {
        var handler = this.props.handler;
        return d.span({ id: 'request-header-area' }, d.div(null, d.button({ onClick: handler.add }, 'Add Header')), d.table(null, d.tbody(null, handler.getHeaders().map(function (header) { return ce(RequestHeaderInput, {
            header: header,
            handler: new RequestHeaderHandler(handler)
        }); }))));
    };
    return RequestHeaderArea;
})(react.Component);
var RequestHeaderRootHandler = (function () {
    function RequestHeaderRootHandler(headers, callback) {
        var _this = this;
        this.remove = function (header) {
            var index = _this.headers.indexOf(header);
            _this.headers.splice(index, 1);
            _this.callBack(_this.headers);
        };
        this.add = function () {
            _this.headers.push(new utils_7.Header());
            _this.callBack(_this.headers);
        };
        this.update = function () {
            _this.callBack(_this.headers);
        };
        this.getHeaders = function () {
            return _this.headers;
        };
        this.headers = headers;
        this.callBack = callback;
    }
    return RequestHeaderRootHandler;
})();
var RequestHeaderHandler = (function () {
    function RequestHeaderHandler(parentHandler) {
        var _this = this;
        this.onChange = function (header, removed) {
            if (removed) {
                _this.parentHandler.remove(header);
            }
            else {
                _this.parentHandler.update();
            }
        };
        this.parentHandler = parentHandler;
    }
    return RequestHeaderHandler;
})();
var RequestHeaderInput = (function (_super) {
    __extends(RequestHeaderInput, _super);
    function RequestHeaderInput(props) {
        _super.call(this, props);
    }
    RequestHeaderInput.prototype.render = function () {
        return this.props.header.asReact(this.props.handler.onChange);
    };
    return RequestHeaderInput;
})(react.Component);
var EndpointChoice = (function (_super) {
    __extends(EndpointChoice, _super);
    function EndpointChoice(props) {
        var _this = this;
        _super.call(this, props);
        this.onClick = function () { return _this.props.handleClick(_this.props.ept); };
    }
    EndpointChoice.prototype.render = function () {
        return (this.props.isSelected) ?
            d.li(null, d.b(null, this.props.ept.name), d.br(null)) :
            d.li(null, d.a({ onClick: this.onClick }, this.props.ept.name), d.br(null));
    };
    return EndpointChoice;
})(react.Component);
var EndpointSelector = (function (_super) {
    __extends(EndpointSelector, _super);
    function EndpointSelector(props) {
        _super.call(this, props);
        this.filter = function (ept) {
            if (ept.params.length > 0 && ept.params.indexOf(null) >= 0) {
                // Skip not implemented endpoints.
                return true;
            }
            var eptAuthType = ept.getAuthType() == utils.AuthType.Team
                ? utils.AuthType.Team
                : utils.AuthType.User;
            if (eptAuthType != utils.getAuthType()) {
                // Skip endpoints with different auth type.
                return true;
            }
            return false;
        };
    }
    // Renders the logo and the list of endpoints
    EndpointSelector.prototype.render = function () {
        var _this = this;
        var groups = {};
        var namespaces = [];
        endpoints.endpointList.forEach(function (ept) {
            if (_this.filter(ept)) {
                return;
            }
            if (groups[ept.ns] == undefined) {
                groups[ept.ns] = [ept];
                namespaces.push(ept.ns);
            }
            else {
                groups[ept.ns].push(ept);
            }
        });
        return d.div({ 'id': 'sidebar' }, d.p({ style: { marginLeft: '35px', marginTop: '12px' } }, d.a({ onClick: function () { return window.location.href = developerPage; } }, d.img({
            src: 'https://cfl.dropboxstatic.com/static/images/logo_catalog/blue_dropbox_glyph_m1-vflZvZxbS.png',
            width: 36,
            className: 'home-icon'
        }))), d.div({ id: 'endpoint-list' }, namespaces.sort().map(function (ns) {
            return d.div(null, d.li(null, ns), groups[ns].map(function (ept) {
                return ce(EndpointChoice, {
                    key: ept.name,
                    ept: ept,
                    handleClick: _this.props.eptChanged,
                    isSelected: _this.props.currEpt == ept
                });
            }));
        })));
    };
    return EndpointSelector;
})(react.Component);
var ResponseArea = (function (_super) {
    __extends(ResponseArea, _super);
    function ResponseArea(props) {
        _super.call(this, props);
    }
    ResponseArea.prototype.render = function () {
        return d.span({ id: 'response-area' }, d.table({ className: 'page-table' }, d.tbody(this.props.hide ? displayNone : null, d.tr(null, tableText('Response'), d.td(null, d.div({ id: 'response-container' }, ce(utils.Highlight, { className: 'json' }, this.props.responseText)), d.div(null, this.props.downloadButton))))));
    };
    return ResponseArea;
})(react.Component);
var APIExplorer = (function (_super) {
    __extends(APIExplorer, _super);
    function APIExplorer(props) {
        var _this = this;
        _super.call(this, props);
        this.componentWillReceiveProps = function (newProps) { return _this.setState({
            ept: newProps.initEpt,
            downloadURL: '',
            responseText: ''
        }); };
        this.APICaller = function (paramsData, endpt, token, headers, responseFn, file) {
            _this.setState({ inProgress: true });
            var responseFn_wrapper = function (component, resp) {
                _this.setState({ inProgress: false });
                responseFn(component, resp);
            };
            apicalls.APIWrapper(paramsData, endpt, token, headers, responseFn_wrapper, _this, file);
        };
        this.state = {
            ept: this.props.initEpt,
            downloadURL: '',
            responseText: '',
            inProgress: false
        };
    }
    APIExplorer.prototype.render = function () {
        // This button pops up only on download
        var downloadButton = (this.state.downloadURL !== '') ?
            d.a({
                href: this.state.downloadURL,
                download: this.state.downloadFilename
            }, d.button(null, 'Download ' + this.state.downloadFilename)) :
            null;
        var props = {
            currEpt: this.state.ept,
            header: d.span(null, 'Dropbox API Explorer • ' + this.state.ept.name),
            messages: [
                ce(RequestArea, {
                    currEpt: this.state.ept,
                    APICaller: this.APICaller,
                    inProgress: this.state.inProgress
                }),
                ce(ResponseArea, {
                    hide: this.state.inProgress || this.state.responseText == '',
                    responseText: this.state.responseText,
                    downloadButton: downloadButton
                })
            ]
        };
        return ce(MainPage, props);
    };
    return APIExplorer;
})(react.Component);
var MainPage = (function (_super) {
    __extends(MainPage, _super);
    function MainPage(props) {
        _super.call(this, props);
        this.getAuthSwitch = function () {
            if (utils.getAuthType() == utils.AuthType.User) {
                return d.a({ id: 'auth-switch', href: utils.currentURL() + 'team/' }, 'Switch to Business endpoints');
            }
            else {
                return d.a({ id: 'auth-switch', href: '../' }, 'Switch to User endpoints');
            }
        };
    }
    MainPage.prototype.render = function () {
        return d.span(null, ce(EndpointSelector, {
            eptChanged: function (endpt) { return window.location.hash = '#' + endpt.getFullName(); },
            currEpt: this.props.currEpt
        }), d.h1({ id: 'header' }, this.props.header, this.getAuthSwitch()), d.div({ id: 'page-content' }, this.props.messages));
    };
    return MainPage;
})(react.Component);
var TextPage = (function (_super) {
    __extends(TextPage, _super);
    function TextPage(props) {
        _super.call(this, props);
    }
    TextPage.prototype.render = function () {
        return ce(MainPage, {
            currEpt: new utils_8.Endpoint('', '', null),
            header: d.span(null, 'Dropbox API Explorer'),
            messages: [this.props.message]
        });
    };
    return TextPage;
})(react.Component);
// Introductory page, which people see when they first open the webpage
var introPage = ce(TextPage, {
    message: d.span(null, d.p(null, 'Welcome to the Dropbox API Explorer!'), d.p(null, 'This API Explorer is a tool to help you learn about the ', d.a({ href: developerPage }, 'Dropbox API v2'), " and test your own examples. For each endpoint, you'll be able to submit an API call ", 'with your own parameters and see the code for that call, as well as the API response.'), d.p(null, 'Click on an endpoint on your left to get started, or check out ', d.a({ href: developerPage + '/documentation' }, 'the documentation'), ' for more information on the API.')) });
/* The endpoint name (supplied via the URL's hash) doesn't correspond to any actual endpoint. Right
   now, this can only happen if the user edits the URL hash.
   React sanitizes its inputs, so displaying the hash below is safe.
 */
var endpointNotFound = ce(TextPage, {
    message: d.span(null, d.p(null, 'Welcome to the Dropbox API Explorer!'), d.p(null, "Unfortunately, there doesn't seem to be an endpoint called ", d.b(null, window.location.hash.substr(1)), '. Try clicking on an endpoint on the left instead.'), d.p(null, 'If you think you received this message in error, please get in contact with us.')) });
/* Error when the state parameter of the hash isn't what was expected, which could be due to an
   XSRF attack.
 */
var stateError = ce(TextPage, {
    message: d.span(null, d.p(null, ''), d.p(null, 'Unfortunately, there was a problem retrieving your OAuth2 token; please try again. ', 'If this error persists, you may be using an insecure network.'), d.p(null, 'If you think you received this message in error, please get in contact with us.')) });
/* The hash of the URL determines which page to render; no hash renders the intro page, and
   'auth_error!' (the ! chosen so it's less likely to have a name clash) renders the stateError
   page when the state parameter isn't what was expected.
 */
var renderGivenHash = function (hash) {
    if (hash === '' || hash === undefined) {
        react.render(introPage, document.body);
    }
    else if (hash === 'xkcd') {
        window.location.href = 'https://xkcd.com/1481/';
    }
    else if (hash === 'auth_error!') {
        react.render(stateError, document.body);
    }
    else {
        var currEpt = utils.getEndpoint(endpoints.endpointList, decodeURIComponent(hash));
        if (currEpt === null) {
            react.render(endpointNotFound, document.body);
        }
        else {
            react.render(ce(APIExplorer, { initEpt: currEpt }), document.body);
        }
    }
};
var checkCsrf = function (state) {
    if (state === null)
        return null;
    var div = state.indexOf('!');
    if (div < 0)
        return null;
    var csrfToken = state.substring(div + 1);
    if (!utils.checkCsrfToken(csrfToken))
        return null;
    return state.substring(0, div); // The part before the CSRF token.
};
/* Things that need to be initialized at the start.
    1. Set up the listener for hash changes.
    2. Process the initial hash. This only occurs when the user goes through token flow, which
       redirects the page back to the API Explorer website, but with a hash that contains the
       token and some extra state (to check against XSRF attacks).
 */
var main = function () {
    window.onhashchange = function (e) {
        //first one works everywhere but IE, second one works everywhere but Firefox 40
        renderGivenHash(e.newURL ? e.newURL.split('#')[1] : window.location.hash.slice(1));
    };
    var hashes = utils.getHashDict();
    if ('state' in hashes) {
        var state = checkCsrf(hashes['state']);
        if (state === null) {
            window.location.hash = '#auth_error!';
        }
        else {
            utils.putToken(hashes['access_token']);
            window.location.href = utils.currentURL() + '#' + state;
        }
    }
    else if ('__ept__' in hashes) {
        renderGivenHash(hashes['__ept__']);
    }
    else {
        react.render(introPage, document.body);
    }
};
main();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./apicalls":1,"./codeview":2,"./endpoints":4,"./utils":6}],6:[function(require,module,exports){
(function (global){
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var hljs = (typeof window !== "undefined" ? window['hljs'] : typeof global !== "undefined" ? global['hljs'] : null);
var cookie = require('./cookie');
var d = react.DOM;
var allowedHeaders = [
    'Dropbox-Api-Select-User',
    'Dropbox-Api-Select-Admin',
    'Dropbox-Api-Path-Root'
];
// This class mostly exists to help Typescript type-check my programs.
var Dict = (function () {
    function Dict() {
    }
    /* Two methods for mapping through dictionaries, customized to the API Explorer's use case.
       - _map takes function from a key, a value, and an index to a React element, and
       - map is the same, but without an index.
       These are used, for example, to convert a dict of HTTP headers into its representation
       in code view.
     */
    Dict._map = function (dc, f) {
        return Object.keys(dc).map(function (key, i) { return f(key, dc[key], i); });
    };
    Dict.map = function (dc, f) {
        return Object.keys(dc).map(function (key) { return f(key, dc[key]); });
    };
    return Dict;
})();
exports.Dict = Dict;
var List = (function () {
    function List() {
        var _this = this;
        this.push = function (value) { return _this.push(value); };
    }
    return List;
})();
exports.List = List;
/* Helper class which deal with local storage. If session storage is allowed, items
   will be written to session storage. If session storage is disabled (e.g. safari
   private browsing mode), cookie storage will be used as fallback.
 */
var LocalStorage = (function () {
    function LocalStorage() {
    }
    LocalStorage._is_session_storage_allowed = function () {
        var test = 'test';
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        }
        catch (e) {
            return false;
        }
    };
    LocalStorage.setItem = function (key, data) {
        if (LocalStorage._is_session_storage_allowed()) {
            sessionStorage.setItem(key, data);
        }
        else {
            cookie.setItem(key, data);
        }
    };
    LocalStorage.getItem = function (key) {
        if (LocalStorage._is_session_storage_allowed()) {
            return sessionStorage.getItem(key);
        }
        else {
            return cookie.getItem(key);
        }
    };
    return LocalStorage;
})();
exports.LocalStorage = LocalStorage;
/* There are three kinds of endpoints, and a lot of the program logic depends on what kind of
   endpoint is currently being shown.
    - An RPC-like endpoint involves no uploading or downloading of data; it sends a request
      with JSON data in the body, and receives a JSON response. Example: get_metadata
    - An upload-like endpoint sends file data in the body and the arguments in a header, but
      receives a JSON response. Example: upload
    - A download-style endpoint sends a request with JSON data, but receives the file in the
      response body. Example: get_thumbnail
 */
(function (EndpointKind) {
    EndpointKind[EndpointKind["RPCLike"] = 0] = "RPCLike";
    EndpointKind[EndpointKind["Upload"] = 1] = "Upload";
    EndpointKind[EndpointKind["Download"] = 2] = "Download";
})(exports.EndpointKind || (exports.EndpointKind = {}));
var EndpointKind = exports.EndpointKind;
(function (AuthType) {
    AuthType[AuthType["None"] = 0] = "None";
    AuthType[AuthType["User"] = 1] = "User";
    AuthType[AuthType["Team"] = 2] = "Team";
    AuthType[AuthType["App"] = 3] = "App";
})(exports.AuthType || (exports.AuthType = {}));
var AuthType = exports.AuthType;
/* A class with all the information about an endpoint: its name and namespace; its kind
   (as listed above), and its list of parameters. The endpoints are all initialized in
   endpoints.ts, which is code-generated.
 */
var Endpoint = (function () {
    function Endpoint(ns, name, attrs) {
        var _this = this;
        var params = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            params[_i - 3] = arguments[_i];
        }
        this.getHostname = function () {
            switch (_this.attrs["host"]) {
                case "content":
                    return "content.dropboxapi.com";
                case "notify":
                    return "notify.dropboxapi.com";
                default:
                    return "api.dropboxapi.com";
            }
        };
        this.getAuthType = function () {
            if (_this.attrs["host"] == "notify") {
                return AuthType.None;
            }
            var auth = _this.attrs["auth"];
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
        this.getEndpointKind = function () {
            switch (_this.attrs["style"]) {
                case "upload":
                    return EndpointKind.Upload;
                case "download":
                    return EndpointKind.Download;
                default:
                    return EndpointKind.RPCLike;
            }
        };
        this.getPathName = function () { return '/2/' + _this.ns + '/' + _this.name; };
        this.getFullName = function () { return _this.ns + '_' + _this.name; };
        this.getURL = function () { return 'https://' + _this.getHostname() + _this.getPathName(); };
        this.ns = ns;
        this.name = name;
        this.attrs = attrs;
        this.params = params;
    }
    return Endpoint;
})();
exports.Endpoint = Endpoint;
// Class store information about request header.
var Header = (function () {
    function Header() {
        this.name = allowedHeaders[0];
        this.value = '';
    }
    Header.prototype.asReact = function (onChangeHandler) {
        var _this = this;
        var updateName = function (event) {
            _this.name = event.target.value;
            onChangeHandler(_this, false);
        };
        var updateValue = function (event) {
            _this.value = event.target.value;
            onChangeHandler(_this, false);
        };
        return d.tr(null, d.td(null, d.select({ value: this.name, onChange: updateName, className: 'header-name' }, allowedHeaders.map(function (name) { return d.option({ key: name, value: name }, name); }))), d.td(null, d.input({
            type: 'text',
            className: 'header-value',
            onChange: updateValue,
            placeholder: 'Header Value',
            value: this.value
        })), d.td(null, d.button({ onClick: function () { return onChangeHandler(_this, true); } }, 'Remove')));
    };
    return Header;
})();
exports.Header = Header;
/* A parameter to an API endpoint. This class is abstract, as different kinds of parameters
   (e.g. text, integer) will implement it differently.
 */
var Parameter = (function () {
    function Parameter(name, optional) {
        var _this = this;
        this.getNameColumn = function () {
            if (!isNaN(+_this.name)) {
                // Don't show name column for list parameter item.
                return null;
            }
            var displayName = (_this.name !== '__file__') ? _this.name : 'File to upload';
            if (_this.optional)
                displayName += ' (optional)';
            var nameArgs = _this.optional ? { 'style': { 'color': '#999' } } : {};
            return d.td(nameArgs, displayName);
        };
        /* Each subclass will implement these abstract methods differently.
            - getValue should parse the value in the string and return the (typed) value for that
              parameter. For example, integer parameters will use parseInt here.
            - defaultValue should return the initial value if the endpoint is required (e.g.
              0 for integers, '' for strings).
            - innerReact determines how to render the input field for a parameter.
         */
        this.getValue = function (s) { return s; };
        this.defaultValue = function () { return ""; };
        this.innerReact = function (props) { return null; };
        this.name = name;
        this.optional = optional;
    }
    /* Renders the parameter's input field, using another method which depends on the
       parameter's subclass.
     */
    Parameter.prototype.asReact = function (props, key) {
        return d.tr({ key: key }, this.getNameColumn(), d.td(null, this.innerReact(props)));
    };
    return Parameter;
})();
exports.Parameter = Parameter;
exports.parameterInput = function (props) {
    props['className'] = 'parameter-input';
    return d.input(props);
};
// A parameter whose value is a string.
var TextParam = (function (_super) {
    __extends(TextParam, _super);
    function TextParam(name, optional) {
        _super.call(this, name, optional);
        this.innerReact = function (props) { return exports.parameterInput(props); };
    }
    return TextParam;
})(Parameter);
exports.TextParam = TextParam;
// A parameter whose value is an integer.
var IntParam = (function (_super) {
    __extends(IntParam, _super);
    function IntParam(name, optional) {
        var _this = this;
        _super.call(this, name, optional);
        this.innerReact = function (props) { return exports.parameterInput(props); };
        this.getValue = function (s) { return (s === '') ? _this.defaultValue() : parseInt(s, 10); };
        this.defaultValue = function () { return 0; };
    }
    return IntParam;
})(Parameter);
exports.IntParam = IntParam;
/* A parameter whose value is a float.
   This isn't currently used in our API, but could be in the future.
 */
var FloatParam = (function (_super) {
    __extends(FloatParam, _super);
    function FloatParam(name, optional) {
        var _this = this;
        _super.call(this, name, optional);
        this.innerReact = function (props) { return exports.parameterInput(props); };
        this.getValue = function (s) { return (s === '') ? _this.defaultValue() : parseFloat(s); };
        this.defaultValue = function () { return 0; };
    }
    return FloatParam;
})(Parameter);
exports.FloatParam = FloatParam;
/* A parameter whose type is void.
 */
var VoidParam = (function (_super) {
    __extends(VoidParam, _super);
    function VoidParam(name) {
        _super.call(this, name, true);
        this.defaultValue = function () { return null; };
        this.getValue = function (s) { return null; };
    }
    return VoidParam;
})(Parameter);
exports.VoidParam = VoidParam;
var SelectorParam = (function (_super) {
    __extends(SelectorParam, _super);
    function SelectorParam(name, optional, choices, selected) {
        var _this = this;
        if (selected === void 0) { selected = null; }
        _super.call(this, name, optional);
        this.defaultValue = function () { return _this.choices[0]; };
        this.getValue = function (s) { return s; };
        this.innerReact = function (props) {
            if (_this.selected != null) {
                props['value'] = _this.selected;
            }
            return d.select(props, _this.choices.map(function (choice) { return d.option({
                key: choice,
                value: choice
            }, choice); }));
        };
        this.choices = choices;
        if (this.optional) {
            this.choices.unshift('');
        }
        this.selected = selected;
    }
    return SelectorParam;
})(Parameter);
exports.SelectorParam = SelectorParam;
// Booleans are selectors for true or false.
var BoolParam = (function (_super) {
    __extends(BoolParam, _super);
    function BoolParam(name, optional) {
        _super.call(this, name, optional, ['false', 'true']);
        this.getValue = function (s) { return s === 'true'; };
    }
    return BoolParam;
})(SelectorParam);
exports.BoolParam = BoolParam;
/* Upload-style endpoints accept data to upload. This is implemented as a special parameter
   to each endpoint, with the special name __file__. However, it's not technically an
   argument to its endpoint: the file is handled separately from the other parameters, since
   its contents are treated as data.
   Note that, since the name is fixed, only one file parameter can be used per endpoint right
   now.
 */
var FileParam = (function (_super) {
    __extends(FileParam, _super);
    function FileParam() {
        _super.call(this, '__file__', false);
        this.innerReact = function (props) {
            props['type'] = 'file';
            return exports.parameterInput(props);
        };
    }
    return FileParam;
})(Parameter);
exports.FileParam = FileParam;
/* A few parameters are structs whose fields are other parameters. The user will just see the
   fields as if they were top-level parameters, but the backend collects them into one
   dictionary.
   TODO: can structs be optional? If so, how do I hint this to the user?
 */
var StructParam = (function (_super) {
    __extends(StructParam, _super);
    function StructParam(name, optional, fields) {
        var _this = this;
        _super.call(this, name, optional);
        this.populateFields = function (dict) {
            _this.fields.forEach(function (field) {
                if (!field.optional) {
                    dict[field.name] = field.defaultValue();
                }
            });
        };
        this.defaultValue = function () {
            var toReturn = {};
            _this.populateFields(toReturn);
            return toReturn;
        };
        this.fields = fields;
    }
    return StructParam;
})(Parameter);
exports.StructParam = StructParam;
// Union are selectors with multiple fields.
var UnionParam = (function (_super) {
    __extends(UnionParam, _super);
    function UnionParam(name, optional, fields) {
        var _this = this;
        _super.call(this, name, optional, fields);
        this.getSelectorParam = function (selected) {
            if (selected === void 0) { selected = null; }
            var choices = [];
            _this.fields.forEach(function (p) { return choices.push(p.name); });
            return new SelectorParam(_this.getSelectorName(), _this.optional, choices, selected);
        };
        this.getSelectorName = function () { return _this.name; };
        this.defaultValue = function () {
            if (_this.optional) {
                return null;
            }
            var param = _this.fields[0];
            var toReturn = { '.tag': param.name };
            if (param instanceof StructParam) {
                param.populateFields(toReturn);
            }
            else if (param instanceof VoidParam) {
            }
            else {
                toReturn[param.name] = param.defaultValue();
            }
            return toReturn;
        };
    }
    return UnionParam;
})(StructParam);
exports.UnionParam = UnionParam;
var RootUnionParam = (function (_super) {
    __extends(RootUnionParam, _super);
    function RootUnionParam(name, optional, fields) {
        _super.call(this, name, optional, fields);
        this.getSelectorName = function () { return 'tag'; };
    }
    return RootUnionParam;
})(UnionParam);
exports.RootUnionParam = RootUnionParam;
var ListParam = (function (_super) {
    __extends(ListParam, _super);
    function ListParam(name, optional, creator) {
        var _this = this;
        _super.call(this, name, optional);
        this.createItem = function (index) { return _this.creator(index.toString()); };
        this.defaultValue = function () {
            return _this.optional ? null : [];
        };
        this.creator = creator;
    }
    return ListParam;
})(Parameter);
exports.ListParam = ListParam;
// Utilities for token flow
var csrfTokenStorageName = 'Dropbox_API_state';
var tokenStorageName = 'Dropbox_API_explorer_token';
var clientIdStorageName = 'Dropbox_API_explorer_client_id';
exports.getAuthType = function () {
    return window.location.href.indexOf('/team') > 0
        ? AuthType.Team
        : AuthType.User;
};
exports.createCsrfToken = function () {
    var randomBytes = new Uint8Array(18); // multiple of 3 avoids base-64 padding
    // If available, use the cryptographically secure generator, otherwise use Math.random.
    var crypto = window.crypto || window.msCrypto;
    if (crypto && crypto.getRandomValues && false) {
        crypto.getRandomValues(randomBytes);
    }
    else {
        for (var i = 0; i < randomBytes.length; i++) {
            randomBytes[i] = Math.floor(Math.random() * 256);
        }
    }
    var token = btoa(String.fromCharCode.apply(null, randomBytes)); // base64-encode
    LocalStorage.setItem(csrfTokenStorageName, token);
    return token;
};
exports.checkCsrfToken = function (givenCsrfToken) {
    var expectedCsrfToken = LocalStorage.getItem(csrfTokenStorageName);
    if (expectedCsrfToken === null)
        return false;
    return givenCsrfToken === expectedCsrfToken; // TODO: timing attack in string comparison?
};
// A utility to read the URL's hash and parse it into a dict.
exports.getHashDict = function () {
    var toReturn = {};
    var index = window.location.href.indexOf('#');
    if (index === -1)
        return toReturn;
    var hash = window.location.href.substr(index + 1);
    var hashes = hash.split('#');
    hashes.forEach(function (s) {
        if (s.indexOf('&') == -1)
            toReturn['__ept__'] = decodeURIComponent(s);
        else {
            s.split('&').forEach(function (pair) {
                var splitPair = pair.split('=');
                toReturn[decodeURIComponent(splitPair[0])] = decodeURIComponent(splitPair[1]);
            });
        }
    });
    return toReturn;
};
// Reading and writing the token, which is preserved in LocalStorage.
exports.putToken = function (token) {
    LocalStorage.setItem(tokenStorageName + '_' + exports.getAuthType(), token);
};
exports.getToken = function () {
    return LocalStorage.getItem(tokenStorageName + '_' + exports.getAuthType());
};
// Reading and writing the client id, which is preserved in LocalStorage.
exports.putClientId = function (clientId) {
    LocalStorage.setItem(clientIdStorageName + '_' + exports.getAuthType(), clientId);
};
exports.getClientId = function () {
    return LocalStorage.getItem(clientIdStorageName + '_' + exports.getAuthType());
};
// Some utilities that help with processing user input
// Returns an endpoint given its name, or null if there was none
exports.getEndpoint = function (epts, name) {
    for (var i = 0; i < epts.length; i++) {
        if (epts[i].getFullName() === name)
            return epts[i];
    }
    return null; // signals an error
};
/* Returns the intial values for the parameters of an endpoint. Specifically, the non-optional
   parameters' initial values are put into the paramVals dictionary. This ensures that the
   required parameters are never missing when the 'submit' button is pressed.
   If there are no parameters (except possibly a file), then the dict should be null rather
   than an empty dict.
 */
exports.initialValues = function (ept) {
    if (ept.params.length == 0)
        return null;
    if (ept.params.length == 1 && ept.params[0].name === '__file__')
        return null;
    var toReturn = {};
    ept.params.forEach(function (param) {
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
exports.getDownloadName = function (ept, paramVals) {
    if (paramVals !== null && 'path' in paramVals) {
        var toReturn = paramVals['path'].split('/').pop();
        if (ept.name === 'get_thumbnail') {
            var format = ('format' in paramVals) ? paramVals['format'] : 'jpeg';
            toReturn = toReturn.substr(0, toReturn.lastIndexOf('.')) + '.' + format;
        }
        return toReturn;
    }
    else
        return ''; // not a download-style endpoint anyways
};
// Returns the current URL without any fragment
exports.currentURL = function () { return window.location.href.split('#', 1)[0]; };
exports.arrayBufToString = function (buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
};
var isJson = function (s) {
    try {
        JSON.parse(s);
        return true;
    }
    catch (_) {
        return false;
    }
};
// Applies pretty-printing to JSON data serialized as a string.
exports.prettyJson = function (s) { return JSON.stringify(JSON.parse(s), null, 2); };
// common message for error handling
exports.errorHandler = function (stat, response) {
    if (isJson(response))
        return d.code(null, exports.prettyJson(response));
    else
        return d.span(null, d.h4(null, "Error: " + stat), d.code(null, response));
};
// Since HTTP headers cannot contain arbitrary Unicode characters, we must replace them.
exports.escapeUnicode = function (s) { return s.replace(/[\u007f-\uffff]/g, function (c) { return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4); }); };
var Highlight = (function (_super) {
    __extends(Highlight, _super);
    function Highlight(props) {
        var _this = this;
        _super.call(this, props);
        this.defaultProps = { className: "" };
        this.componentDidMount = function () { return _this.highlightCode(); };
        this.componentDidUpdate = function () { return _this.highlightCode(); };
        this.highlightCode = function () { return [].forEach.call(react.findDOMNode(_this).querySelectorAll('pre code'), function (node) { return hljs.highlightBlock(node); }); };
    }
    Highlight.prototype.render = function () {
        return d.pre({ className: this.props.className }, d.code({ className: this.props.className }, this.props.children));
    };
    return Highlight;
})(react.Component);
exports.Highlight = Highlight;
// Utility functions for getting the headers for an API call
// The headers for an RPC-like endpoint HTTP request
exports.RPCLikeHeaders = function (token, authType) {
    var toReturn = {};
    if (authType == AuthType.None) {
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
exports.uploadLikeHeaders = function (token, args) {
    return {
        Authorization: "Bearer " + token,
        "Content-Type": "application/octet-stream",
        "Dropbox-API-Arg": exports.escapeUnicode(args)
    };
};
exports.downloadLikeHeaders = function (token, args) {
    return {
        Authorization: "Bearer " + token,
        "Dropbox-API-Arg": exports.escapeUnicode(args)
    };
};
exports.getHeaders = function (ept, token, customHeaders, args) {
    if (args === void 0) { args = null; }
    var headers = {};
    switch (ept.getEndpointKind()) {
        case EndpointKind.RPCLike: {
            headers = exports.RPCLikeHeaders(token, ept.getAuthType());
            break;
        }
        case EndpointKind.Upload: {
            headers = exports.uploadLikeHeaders(token, args);
            break;
        }
        case EndpointKind.Download: {
            headers = exports.downloadLikeHeaders(token, args);
            break;
        }
    }
    customHeaders.forEach(function (header) {
        if (header.name != '') {
            headers[header.name] = header.value;
        }
    });
    return headers;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./cookie":3}],7:[function(require,module,exports){

},{}]},{},[5,7])


//# sourceMappingURL=all.js.map
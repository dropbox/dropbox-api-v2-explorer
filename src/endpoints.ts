// Automatically generated code; do not edit

import Utils = require('./utils');

module Endpoints {
    const get_metadata_endpt = new Utils.Endpoint("files", "get_metadata", Utils.EndpointKind.RPCLike,
        new Utils.TextParam("path", false)
    );
    const list_folder_endpt = new Utils.Endpoint("files", "list_folder", Utils.EndpointKind.RPCLike,
        new Utils.TextParam("path", false),
        new Utils.BoolParam("recursive", true)
    );
    const list_folder_continue_endpt = new Utils.Endpoint("files", "list_folder/continue", Utils.EndpointKind.RPCLike,
        new Utils.TextParam("cursor", false)
    );
    const list_folder_get_latest_cursor_endpt = new Utils.Endpoint("files", "list_folder/get_latest_cursor", Utils.EndpointKind.RPCLike,
        new Utils.TextParam("path", false),
        new Utils.BoolParam("recursive", true)
    );
    const download_endpt = new Utils.Endpoint("files", "download", Utils.EndpointKind.Download,
        new Utils.TextParam("path", false),
        new Utils.TextParam("rev", true)
    );
    const upload_session_start_endpt = new Utils.Endpoint("files", "upload_session/start", Utils.EndpointKind.Upload,
        new Utils.FileParam()
    );
    const upload_session_append_endpt = new Utils.Endpoint("files", "upload_session/append", Utils.EndpointKind.Upload,
        new Utils.FileParam(),
        new Utils.TextParam("session_id", false),
        new Utils.IntParam("offset", false)
    );
    const upload_session_finish_endpt = new Utils.Endpoint("files", "upload_session/finish", Utils.EndpointKind.Upload,
        new Utils.FileParam(),
        new Utils.StructParam("cursor", false, new Utils.TextParam("session_id", false), new Utils.IntParam("offset", false)),
        new Utils.StructParam("commit", false, new Utils.TextParam("path", false), new Utils.SelectorParam("mode", ["add", "overwrite", "update"], true), new Utils.BoolParam("autorename", true), new Utils.TextParam("client_modified", true), new Utils.BoolParam("mute", true))
    );
    const upload_endpt = new Utils.Endpoint("files", "upload", Utils.EndpointKind.Upload,
        new Utils.FileParam(),
        new Utils.TextParam("path", false),
        new Utils.SelectorParam("mode", ["add", "overwrite", "update"], true),
        new Utils.BoolParam("autorename", true),
        new Utils.TextParam("client_modified", true),
        new Utils.BoolParam("mute", true)
    );
    const search_endpt = new Utils.Endpoint("files", "search", Utils.EndpointKind.RPCLike,
        new Utils.TextParam("path", false),
        new Utils.TextParam("query", false),
        new Utils.IntParam("start", true),
        new Utils.IntParam("max_results", true),
        new Utils.SelectorParam("mode", ["filename", "filename_and_content", "deleted_filename"], true)
    );
    const create_folder_endpt = new Utils.Endpoint("files", "create_folder", Utils.EndpointKind.RPCLike,
        new Utils.TextParam("path", false)
    );
    const delete_endpt = new Utils.Endpoint("files", "delete", Utils.EndpointKind.RPCLike,
        new Utils.TextParam("path", false)
    );
    const copy_endpt = new Utils.Endpoint("files", "copy", Utils.EndpointKind.RPCLike,
        new Utils.TextParam("from_path", false),
        new Utils.TextParam("to_path", false)
    );
    const move_endpt = new Utils.Endpoint("files", "move", Utils.EndpointKind.RPCLike,
        new Utils.TextParam("from_path", false),
        new Utils.TextParam("to_path", false)
    );
    const get_thumbnail_endpt = new Utils.Endpoint("files", "get_thumbnail", Utils.EndpointKind.Download,
        new Utils.TextParam("path", false),
        new Utils.SelectorParam("format", ["jpeg", "png"], true),
        new Utils.SelectorParam("size", ["xs", "s", "m", "l", "xl"], true)
    );
    const get_preview_endpt = new Utils.Endpoint("files", "get_preview", Utils.EndpointKind.Download,
        new Utils.TextParam("path", false),
        new Utils.TextParam("rev", true)
    );
    const list_revisions_endpt = new Utils.Endpoint("files", "list_revisions", Utils.EndpointKind.RPCLike,
        new Utils.TextParam("path", false),
        new Utils.IntParam("limit", true)
    );
    const restore_endpt = new Utils.Endpoint("files", "restore", Utils.EndpointKind.RPCLike,
        new Utils.TextParam("path", false),
        new Utils.TextParam("rev", false)
    );
    const get_account_endpt = new Utils.Endpoint("users", "get_account", Utils.EndpointKind.RPCLike,
        new Utils.TextParam("account_id", false)
    );
    const get_current_account_endpt = new Utils.Endpoint("users", "get_current_account", Utils.EndpointKind.RPCLike);
    const get_space_usage_endpt = new Utils.Endpoint("users", "get_space_usage", Utils.EndpointKind.RPCLike);

    export const endpointList: Utils.Endpoint[] = [get_metadata_endpt,
                                                   list_folder_endpt,
                                                   list_folder_continue_endpt,
                                                   list_folder_get_latest_cursor_endpt,
                                                   download_endpt,
                                                   upload_session_start_endpt,
                                                   upload_session_append_endpt,
                                                   upload_session_finish_endpt,
                                                   upload_endpt,
                                                   search_endpt,
                                                   create_folder_endpt,
                                                   delete_endpt,
                                                   copy_endpt,
                                                   move_endpt,
                                                   get_thumbnail_endpt,
                                                   get_preview_endpt,
                                                   list_revisions_endpt,
                                                   restore_endpt,
                                                   get_account_endpt,
                                                   get_current_account_endpt,
                                                   get_space_usage_endpt];
}

export = Endpoints;

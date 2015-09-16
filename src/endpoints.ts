// Automatically generated code; do not edit

import utils = require('./utils');

const get_metadata_endpt = new utils.Endpoint("files", "get_metadata", utils.EndpointKind.RPCLike,
    new utils.TextParam("path", false)
);
const list_folder_endpt = new utils.Endpoint("files", "list_folder", utils.EndpointKind.RPCLike,
    new utils.TextParam("path", false),
    new utils.BoolParam("recursive", true)
);
const list_folder_continue_endpt = new utils.Endpoint("files", "list_folder/continue", utils.EndpointKind.RPCLike,
    new utils.TextParam("cursor", false)
);
const list_folder_get_latest_cursor_endpt = new utils.Endpoint("files", "list_folder/get_latest_cursor", utils.EndpointKind.RPCLike,
    new utils.TextParam("path", false),
    new utils.BoolParam("recursive", true)
);
const download_endpt = new utils.Endpoint("files", "download", utils.EndpointKind.Download,
    new utils.TextParam("path", false),
    new utils.TextParam("rev", true)
);
const upload_session_start_endpt = new utils.Endpoint("files", "upload_session/start", utils.EndpointKind.Upload,
    new utils.FileParam()
);
const upload_session_append_endpt = new utils.Endpoint("files", "upload_session/append", utils.EndpointKind.Upload,
    new utils.FileParam(),
    new utils.TextParam("session_id", false),
    new utils.IntParam("offset", false)
);
const upload_session_finish_endpt = new utils.Endpoint("files", "upload_session/finish", utils.EndpointKind.Upload,
    new utils.FileParam(),
    new utils.StructParam("cursor", false, new utils.TextParam("session_id", false), new utils.IntParam("offset", false)),
    new utils.StructParam("commit", false, new utils.TextParam("path", false), new utils.SelectorParam("mode", ["add", "overwrite", "update"], true), new utils.BoolParam("autorename", true), new utils.TextParam("client_modified", true), new utils.BoolParam("mute", true))
);
const upload_endpt = new utils.Endpoint("files", "upload", utils.EndpointKind.Upload,
    new utils.FileParam(),
    new utils.TextParam("path", false),
    new utils.SelectorParam("mode", ["add", "overwrite", "update"], true),
    new utils.BoolParam("autorename", true),
    new utils.TextParam("client_modified", true),
    new utils.BoolParam("mute", true)
);
const search_endpt = new utils.Endpoint("files", "search", utils.EndpointKind.RPCLike,
    new utils.TextParam("path", false),
    new utils.TextParam("query", false),
    new utils.IntParam("start", true),
    new utils.IntParam("max_results", true),
    new utils.SelectorParam("mode", ["filename", "filename_and_content", "deleted_filename"], true)
);
const create_folder_endpt = new utils.Endpoint("files", "create_folder", utils.EndpointKind.RPCLike,
    new utils.TextParam("path", false)
);
const delete_endpt = new utils.Endpoint("files", "delete", utils.EndpointKind.RPCLike,
    new utils.TextParam("path", false)
);
const copy_endpt = new utils.Endpoint("files", "copy", utils.EndpointKind.RPCLike,
    new utils.TextParam("from_path", false),
    new utils.TextParam("to_path", false)
);
const move_endpt = new utils.Endpoint("files", "move", utils.EndpointKind.RPCLike,
    new utils.TextParam("from_path", false),
    new utils.TextParam("to_path", false)
);
const get_thumbnail_endpt = new utils.Endpoint("files", "get_thumbnail", utils.EndpointKind.Download,
    new utils.TextParam("path", false),
    new utils.SelectorParam("format", ["jpeg", "png"], true),
    new utils.SelectorParam("size", ["xs", "s", "m", "l", "xl"], true)
);
const get_preview_endpt = new utils.Endpoint("files", "get_preview", utils.EndpointKind.Download,
    new utils.TextParam("path", false),
    new utils.TextParam("rev", true)
);
const list_revisions_endpt = new utils.Endpoint("files", "list_revisions", utils.EndpointKind.RPCLike,
    new utils.TextParam("path", false),
    new utils.IntParam("limit", true)
);
const restore_endpt = new utils.Endpoint("files", "restore", utils.EndpointKind.RPCLike,
    new utils.TextParam("path", false),
    new utils.TextParam("rev", false)
);
const get_account_endpt = new utils.Endpoint("users", "get_account", utils.EndpointKind.RPCLike,
    new utils.TextParam("account_id", false)
);
const get_current_account_endpt = new utils.Endpoint("users", "get_current_account", utils.EndpointKind.RPCLike);
const get_space_usage_endpt = new utils.Endpoint("users", "get_space_usage", utils.EndpointKind.RPCLike);

export const endpointList: utils.Endpoint[] = [get_metadata_endpt,
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

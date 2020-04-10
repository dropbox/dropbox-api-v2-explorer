// Automatically generated code; do not edit

import * as Utils from './utils';

module Endpoints {
    const account_set_profile_photo_endpt = new Utils.Endpoint("account", "set_profile_photo",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "account_info.write",
        },
        new Utils.UnionParam("photo", false, [new Utils.TextParam("base64_data", false)])
    );
    const auth_token_from_oauth1_endpt = new Utils.Endpoint("auth", "token/from_oauth1",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "app",
            host: "api",
            scope: "None",
        },
        new Utils.TextParam("oauth1_token", false),
        new Utils.TextParam("oauth1_token_secret", false)
    );
    const auth_token_revoke_endpt = new Utils.Endpoint("auth", "token/revoke",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "None",
        }
    );
    const check_app_endpt = new Utils.Endpoint("check", "app",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "True",
            select_admin_mode: "None",
            style: "rpc",
            auth: "app",
            host: "api",
            scope: "None",
        },
        new Utils.TextParam("query", true)
    );
    const check_user_endpt = new Utils.Endpoint("check", "user",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "True",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "None",
        },
        new Utils.TextParam("query", true)
    );
    const contacts_delete_manual_contacts_endpt = new Utils.Endpoint("contacts", "delete_manual_contacts",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "contacts.write",
        }
    );
    const contacts_delete_manual_contacts_batch_endpt = new Utils.Endpoint("contacts", "delete_manual_contacts_batch",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "contacts.write",
        },
        new Utils.ListParam("email_addresses", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false))
    );
    const file_properties_properties_add_endpt = new Utils.Endpoint("file_properties", "properties/add",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.metadata.write",
        },
        new Utils.TextParam("path", false),
        new Utils.ListParam("property_groups", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("template_id", false), new Utils.ListParam("fields", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("value", false)]))]))
    );
    const file_properties_properties_overwrite_endpt = new Utils.Endpoint("file_properties", "properties/overwrite",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.metadata.write",
        },
        new Utils.TextParam("path", false),
        new Utils.ListParam("property_groups", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("template_id", false), new Utils.ListParam("fields", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("value", false)]))]))
    );
    const file_properties_properties_remove_endpt = new Utils.Endpoint("file_properties", "properties/remove",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.metadata.write",
        },
        new Utils.TextParam("path", false),
        new Utils.ListParam("property_template_ids", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false))
    );
    const file_properties_properties_search_endpt = new Utils.Endpoint("file_properties", "properties/search",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.metadata.read",
        },
        new Utils.ListParam("queries", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("query", false), new Utils.UnionParam("mode", false, [new Utils.TextParam("field_name", false)]), new Utils.UnionParam("logical_operator", true, [new Utils.VoidParam("or_operator")])])),
        new Utils.UnionParam("template_filter", true, [new Utils.ListParam("filter_some", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false)), new Utils.VoidParam("filter_none")])
    );
    const file_properties_properties_search_continue_endpt = new Utils.Endpoint("file_properties", "properties/search/continue",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.metadata.read",
        },
        new Utils.TextParam("cursor", false)
    );
    const file_properties_properties_update_endpt = new Utils.Endpoint("file_properties", "properties/update",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.metadata.write",
        },
        new Utils.TextParam("path", false),
        new Utils.ListParam("update_property_groups", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("template_id", false), new Utils.ListParam("add_or_update_fields", true, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("value", false)])), new Utils.ListParam("remove_fields", true, (index: string): Utils.Parameter => new Utils.TextParam(index, false))]))
    );
    const file_properties_templates_add_for_team_endpt = new Utils.Endpoint("file_properties", "templates/add_for_team",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "files.team_metadata.write",
        },
        new Utils.TextParam("name", false),
        new Utils.TextParam("description", false),
        new Utils.ListParam("fields", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("description", false), new Utils.UnionParam("type", false, [new Utils.VoidParam("string")])]))
    );
    const file_properties_templates_add_for_user_endpt = new Utils.Endpoint("file_properties", "templates/add_for_user",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.metadata.write",
        },
        new Utils.TextParam("name", false),
        new Utils.TextParam("description", false),
        new Utils.ListParam("fields", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("description", false), new Utils.UnionParam("type", false, [new Utils.VoidParam("string")])]))
    );
    const file_properties_templates_get_for_team_endpt = new Utils.Endpoint("file_properties", "templates/get_for_team",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "files.team_metadata.write",
        },
        new Utils.TextParam("template_id", false)
    );
    const file_properties_templates_get_for_user_endpt = new Utils.Endpoint("file_properties", "templates/get_for_user",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.metadata.read",
        },
        new Utils.TextParam("template_id", false)
    );
    const file_properties_templates_list_for_team_endpt = new Utils.Endpoint("file_properties", "templates/list_for_team",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "files.team_metadata.write",
        }
    );
    const file_properties_templates_list_for_user_endpt = new Utils.Endpoint("file_properties", "templates/list_for_user",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.metadata.read",
        }
    );
    const file_properties_templates_remove_for_team_endpt = new Utils.Endpoint("file_properties", "templates/remove_for_team",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "files.team_metadata.write",
        },
        new Utils.TextParam("template_id", false)
    );
    const file_properties_templates_remove_for_user_endpt = new Utils.Endpoint("file_properties", "templates/remove_for_user",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.metadata.write",
        },
        new Utils.TextParam("template_id", false)
    );
    const file_properties_templates_update_for_team_endpt = new Utils.Endpoint("file_properties", "templates/update_for_team",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "files.team_metadata.write",
        },
        new Utils.TextParam("template_id", false),
        new Utils.TextParam("name", true),
        new Utils.TextParam("description", true),
        new Utils.ListParam("add_fields", true, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("description", false), new Utils.UnionParam("type", false, [new Utils.VoidParam("string")])]))
    );
    const file_properties_templates_update_for_user_endpt = new Utils.Endpoint("file_properties", "templates/update_for_user",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.metadata.write",
        },
        new Utils.TextParam("template_id", false),
        new Utils.TextParam("name", true),
        new Utils.TextParam("description", true),
        new Utils.ListParam("add_fields", true, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("description", false), new Utils.UnionParam("type", false, [new Utils.VoidParam("string")])]))
    );
    const file_requests_count_endpt = new Utils.Endpoint("file_requests", "count",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "file_requests.read",
        }
    );
    const file_requests_create_endpt = new Utils.Endpoint("file_requests", "create",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "file_requests.write",
        },
        new Utils.TextParam("title", false),
        new Utils.TextParam("destination", false),
        new Utils.StructParam("deadline", true, [new Utils.TextParam("deadline", false), new Utils.UnionParam("allow_late_uploads", true, [new Utils.VoidParam("one_day"), new Utils.VoidParam("two_days"), new Utils.VoidParam("seven_days"), new Utils.VoidParam("thirty_days"), new Utils.VoidParam("always")])]),
        new Utils.BoolParam("open", true)
    );
    const file_requests_delete_endpt = new Utils.Endpoint("file_requests", "delete",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "file_requests.write",
        },
        new Utils.ListParam("ids", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false))
    );
    const file_requests_delete_all_closed_endpt = new Utils.Endpoint("file_requests", "delete_all_closed",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "file_requests.write",
        }
    );
    const file_requests_get_endpt = new Utils.Endpoint("file_requests", "get",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "file_requests.read",
        },
        new Utils.TextParam("id", false)
    );
    const file_requests_list_v2_endpt = new Utils.Endpoint("file_requests", "list_v2",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "True",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "file_requests.read",
        },
        new Utils.IntParam("limit", true)
    );
    const file_requests_list_endpt = new Utils.Endpoint("file_requests", "list",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "file_requests.read",
        }
    );
    const file_requests_list_continue_endpt = new Utils.Endpoint("file_requests", "list/continue",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "True",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "file_requests.read",
        },
        new Utils.TextParam("cursor", false)
    );
    const file_requests_update_endpt = new Utils.Endpoint("file_requests", "update",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "file_requests.write",
        },
        new Utils.TextParam("id", false),
        new Utils.TextParam("title", true),
        new Utils.TextParam("destination", true),
        new Utils.UnionParam("deadline", true, [new Utils.VoidParam("no_update"), new Utils.StructParam("update", true, [new Utils.TextParam("deadline", false), new Utils.UnionParam("allow_late_uploads", true, [new Utils.VoidParam("one_day"), new Utils.VoidParam("two_days"), new Utils.VoidParam("seven_days"), new Utils.VoidParam("thirty_days"), new Utils.VoidParam("always")])])]),
        new Utils.BoolParam("open", true)
    );
    const files_copy_v2_endpt = new Utils.Endpoint("files", "copy_v2",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.write",
        },
        new Utils.TextParam("from_path", false),
        new Utils.TextParam("to_path", false),
        new Utils.BoolParam("allow_shared_folder", true),
        new Utils.BoolParam("autorename", true),
        new Utils.BoolParam("allow_ownership_transfer", true)
    );
    const files_copy_batch_v2_endpt = new Utils.Endpoint("files", "copy_batch_v2",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.write",
        },
        new Utils.ListParam("entries", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("from_path", false), new Utils.TextParam("to_path", false)])),
        new Utils.BoolParam("autorename", true)
    );
    const files_copy_batch_check_v2_endpt = new Utils.Endpoint("files", "copy_batch/check_v2",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.write",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const files_copy_reference_get_endpt = new Utils.Endpoint("files", "copy_reference/get",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.write",
        },
        new Utils.TextParam("path", false)
    );
    const files_copy_reference_save_endpt = new Utils.Endpoint("files", "copy_reference/save",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.write",
        },
        new Utils.TextParam("copy_reference", false),
        new Utils.TextParam("path", false)
    );
    const files_create_folder_v2_endpt = new Utils.Endpoint("files", "create_folder_v2",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.write",
        },
        new Utils.TextParam("path", false),
        new Utils.BoolParam("autorename", true)
    );
    const files_create_folder_batch_endpt = new Utils.Endpoint("files", "create_folder_batch",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.write",
        },
        new Utils.ListParam("paths", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false)),
        new Utils.BoolParam("autorename", true),
        new Utils.BoolParam("force_async", true)
    );
    const files_create_folder_batch_check_endpt = new Utils.Endpoint("files", "create_folder_batch/check",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.write",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const files_delete_v2_endpt = new Utils.Endpoint("files", "delete_v2",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.write",
        },
        new Utils.TextParam("path", false),
        new Utils.TextParam("parent_rev", true)
    );
    const files_delete_batch_endpt = new Utils.Endpoint("files", "delete_batch",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.write",
        },
        new Utils.ListParam("entries", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("path", false), new Utils.TextParam("parent_rev", true)]))
    );
    const files_delete_batch_check_endpt = new Utils.Endpoint("files", "delete_batch/check",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.write",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const files_download_endpt = new Utils.Endpoint("files", "download",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "whole_team",
            style: "download",
            auth: "user",
            host: "content",
            scope: "files.content.read",
        },
        new Utils.TextParam("path", false),
        new Utils.TextParam("rev", true)
    );
    const files_download_zip_endpt = new Utils.Endpoint("files", "download_zip",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "download",
            auth: "user",
            host: "content",
            scope: "files.content.read",
        },
        new Utils.TextParam("path", false)
    );
    const files_export_endpt = new Utils.Endpoint("files", "export",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "True",
            select_admin_mode: "whole_team",
            style: "download",
            auth: "user",
            host: "content",
            scope: "files.content.read",
        },
        new Utils.TextParam("path", false)
    );
    const files_get_file_lock_batch_endpt = new Utils.Endpoint("files", "get_file_lock_batch",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.read",
        },
        new Utils.ListParam("entries", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("path", false)]))
    );
    const files_get_metadata_endpt = new Utils.Endpoint("files", "get_metadata",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "whole_team",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.metadata.read",
        },
        new Utils.TextParam("path", false),
        new Utils.BoolParam("include_media_info", true),
        new Utils.BoolParam("include_deleted", true),
        new Utils.BoolParam("include_has_explicit_shared_members", true),
        new Utils.UnionParam("include_property_groups", true, [new Utils.ListParam("filter_some", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false))])
    );
    const files_get_preview_endpt = new Utils.Endpoint("files", "get_preview",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "whole_team",
            style: "download",
            auth: "user",
            host: "content",
            scope: "files.content.read",
        },
        new Utils.TextParam("path", false),
        new Utils.TextParam("rev", true)
    );
    const files_get_temporary_link_endpt = new Utils.Endpoint("files", "get_temporary_link",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.read",
        },
        new Utils.TextParam("path", false)
    );
    const files_get_temporary_upload_link_endpt = new Utils.Endpoint("files", "get_temporary_upload_link",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.write",
        },
        new Utils.StructParam("commit_info", false, [new Utils.TextParam("path", false), new Utils.UnionParam("mode", true, [new Utils.VoidParam("add"), new Utils.VoidParam("overwrite"), new Utils.TextParam("update", false)]), new Utils.BoolParam("autorename", true), new Utils.TextParam("client_modified", true), new Utils.BoolParam("mute", true), new Utils.ListParam("property_groups", true, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("template_id", false), new Utils.ListParam("fields", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("value", false)]))])), new Utils.BoolParam("strict_conflict", true)]),
        new Utils.FloatParam("duration", true)
    );
    const files_get_thumbnail_endpt = new Utils.Endpoint("files", "get_thumbnail",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "whole_team",
            style: "download",
            auth: "user",
            host: "content",
            scope: "files.content.read",
        },
        new Utils.TextParam("path", false),
        new Utils.UnionParam("format", true, [new Utils.VoidParam("jpeg"), new Utils.VoidParam("png")]),
        new Utils.UnionParam("size", true, [new Utils.VoidParam("w32h32"), new Utils.VoidParam("w64h64"), new Utils.VoidParam("w128h128"), new Utils.VoidParam("w256h256"), new Utils.VoidParam("w480h320"), new Utils.VoidParam("w640h480"), new Utils.VoidParam("w960h640"), new Utils.VoidParam("w1024h768"), new Utils.VoidParam("w2048h1536")]),
        new Utils.UnionParam("mode", true, [new Utils.VoidParam("strict"), new Utils.VoidParam("bestfit"), new Utils.VoidParam("fitone_bestfit")])
    );
    const files_get_thumbnail_v2_endpt = new Utils.Endpoint("files", "get_thumbnail_v2",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "whole_team",
            style: "download",
            auth: "app, user",
            host: "content",
            scope: "files.content.read",
        },
        new Utils.UnionParam("resource", false, [new Utils.TextParam("path", false), new Utils.StructParam("link", false, [new Utils.TextParam("url", false), new Utils.TextParam("path", true), new Utils.TextParam("password", true)])]),
        new Utils.UnionParam("format", true, [new Utils.VoidParam("jpeg"), new Utils.VoidParam("png")]),
        new Utils.UnionParam("size", true, [new Utils.VoidParam("w32h32"), new Utils.VoidParam("w64h64"), new Utils.VoidParam("w128h128"), new Utils.VoidParam("w256h256"), new Utils.VoidParam("w480h320"), new Utils.VoidParam("w640h480"), new Utils.VoidParam("w960h640"), new Utils.VoidParam("w1024h768"), new Utils.VoidParam("w2048h1536")]),
        new Utils.UnionParam("mode", true, [new Utils.VoidParam("strict"), new Utils.VoidParam("bestfit"), new Utils.VoidParam("fitone_bestfit")])
    );
    const files_get_thumbnail_batch_endpt = new Utils.Endpoint("files", "get_thumbnail_batch",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "whole_team",
            style: "rpc",
            auth: "user",
            host: "content",
            scope: "files.content.read",
        },
        new Utils.ListParam("entries", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("path", false), new Utils.UnionParam("format", true, [new Utils.VoidParam("jpeg"), new Utils.VoidParam("png")]), new Utils.UnionParam("size", true, [new Utils.VoidParam("w32h32"), new Utils.VoidParam("w64h64"), new Utils.VoidParam("w128h128"), new Utils.VoidParam("w256h256"), new Utils.VoidParam("w480h320"), new Utils.VoidParam("w640h480"), new Utils.VoidParam("w960h640"), new Utils.VoidParam("w1024h768"), new Utils.VoidParam("w2048h1536")]), new Utils.UnionParam("mode", true, [new Utils.VoidParam("strict"), new Utils.VoidParam("bestfit"), new Utils.VoidParam("fitone_bestfit")])]))
    );
    const files_list_folder_endpt = new Utils.Endpoint("files", "list_folder",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "whole_team",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.metadata.read",
        },
        new Utils.TextParam("path", false),
        new Utils.BoolParam("recursive", true),
        new Utils.BoolParam("include_media_info", true),
        new Utils.BoolParam("include_deleted", true),
        new Utils.BoolParam("include_has_explicit_shared_members", true),
        new Utils.BoolParam("include_mounted_folders", true),
        new Utils.IntParam("limit", true),
        new Utils.StructParam("shared_link", true, [new Utils.TextParam("url", false), new Utils.TextParam("password", true)]),
        new Utils.UnionParam("include_property_groups", true, [new Utils.ListParam("filter_some", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false))]),
        new Utils.BoolParam("include_non_downloadable_files", true)
    );
    const files_list_folder_continue_endpt = new Utils.Endpoint("files", "list_folder/continue",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "whole_team",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.metadata.read",
        },
        new Utils.TextParam("cursor", false)
    );
    const files_list_folder_get_latest_cursor_endpt = new Utils.Endpoint("files", "list_folder/get_latest_cursor",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "whole_team",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.metadata.read",
        },
        new Utils.TextParam("path", false),
        new Utils.BoolParam("recursive", true),
        new Utils.BoolParam("include_media_info", true),
        new Utils.BoolParam("include_deleted", true),
        new Utils.BoolParam("include_has_explicit_shared_members", true),
        new Utils.BoolParam("include_mounted_folders", true),
        new Utils.IntParam("limit", true),
        new Utils.StructParam("shared_link", true, [new Utils.TextParam("url", false), new Utils.TextParam("password", true)]),
        new Utils.UnionParam("include_property_groups", true, [new Utils.ListParam("filter_some", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false))]),
        new Utils.BoolParam("include_non_downloadable_files", true)
    );
    const files_list_folder_longpoll_endpt = new Utils.Endpoint("files", "list_folder/longpoll",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "whole_team",
            style: "rpc",
            auth: "noauth",
            host: "notify",
            scope: "files.metadata.read",
        },
        new Utils.TextParam("cursor", false),
        new Utils.IntParam("timeout", true)
    );
    const files_list_revisions_endpt = new Utils.Endpoint("files", "list_revisions",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "whole_team",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.metadata.read",
        },
        new Utils.TextParam("path", false),
        new Utils.UnionParam("mode", true, [new Utils.VoidParam("path"), new Utils.VoidParam("id")]),
        new Utils.IntParam("limit", true)
    );
    const files_lock_file_batch_endpt = new Utils.Endpoint("files", "lock_file_batch",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.write",
        },
        new Utils.ListParam("entries", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("path", false)]))
    );
    const files_move_v2_endpt = new Utils.Endpoint("files", "move_v2",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.write",
        },
        new Utils.TextParam("from_path", false),
        new Utils.TextParam("to_path", false),
        new Utils.BoolParam("allow_shared_folder", true),
        new Utils.BoolParam("autorename", true),
        new Utils.BoolParam("allow_ownership_transfer", true)
    );
    const files_move_batch_v2_endpt = new Utils.Endpoint("files", "move_batch_v2",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.write",
        },
        new Utils.ListParam("entries", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("from_path", false), new Utils.TextParam("to_path", false)])),
        new Utils.BoolParam("autorename", true),
        new Utils.BoolParam("allow_ownership_transfer", true)
    );
    const files_move_batch_check_v2_endpt = new Utils.Endpoint("files", "move_batch/check_v2",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.write",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const files_permanently_delete_endpt = new Utils.Endpoint("files", "permanently_delete",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.permanent_delete",
        },
        new Utils.TextParam("path", false),
        new Utils.TextParam("parent_rev", true)
    );
    const files_restore_endpt = new Utils.Endpoint("files", "restore",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.write",
        },
        new Utils.TextParam("path", false),
        new Utils.TextParam("rev", false)
    );
    const files_save_url_endpt = new Utils.Endpoint("files", "save_url",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.write",
        },
        new Utils.TextParam("path", false),
        new Utils.TextParam("url", false)
    );
    const files_save_url_check_job_status_endpt = new Utils.Endpoint("files", "save_url/check_job_status",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.write",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const files_search_v2_endpt = new Utils.Endpoint("files", "search_v2",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.metadata.read",
        },
        new Utils.TextParam("query", false),
        new Utils.StructParam("options", true, [new Utils.TextParam("path", true), new Utils.IntParam("max_results", true), new Utils.UnionParam("file_status", true, [new Utils.VoidParam("active"), new Utils.VoidParam("deleted")]), new Utils.BoolParam("filename_only", true), new Utils.ListParam("file_extensions", true, (index: string): Utils.Parameter => new Utils.TextParam(index, false)), new Utils.ListParam("file_categories", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("image"), new Utils.VoidParam("document"), new Utils.VoidParam("pdf"), new Utils.VoidParam("spreadsheet"), new Utils.VoidParam("presentation"), new Utils.VoidParam("audio"), new Utils.VoidParam("video"), new Utils.VoidParam("folder"), new Utils.VoidParam("paper"), new Utils.VoidParam("others")]))]),
        new Utils.BoolParam("include_highlights", true)
    );
    const files_search_continue_v2_endpt = new Utils.Endpoint("files", "search/continue_v2",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.metadata.read",
        },
        new Utils.TextParam("cursor", false)
    );
    const files_unlock_file_batch_endpt = new Utils.Endpoint("files", "unlock_file_batch",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "whole_team",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.write",
        },
        new Utils.ListParam("entries", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("path", false)]))
    );
    const files_upload_endpt = new Utils.Endpoint("files", "upload",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "upload",
            auth: "user",
            host: "content",
            scope: "files.content.write",
        },
        new Utils.FileParam(),
        new Utils.TextParam("path", false),
        new Utils.UnionParam("mode", true, [new Utils.VoidParam("add"), new Utils.VoidParam("overwrite"), new Utils.TextParam("update", false)]),
        new Utils.BoolParam("autorename", true),
        new Utils.TextParam("client_modified", true),
        new Utils.BoolParam("mute", true),
        new Utils.ListParam("property_groups", true, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("template_id", false), new Utils.ListParam("fields", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("value", false)]))])),
        new Utils.BoolParam("strict_conflict", true)
    );
    const files_upload_session_append_v2_endpt = new Utils.Endpoint("files", "upload_session/append_v2",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "upload",
            auth: "user",
            host: "content",
            scope: "files.content.write",
        },
        new Utils.FileParam(),
        new Utils.StructParam("cursor", false, [new Utils.TextParam("session_id", false), new Utils.IntParam("offset", false)]),
        new Utils.BoolParam("close", true)
    );
    const files_upload_session_finish_endpt = new Utils.Endpoint("files", "upload_session/finish",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "upload",
            auth: "user",
            host: "content",
            scope: "files.content.write",
        },
        new Utils.FileParam(),
        new Utils.StructParam("cursor", false, [new Utils.TextParam("session_id", false), new Utils.IntParam("offset", false)]),
        new Utils.StructParam("commit", false, [new Utils.TextParam("path", false), new Utils.UnionParam("mode", true, [new Utils.VoidParam("add"), new Utils.VoidParam("overwrite"), new Utils.TextParam("update", false)]), new Utils.BoolParam("autorename", true), new Utils.TextParam("client_modified", true), new Utils.BoolParam("mute", true), new Utils.ListParam("property_groups", true, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("template_id", false), new Utils.ListParam("fields", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("value", false)]))])), new Utils.BoolParam("strict_conflict", true)])
    );
    const files_upload_session_finish_batch_endpt = new Utils.Endpoint("files", "upload_session/finish_batch",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.write",
        },
        new Utils.ListParam("entries", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.StructParam("cursor", false, [new Utils.TextParam("session_id", false), new Utils.IntParam("offset", false)]), new Utils.StructParam("commit", false, [new Utils.TextParam("path", false), new Utils.UnionParam("mode", true, [new Utils.VoidParam("add"), new Utils.VoidParam("overwrite"), new Utils.TextParam("update", false)]), new Utils.BoolParam("autorename", true), new Utils.TextParam("client_modified", true), new Utils.BoolParam("mute", true), new Utils.ListParam("property_groups", true, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("template_id", false), new Utils.ListParam("fields", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("value", false)]))])), new Utils.BoolParam("strict_conflict", true)])]))
    );
    const files_upload_session_finish_batch_check_endpt = new Utils.Endpoint("files", "upload_session/finish_batch/check",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "files.content.write",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const files_upload_session_start_endpt = new Utils.Endpoint("files", "upload_session/start",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "upload",
            auth: "user",
            host: "content",
            scope: "files.content.write",
        },
        new Utils.FileParam(),
        new Utils.BoolParam("close", true)
    );
    const sharing_add_file_member_endpt = new Utils.Endpoint("sharing", "add_file_member",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.write",
        },
        new Utils.TextParam("file", false),
        new Utils.ListParam("members", false, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.TextParam("dropbox_id", false), new Utils.TextParam("email", false)])),
        new Utils.TextParam("custom_message", true),
        new Utils.BoolParam("quiet", true),
        new Utils.UnionParam("access_level", true, [new Utils.VoidParam("owner"), new Utils.VoidParam("editor"), new Utils.VoidParam("viewer"), new Utils.VoidParam("viewer_no_comment")]),
        new Utils.BoolParam("add_message_as_comment", true)
    );
    const sharing_add_folder_member_endpt = new Utils.Endpoint("sharing", "add_folder_member",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.write",
        },
        new Utils.TextParam("shared_folder_id", false),
        new Utils.ListParam("members", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.UnionParam("member", false, [new Utils.TextParam("dropbox_id", false), new Utils.TextParam("email", false)]), new Utils.UnionParam("access_level", true, [new Utils.VoidParam("owner"), new Utils.VoidParam("editor"), new Utils.VoidParam("viewer"), new Utils.VoidParam("viewer_no_comment")])])),
        new Utils.BoolParam("quiet", true),
        new Utils.TextParam("custom_message", true)
    );
    const sharing_check_job_status_endpt = new Utils.Endpoint("sharing", "check_job_status",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.write",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const sharing_check_remove_member_job_status_endpt = new Utils.Endpoint("sharing", "check_remove_member_job_status",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.write",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const sharing_check_share_job_status_endpt = new Utils.Endpoint("sharing", "check_share_job_status",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.write",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const sharing_create_shared_link_with_settings_endpt = new Utils.Endpoint("sharing", "create_shared_link_with_settings",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.write",
        },
        new Utils.TextParam("path", false),
        new Utils.StructParam("settings", true, [new Utils.UnionParam("requested_visibility", true, [new Utils.VoidParam("public"), new Utils.VoidParam("team_only"), new Utils.VoidParam("password")]), new Utils.TextParam("link_password", true), new Utils.TextParam("expires", true), new Utils.UnionParam("audience", true, [new Utils.VoidParam("public"), new Utils.VoidParam("team"), new Utils.VoidParam("no_one"), new Utils.VoidParam("password"), new Utils.VoidParam("members")]), new Utils.UnionParam("access", true, [new Utils.VoidParam("viewer"), new Utils.VoidParam("editor"), new Utils.VoidParam("max")])])
    );
    const sharing_get_file_metadata_endpt = new Utils.Endpoint("sharing", "get_file_metadata",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.read",
        },
        new Utils.TextParam("file", false),
        new Utils.ListParam("actions", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("disable_viewer_info"), new Utils.VoidParam("edit_contents"), new Utils.VoidParam("enable_viewer_info"), new Utils.VoidParam("invite_viewer"), new Utils.VoidParam("invite_viewer_no_comment"), new Utils.VoidParam("invite_editor"), new Utils.VoidParam("unshare"), new Utils.VoidParam("relinquish_membership"), new Utils.VoidParam("share_link"), new Utils.VoidParam("create_link"), new Utils.VoidParam("create_view_link"), new Utils.VoidParam("create_edit_link")]))
    );
    const sharing_get_file_metadata_batch_endpt = new Utils.Endpoint("sharing", "get_file_metadata/batch",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.read",
        },
        new Utils.ListParam("files", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false)),
        new Utils.ListParam("actions", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("disable_viewer_info"), new Utils.VoidParam("edit_contents"), new Utils.VoidParam("enable_viewer_info"), new Utils.VoidParam("invite_viewer"), new Utils.VoidParam("invite_viewer_no_comment"), new Utils.VoidParam("invite_editor"), new Utils.VoidParam("unshare"), new Utils.VoidParam("relinquish_membership"), new Utils.VoidParam("share_link"), new Utils.VoidParam("create_link"), new Utils.VoidParam("create_view_link"), new Utils.VoidParam("create_edit_link")]))
    );
    const sharing_get_folder_metadata_endpt = new Utils.Endpoint("sharing", "get_folder_metadata",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "whole_team",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.read",
        },
        new Utils.TextParam("shared_folder_id", false),
        new Utils.ListParam("actions", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("change_options"), new Utils.VoidParam("disable_viewer_info"), new Utils.VoidParam("edit_contents"), new Utils.VoidParam("enable_viewer_info"), new Utils.VoidParam("invite_editor"), new Utils.VoidParam("invite_viewer"), new Utils.VoidParam("invite_viewer_no_comment"), new Utils.VoidParam("relinquish_membership"), new Utils.VoidParam("unmount"), new Utils.VoidParam("unshare"), new Utils.VoidParam("leave_a_copy"), new Utils.VoidParam("share_link"), new Utils.VoidParam("create_link"), new Utils.VoidParam("set_access_inheritance")]))
    );
    const sharing_get_shared_link_file_endpt = new Utils.Endpoint("sharing", "get_shared_link_file",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "download",
            auth: "user",
            host: "content",
            scope: "sharing.read",
        },
        new Utils.TextParam("url", false),
        new Utils.TextParam("path", true),
        new Utils.TextParam("link_password", true)
    );
    const sharing_get_shared_link_metadata_endpt = new Utils.Endpoint("sharing", "get_shared_link_metadata",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.read",
        },
        new Utils.TextParam("url", false),
        new Utils.TextParam("path", true),
        new Utils.TextParam("link_password", true)
    );
    const sharing_list_file_members_endpt = new Utils.Endpoint("sharing", "list_file_members",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.read",
        },
        new Utils.TextParam("file", false),
        new Utils.ListParam("actions", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("leave_a_copy"), new Utils.VoidParam("make_editor"), new Utils.VoidParam("make_owner"), new Utils.VoidParam("make_viewer"), new Utils.VoidParam("make_viewer_no_comment"), new Utils.VoidParam("remove")])),
        new Utils.BoolParam("include_inherited", true),
        new Utils.IntParam("limit", true)
    );
    const sharing_list_file_members_batch_endpt = new Utils.Endpoint("sharing", "list_file_members/batch",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.read",
        },
        new Utils.ListParam("files", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false)),
        new Utils.IntParam("limit", true)
    );
    const sharing_list_file_members_continue_endpt = new Utils.Endpoint("sharing", "list_file_members/continue",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.read",
        },
        new Utils.TextParam("cursor", false)
    );
    const sharing_list_folder_members_endpt = new Utils.Endpoint("sharing", "list_folder_members",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "whole_team",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.read",
        },
        new Utils.TextParam("shared_folder_id", false),
        new Utils.ListParam("actions", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("leave_a_copy"), new Utils.VoidParam("make_editor"), new Utils.VoidParam("make_owner"), new Utils.VoidParam("make_viewer"), new Utils.VoidParam("make_viewer_no_comment"), new Utils.VoidParam("remove")])),
        new Utils.IntParam("limit", true)
    );
    const sharing_list_folder_members_continue_endpt = new Utils.Endpoint("sharing", "list_folder_members/continue",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "whole_team",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.read",
        },
        new Utils.TextParam("cursor", false)
    );
    const sharing_list_folders_endpt = new Utils.Endpoint("sharing", "list_folders",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.read",
        },
        new Utils.IntParam("limit", true),
        new Utils.ListParam("actions", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("change_options"), new Utils.VoidParam("disable_viewer_info"), new Utils.VoidParam("edit_contents"), new Utils.VoidParam("enable_viewer_info"), new Utils.VoidParam("invite_editor"), new Utils.VoidParam("invite_viewer"), new Utils.VoidParam("invite_viewer_no_comment"), new Utils.VoidParam("relinquish_membership"), new Utils.VoidParam("unmount"), new Utils.VoidParam("unshare"), new Utils.VoidParam("leave_a_copy"), new Utils.VoidParam("share_link"), new Utils.VoidParam("create_link"), new Utils.VoidParam("set_access_inheritance")]))
    );
    const sharing_list_folders_continue_endpt = new Utils.Endpoint("sharing", "list_folders/continue",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.read",
        },
        new Utils.TextParam("cursor", false)
    );
    const sharing_list_mountable_folders_endpt = new Utils.Endpoint("sharing", "list_mountable_folders",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.read",
        },
        new Utils.IntParam("limit", true),
        new Utils.ListParam("actions", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("change_options"), new Utils.VoidParam("disable_viewer_info"), new Utils.VoidParam("edit_contents"), new Utils.VoidParam("enable_viewer_info"), new Utils.VoidParam("invite_editor"), new Utils.VoidParam("invite_viewer"), new Utils.VoidParam("invite_viewer_no_comment"), new Utils.VoidParam("relinquish_membership"), new Utils.VoidParam("unmount"), new Utils.VoidParam("unshare"), new Utils.VoidParam("leave_a_copy"), new Utils.VoidParam("share_link"), new Utils.VoidParam("create_link"), new Utils.VoidParam("set_access_inheritance")]))
    );
    const sharing_list_mountable_folders_continue_endpt = new Utils.Endpoint("sharing", "list_mountable_folders/continue",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.read",
        },
        new Utils.TextParam("cursor", false)
    );
    const sharing_list_received_files_endpt = new Utils.Endpoint("sharing", "list_received_files",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.read",
        },
        new Utils.IntParam("limit", true),
        new Utils.ListParam("actions", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("disable_viewer_info"), new Utils.VoidParam("edit_contents"), new Utils.VoidParam("enable_viewer_info"), new Utils.VoidParam("invite_viewer"), new Utils.VoidParam("invite_viewer_no_comment"), new Utils.VoidParam("invite_editor"), new Utils.VoidParam("unshare"), new Utils.VoidParam("relinquish_membership"), new Utils.VoidParam("share_link"), new Utils.VoidParam("create_link"), new Utils.VoidParam("create_view_link"), new Utils.VoidParam("create_edit_link")]))
    );
    const sharing_list_received_files_continue_endpt = new Utils.Endpoint("sharing", "list_received_files/continue",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.read",
        },
        new Utils.TextParam("cursor", false)
    );
    const sharing_list_shared_links_endpt = new Utils.Endpoint("sharing", "list_shared_links",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.read",
        },
        new Utils.TextParam("path", true),
        new Utils.TextParam("cursor", true),
        new Utils.BoolParam("direct_only", true)
    );
    const sharing_modify_shared_link_settings_endpt = new Utils.Endpoint("sharing", "modify_shared_link_settings",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.write",
        },
        new Utils.TextParam("url", false),
        new Utils.StructParam("settings", false, [new Utils.UnionParam("requested_visibility", true, [new Utils.VoidParam("public"), new Utils.VoidParam("team_only"), new Utils.VoidParam("password")]), new Utils.TextParam("link_password", true), new Utils.TextParam("expires", true), new Utils.UnionParam("audience", true, [new Utils.VoidParam("public"), new Utils.VoidParam("team"), new Utils.VoidParam("no_one"), new Utils.VoidParam("password"), new Utils.VoidParam("members")]), new Utils.UnionParam("access", true, [new Utils.VoidParam("viewer"), new Utils.VoidParam("editor"), new Utils.VoidParam("max")])]),
        new Utils.BoolParam("remove_expiration", true)
    );
    const sharing_mount_folder_endpt = new Utils.Endpoint("sharing", "mount_folder",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.write",
        },
        new Utils.TextParam("shared_folder_id", false)
    );
    const sharing_relinquish_file_membership_endpt = new Utils.Endpoint("sharing", "relinquish_file_membership",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.write",
        },
        new Utils.TextParam("file", false)
    );
    const sharing_relinquish_folder_membership_endpt = new Utils.Endpoint("sharing", "relinquish_folder_membership",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.write",
        },
        new Utils.TextParam("shared_folder_id", false),
        new Utils.BoolParam("leave_a_copy", true)
    );
    const sharing_remove_file_member_2_endpt = new Utils.Endpoint("sharing", "remove_file_member_2",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.write",
        },
        new Utils.TextParam("file", false),
        new Utils.UnionParam("member", false, [new Utils.TextParam("dropbox_id", false), new Utils.TextParam("email", false)])
    );
    const sharing_remove_folder_member_endpt = new Utils.Endpoint("sharing", "remove_folder_member",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.write",
        },
        new Utils.TextParam("shared_folder_id", false),
        new Utils.UnionParam("member", false, [new Utils.TextParam("dropbox_id", false), new Utils.TextParam("email", false)]),
        new Utils.BoolParam("leave_a_copy", false)
    );
    const sharing_revoke_shared_link_endpt = new Utils.Endpoint("sharing", "revoke_shared_link",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.write",
        },
        new Utils.TextParam("url", false)
    );
    const sharing_set_access_inheritance_endpt = new Utils.Endpoint("sharing", "set_access_inheritance",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.write",
        },
        new Utils.TextParam("shared_folder_id", false),
        new Utils.UnionParam("access_inheritance", true, [new Utils.VoidParam("inherit"), new Utils.VoidParam("no_inherit")])
    );
    const sharing_share_folder_endpt = new Utils.Endpoint("sharing", "share_folder",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.write",
        },
        new Utils.TextParam("path", false),
        new Utils.UnionParam("acl_update_policy", true, [new Utils.VoidParam("owner"), new Utils.VoidParam("editors")]),
        new Utils.BoolParam("force_async", true),
        new Utils.UnionParam("member_policy", true, [new Utils.VoidParam("team"), new Utils.VoidParam("anyone")]),
        new Utils.UnionParam("shared_link_policy", true, [new Utils.VoidParam("anyone"), new Utils.VoidParam("team"), new Utils.VoidParam("members")]),
        new Utils.UnionParam("viewer_info_policy", true, [new Utils.VoidParam("enabled"), new Utils.VoidParam("disabled")]),
        new Utils.UnionParam("access_inheritance", true, [new Utils.VoidParam("inherit"), new Utils.VoidParam("no_inherit")]),
        new Utils.ListParam("actions", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("change_options"), new Utils.VoidParam("disable_viewer_info"), new Utils.VoidParam("edit_contents"), new Utils.VoidParam("enable_viewer_info"), new Utils.VoidParam("invite_editor"), new Utils.VoidParam("invite_viewer"), new Utils.VoidParam("invite_viewer_no_comment"), new Utils.VoidParam("relinquish_membership"), new Utils.VoidParam("unmount"), new Utils.VoidParam("unshare"), new Utils.VoidParam("leave_a_copy"), new Utils.VoidParam("share_link"), new Utils.VoidParam("create_link"), new Utils.VoidParam("set_access_inheritance")])),
        new Utils.StructParam("link_settings", true, [new Utils.UnionParam("access_level", true, [new Utils.VoidParam("owner"), new Utils.VoidParam("editor"), new Utils.VoidParam("viewer"), new Utils.VoidParam("viewer_no_comment")]), new Utils.UnionParam("audience", true, [new Utils.VoidParam("public"), new Utils.VoidParam("team"), new Utils.VoidParam("no_one"), new Utils.VoidParam("password"), new Utils.VoidParam("members")]), new Utils.UnionParam("expiry", true, [new Utils.VoidParam("remove_expiry"), new Utils.TextParam("set_expiry", false)]), new Utils.UnionParam("password", true, [new Utils.VoidParam("remove_password"), new Utils.TextParam("set_password", false)])])
    );
    const sharing_transfer_folder_endpt = new Utils.Endpoint("sharing", "transfer_folder",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.write",
        },
        new Utils.TextParam("shared_folder_id", false),
        new Utils.TextParam("to_dropbox_id", false)
    );
    const sharing_unmount_folder_endpt = new Utils.Endpoint("sharing", "unmount_folder",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.write",
        },
        new Utils.TextParam("shared_folder_id", false)
    );
    const sharing_unshare_file_endpt = new Utils.Endpoint("sharing", "unshare_file",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.write",
        },
        new Utils.TextParam("file", false)
    );
    const sharing_unshare_folder_endpt = new Utils.Endpoint("sharing", "unshare_folder",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.write",
        },
        new Utils.TextParam("shared_folder_id", false),
        new Utils.BoolParam("leave_a_copy", true)
    );
    const sharing_update_file_member_endpt = new Utils.Endpoint("sharing", "update_file_member",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.write",
        },
        new Utils.TextParam("file", false),
        new Utils.UnionParam("member", false, [new Utils.TextParam("dropbox_id", false), new Utils.TextParam("email", false)]),
        new Utils.UnionParam("access_level", false, [new Utils.VoidParam("owner"), new Utils.VoidParam("editor"), new Utils.VoidParam("viewer"), new Utils.VoidParam("viewer_no_comment")])
    );
    const sharing_update_folder_member_endpt = new Utils.Endpoint("sharing", "update_folder_member",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.write",
        },
        new Utils.TextParam("shared_folder_id", false),
        new Utils.UnionParam("member", false, [new Utils.TextParam("dropbox_id", false), new Utils.TextParam("email", false)]),
        new Utils.UnionParam("access_level", false, [new Utils.VoidParam("owner"), new Utils.VoidParam("editor"), new Utils.VoidParam("viewer"), new Utils.VoidParam("viewer_no_comment")])
    );
    const sharing_update_folder_policy_endpt = new Utils.Endpoint("sharing", "update_folder_policy",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "team_admin",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.write",
        },
        new Utils.TextParam("shared_folder_id", false),
        new Utils.UnionParam("member_policy", true, [new Utils.VoidParam("team"), new Utils.VoidParam("anyone")]),
        new Utils.UnionParam("acl_update_policy", true, [new Utils.VoidParam("owner"), new Utils.VoidParam("editors")]),
        new Utils.UnionParam("viewer_info_policy", true, [new Utils.VoidParam("enabled"), new Utils.VoidParam("disabled")]),
        new Utils.UnionParam("shared_link_policy", true, [new Utils.VoidParam("anyone"), new Utils.VoidParam("team"), new Utils.VoidParam("members")]),
        new Utils.StructParam("link_settings", true, [new Utils.UnionParam("access_level", true, [new Utils.VoidParam("owner"), new Utils.VoidParam("editor"), new Utils.VoidParam("viewer"), new Utils.VoidParam("viewer_no_comment")]), new Utils.UnionParam("audience", true, [new Utils.VoidParam("public"), new Utils.VoidParam("team"), new Utils.VoidParam("no_one"), new Utils.VoidParam("password"), new Utils.VoidParam("members")]), new Utils.UnionParam("expiry", true, [new Utils.VoidParam("remove_expiry"), new Utils.TextParam("set_expiry", false)]), new Utils.UnionParam("password", true, [new Utils.VoidParam("remove_password"), new Utils.TextParam("set_password", false)])]),
        new Utils.ListParam("actions", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("change_options"), new Utils.VoidParam("disable_viewer_info"), new Utils.VoidParam("edit_contents"), new Utils.VoidParam("enable_viewer_info"), new Utils.VoidParam("invite_editor"), new Utils.VoidParam("invite_viewer"), new Utils.VoidParam("invite_viewer_no_comment"), new Utils.VoidParam("relinquish_membership"), new Utils.VoidParam("unmount"), new Utils.VoidParam("unshare"), new Utils.VoidParam("leave_a_copy"), new Utils.VoidParam("share_link"), new Utils.VoidParam("create_link"), new Utils.VoidParam("set_access_inheritance")]))
    );
    const team_devices_list_member_devices_endpt = new Utils.Endpoint("team", "devices/list_member_devices",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "sessions.list",
        },
        new Utils.TextParam("team_member_id", false),
        new Utils.BoolParam("include_web_sessions", true),
        new Utils.BoolParam("include_desktop_clients", true),
        new Utils.BoolParam("include_mobile_clients", true)
    );
    const team_devices_list_members_devices_endpt = new Utils.Endpoint("team", "devices/list_members_devices",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "sessions.list",
        },
        new Utils.TextParam("cursor", true),
        new Utils.BoolParam("include_web_sessions", true),
        new Utils.BoolParam("include_desktop_clients", true),
        new Utils.BoolParam("include_mobile_clients", true)
    );
    const team_devices_revoke_device_session_endpt = new Utils.Endpoint("team", "devices/revoke_device_session",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "sessions.modify",
        },
        new Utils.RootUnionParam('', false, [new Utils.StructParam("web_session", false, [new Utils.TextParam("session_id", false), new Utils.TextParam("team_member_id", false)]), new Utils.StructParam("desktop_client", false, [new Utils.TextParam("session_id", false), new Utils.TextParam("team_member_id", false), new Utils.BoolParam("delete_on_unlink", true)]), new Utils.StructParam("mobile_client", false, [new Utils.TextParam("session_id", false), new Utils.TextParam("team_member_id", false)])])
    );
    const team_devices_revoke_device_session_batch_endpt = new Utils.Endpoint("team", "devices/revoke_device_session_batch",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "sessions.modify",
        },
        new Utils.ListParam("revoke_devices", false, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.StructParam("web_session", false, [new Utils.TextParam("session_id", false), new Utils.TextParam("team_member_id", false)]), new Utils.StructParam("desktop_client", false, [new Utils.TextParam("session_id", false), new Utils.TextParam("team_member_id", false), new Utils.BoolParam("delete_on_unlink", true)]), new Utils.StructParam("mobile_client", false, [new Utils.TextParam("session_id", false), new Utils.TextParam("team_member_id", false)])]))
    );
    const team_features_get_values_endpt = new Utils.Endpoint("team", "features/get_values",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_info.read",
        },
        new Utils.ListParam("features", false, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("upload_api_rate_limit"), new Utils.VoidParam("has_team_shared_dropbox"), new Utils.VoidParam("has_team_file_events"), new Utils.VoidParam("has_team_selective_sync")]))
    );
    const team_get_info_endpt = new Utils.Endpoint("team", "get_info",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_info.read",
        }
    );
    const team_groups_create_endpt = new Utils.Endpoint("team", "groups/create",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "groups.write",
        },
        new Utils.TextParam("group_name", false),
        new Utils.BoolParam("add_creator_as_owner", true),
        new Utils.TextParam("group_external_id", true),
        new Utils.UnionParam("group_management_type", true, [new Utils.VoidParam("user_managed"), new Utils.VoidParam("company_managed"), new Utils.VoidParam("system_managed")])
    );
    const team_groups_delete_endpt = new Utils.Endpoint("team", "groups/delete",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "groups.write",
        },
        new Utils.RootUnionParam('', false, [new Utils.TextParam("group_id", false), new Utils.TextParam("group_external_id", false)])
    );
    const team_groups_get_info_endpt = new Utils.Endpoint("team", "groups/get_info",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "groups.read",
        },
        new Utils.RootUnionParam('', false, [new Utils.ListParam("group_ids", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false)), new Utils.ListParam("group_external_ids", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false))])
    );
    const team_groups_job_status_get_endpt = new Utils.Endpoint("team", "groups/job_status/get",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "groups.write",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const team_groups_list_endpt = new Utils.Endpoint("team", "groups/list",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "groups.read",
        },
        new Utils.IntParam("limit", true)
    );
    const team_groups_list_continue_endpt = new Utils.Endpoint("team", "groups/list/continue",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "groups.read",
        },
        new Utils.TextParam("cursor", false)
    );
    const team_groups_members_add_endpt = new Utils.Endpoint("team", "groups/members/add",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "groups.write",
        },
        new Utils.UnionParam("group", false, [new Utils.TextParam("group_id", false), new Utils.TextParam("group_external_id", false)]),
        new Utils.ListParam("members", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]), new Utils.UnionParam("access_type", false, [new Utils.VoidParam("member"), new Utils.VoidParam("owner")])])),
        new Utils.BoolParam("return_members", true)
    );
    const team_groups_members_list_endpt = new Utils.Endpoint("team", "groups/members/list",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "groups.read",
        },
        new Utils.UnionParam("group", false, [new Utils.TextParam("group_id", false), new Utils.TextParam("group_external_id", false)]),
        new Utils.IntParam("limit", true)
    );
    const team_groups_members_list_continue_endpt = new Utils.Endpoint("team", "groups/members/list/continue",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "groups.read",
        },
        new Utils.TextParam("cursor", false)
    );
    const team_groups_members_remove_endpt = new Utils.Endpoint("team", "groups/members/remove",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "groups.write",
        },
        new Utils.UnionParam("group", false, [new Utils.TextParam("group_id", false), new Utils.TextParam("group_external_id", false)]),
        new Utils.ListParam("users", false, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)])),
        new Utils.BoolParam("return_members", true)
    );
    const team_groups_members_set_access_type_endpt = new Utils.Endpoint("team", "groups/members/set_access_type",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "groups.write",
        },
        new Utils.UnionParam("group", false, [new Utils.TextParam("group_id", false), new Utils.TextParam("group_external_id", false)]),
        new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]),
        new Utils.UnionParam("access_type", false, [new Utils.VoidParam("member"), new Utils.VoidParam("owner")]),
        new Utils.BoolParam("return_members", true)
    );
    const team_groups_update_endpt = new Utils.Endpoint("team", "groups/update",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "groups.write",
        },
        new Utils.UnionParam("group", false, [new Utils.TextParam("group_id", false), new Utils.TextParam("group_external_id", false)]),
        new Utils.BoolParam("return_members", true),
        new Utils.TextParam("new_group_name", true),
        new Utils.TextParam("new_group_external_id", true),
        new Utils.UnionParam("new_group_management_type", true, [new Utils.VoidParam("user_managed"), new Utils.VoidParam("company_managed"), new Utils.VoidParam("system_managed")])
    );
    const team_legal_holds_create_policy_endpt = new Utils.Endpoint("team", "legal_holds/create_policy",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_data.member",
        },
        new Utils.TextParam("name", false),
        new Utils.ListParam("members", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false)),
        new Utils.TextParam("description", true),
        new Utils.TextParam("start_date", true),
        new Utils.TextParam("end_date", true)
    );
    const team_legal_holds_get_policy_endpt = new Utils.Endpoint("team", "legal_holds/get_policy",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_data.member",
        },
        new Utils.TextParam("id", false)
    );
    const team_legal_holds_list_held_revisions_endpt = new Utils.Endpoint("team", "legal_holds/list_held_revisions",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_data.member",
        },
        new Utils.TextParam("id", false)
    );
    const team_legal_holds_list_held_revisions_continue_endpt = new Utils.Endpoint("team", "legal_holds/list_held_revisions_continue",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_data.member",
        },
        new Utils.TextParam("id", false),
        new Utils.TextParam("cursor", true)
    );
    const team_legal_holds_list_policies_endpt = new Utils.Endpoint("team", "legal_holds/list_policies",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_data.member",
        },
        new Utils.BoolParam("include_released", true)
    );
    const team_legal_holds_release_policy_endpt = new Utils.Endpoint("team", "legal_holds/release_policy",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_data.member",
        },
        new Utils.TextParam("id", false)
    );
    const team_legal_holds_update_policy_endpt = new Utils.Endpoint("team", "legal_holds/update_policy",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_data.member",
        },
        new Utils.TextParam("id", false),
        new Utils.ListParam("members", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false)),
        new Utils.TextParam("name", true),
        new Utils.TextParam("description", true)
    );
    const team_linked_apps_list_member_linked_apps_endpt = new Utils.Endpoint("team", "linked_apps/list_member_linked_apps",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "sessions.list",
        },
        new Utils.TextParam("team_member_id", false)
    );
    const team_linked_apps_list_members_linked_apps_endpt = new Utils.Endpoint("team", "linked_apps/list_members_linked_apps",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "sessions.list",
        },
        new Utils.TextParam("cursor", true)
    );
    const team_linked_apps_revoke_linked_app_endpt = new Utils.Endpoint("team", "linked_apps/revoke_linked_app",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "sessions.modify",
        },
        new Utils.TextParam("app_id", false),
        new Utils.TextParam("team_member_id", false),
        new Utils.BoolParam("keep_app_folder", true)
    );
    const team_linked_apps_revoke_linked_app_batch_endpt = new Utils.Endpoint("team", "linked_apps/revoke_linked_app_batch",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "sessions.modify",
        },
        new Utils.ListParam("revoke_linked_app", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("app_id", false), new Utils.TextParam("team_member_id", false), new Utils.BoolParam("keep_app_folder", true)]))
    );
    const team_member_space_limits_excluded_users_add_endpt = new Utils.Endpoint("team", "member_space_limits/excluded_users/add",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.write",
        },
        new Utils.ListParam("users", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]))
    );
    const team_member_space_limits_excluded_users_list_endpt = new Utils.Endpoint("team", "member_space_limits/excluded_users/list",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.read",
        },
        new Utils.IntParam("limit", true)
    );
    const team_member_space_limits_excluded_users_list_continue_endpt = new Utils.Endpoint("team", "member_space_limits/excluded_users/list/continue",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.read",
        },
        new Utils.TextParam("cursor", false)
    );
    const team_member_space_limits_excluded_users_remove_endpt = new Utils.Endpoint("team", "member_space_limits/excluded_users/remove",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.write",
        },
        new Utils.ListParam("users", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]))
    );
    const team_member_space_limits_get_custom_quota_endpt = new Utils.Endpoint("team", "member_space_limits/get_custom_quota",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.read",
        },
        new Utils.ListParam("users", false, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]))
    );
    const team_member_space_limits_remove_custom_quota_endpt = new Utils.Endpoint("team", "member_space_limits/remove_custom_quota",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.write",
        },
        new Utils.ListParam("users", false, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]))
    );
    const team_member_space_limits_set_custom_quota_endpt = new Utils.Endpoint("team", "member_space_limits/set_custom_quota",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.read",
        },
        new Utils.ListParam("users_and_quotas", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]), new Utils.IntParam("quota_gb", false)]))
    );
    const team_members_add_endpt = new Utils.Endpoint("team", "members/add",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.write",
        },
        new Utils.ListParam("new_members", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("member_email", false), new Utils.TextParam("member_given_name", true), new Utils.TextParam("member_surname", true), new Utils.TextParam("member_external_id", true), new Utils.TextParam("member_persistent_id", true), new Utils.BoolParam("send_welcome_email", true), new Utils.UnionParam("role", true, [new Utils.VoidParam("team_admin"), new Utils.VoidParam("user_management_admin"), new Utils.VoidParam("support_admin"), new Utils.VoidParam("member_only")]), new Utils.BoolParam("is_directory_restricted", true)])),
        new Utils.BoolParam("force_async", true)
    );
    const team_members_add_job_status_get_endpt = new Utils.Endpoint("team", "members/add/job_status/get",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.write",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const team_members_delete_profile_photo_endpt = new Utils.Endpoint("team", "members/delete_profile_photo",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.write",
        },
        new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)])
    );
    const team_members_get_info_endpt = new Utils.Endpoint("team", "members/get_info",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.read",
        },
        new Utils.ListParam("members", false, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]))
    );
    const team_members_list_endpt = new Utils.Endpoint("team", "members/list",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.read",
        },
        new Utils.IntParam("limit", true),
        new Utils.BoolParam("include_removed", true)
    );
    const team_members_list_continue_endpt = new Utils.Endpoint("team", "members/list/continue",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.read",
        },
        new Utils.TextParam("cursor", false)
    );
    const team_members_move_former_member_files_endpt = new Utils.Endpoint("team", "members/move_former_member_files",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.write",
        },
        new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]),
        new Utils.UnionParam("transfer_dest_id", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]),
        new Utils.UnionParam("transfer_admin_id", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)])
    );
    const team_members_move_former_member_files_job_status_check_endpt = new Utils.Endpoint("team", "members/move_former_member_files/job_status/check",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.write",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const team_members_recover_endpt = new Utils.Endpoint("team", "members/recover",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.delete",
        },
        new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)])
    );
    const team_members_remove_endpt = new Utils.Endpoint("team", "members/remove",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.delete",
        },
        new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]),
        new Utils.BoolParam("wipe_data", true),
        new Utils.UnionParam("transfer_dest_id", true, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]),
        new Utils.UnionParam("transfer_admin_id", true, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]),
        new Utils.BoolParam("keep_account", true),
        new Utils.BoolParam("retain_team_shares", true)
    );
    const team_members_remove_job_status_get_endpt = new Utils.Endpoint("team", "members/remove/job_status/get",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.delete",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const team_members_secondary_emails_add_endpt = new Utils.Endpoint("team", "members/secondary_emails/add",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "True",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.write",
        },
        new Utils.ListParam("new_secondary_emails", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]), new Utils.ListParam("secondary_emails", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false))]))
    );
    const team_members_secondary_emails_delete_endpt = new Utils.Endpoint("team", "members/secondary_emails/delete",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "True",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.write",
        },
        new Utils.ListParam("emails_to_delete", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]), new Utils.ListParam("secondary_emails", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false))]))
    );
    const team_members_secondary_emails_resend_verification_emails_endpt = new Utils.Endpoint("team", "members/secondary_emails/resend_verification_emails",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "True",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.write",
        },
        new Utils.ListParam("emails_to_resend", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]), new Utils.ListParam("secondary_emails", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false))]))
    );
    const team_members_send_welcome_email_endpt = new Utils.Endpoint("team", "members/send_welcome_email",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.write",
        },
        new Utils.RootUnionParam('', false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)])
    );
    const team_members_set_admin_permissions_endpt = new Utils.Endpoint("team", "members/set_admin_permissions",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.write",
        },
        new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]),
        new Utils.UnionParam("new_role", false, [new Utils.VoidParam("team_admin"), new Utils.VoidParam("user_management_admin"), new Utils.VoidParam("support_admin"), new Utils.VoidParam("member_only")])
    );
    const team_members_set_profile_endpt = new Utils.Endpoint("team", "members/set_profile",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.write",
        },
        new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]),
        new Utils.TextParam("new_email", true),
        new Utils.TextParam("new_external_id", true),
        new Utils.TextParam("new_given_name", true),
        new Utils.TextParam("new_surname", true),
        new Utils.TextParam("new_persistent_id", true),
        new Utils.BoolParam("new_is_directory_restricted", true)
    );
    const team_members_set_profile_photo_endpt = new Utils.Endpoint("team", "members/set_profile_photo",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.write",
        },
        new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]),
        new Utils.UnionParam("photo", false, [new Utils.TextParam("base64_data", false)])
    );
    const team_members_suspend_endpt = new Utils.Endpoint("team", "members/suspend",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.write",
        },
        new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]),
        new Utils.BoolParam("wipe_data", true)
    );
    const team_members_unsuspend_endpt = new Utils.Endpoint("team", "members/unsuspend",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "members.write",
        },
        new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)])
    );
    const team_namespaces_list_endpt = new Utils.Endpoint("team", "namespaces/list",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_data.member",
        },
        new Utils.IntParam("limit", true)
    );
    const team_namespaces_list_continue_endpt = new Utils.Endpoint("team", "namespaces/list/continue",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_data.member",
        },
        new Utils.TextParam("cursor", false)
    );
    const team_reports_get_activity_endpt = new Utils.Endpoint("team", "reports/get_activity",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_info.read",
        },
        new Utils.TextParam("start_date", true),
        new Utils.TextParam("end_date", true)
    );
    const team_reports_get_devices_endpt = new Utils.Endpoint("team", "reports/get_devices",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_info.read",
        },
        new Utils.TextParam("start_date", true),
        new Utils.TextParam("end_date", true)
    );
    const team_reports_get_membership_endpt = new Utils.Endpoint("team", "reports/get_membership",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_info.read",
        },
        new Utils.TextParam("start_date", true),
        new Utils.TextParam("end_date", true)
    );
    const team_reports_get_storage_endpt = new Utils.Endpoint("team", "reports/get_storage",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_info.read",
        },
        new Utils.TextParam("start_date", true),
        new Utils.TextParam("end_date", true)
    );
    const team_team_folder_activate_endpt = new Utils.Endpoint("team", "team_folder/activate",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_data.team_space",
        },
        new Utils.TextParam("team_folder_id", false)
    );
    const team_team_folder_archive_endpt = new Utils.Endpoint("team", "team_folder/archive",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_data.team_space",
        },
        new Utils.TextParam("team_folder_id", false),
        new Utils.BoolParam("force_async_off", true)
    );
    const team_team_folder_archive_check_endpt = new Utils.Endpoint("team", "team_folder/archive/check",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_data.team_space",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const team_team_folder_create_endpt = new Utils.Endpoint("team", "team_folder/create",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_data.team_space",
        },
        new Utils.TextParam("name", false),
        new Utils.UnionParam("sync_setting", true, [new Utils.VoidParam("default"), new Utils.VoidParam("not_synced")])
    );
    const team_team_folder_get_info_endpt = new Utils.Endpoint("team", "team_folder/get_info",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_data.team_space",
        },
        new Utils.ListParam("team_folder_ids", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false))
    );
    const team_team_folder_list_endpt = new Utils.Endpoint("team", "team_folder/list",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_data.team_space",
        },
        new Utils.IntParam("limit", true)
    );
    const team_team_folder_list_continue_endpt = new Utils.Endpoint("team", "team_folder/list/continue",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_data.team_space",
        },
        new Utils.TextParam("cursor", false)
    );
    const team_team_folder_permanently_delete_endpt = new Utils.Endpoint("team", "team_folder/permanently_delete",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_data.team_space",
        },
        new Utils.TextParam("team_folder_id", false)
    );
    const team_team_folder_rename_endpt = new Utils.Endpoint("team", "team_folder/rename",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_data.team_space",
        },
        new Utils.TextParam("team_folder_id", false),
        new Utils.TextParam("name", false)
    );
    const team_team_folder_update_sync_settings_endpt = new Utils.Endpoint("team", "team_folder/update_sync_settings",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_data.team_space",
        },
        new Utils.TextParam("team_folder_id", false),
        new Utils.UnionParam("sync_setting", true, [new Utils.VoidParam("default"), new Utils.VoidParam("not_synced")]),
        new Utils.ListParam("content_sync_settings", true, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("id", false), new Utils.UnionParam("sync_setting", false, [new Utils.VoidParam("default"), new Utils.VoidParam("not_synced")])]))
    );
    const team_token_get_authenticated_admin_endpt = new Utils.Endpoint("team", "token/get_authenticated_admin",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "team_info.read",
        }
    );
    const team_log_get_events_endpt = new Utils.Endpoint("team_log", "get_events",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "events.read",
        },
        new Utils.IntParam("limit", true),
        new Utils.TextParam("account_id", true),
        new Utils.StructParam("time", true, [new Utils.TextParam("start_time", true), new Utils.TextParam("end_time", true)]),
        new Utils.UnionParam("category", true, [new Utils.VoidParam("apps"), new Utils.VoidParam("comments"), new Utils.VoidParam("devices"), new Utils.VoidParam("domains"), new Utils.VoidParam("file_operations"), new Utils.VoidParam("file_requests"), new Utils.VoidParam("groups"), new Utils.VoidParam("legal_holds"), new Utils.VoidParam("logins"), new Utils.VoidParam("members"), new Utils.VoidParam("paper"), new Utils.VoidParam("passwords"), new Utils.VoidParam("reports"), new Utils.VoidParam("sharing"), new Utils.VoidParam("showcase"), new Utils.VoidParam("sso"), new Utils.VoidParam("team_folders"), new Utils.VoidParam("team_policies"), new Utils.VoidParam("team_profile"), new Utils.VoidParam("tfa"), new Utils.VoidParam("trusted_teams")])
    );
    const team_log_get_events_continue_endpt = new Utils.Endpoint("team_log", "get_events/continue",
        {
            allow_app_folder_app: "False",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "team",
            host: "api",
            scope: "events.read",
        },
        new Utils.TextParam("cursor", false)
    );
    const users_features_get_values_endpt = new Utils.Endpoint("users", "features/get_values",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "account_info.read",
        },
        new Utils.ListParam("features", false, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("paper_as_files"), new Utils.VoidParam("file_locking")]))
    );
    const users_get_account_endpt = new Utils.Endpoint("users", "get_account",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.read",
        },
        new Utils.TextParam("account_id", false)
    );
    const users_get_account_batch_endpt = new Utils.Endpoint("users", "get_account_batch",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "sharing.read",
        },
        new Utils.ListParam("account_ids", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false))
    );
    const users_get_current_account_endpt = new Utils.Endpoint("users", "get_current_account",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "whole_team",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "account_info.read",
        }
    );
    const users_get_space_usage_endpt = new Utils.Endpoint("users", "get_space_usage",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "None",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "account_info.read",
        }
    );

    export const endpointList: Utils.Endpoint[] = [account_set_profile_photo_endpt,
                                                   auth_token_from_oauth1_endpt,
                                                   auth_token_revoke_endpt,
                                                   check_app_endpt,
                                                   check_user_endpt,
                                                   contacts_delete_manual_contacts_endpt,
                                                   contacts_delete_manual_contacts_batch_endpt,
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
                                                   file_requests_count_endpt,
                                                   file_requests_create_endpt,
                                                   file_requests_delete_endpt,
                                                   file_requests_delete_all_closed_endpt,
                                                   file_requests_get_endpt,
                                                   file_requests_list_v2_endpt,
                                                   file_requests_list_endpt,
                                                   file_requests_list_continue_endpt,
                                                   file_requests_update_endpt,
                                                   files_copy_v2_endpt,
                                                   files_copy_batch_v2_endpt,
                                                   files_copy_batch_check_v2_endpt,
                                                   files_copy_reference_get_endpt,
                                                   files_copy_reference_save_endpt,
                                                   files_create_folder_v2_endpt,
                                                   files_create_folder_batch_endpt,
                                                   files_create_folder_batch_check_endpt,
                                                   files_delete_v2_endpt,
                                                   files_delete_batch_endpt,
                                                   files_delete_batch_check_endpt,
                                                   files_download_endpt,
                                                   files_download_zip_endpt,
                                                   files_export_endpt,
                                                   files_get_file_lock_batch_endpt,
                                                   files_get_metadata_endpt,
                                                   files_get_preview_endpt,
                                                   files_get_temporary_link_endpt,
                                                   files_get_temporary_upload_link_endpt,
                                                   files_get_thumbnail_endpt,
                                                   files_get_thumbnail_v2_endpt,
                                                   files_get_thumbnail_batch_endpt,
                                                   files_list_folder_endpt,
                                                   files_list_folder_continue_endpt,
                                                   files_list_folder_get_latest_cursor_endpt,
                                                   files_list_folder_longpoll_endpt,
                                                   files_list_revisions_endpt,
                                                   files_lock_file_batch_endpt,
                                                   files_move_v2_endpt,
                                                   files_move_batch_v2_endpt,
                                                   files_move_batch_check_v2_endpt,
                                                   files_permanently_delete_endpt,
                                                   files_restore_endpt,
                                                   files_save_url_endpt,
                                                   files_save_url_check_job_status_endpt,
                                                   files_search_v2_endpt,
                                                   files_search_continue_v2_endpt,
                                                   files_unlock_file_batch_endpt,
                                                   files_upload_endpt,
                                                   files_upload_session_append_v2_endpt,
                                                   files_upload_session_finish_endpt,
                                                   files_upload_session_finish_batch_endpt,
                                                   files_upload_session_finish_batch_check_endpt,
                                                   files_upload_session_start_endpt,
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
                                                   team_legal_holds_create_policy_endpt,
                                                   team_legal_holds_get_policy_endpt,
                                                   team_legal_holds_list_held_revisions_endpt,
                                                   team_legal_holds_list_held_revisions_continue_endpt,
                                                   team_legal_holds_list_policies_endpt,
                                                   team_legal_holds_release_policy_endpt,
                                                   team_legal_holds_update_policy_endpt,
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
                                                   team_members_delete_profile_photo_endpt,
                                                   team_members_get_info_endpt,
                                                   team_members_list_endpt,
                                                   team_members_list_continue_endpt,
                                                   team_members_move_former_member_files_endpt,
                                                   team_members_move_former_member_files_job_status_check_endpt,
                                                   team_members_recover_endpt,
                                                   team_members_remove_endpt,
                                                   team_members_remove_job_status_get_endpt,
                                                   team_members_secondary_emails_add_endpt,
                                                   team_members_secondary_emails_delete_endpt,
                                                   team_members_secondary_emails_resend_verification_emails_endpt,
                                                   team_members_send_welcome_email_endpt,
                                                   team_members_set_admin_permissions_endpt,
                                                   team_members_set_profile_endpt,
                                                   team_members_set_profile_photo_endpt,
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
                                                   users_features_get_values_endpt,
                                                   users_get_account_endpt,
                                                   users_get_account_batch_endpt,
                                                   users_get_current_account_endpt,
                                                   users_get_space_usage_endpt];
}

export = Endpoints;

// Automatically generated code; do not edit

import * as Utils from './utils';

module Endpoints {
    const account_set_profile_photo_endpt = new Utils.Endpoint("account", "set_profile_photo",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "account_info.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.UnionParam("photo", false, [new Utils.TextParam("base64_data", false)])
    );
    const auth_token_from_oauth1_endpt = new Utils.Endpoint("auth", "token/from_oauth1",
        {
            auth: "app",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "None",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("oauth1_token", false),
        new Utils.TextParam("oauth1_token_secret", false)
    );
    const auth_token_revoke_endpt = new Utils.Endpoint("auth", "token/revoke",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "None",
            is_cloud_doc_auth: "False",
        }
    );
    const check_app_endpt = new Utils.Endpoint("check", "app",
        {
            auth: "app",
            host: "api",
            style: "rpc",
            is_preview: "True",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "None",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("query", true)
    );
    const check_user_endpt = new Utils.Endpoint("check", "user",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "True",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "account_info.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("query", true)
    );
    const contacts_delete_manual_contacts_endpt = new Utils.Endpoint("contacts", "delete_manual_contacts",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "contacts.write",
            is_cloud_doc_auth: "False",
        }
    );
    const contacts_delete_manual_contacts_batch_endpt = new Utils.Endpoint("contacts", "delete_manual_contacts_batch",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "contacts.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("email_addresses", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false))
    );
    const file_properties_properties_add_endpt = new Utils.Endpoint("file_properties", "properties/add",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "files.metadata.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("path", false),
        new Utils.ListParam("property_groups", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("template_id", false), new Utils.ListParam("fields", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("value", false)]))]))
    );
    const file_properties_properties_overwrite_endpt = new Utils.Endpoint("file_properties", "properties/overwrite",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "files.metadata.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("path", false),
        new Utils.ListParam("property_groups", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("template_id", false), new Utils.ListParam("fields", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("value", false)]))]))
    );
    const file_properties_properties_remove_endpt = new Utils.Endpoint("file_properties", "properties/remove",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "files.metadata.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("path", false),
        new Utils.ListParam("property_template_ids", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false))
    );
    const file_properties_properties_search_endpt = new Utils.Endpoint("file_properties", "properties/search",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "files.metadata.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("queries", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("query", false), new Utils.UnionParam("mode", false, [new Utils.TextParam("field_name", false)]), new Utils.UnionParam("logical_operator", true, [new Utils.VoidParam("or_operator")])])),
        new Utils.UnionParam("template_filter", true, [new Utils.ListParam("filter_some", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false)), new Utils.VoidParam("filter_none")])
    );
    const file_properties_properties_search_continue_endpt = new Utils.Endpoint("file_properties", "properties/search/continue",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "files.metadata.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("cursor", false)
    );
    const file_properties_properties_update_endpt = new Utils.Endpoint("file_properties", "properties/update",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "files.metadata.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("path", false),
        new Utils.ListParam("update_property_groups", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("template_id", false), new Utils.ListParam("add_or_update_fields", true, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("value", false)])), new Utils.ListParam("remove_fields", true, (index: string): Utils.Parameter => new Utils.TextParam(index, false))]))
    );
    const file_properties_templates_add_for_team_endpt = new Utils.Endpoint("file_properties", "templates/add_for_team",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "files.team_metadata.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("name", false),
        new Utils.TextParam("description", false),
        new Utils.ListParam("fields", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("description", false), new Utils.UnionParam("type", false, [new Utils.VoidParam("string")])]))
    );
    const file_properties_templates_add_for_user_endpt = new Utils.Endpoint("file_properties", "templates/add_for_user",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "files.metadata.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("name", false),
        new Utils.TextParam("description", false),
        new Utils.ListParam("fields", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("description", false), new Utils.UnionParam("type", false, [new Utils.VoidParam("string")])]))
    );
    const file_properties_templates_get_for_team_endpt = new Utils.Endpoint("file_properties", "templates/get_for_team",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "files.team_metadata.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("template_id", false)
    );
    const file_properties_templates_get_for_user_endpt = new Utils.Endpoint("file_properties", "templates/get_for_user",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "files.metadata.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("template_id", false)
    );
    const file_properties_templates_list_for_team_endpt = new Utils.Endpoint("file_properties", "templates/list_for_team",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "files.team_metadata.write",
            is_cloud_doc_auth: "False",
        }
    );
    const file_properties_templates_list_for_user_endpt = new Utils.Endpoint("file_properties", "templates/list_for_user",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "files.metadata.read",
            is_cloud_doc_auth: "False",
        }
    );
    const file_properties_templates_remove_for_team_endpt = new Utils.Endpoint("file_properties", "templates/remove_for_team",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "files.team_metadata.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("template_id", false)
    );
    const file_properties_templates_remove_for_user_endpt = new Utils.Endpoint("file_properties", "templates/remove_for_user",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "files.metadata.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("template_id", false)
    );
    const file_properties_templates_update_for_team_endpt = new Utils.Endpoint("file_properties", "templates/update_for_team",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "files.team_metadata.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("template_id", false),
        new Utils.TextParam("name", true),
        new Utils.TextParam("description", true),
        new Utils.ListParam("add_fields", true, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("description", false), new Utils.UnionParam("type", false, [new Utils.VoidParam("string")])]))
    );
    const file_properties_templates_update_for_user_endpt = new Utils.Endpoint("file_properties", "templates/update_for_user",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "files.metadata.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("template_id", false),
        new Utils.TextParam("name", true),
        new Utils.TextParam("description", true),
        new Utils.ListParam("add_fields", true, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("description", false), new Utils.UnionParam("type", false, [new Utils.VoidParam("string")])]))
    );
    const file_requests_count_endpt = new Utils.Endpoint("file_requests", "count",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "file_requests.read",
            is_cloud_doc_auth: "False",
        }
    );
    const file_requests_create_endpt = new Utils.Endpoint("file_requests", "create",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "file_requests.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("title", false),
        new Utils.TextParam("destination", false),
        new Utils.StructParam("deadline", true, [new Utils.TextParam("deadline", false), new Utils.UnionParam("allow_late_uploads", true, [new Utils.VoidParam("one_day"), new Utils.VoidParam("two_days"), new Utils.VoidParam("seven_days"), new Utils.VoidParam("thirty_days"), new Utils.VoidParam("always")])]),
        new Utils.BoolParam("open", true),
        new Utils.TextParam("description", true)
    );
    const file_requests_delete_endpt = new Utils.Endpoint("file_requests", "delete",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "file_requests.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("ids", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false))
    );
    const file_requests_delete_all_closed_endpt = new Utils.Endpoint("file_requests", "delete_all_closed",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "file_requests.write",
            is_cloud_doc_auth: "False",
        }
    );
    const file_requests_get_endpt = new Utils.Endpoint("file_requests", "get",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "file_requests.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("id", false)
    );
    const file_requests_list_v2_endpt = new Utils.Endpoint("file_requests", "list_v2",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "True",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "file_requests.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.IntParam("limit", true)
    );
    const file_requests_list_endpt = new Utils.Endpoint("file_requests", "list",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "file_requests.read",
            is_cloud_doc_auth: "False",
        }
    );
    const file_requests_list_continue_endpt = new Utils.Endpoint("file_requests", "list/continue",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "True",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "file_requests.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("cursor", false)
    );
    const file_requests_update_endpt = new Utils.Endpoint("file_requests", "update",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "file_requests.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("id", false),
        new Utils.TextParam("title", true),
        new Utils.TextParam("destination", true),
        new Utils.UnionParam("deadline", true, [new Utils.VoidParam("no_update"), new Utils.StructParam("update", true, [new Utils.TextParam("deadline", false), new Utils.UnionParam("allow_late_uploads", true, [new Utils.VoidParam("one_day"), new Utils.VoidParam("two_days"), new Utils.VoidParam("seven_days"), new Utils.VoidParam("thirty_days"), new Utils.VoidParam("always")])])]),
        new Utils.BoolParam("open", true),
        new Utils.TextParam("description", true)
    );
    const files_copy_v2_endpt = new Utils.Endpoint("files", "copy_v2",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "team_admin",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("from_path", false),
        new Utils.TextParam("to_path", false),
        new Utils.BoolParam("allow_shared_folder", true),
        new Utils.BoolParam("autorename", true),
        new Utils.BoolParam("allow_ownership_transfer", true)
    );
    const files_copy_batch_v2_endpt = new Utils.Endpoint("files", "copy_batch_v2",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "team_admin",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("entries", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("from_path", false), new Utils.TextParam("to_path", false)])),
        new Utils.BoolParam("autorename", true)
    );
    const files_copy_batch_check_v2_endpt = new Utils.Endpoint("files", "copy_batch/check_v2",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "team_admin",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const files_copy_reference_get_endpt = new Utils.Endpoint("files", "copy_reference/get",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("path", false)
    );
    const files_copy_reference_save_endpt = new Utils.Endpoint("files", "copy_reference/save",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("copy_reference", false),
        new Utils.TextParam("path", false)
    );
    const files_create_folder_v2_endpt = new Utils.Endpoint("files", "create_folder_v2",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "team_admin",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("path", false),
        new Utils.BoolParam("autorename", true)
    );
    const files_create_folder_batch_endpt = new Utils.Endpoint("files", "create_folder_batch",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "team_admin",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("paths", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false)),
        new Utils.BoolParam("autorename", true),
        new Utils.BoolParam("force_async", true)
    );
    const files_create_folder_batch_check_endpt = new Utils.Endpoint("files", "create_folder_batch/check",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "team_admin",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const files_delete_v2_endpt = new Utils.Endpoint("files", "delete_v2",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "team_admin",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("path", false),
        new Utils.TextParam("parent_rev", true)
    );
    const files_delete_batch_endpt = new Utils.Endpoint("files", "delete_batch",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "team_admin",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("entries", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("path", false), new Utils.TextParam("parent_rev", true)]))
    );
    const files_delete_batch_check_endpt = new Utils.Endpoint("files", "delete_batch/check",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "team_admin",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const files_download_endpt = new Utils.Endpoint("files", "download",
        {
            auth: "user",
            host: "content",
            style: "download",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "whole_team",
            scope: "files.content.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("path", false),
        new Utils.TextParam("rev", true)
    );
    const files_download_zip_endpt = new Utils.Endpoint("files", "download_zip",
        {
            auth: "user",
            host: "content",
            style: "download",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "files.content.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("path", false)
    );
    const files_export_endpt = new Utils.Endpoint("files", "export",
        {
            auth: "user",
            host: "content",
            style: "download",
            is_preview: "True",
            allow_app_folder_app: "True",
            select_admin_mode: "whole_team",
            scope: "files.content.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("path", false),
        new Utils.TextParam("export_format", true)
    );
    const files_get_file_lock_batch_endpt = new Utils.Endpoint("files", "get_file_lock_batch",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "files.content.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("entries", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("path", false)]))
    );
    const files_get_metadata_endpt = new Utils.Endpoint("files", "get_metadata",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "whole_team",
            scope: "files.metadata.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("path", false),
        new Utils.BoolParam("include_media_info", true),
        new Utils.BoolParam("include_deleted", true),
        new Utils.BoolParam("include_has_explicit_shared_members", true),
        new Utils.UnionParam("include_property_groups", true, [new Utils.ListParam("filter_some", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false))])
    );
    const files_get_preview_endpt = new Utils.Endpoint("files", "get_preview",
        {
            auth: "user",
            host: "content",
            style: "download",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "whole_team",
            scope: "files.content.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("path", false),
        new Utils.TextParam("rev", true)
    );
    const files_get_temporary_link_endpt = new Utils.Endpoint("files", "get_temporary_link",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "files.content.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("path", false)
    );
    const files_get_temporary_upload_link_endpt = new Utils.Endpoint("files", "get_temporary_upload_link",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.StructParam("commit_info", false, [new Utils.TextParam("path", false), new Utils.UnionParam("mode", true, [new Utils.VoidParam("add"), new Utils.VoidParam("overwrite"), new Utils.TextParam("update", false)]), new Utils.BoolParam("autorename", true), new Utils.TextParam("client_modified", true), new Utils.BoolParam("mute", true), new Utils.ListParam("property_groups", true, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("template_id", false), new Utils.ListParam("fields", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("value", false)]))])), new Utils.BoolParam("strict_conflict", true)]),
        new Utils.FloatParam("duration", true)
    );
    const files_get_thumbnail_endpt = new Utils.Endpoint("files", "get_thumbnail",
        {
            auth: "user",
            host: "content",
            style: "download",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "whole_team",
            scope: "files.content.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("path", false),
        new Utils.UnionParam("format", true, [new Utils.VoidParam("jpeg"), new Utils.VoidParam("png")]),
        new Utils.UnionParam("size", true, [new Utils.VoidParam("w32h32"), new Utils.VoidParam("w64h64"), new Utils.VoidParam("w128h128"), new Utils.VoidParam("w256h256"), new Utils.VoidParam("w480h320"), new Utils.VoidParam("w640h480"), new Utils.VoidParam("w960h640"), new Utils.VoidParam("w1024h768"), new Utils.VoidParam("w2048h1536")]),
        new Utils.UnionParam("mode", true, [new Utils.VoidParam("strict"), new Utils.VoidParam("bestfit"), new Utils.VoidParam("fitone_bestfit")])
    );
    const files_get_thumbnail_v2_endpt = new Utils.Endpoint("files", "get_thumbnail_v2",
        {
            auth: "app, user",
            host: "content",
            style: "download",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "whole_team",
            scope: "files.content.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.UnionParam("resource", false, [new Utils.TextParam("path", false), new Utils.StructParam("link", false, [new Utils.TextParam("url", false), new Utils.TextParam("path", true), new Utils.TextParam("password", true)])]),
        new Utils.UnionParam("format", true, [new Utils.VoidParam("jpeg"), new Utils.VoidParam("png")]),
        new Utils.UnionParam("size", true, [new Utils.VoidParam("w32h32"), new Utils.VoidParam("w64h64"), new Utils.VoidParam("w128h128"), new Utils.VoidParam("w256h256"), new Utils.VoidParam("w480h320"), new Utils.VoidParam("w640h480"), new Utils.VoidParam("w960h640"), new Utils.VoidParam("w1024h768"), new Utils.VoidParam("w2048h1536")]),
        new Utils.UnionParam("mode", true, [new Utils.VoidParam("strict"), new Utils.VoidParam("bestfit"), new Utils.VoidParam("fitone_bestfit")])
    );
    const files_get_thumbnail_batch_endpt = new Utils.Endpoint("files", "get_thumbnail_batch",
        {
            auth: "user",
            host: "content",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "whole_team",
            scope: "files.content.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("entries", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("path", false), new Utils.UnionParam("format", true, [new Utils.VoidParam("jpeg"), new Utils.VoidParam("png")]), new Utils.UnionParam("size", true, [new Utils.VoidParam("w32h32"), new Utils.VoidParam("w64h64"), new Utils.VoidParam("w128h128"), new Utils.VoidParam("w256h256"), new Utils.VoidParam("w480h320"), new Utils.VoidParam("w640h480"), new Utils.VoidParam("w960h640"), new Utils.VoidParam("w1024h768"), new Utils.VoidParam("w2048h1536")]), new Utils.UnionParam("mode", true, [new Utils.VoidParam("strict"), new Utils.VoidParam("bestfit"), new Utils.VoidParam("fitone_bestfit")])]))
    );
    const files_list_folder_endpt = new Utils.Endpoint("files", "list_folder",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "whole_team",
            scope: "files.metadata.read",
            is_cloud_doc_auth: "False",
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
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "whole_team",
            scope: "files.metadata.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("cursor", false)
    );
    const files_list_folder_get_latest_cursor_endpt = new Utils.Endpoint("files", "list_folder/get_latest_cursor",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "whole_team",
            scope: "files.metadata.read",
            is_cloud_doc_auth: "False",
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
            auth: "noauth",
            host: "notify",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "whole_team",
            scope: "files.metadata.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("cursor", false),
        new Utils.IntParam("timeout", true)
    );
    const files_list_revisions_endpt = new Utils.Endpoint("files", "list_revisions",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "whole_team",
            scope: "files.metadata.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("path", false),
        new Utils.UnionParam("mode", true, [new Utils.VoidParam("path"), new Utils.VoidParam("id")]),
        new Utils.IntParam("limit", true)
    );
    const files_lock_file_batch_endpt = new Utils.Endpoint("files", "lock_file_batch",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("entries", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("path", false)]))
    );
    const files_move_v2_endpt = new Utils.Endpoint("files", "move_v2",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "team_admin",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("from_path", false),
        new Utils.TextParam("to_path", false),
        new Utils.BoolParam("allow_shared_folder", true),
        new Utils.BoolParam("autorename", true),
        new Utils.BoolParam("allow_ownership_transfer", true)
    );
    const files_move_batch_v2_endpt = new Utils.Endpoint("files", "move_batch_v2",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "team_admin",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("entries", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("from_path", false), new Utils.TextParam("to_path", false)])),
        new Utils.BoolParam("autorename", true),
        new Utils.BoolParam("allow_ownership_transfer", true)
    );
    const files_move_batch_check_v2_endpt = new Utils.Endpoint("files", "move_batch/check_v2",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "team_admin",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const files_paper_create_endpt = new Utils.Endpoint("files", "paper/create",
        {
            auth: "user",
            host: "api",
            style: "upload",
            is_preview: "True",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.FileParam(),
        new Utils.TextParam("path", false),
        new Utils.UnionParam("import_format", false, [new Utils.VoidParam("html"), new Utils.VoidParam("markdown"), new Utils.VoidParam("plain_text")])
    );
    const files_paper_update_endpt = new Utils.Endpoint("files", "paper/update",
        {
            auth: "user",
            host: "api",
            style: "upload",
            is_preview: "True",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.FileParam(),
        new Utils.TextParam("path", false),
        new Utils.UnionParam("import_format", false, [new Utils.VoidParam("html"), new Utils.VoidParam("markdown"), new Utils.VoidParam("plain_text")]),
        new Utils.UnionParam("doc_update_policy", false, [new Utils.VoidParam("update"), new Utils.VoidParam("overwrite"), new Utils.VoidParam("prepend"), new Utils.VoidParam("append")]),
        new Utils.IntParam("paper_revision", true)
    );
    const files_permanently_delete_endpt = new Utils.Endpoint("files", "permanently_delete",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "team_admin",
            scope: "files.permanent_delete",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("path", false),
        new Utils.TextParam("parent_rev", true)
    );
    const files_restore_endpt = new Utils.Endpoint("files", "restore",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "team_admin",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("path", false),
        new Utils.TextParam("rev", false)
    );
    const files_save_url_endpt = new Utils.Endpoint("files", "save_url",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("path", false),
        new Utils.TextParam("url", false)
    );
    const files_save_url_check_job_status_endpt = new Utils.Endpoint("files", "save_url/check_job_status",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const files_search_v2_endpt = new Utils.Endpoint("files", "search_v2",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "files.metadata.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("query", false),
        new Utils.StructParam("options", true, [new Utils.TextParam("path", true), new Utils.IntParam("max_results", true), new Utils.UnionParam("order_by", true, [new Utils.VoidParam("relevance"), new Utils.VoidParam("last_modified_time")]), new Utils.UnionParam("file_status", true, [new Utils.VoidParam("active"), new Utils.VoidParam("deleted")]), new Utils.BoolParam("filename_only", true), new Utils.ListParam("file_extensions", true, (index: string): Utils.Parameter => new Utils.TextParam(index, false)), new Utils.ListParam("file_categories", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("image"), new Utils.VoidParam("document"), new Utils.VoidParam("pdf"), new Utils.VoidParam("spreadsheet"), new Utils.VoidParam("presentation"), new Utils.VoidParam("audio"), new Utils.VoidParam("video"), new Utils.VoidParam("folder"), new Utils.VoidParam("paper"), new Utils.VoidParam("others")]))]),
        new Utils.StructParam("match_field_options", true, [new Utils.BoolParam("include_highlights", true)]),
        new Utils.BoolParam("include_highlights", true)
    );
    const files_search_continue_v2_endpt = new Utils.Endpoint("files", "search/continue_v2",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "files.metadata.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("cursor", false)
    );
    const files_unlock_file_batch_endpt = new Utils.Endpoint("files", "unlock_file_batch",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "whole_team",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("entries", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("path", false)]))
    );
    const files_upload_endpt = new Utils.Endpoint("files", "upload",
        {
            auth: "user",
            host: "content",
            style: "upload",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "team_admin",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
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
            auth: "user",
            host: "content",
            style: "upload",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "team_admin",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.FileParam(),
        new Utils.StructParam("cursor", false, [new Utils.TextParam("session_id", false), new Utils.IntParam("offset", false)]),
        new Utils.BoolParam("close", true)
    );
    const files_upload_session_finish_endpt = new Utils.Endpoint("files", "upload_session/finish",
        {
            auth: "user",
            host: "content",
            style: "upload",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "team_admin",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.FileParam(),
        new Utils.StructParam("cursor", false, [new Utils.TextParam("session_id", false), new Utils.IntParam("offset", false)]),
        new Utils.StructParam("commit", false, [new Utils.TextParam("path", false), new Utils.UnionParam("mode", true, [new Utils.VoidParam("add"), new Utils.VoidParam("overwrite"), new Utils.TextParam("update", false)]), new Utils.BoolParam("autorename", true), new Utils.TextParam("client_modified", true), new Utils.BoolParam("mute", true), new Utils.ListParam("property_groups", true, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("template_id", false), new Utils.ListParam("fields", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("value", false)]))])), new Utils.BoolParam("strict_conflict", true)])
    );
    const files_upload_session_finish_batch_endpt = new Utils.Endpoint("files", "upload_session/finish_batch",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "team_admin",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("entries", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.StructParam("cursor", false, [new Utils.TextParam("session_id", false), new Utils.IntParam("offset", false)]), new Utils.StructParam("commit", false, [new Utils.TextParam("path", false), new Utils.UnionParam("mode", true, [new Utils.VoidParam("add"), new Utils.VoidParam("overwrite"), new Utils.TextParam("update", false)]), new Utils.BoolParam("autorename", true), new Utils.TextParam("client_modified", true), new Utils.BoolParam("mute", true), new Utils.ListParam("property_groups", true, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("template_id", false), new Utils.ListParam("fields", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("name", false), new Utils.TextParam("value", false)]))])), new Utils.BoolParam("strict_conflict", true)])]))
    );
    const files_upload_session_finish_batch_check_endpt = new Utils.Endpoint("files", "upload_session/finish_batch/check",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "team_admin",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const files_upload_session_start_endpt = new Utils.Endpoint("files", "upload_session/start",
        {
            auth: "user",
            host: "content",
            style: "upload",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "team_admin",
            scope: "files.content.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.FileParam(),
        new Utils.BoolParam("close", true),
        new Utils.UnionParam("session_type", true, [new Utils.VoidParam("sequential"), new Utils.VoidParam("concurrent")])
    );
    const sharing_add_file_member_endpt = new Utils.Endpoint("sharing", "add_file_member",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "team_admin",
            scope: "sharing.write",
            is_cloud_doc_auth: "False",
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
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "team_admin",
            scope: "sharing.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("shared_folder_id", false),
        new Utils.ListParam("members", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.UnionParam("member", false, [new Utils.TextParam("dropbox_id", false), new Utils.TextParam("email", false)]), new Utils.UnionParam("access_level", true, [new Utils.VoidParam("owner"), new Utils.VoidParam("editor"), new Utils.VoidParam("viewer"), new Utils.VoidParam("viewer_no_comment")])])),
        new Utils.BoolParam("quiet", true),
        new Utils.TextParam("custom_message", true)
    );
    const sharing_check_job_status_endpt = new Utils.Endpoint("sharing", "check_job_status",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "team_admin",
            scope: "sharing.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const sharing_check_remove_member_job_status_endpt = new Utils.Endpoint("sharing", "check_remove_member_job_status",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "team_admin",
            scope: "sharing.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const sharing_check_share_job_status_endpt = new Utils.Endpoint("sharing", "check_share_job_status",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "team_admin",
            scope: "sharing.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const sharing_create_shared_link_with_settings_endpt = new Utils.Endpoint("sharing", "create_shared_link_with_settings",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "team_admin",
            scope: "sharing.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("path", false),
        new Utils.StructParam("settings", true, [new Utils.UnionParam("requested_visibility", true, [new Utils.VoidParam("public"), new Utils.VoidParam("team_only"), new Utils.VoidParam("password")]), new Utils.TextParam("link_password", true), new Utils.TextParam("expires", true), new Utils.UnionParam("audience", true, [new Utils.VoidParam("public"), new Utils.VoidParam("team"), new Utils.VoidParam("no_one"), new Utils.VoidParam("password"), new Utils.VoidParam("members")]), new Utils.UnionParam("access", true, [new Utils.VoidParam("viewer"), new Utils.VoidParam("editor"), new Utils.VoidParam("max")])])
    );
    const sharing_get_file_metadata_endpt = new Utils.Endpoint("sharing", "get_file_metadata",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "team_admin",
            scope: "sharing.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("file", false),
        new Utils.ListParam("actions", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("disable_viewer_info"), new Utils.VoidParam("edit_contents"), new Utils.VoidParam("enable_viewer_info"), new Utils.VoidParam("invite_viewer"), new Utils.VoidParam("invite_viewer_no_comment"), new Utils.VoidParam("invite_editor"), new Utils.VoidParam("unshare"), new Utils.VoidParam("relinquish_membership"), new Utils.VoidParam("share_link"), new Utils.VoidParam("create_link"), new Utils.VoidParam("create_view_link"), new Utils.VoidParam("create_edit_link")]))
    );
    const sharing_get_file_metadata_batch_endpt = new Utils.Endpoint("sharing", "get_file_metadata/batch",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "sharing.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("files", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false)),
        new Utils.ListParam("actions", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("disable_viewer_info"), new Utils.VoidParam("edit_contents"), new Utils.VoidParam("enable_viewer_info"), new Utils.VoidParam("invite_viewer"), new Utils.VoidParam("invite_viewer_no_comment"), new Utils.VoidParam("invite_editor"), new Utils.VoidParam("unshare"), new Utils.VoidParam("relinquish_membership"), new Utils.VoidParam("share_link"), new Utils.VoidParam("create_link"), new Utils.VoidParam("create_view_link"), new Utils.VoidParam("create_edit_link")]))
    );
    const sharing_get_folder_metadata_endpt = new Utils.Endpoint("sharing", "get_folder_metadata",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "whole_team",
            scope: "sharing.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("shared_folder_id", false),
        new Utils.ListParam("actions", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("change_options"), new Utils.VoidParam("disable_viewer_info"), new Utils.VoidParam("edit_contents"), new Utils.VoidParam("enable_viewer_info"), new Utils.VoidParam("invite_editor"), new Utils.VoidParam("invite_viewer"), new Utils.VoidParam("invite_viewer_no_comment"), new Utils.VoidParam("relinquish_membership"), new Utils.VoidParam("unmount"), new Utils.VoidParam("unshare"), new Utils.VoidParam("leave_a_copy"), new Utils.VoidParam("share_link"), new Utils.VoidParam("create_link"), new Utils.VoidParam("set_access_inheritance")]))
    );
    const sharing_get_shared_link_file_endpt = new Utils.Endpoint("sharing", "get_shared_link_file",
        {
            auth: "user",
            host: "content",
            style: "download",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "sharing.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("url", false),
        new Utils.TextParam("path", true),
        new Utils.TextParam("link_password", true)
    );
    const sharing_get_shared_link_metadata_endpt = new Utils.Endpoint("sharing", "get_shared_link_metadata",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "sharing.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("url", false),
        new Utils.TextParam("path", true),
        new Utils.TextParam("link_password", true)
    );
    const sharing_list_file_members_endpt = new Utils.Endpoint("sharing", "list_file_members",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "team_admin",
            scope: "sharing.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("file", false),
        new Utils.ListParam("actions", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("leave_a_copy"), new Utils.VoidParam("make_editor"), new Utils.VoidParam("make_owner"), new Utils.VoidParam("make_viewer"), new Utils.VoidParam("make_viewer_no_comment"), new Utils.VoidParam("remove")])),
        new Utils.BoolParam("include_inherited", true),
        new Utils.IntParam("limit", true)
    );
    const sharing_list_file_members_batch_endpt = new Utils.Endpoint("sharing", "list_file_members/batch",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "sharing.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("files", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false)),
        new Utils.IntParam("limit", true)
    );
    const sharing_list_file_members_continue_endpt = new Utils.Endpoint("sharing", "list_file_members/continue",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "sharing.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("cursor", false)
    );
    const sharing_list_folder_members_endpt = new Utils.Endpoint("sharing", "list_folder_members",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "whole_team",
            scope: "sharing.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("shared_folder_id", false),
        new Utils.ListParam("actions", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("leave_a_copy"), new Utils.VoidParam("make_editor"), new Utils.VoidParam("make_owner"), new Utils.VoidParam("make_viewer"), new Utils.VoidParam("make_viewer_no_comment"), new Utils.VoidParam("remove")])),
        new Utils.IntParam("limit", true)
    );
    const sharing_list_folder_members_continue_endpt = new Utils.Endpoint("sharing", "list_folder_members/continue",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "whole_team",
            scope: "sharing.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("cursor", false)
    );
    const sharing_list_folders_endpt = new Utils.Endpoint("sharing", "list_folders",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "sharing.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.IntParam("limit", true),
        new Utils.ListParam("actions", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("change_options"), new Utils.VoidParam("disable_viewer_info"), new Utils.VoidParam("edit_contents"), new Utils.VoidParam("enable_viewer_info"), new Utils.VoidParam("invite_editor"), new Utils.VoidParam("invite_viewer"), new Utils.VoidParam("invite_viewer_no_comment"), new Utils.VoidParam("relinquish_membership"), new Utils.VoidParam("unmount"), new Utils.VoidParam("unshare"), new Utils.VoidParam("leave_a_copy"), new Utils.VoidParam("share_link"), new Utils.VoidParam("create_link"), new Utils.VoidParam("set_access_inheritance")]))
    );
    const sharing_list_folders_continue_endpt = new Utils.Endpoint("sharing", "list_folders/continue",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "sharing.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("cursor", false)
    );
    const sharing_list_mountable_folders_endpt = new Utils.Endpoint("sharing", "list_mountable_folders",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "sharing.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.IntParam("limit", true),
        new Utils.ListParam("actions", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("change_options"), new Utils.VoidParam("disable_viewer_info"), new Utils.VoidParam("edit_contents"), new Utils.VoidParam("enable_viewer_info"), new Utils.VoidParam("invite_editor"), new Utils.VoidParam("invite_viewer"), new Utils.VoidParam("invite_viewer_no_comment"), new Utils.VoidParam("relinquish_membership"), new Utils.VoidParam("unmount"), new Utils.VoidParam("unshare"), new Utils.VoidParam("leave_a_copy"), new Utils.VoidParam("share_link"), new Utils.VoidParam("create_link"), new Utils.VoidParam("set_access_inheritance")]))
    );
    const sharing_list_mountable_folders_continue_endpt = new Utils.Endpoint("sharing", "list_mountable_folders/continue",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "sharing.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("cursor", false)
    );
    const sharing_list_received_files_endpt = new Utils.Endpoint("sharing", "list_received_files",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "team_admin",
            scope: "sharing.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.IntParam("limit", true),
        new Utils.ListParam("actions", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("disable_viewer_info"), new Utils.VoidParam("edit_contents"), new Utils.VoidParam("enable_viewer_info"), new Utils.VoidParam("invite_viewer"), new Utils.VoidParam("invite_viewer_no_comment"), new Utils.VoidParam("invite_editor"), new Utils.VoidParam("unshare"), new Utils.VoidParam("relinquish_membership"), new Utils.VoidParam("share_link"), new Utils.VoidParam("create_link"), new Utils.VoidParam("create_view_link"), new Utils.VoidParam("create_edit_link")]))
    );
    const sharing_list_received_files_continue_endpt = new Utils.Endpoint("sharing", "list_received_files/continue",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "sharing.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("cursor", false)
    );
    const sharing_list_shared_links_endpt = new Utils.Endpoint("sharing", "list_shared_links",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "sharing.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("path", true),
        new Utils.TextParam("cursor", true),
        new Utils.BoolParam("direct_only", true)
    );
    const sharing_modify_shared_link_settings_endpt = new Utils.Endpoint("sharing", "modify_shared_link_settings",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "sharing.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("url", false),
        new Utils.StructParam("settings", false, [new Utils.UnionParam("requested_visibility", true, [new Utils.VoidParam("public"), new Utils.VoidParam("team_only"), new Utils.VoidParam("password")]), new Utils.TextParam("link_password", true), new Utils.TextParam("expires", true), new Utils.UnionParam("audience", true, [new Utils.VoidParam("public"), new Utils.VoidParam("team"), new Utils.VoidParam("no_one"), new Utils.VoidParam("password"), new Utils.VoidParam("members")]), new Utils.UnionParam("access", true, [new Utils.VoidParam("viewer"), new Utils.VoidParam("editor"), new Utils.VoidParam("max")])]),
        new Utils.BoolParam("remove_expiration", true)
    );
    const sharing_mount_folder_endpt = new Utils.Endpoint("sharing", "mount_folder",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "sharing.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("shared_folder_id", false)
    );
    const sharing_relinquish_file_membership_endpt = new Utils.Endpoint("sharing", "relinquish_file_membership",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "team_admin",
            scope: "sharing.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("file", false)
    );
    const sharing_relinquish_folder_membership_endpt = new Utils.Endpoint("sharing", "relinquish_folder_membership",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "sharing.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("shared_folder_id", false),
        new Utils.BoolParam("leave_a_copy", true)
    );
    const sharing_remove_file_member_2_endpt = new Utils.Endpoint("sharing", "remove_file_member_2",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "team_admin",
            scope: "sharing.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("file", false),
        new Utils.UnionParam("member", false, [new Utils.TextParam("dropbox_id", false), new Utils.TextParam("email", false)])
    );
    const sharing_remove_folder_member_endpt = new Utils.Endpoint("sharing", "remove_folder_member",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "team_admin",
            scope: "sharing.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("shared_folder_id", false),
        new Utils.UnionParam("member", false, [new Utils.TextParam("dropbox_id", false), new Utils.TextParam("email", false)]),
        new Utils.BoolParam("leave_a_copy", false)
    );
    const sharing_revoke_shared_link_endpt = new Utils.Endpoint("sharing", "revoke_shared_link",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "team_admin",
            scope: "sharing.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("url", false)
    );
    const sharing_set_access_inheritance_endpt = new Utils.Endpoint("sharing", "set_access_inheritance",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "sharing.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("shared_folder_id", false),
        new Utils.UnionParam("access_inheritance", true, [new Utils.VoidParam("inherit"), new Utils.VoidParam("no_inherit")])
    );
    const sharing_share_folder_endpt = new Utils.Endpoint("sharing", "share_folder",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "team_admin",
            scope: "sharing.write",
            is_cloud_doc_auth: "False",
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
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "team_admin",
            scope: "sharing.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("shared_folder_id", false),
        new Utils.TextParam("to_dropbox_id", false)
    );
    const sharing_unmount_folder_endpt = new Utils.Endpoint("sharing", "unmount_folder",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "team_admin",
            scope: "sharing.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("shared_folder_id", false)
    );
    const sharing_unshare_file_endpt = new Utils.Endpoint("sharing", "unshare_file",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "team_admin",
            scope: "sharing.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("file", false)
    );
    const sharing_unshare_folder_endpt = new Utils.Endpoint("sharing", "unshare_folder",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "team_admin",
            scope: "sharing.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("shared_folder_id", false),
        new Utils.BoolParam("leave_a_copy", true)
    );
    const sharing_update_file_member_endpt = new Utils.Endpoint("sharing", "update_file_member",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "team_admin",
            scope: "sharing.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("file", false),
        new Utils.UnionParam("member", false, [new Utils.TextParam("dropbox_id", false), new Utils.TextParam("email", false)]),
        new Utils.UnionParam("access_level", false, [new Utils.VoidParam("owner"), new Utils.VoidParam("editor"), new Utils.VoidParam("viewer"), new Utils.VoidParam("viewer_no_comment")])
    );
    const sharing_update_folder_member_endpt = new Utils.Endpoint("sharing", "update_folder_member",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "team_admin",
            scope: "sharing.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("shared_folder_id", false),
        new Utils.UnionParam("member", false, [new Utils.TextParam("dropbox_id", false), new Utils.TextParam("email", false)]),
        new Utils.UnionParam("access_level", false, [new Utils.VoidParam("owner"), new Utils.VoidParam("editor"), new Utils.VoidParam("viewer"), new Utils.VoidParam("viewer_no_comment")])
    );
    const sharing_update_folder_policy_endpt = new Utils.Endpoint("sharing", "update_folder_policy",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "team_admin",
            scope: "sharing.write",
            is_cloud_doc_auth: "False",
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
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "sessions.list",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("team_member_id", false),
        new Utils.BoolParam("include_web_sessions", true),
        new Utils.BoolParam("include_desktop_clients", true),
        new Utils.BoolParam("include_mobile_clients", true)
    );
    const team_devices_list_members_devices_endpt = new Utils.Endpoint("team", "devices/list_members_devices",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "sessions.list",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("cursor", true),
        new Utils.BoolParam("include_web_sessions", true),
        new Utils.BoolParam("include_desktop_clients", true),
        new Utils.BoolParam("include_mobile_clients", true)
    );
    const team_devices_revoke_device_session_endpt = new Utils.Endpoint("team", "devices/revoke_device_session",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "sessions.modify",
            is_cloud_doc_auth: "False",
        },
        new Utils.RootUnionParam('', false, [new Utils.StructParam("web_session", false, [new Utils.TextParam("session_id", false), new Utils.TextParam("team_member_id", false)]), new Utils.StructParam("desktop_client", false, [new Utils.TextParam("session_id", false), new Utils.TextParam("team_member_id", false), new Utils.BoolParam("delete_on_unlink", true)]), new Utils.StructParam("mobile_client", false, [new Utils.TextParam("session_id", false), new Utils.TextParam("team_member_id", false)])])
    );
    const team_devices_revoke_device_session_batch_endpt = new Utils.Endpoint("team", "devices/revoke_device_session_batch",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "sessions.modify",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("revoke_devices", false, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.StructParam("web_session", false, [new Utils.TextParam("session_id", false), new Utils.TextParam("team_member_id", false)]), new Utils.StructParam("desktop_client", false, [new Utils.TextParam("session_id", false), new Utils.TextParam("team_member_id", false), new Utils.BoolParam("delete_on_unlink", true)]), new Utils.StructParam("mobile_client", false, [new Utils.TextParam("session_id", false), new Utils.TextParam("team_member_id", false)])]))
    );
    const team_features_get_values_endpt = new Utils.Endpoint("team", "features/get_values",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "team_info.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("features", false, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("upload_api_rate_limit"), new Utils.VoidParam("has_team_shared_dropbox"), new Utils.VoidParam("has_team_file_events"), new Utils.VoidParam("has_team_selective_sync")]))
    );
    const team_get_info_endpt = new Utils.Endpoint("team", "get_info",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "team_info.read",
            is_cloud_doc_auth: "False",
        }
    );
    const team_groups_create_endpt = new Utils.Endpoint("team", "groups/create",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "groups.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("group_name", false),
        new Utils.BoolParam("add_creator_as_owner", true),
        new Utils.TextParam("group_external_id", true),
        new Utils.UnionParam("group_management_type", true, [new Utils.VoidParam("user_managed"), new Utils.VoidParam("company_managed"), new Utils.VoidParam("system_managed")])
    );
    const team_groups_delete_endpt = new Utils.Endpoint("team", "groups/delete",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "groups.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.RootUnionParam('', false, [new Utils.TextParam("group_id", false), new Utils.TextParam("group_external_id", false)])
    );
    const team_groups_get_info_endpt = new Utils.Endpoint("team", "groups/get_info",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "groups.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.RootUnionParam('', false, [new Utils.ListParam("group_ids", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false)), new Utils.ListParam("group_external_ids", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false))])
    );
    const team_groups_job_status_get_endpt = new Utils.Endpoint("team", "groups/job_status/get",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "groups.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const team_groups_list_endpt = new Utils.Endpoint("team", "groups/list",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "groups.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.IntParam("limit", true)
    );
    const team_groups_list_continue_endpt = new Utils.Endpoint("team", "groups/list/continue",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "groups.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("cursor", false)
    );
    const team_groups_members_add_endpt = new Utils.Endpoint("team", "groups/members/add",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "groups.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.UnionParam("group", false, [new Utils.TextParam("group_id", false), new Utils.TextParam("group_external_id", false)]),
        new Utils.ListParam("members", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]), new Utils.UnionParam("access_type", false, [new Utils.VoidParam("member"), new Utils.VoidParam("owner")])])),
        new Utils.BoolParam("return_members", true)
    );
    const team_groups_members_list_endpt = new Utils.Endpoint("team", "groups/members/list",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "groups.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.UnionParam("group", false, [new Utils.TextParam("group_id", false), new Utils.TextParam("group_external_id", false)]),
        new Utils.IntParam("limit", true)
    );
    const team_groups_members_list_continue_endpt = new Utils.Endpoint("team", "groups/members/list/continue",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "groups.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("cursor", false)
    );
    const team_groups_members_remove_endpt = new Utils.Endpoint("team", "groups/members/remove",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "groups.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.UnionParam("group", false, [new Utils.TextParam("group_id", false), new Utils.TextParam("group_external_id", false)]),
        new Utils.ListParam("users", false, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)])),
        new Utils.BoolParam("return_members", true)
    );
    const team_groups_members_set_access_type_endpt = new Utils.Endpoint("team", "groups/members/set_access_type",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "groups.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.UnionParam("group", false, [new Utils.TextParam("group_id", false), new Utils.TextParam("group_external_id", false)]),
        new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]),
        new Utils.UnionParam("access_type", false, [new Utils.VoidParam("member"), new Utils.VoidParam("owner")]),
        new Utils.BoolParam("return_members", true)
    );
    const team_groups_update_endpt = new Utils.Endpoint("team", "groups/update",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "groups.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.UnionParam("group", false, [new Utils.TextParam("group_id", false), new Utils.TextParam("group_external_id", false)]),
        new Utils.BoolParam("return_members", true),
        new Utils.TextParam("new_group_name", true),
        new Utils.TextParam("new_group_external_id", true),
        new Utils.UnionParam("new_group_management_type", true, [new Utils.VoidParam("user_managed"), new Utils.VoidParam("company_managed"), new Utils.VoidParam("system_managed")])
    );
    const team_legal_holds_create_policy_endpt = new Utils.Endpoint("team", "legal_holds/create_policy",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "team_data.member",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("name", false),
        new Utils.ListParam("members", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false)),
        new Utils.TextParam("description", true),
        new Utils.TextParam("start_date", true),
        new Utils.TextParam("end_date", true)
    );
    const team_legal_holds_get_policy_endpt = new Utils.Endpoint("team", "legal_holds/get_policy",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "team_data.member",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("id", false)
    );
    const team_legal_holds_list_held_revisions_endpt = new Utils.Endpoint("team", "legal_holds/list_held_revisions",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "team_data.member",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("id", false)
    );
    const team_legal_holds_list_held_revisions_continue_endpt = new Utils.Endpoint("team", "legal_holds/list_held_revisions_continue",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "team_data.member",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("id", false),
        new Utils.TextParam("cursor", true)
    );
    const team_legal_holds_list_policies_endpt = new Utils.Endpoint("team", "legal_holds/list_policies",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "team_data.member",
            is_cloud_doc_auth: "False",
        },
        new Utils.BoolParam("include_released", true)
    );
    const team_legal_holds_release_policy_endpt = new Utils.Endpoint("team", "legal_holds/release_policy",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "team_data.member",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("id", false)
    );
    const team_legal_holds_update_policy_endpt = new Utils.Endpoint("team", "legal_holds/update_policy",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "team_data.member",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("id", false),
        new Utils.TextParam("name", true),
        new Utils.TextParam("description", true),
        new Utils.ListParam("members", true, (index: string): Utils.Parameter => new Utils.TextParam(index, false))
    );
    const team_linked_apps_list_member_linked_apps_endpt = new Utils.Endpoint("team", "linked_apps/list_member_linked_apps",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "sessions.list",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("team_member_id", false)
    );
    const team_linked_apps_list_members_linked_apps_endpt = new Utils.Endpoint("team", "linked_apps/list_members_linked_apps",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "sessions.list",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("cursor", true)
    );
    const team_linked_apps_revoke_linked_app_endpt = new Utils.Endpoint("team", "linked_apps/revoke_linked_app",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "sessions.modify",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("app_id", false),
        new Utils.TextParam("team_member_id", false),
        new Utils.BoolParam("keep_app_folder", true)
    );
    const team_linked_apps_revoke_linked_app_batch_endpt = new Utils.Endpoint("team", "linked_apps/revoke_linked_app_batch",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "sessions.modify",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("revoke_linked_app", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("app_id", false), new Utils.TextParam("team_member_id", false), new Utils.BoolParam("keep_app_folder", true)]))
    );
    const team_member_space_limits_excluded_users_add_endpt = new Utils.Endpoint("team", "member_space_limits/excluded_users/add",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("users", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]))
    );
    const team_member_space_limits_excluded_users_list_endpt = new Utils.Endpoint("team", "member_space_limits/excluded_users/list",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.IntParam("limit", true)
    );
    const team_member_space_limits_excluded_users_list_continue_endpt = new Utils.Endpoint("team", "member_space_limits/excluded_users/list/continue",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("cursor", false)
    );
    const team_member_space_limits_excluded_users_remove_endpt = new Utils.Endpoint("team", "member_space_limits/excluded_users/remove",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("users", true, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]))
    );
    const team_member_space_limits_get_custom_quota_endpt = new Utils.Endpoint("team", "member_space_limits/get_custom_quota",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("users", false, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]))
    );
    const team_member_space_limits_remove_custom_quota_endpt = new Utils.Endpoint("team", "member_space_limits/remove_custom_quota",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("users", false, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]))
    );
    const team_member_space_limits_set_custom_quota_endpt = new Utils.Endpoint("team", "member_space_limits/set_custom_quota",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("users_and_quotas", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]), new Utils.IntParam("quota_gb", false)]))
    );
    const team_members_add_v2_endpt = new Utils.Endpoint("team", "members/add_v2",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "True",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("new_members", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("member_email", false), new Utils.TextParam("member_given_name", true), new Utils.TextParam("member_surname", true), new Utils.TextParam("member_external_id", true), new Utils.TextParam("member_persistent_id", true), new Utils.BoolParam("send_welcome_email", true), new Utils.BoolParam("is_directory_restricted", true), new Utils.ListParam("role_ids", true, (index: string): Utils.Parameter => new Utils.TextParam(index, false))])),
        new Utils.BoolParam("force_async", true)
    );
    const team_members_add_endpt = new Utils.Endpoint("team", "members/add",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("new_members", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("member_email", false), new Utils.TextParam("member_given_name", true), new Utils.TextParam("member_surname", true), new Utils.TextParam("member_external_id", true), new Utils.TextParam("member_persistent_id", true), new Utils.BoolParam("send_welcome_email", true), new Utils.BoolParam("is_directory_restricted", true), new Utils.UnionParam("role", true, [new Utils.VoidParam("team_admin"), new Utils.VoidParam("user_management_admin"), new Utils.VoidParam("support_admin"), new Utils.VoidParam("member_only")])])),
        new Utils.BoolParam("force_async", true)
    );
    const team_members_add_job_status_get_v2_endpt = new Utils.Endpoint("team", "members/add/job_status/get_v2",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "True",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const team_members_add_job_status_get_endpt = new Utils.Endpoint("team", "members/add/job_status/get",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const team_members_delete_profile_photo_v2_endpt = new Utils.Endpoint("team", "members/delete_profile_photo_v2",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "True",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)])
    );
    const team_members_delete_profile_photo_endpt = new Utils.Endpoint("team", "members/delete_profile_photo",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)])
    );
    const team_members_get_available_team_member_roles_endpt = new Utils.Endpoint("team", "members/get_available_team_member_roles",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "True",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.read",
            is_cloud_doc_auth: "False",
        }
    );
    const team_members_get_info_v2_endpt = new Utils.Endpoint("team", "members/get_info_v2",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "True",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("members", false, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]))
    );
    const team_members_get_info_endpt = new Utils.Endpoint("team", "members/get_info",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("members", false, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]))
    );
    const team_members_list_v2_endpt = new Utils.Endpoint("team", "members/list_v2",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "True",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.IntParam("limit", true),
        new Utils.BoolParam("include_removed", true)
    );
    const team_members_list_endpt = new Utils.Endpoint("team", "members/list",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.IntParam("limit", true),
        new Utils.BoolParam("include_removed", true)
    );
    const team_members_list_continue_v2_endpt = new Utils.Endpoint("team", "members/list/continue_v2",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "True",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("cursor", false)
    );
    const team_members_list_continue_endpt = new Utils.Endpoint("team", "members/list/continue",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("cursor", false)
    );
    const team_members_move_former_member_files_endpt = new Utils.Endpoint("team", "members/move_former_member_files",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]),
        new Utils.UnionParam("transfer_dest_id", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]),
        new Utils.UnionParam("transfer_admin_id", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)])
    );
    const team_members_move_former_member_files_job_status_check_endpt = new Utils.Endpoint("team", "members/move_former_member_files/job_status/check",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const team_members_recover_endpt = new Utils.Endpoint("team", "members/recover",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.delete",
            is_cloud_doc_auth: "False",
        },
        new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)])
    );
    const team_members_remove_endpt = new Utils.Endpoint("team", "members/remove",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.delete",
            is_cloud_doc_auth: "False",
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
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.delete",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const team_members_secondary_emails_add_endpt = new Utils.Endpoint("team", "members/secondary_emails/add",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("new_secondary_emails", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]), new Utils.ListParam("secondary_emails", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false))]))
    );
    const team_members_secondary_emails_delete_endpt = new Utils.Endpoint("team", "members/secondary_emails/delete",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("emails_to_delete", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]), new Utils.ListParam("secondary_emails", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false))]))
    );
    const team_members_secondary_emails_resend_verification_emails_endpt = new Utils.Endpoint("team", "members/secondary_emails/resend_verification_emails",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("emails_to_resend", false, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]), new Utils.ListParam("secondary_emails", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false))]))
    );
    const team_members_send_welcome_email_endpt = new Utils.Endpoint("team", "members/send_welcome_email",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.RootUnionParam('', false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)])
    );
    const team_members_set_admin_permissions_v2_endpt = new Utils.Endpoint("team", "members/set_admin_permissions_v2",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "True",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]),
        new Utils.ListParam("new_roles", true, (index: string): Utils.Parameter => new Utils.TextParam(index, false))
    );
    const team_members_set_admin_permissions_endpt = new Utils.Endpoint("team", "members/set_admin_permissions",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]),
        new Utils.UnionParam("new_role", false, [new Utils.VoidParam("team_admin"), new Utils.VoidParam("user_management_admin"), new Utils.VoidParam("support_admin"), new Utils.VoidParam("member_only")])
    );
    const team_members_set_profile_v2_endpt = new Utils.Endpoint("team", "members/set_profile_v2",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "True",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]),
        new Utils.TextParam("new_email", true),
        new Utils.TextParam("new_external_id", true),
        new Utils.TextParam("new_given_name", true),
        new Utils.TextParam("new_surname", true),
        new Utils.TextParam("new_persistent_id", true),
        new Utils.BoolParam("new_is_directory_restricted", true)
    );
    const team_members_set_profile_endpt = new Utils.Endpoint("team", "members/set_profile",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]),
        new Utils.TextParam("new_email", true),
        new Utils.TextParam("new_external_id", true),
        new Utils.TextParam("new_given_name", true),
        new Utils.TextParam("new_surname", true),
        new Utils.TextParam("new_persistent_id", true),
        new Utils.BoolParam("new_is_directory_restricted", true)
    );
    const team_members_set_profile_photo_v2_endpt = new Utils.Endpoint("team", "members/set_profile_photo_v2",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "True",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]),
        new Utils.UnionParam("photo", false, [new Utils.TextParam("base64_data", false)])
    );
    const team_members_set_profile_photo_endpt = new Utils.Endpoint("team", "members/set_profile_photo",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]),
        new Utils.UnionParam("photo", false, [new Utils.TextParam("base64_data", false)])
    );
    const team_members_suspend_endpt = new Utils.Endpoint("team", "members/suspend",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)]),
        new Utils.BoolParam("wipe_data", true)
    );
    const team_members_unsuspend_endpt = new Utils.Endpoint("team", "members/unsuspend",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "members.write",
            is_cloud_doc_auth: "False",
        },
        new Utils.UnionParam("user", false, [new Utils.TextParam("team_member_id", false), new Utils.TextParam("external_id", false), new Utils.TextParam("email", false)])
    );
    const team_namespaces_list_endpt = new Utils.Endpoint("team", "namespaces/list",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "team_data.member",
            is_cloud_doc_auth: "False",
        },
        new Utils.IntParam("limit", true)
    );
    const team_namespaces_list_continue_endpt = new Utils.Endpoint("team", "namespaces/list/continue",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "team_data.member",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("cursor", false)
    );
    const team_team_folder_activate_endpt = new Utils.Endpoint("team", "team_folder/activate",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "team_data.team_space",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("team_folder_id", false)
    );
    const team_team_folder_archive_endpt = new Utils.Endpoint("team", "team_folder/archive",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "team_data.team_space",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("team_folder_id", false),
        new Utils.BoolParam("force_async_off", true)
    );
    const team_team_folder_archive_check_endpt = new Utils.Endpoint("team", "team_folder/archive/check",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "team_data.team_space",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("async_job_id", false)
    );
    const team_team_folder_create_endpt = new Utils.Endpoint("team", "team_folder/create",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "team_data.team_space",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("name", false),
        new Utils.UnionParam("sync_setting", true, [new Utils.VoidParam("default"), new Utils.VoidParam("not_synced")])
    );
    const team_team_folder_get_info_endpt = new Utils.Endpoint("team", "team_folder/get_info",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "team_data.team_space",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("team_folder_ids", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false))
    );
    const team_team_folder_list_endpt = new Utils.Endpoint("team", "team_folder/list",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "team_data.team_space",
            is_cloud_doc_auth: "False",
        },
        new Utils.IntParam("limit", true)
    );
    const team_team_folder_list_continue_endpt = new Utils.Endpoint("team", "team_folder/list/continue",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "team_data.team_space",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("cursor", false)
    );
    const team_team_folder_permanently_delete_endpt = new Utils.Endpoint("team", "team_folder/permanently_delete",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "team_data.team_space",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("team_folder_id", false)
    );
    const team_team_folder_rename_endpt = new Utils.Endpoint("team", "team_folder/rename",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "team_data.team_space",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("team_folder_id", false),
        new Utils.TextParam("name", false)
    );
    const team_team_folder_update_sync_settings_endpt = new Utils.Endpoint("team", "team_folder/update_sync_settings",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "team_data.team_space",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("team_folder_id", false),
        new Utils.UnionParam("sync_setting", true, [new Utils.VoidParam("default"), new Utils.VoidParam("not_synced")]),
        new Utils.ListParam("content_sync_settings", true, (index: string): Utils.Parameter => new Utils.StructParam(index, false, [new Utils.TextParam("id", false), new Utils.UnionParam("sync_setting", false, [new Utils.VoidParam("default"), new Utils.VoidParam("not_synced")])]))
    );
    const team_token_get_authenticated_admin_endpt = new Utils.Endpoint("team", "token/get_authenticated_admin",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "team_info.read",
            is_cloud_doc_auth: "False",
        }
    );
    const team_log_get_events_endpt = new Utils.Endpoint("team_log", "get_events",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "events.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.IntParam("limit", true),
        new Utils.TextParam("account_id", true),
        new Utils.StructParam("time", true, [new Utils.TextParam("start_time", true), new Utils.TextParam("end_time", true)]),
        new Utils.UnionParam("category", true, [new Utils.VoidParam("admin_alerting"), new Utils.VoidParam("apps"), new Utils.VoidParam("comments"), new Utils.VoidParam("data_governance"), new Utils.VoidParam("devices"), new Utils.VoidParam("domains"), new Utils.VoidParam("file_operations"), new Utils.VoidParam("file_requests"), new Utils.VoidParam("groups"), new Utils.VoidParam("logins"), new Utils.VoidParam("members"), new Utils.VoidParam("paper"), new Utils.VoidParam("passwords"), new Utils.VoidParam("reports"), new Utils.VoidParam("sharing"), new Utils.VoidParam("showcase"), new Utils.VoidParam("sso"), new Utils.VoidParam("team_folders"), new Utils.VoidParam("team_policies"), new Utils.VoidParam("team_profile"), new Utils.VoidParam("tfa"), new Utils.VoidParam("trusted_teams")]),
        new Utils.UnionParam("event_type", true, [new Utils.VoidParam("admin_alerting_changed_alert_config"), new Utils.VoidParam("admin_alerting_triggered_alert"), new Utils.VoidParam("app_blocked_by_permissions"), new Utils.VoidParam("app_link_team"), new Utils.VoidParam("app_link_user"), new Utils.VoidParam("app_unlink_team"), new Utils.VoidParam("app_unlink_user"), new Utils.VoidParam("integration_connected"), new Utils.VoidParam("integration_disconnected"), new Utils.VoidParam("file_add_comment"), new Utils.VoidParam("file_change_comment_subscription"), new Utils.VoidParam("file_delete_comment"), new Utils.VoidParam("file_edit_comment"), new Utils.VoidParam("file_like_comment"), new Utils.VoidParam("file_resolve_comment"), new Utils.VoidParam("file_unlike_comment"), new Utils.VoidParam("file_unresolve_comment"), new Utils.VoidParam("governance_policy_add_folders"), new Utils.VoidParam("governance_policy_add_folder_failed"), new Utils.VoidParam("governance_policy_content_disposed"), new Utils.VoidParam("governance_policy_create"), new Utils.VoidParam("governance_policy_delete"), new Utils.VoidParam("governance_policy_edit_details"), new Utils.VoidParam("governance_policy_edit_duration"), new Utils.VoidParam("governance_policy_export_created"), new Utils.VoidParam("governance_policy_export_removed"), new Utils.VoidParam("governance_policy_remove_folders"), new Utils.VoidParam("governance_policy_report_created"), new Utils.VoidParam("governance_policy_zip_part_downloaded"), new Utils.VoidParam("legal_holds_activate_a_hold"), new Utils.VoidParam("legal_holds_add_members"), new Utils.VoidParam("legal_holds_change_hold_details"), new Utils.VoidParam("legal_holds_change_hold_name"), new Utils.VoidParam("legal_holds_export_a_hold"), new Utils.VoidParam("legal_holds_export_cancelled"), new Utils.VoidParam("legal_holds_export_downloaded"), new Utils.VoidParam("legal_holds_export_removed"), new Utils.VoidParam("legal_holds_release_a_hold"), new Utils.VoidParam("legal_holds_remove_members"), new Utils.VoidParam("legal_holds_report_a_hold"), new Utils.VoidParam("device_change_ip_desktop"), new Utils.VoidParam("device_change_ip_mobile"), new Utils.VoidParam("device_change_ip_web"), new Utils.VoidParam("device_delete_on_unlink_fail"), new Utils.VoidParam("device_delete_on_unlink_success"), new Utils.VoidParam("device_link_fail"), new Utils.VoidParam("device_link_success"), new Utils.VoidParam("device_management_disabled"), new Utils.VoidParam("device_management_enabled"), new Utils.VoidParam("device_sync_backup_status_changed"), new Utils.VoidParam("device_unlink"), new Utils.VoidParam("dropbox_passwords_exported"), new Utils.VoidParam("dropbox_passwords_new_device_enrolled"), new Utils.VoidParam("emm_refresh_auth_token"), new Utils.VoidParam("account_capture_change_availability"), new Utils.VoidParam("account_capture_migrate_account"), new Utils.VoidParam("account_capture_notification_emails_sent"), new Utils.VoidParam("account_capture_relinquish_account"), new Utils.VoidParam("disabled_domain_invites"), new Utils.VoidParam("domain_invites_approve_request_to_join_team"), new Utils.VoidParam("domain_invites_decline_request_to_join_team"), new Utils.VoidParam("domain_invites_email_existing_users"), new Utils.VoidParam("domain_invites_request_to_join_team"), new Utils.VoidParam("domain_invites_set_invite_new_user_pref_to_no"), new Utils.VoidParam("domain_invites_set_invite_new_user_pref_to_yes"), new Utils.VoidParam("domain_verification_add_domain_fail"), new Utils.VoidParam("domain_verification_add_domain_success"), new Utils.VoidParam("domain_verification_remove_domain"), new Utils.VoidParam("enabled_domain_invites"), new Utils.VoidParam("create_folder"), new Utils.VoidParam("file_add"), new Utils.VoidParam("file_copy"), new Utils.VoidParam("file_delete"), new Utils.VoidParam("file_download"), new Utils.VoidParam("file_edit"), new Utils.VoidParam("file_get_copy_reference"), new Utils.VoidParam("file_locking_lock_status_changed"), new Utils.VoidParam("file_move"), new Utils.VoidParam("file_permanently_delete"), new Utils.VoidParam("file_preview"), new Utils.VoidParam("file_rename"), new Utils.VoidParam("file_restore"), new Utils.VoidParam("file_revert"), new Utils.VoidParam("file_rollback_changes"), new Utils.VoidParam("file_save_copy_reference"), new Utils.VoidParam("folder_overview_description_changed"), new Utils.VoidParam("folder_overview_item_pinned"), new Utils.VoidParam("folder_overview_item_unpinned"), new Utils.VoidParam("object_label_added"), new Utils.VoidParam("object_label_removed"), new Utils.VoidParam("object_label_updated_value"), new Utils.VoidParam("rewind_folder"), new Utils.VoidParam("file_request_change"), new Utils.VoidParam("file_request_close"), new Utils.VoidParam("file_request_create"), new Utils.VoidParam("file_request_delete"), new Utils.VoidParam("file_request_receive_file"), new Utils.VoidParam("group_add_external_id"), new Utils.VoidParam("group_add_member"), new Utils.VoidParam("group_change_external_id"), new Utils.VoidParam("group_change_management_type"), new Utils.VoidParam("group_change_member_role"), new Utils.VoidParam("group_create"), new Utils.VoidParam("group_delete"), new Utils.VoidParam("group_description_updated"), new Utils.VoidParam("group_join_policy_updated"), new Utils.VoidParam("group_moved"), new Utils.VoidParam("group_remove_external_id"), new Utils.VoidParam("group_remove_member"), new Utils.VoidParam("group_rename"), new Utils.VoidParam("account_lock_or_unlocked"), new Utils.VoidParam("emm_error"), new Utils.VoidParam("guest_admin_signed_in_via_trusted_teams"), new Utils.VoidParam("guest_admin_signed_out_via_trusted_teams"), new Utils.VoidParam("login_fail"), new Utils.VoidParam("login_success"), new Utils.VoidParam("logout"), new Utils.VoidParam("reseller_support_session_end"), new Utils.VoidParam("reseller_support_session_start"), new Utils.VoidParam("sign_in_as_session_end"), new Utils.VoidParam("sign_in_as_session_start"), new Utils.VoidParam("sso_error"), new Utils.VoidParam("create_team_invite_link"), new Utils.VoidParam("delete_team_invite_link"), new Utils.VoidParam("member_add_external_id"), new Utils.VoidParam("member_add_name"), new Utils.VoidParam("member_change_admin_role"), new Utils.VoidParam("member_change_email"), new Utils.VoidParam("member_change_external_id"), new Utils.VoidParam("member_change_membership_type"), new Utils.VoidParam("member_change_name"), new Utils.VoidParam("member_change_reseller_role"), new Utils.VoidParam("member_change_status"), new Utils.VoidParam("member_delete_manual_contacts"), new Utils.VoidParam("member_delete_profile_photo"), new Utils.VoidParam("member_permanently_delete_account_contents"), new Utils.VoidParam("member_remove_external_id"), new Utils.VoidParam("member_set_profile_photo"), new Utils.VoidParam("member_space_limits_add_custom_quota"), new Utils.VoidParam("member_space_limits_change_custom_quota"), new Utils.VoidParam("member_space_limits_change_status"), new Utils.VoidParam("member_space_limits_remove_custom_quota"), new Utils.VoidParam("member_suggest"), new Utils.VoidParam("member_transfer_account_contents"), new Utils.VoidParam("pending_secondary_email_added"), new Utils.VoidParam("secondary_email_deleted"), new Utils.VoidParam("secondary_email_verified"), new Utils.VoidParam("secondary_mails_policy_changed"), new Utils.VoidParam("binder_add_page"), new Utils.VoidParam("binder_add_section"), new Utils.VoidParam("binder_remove_page"), new Utils.VoidParam("binder_remove_section"), new Utils.VoidParam("binder_rename_page"), new Utils.VoidParam("binder_rename_section"), new Utils.VoidParam("binder_reorder_page"), new Utils.VoidParam("binder_reorder_section"), new Utils.VoidParam("paper_content_add_member"), new Utils.VoidParam("paper_content_add_to_folder"), new Utils.VoidParam("paper_content_archive"), new Utils.VoidParam("paper_content_create"), new Utils.VoidParam("paper_content_permanently_delete"), new Utils.VoidParam("paper_content_remove_from_folder"), new Utils.VoidParam("paper_content_remove_member"), new Utils.VoidParam("paper_content_rename"), new Utils.VoidParam("paper_content_restore"), new Utils.VoidParam("paper_doc_add_comment"), new Utils.VoidParam("paper_doc_change_member_role"), new Utils.VoidParam("paper_doc_change_sharing_policy"), new Utils.VoidParam("paper_doc_change_subscription"), new Utils.VoidParam("paper_doc_deleted"), new Utils.VoidParam("paper_doc_delete_comment"), new Utils.VoidParam("paper_doc_download"), new Utils.VoidParam("paper_doc_edit"), new Utils.VoidParam("paper_doc_edit_comment"), new Utils.VoidParam("paper_doc_followed"), new Utils.VoidParam("paper_doc_mention"), new Utils.VoidParam("paper_doc_ownership_changed"), new Utils.VoidParam("paper_doc_request_access"), new Utils.VoidParam("paper_doc_resolve_comment"), new Utils.VoidParam("paper_doc_revert"), new Utils.VoidParam("paper_doc_slack_share"), new Utils.VoidParam("paper_doc_team_invite"), new Utils.VoidParam("paper_doc_trashed"), new Utils.VoidParam("paper_doc_unresolve_comment"), new Utils.VoidParam("paper_doc_untrashed"), new Utils.VoidParam("paper_doc_view"), new Utils.VoidParam("paper_external_view_allow"), new Utils.VoidParam("paper_external_view_default_team"), new Utils.VoidParam("paper_external_view_forbid"), new Utils.VoidParam("paper_folder_change_subscription"), new Utils.VoidParam("paper_folder_deleted"), new Utils.VoidParam("paper_folder_followed"), new Utils.VoidParam("paper_folder_team_invite"), new Utils.VoidParam("paper_published_link_change_permission"), new Utils.VoidParam("paper_published_link_create"), new Utils.VoidParam("paper_published_link_disabled"), new Utils.VoidParam("paper_published_link_view"), new Utils.VoidParam("password_change"), new Utils.VoidParam("password_reset"), new Utils.VoidParam("password_reset_all"), new Utils.VoidParam("classification_create_report"), new Utils.VoidParam("classification_create_report_fail"), new Utils.VoidParam("emm_create_exceptions_report"), new Utils.VoidParam("emm_create_usage_report"), new Utils.VoidParam("export_members_report"), new Utils.VoidParam("export_members_report_fail"), new Utils.VoidParam("external_sharing_create_report"), new Utils.VoidParam("external_sharing_report_failed"), new Utils.VoidParam("no_expiration_link_gen_create_report"), new Utils.VoidParam("no_expiration_link_gen_report_failed"), new Utils.VoidParam("no_password_link_gen_create_report"), new Utils.VoidParam("no_password_link_gen_report_failed"), new Utils.VoidParam("no_password_link_view_create_report"), new Utils.VoidParam("no_password_link_view_report_failed"), new Utils.VoidParam("outdated_link_view_create_report"), new Utils.VoidParam("outdated_link_view_report_failed"), new Utils.VoidParam("paper_admin_export_start"), new Utils.VoidParam("smart_sync_create_admin_privilege_report"), new Utils.VoidParam("team_activity_create_report"), new Utils.VoidParam("team_activity_create_report_fail"), new Utils.VoidParam("collection_share"), new Utils.VoidParam("file_transfers_file_add"), new Utils.VoidParam("file_transfers_transfer_delete"), new Utils.VoidParam("file_transfers_transfer_download"), new Utils.VoidParam("file_transfers_transfer_send"), new Utils.VoidParam("file_transfers_transfer_view"), new Utils.VoidParam("note_acl_invite_only"), new Utils.VoidParam("note_acl_link"), new Utils.VoidParam("note_acl_team_link"), new Utils.VoidParam("note_shared"), new Utils.VoidParam("note_share_receive"), new Utils.VoidParam("open_note_shared"), new Utils.VoidParam("sf_add_group"), new Utils.VoidParam("sf_allow_non_members_to_view_shared_links"), new Utils.VoidParam("sf_external_invite_warn"), new Utils.VoidParam("sf_fb_invite"), new Utils.VoidParam("sf_fb_invite_change_role"), new Utils.VoidParam("sf_fb_uninvite"), new Utils.VoidParam("sf_invite_group"), new Utils.VoidParam("sf_team_grant_access"), new Utils.VoidParam("sf_team_invite"), new Utils.VoidParam("sf_team_invite_change_role"), new Utils.VoidParam("sf_team_join"), new Utils.VoidParam("sf_team_join_from_oob_link"), new Utils.VoidParam("sf_team_uninvite"), new Utils.VoidParam("shared_content_add_invitees"), new Utils.VoidParam("shared_content_add_link_expiry"), new Utils.VoidParam("shared_content_add_link_password"), new Utils.VoidParam("shared_content_add_member"), new Utils.VoidParam("shared_content_change_downloads_policy"), new Utils.VoidParam("shared_content_change_invitee_role"), new Utils.VoidParam("shared_content_change_link_audience"), new Utils.VoidParam("shared_content_change_link_expiry"), new Utils.VoidParam("shared_content_change_link_password"), new Utils.VoidParam("shared_content_change_member_role"), new Utils.VoidParam("shared_content_change_viewer_info_policy"), new Utils.VoidParam("shared_content_claim_invitation"), new Utils.VoidParam("shared_content_copy"), new Utils.VoidParam("shared_content_download"), new Utils.VoidParam("shared_content_relinquish_membership"), new Utils.VoidParam("shared_content_remove_invitees"), new Utils.VoidParam("shared_content_remove_link_expiry"), new Utils.VoidParam("shared_content_remove_link_password"), new Utils.VoidParam("shared_content_remove_member"), new Utils.VoidParam("shared_content_request_access"), new Utils.VoidParam("shared_content_restore_invitees"), new Utils.VoidParam("shared_content_restore_member"), new Utils.VoidParam("shared_content_unshare"), new Utils.VoidParam("shared_content_view"), new Utils.VoidParam("shared_folder_change_link_policy"), new Utils.VoidParam("shared_folder_change_members_inheritance_policy"), new Utils.VoidParam("shared_folder_change_members_management_policy"), new Utils.VoidParam("shared_folder_change_members_policy"), new Utils.VoidParam("shared_folder_create"), new Utils.VoidParam("shared_folder_decline_invitation"), new Utils.VoidParam("shared_folder_mount"), new Utils.VoidParam("shared_folder_nest"), new Utils.VoidParam("shared_folder_transfer_ownership"), new Utils.VoidParam("shared_folder_unmount"), new Utils.VoidParam("shared_link_add_expiry"), new Utils.VoidParam("shared_link_change_expiry"), new Utils.VoidParam("shared_link_change_visibility"), new Utils.VoidParam("shared_link_copy"), new Utils.VoidParam("shared_link_create"), new Utils.VoidParam("shared_link_disable"), new Utils.VoidParam("shared_link_download"), new Utils.VoidParam("shared_link_remove_expiry"), new Utils.VoidParam("shared_link_settings_add_expiration"), new Utils.VoidParam("shared_link_settings_add_password"), new Utils.VoidParam("shared_link_settings_allow_download_disabled"), new Utils.VoidParam("shared_link_settings_allow_download_enabled"), new Utils.VoidParam("shared_link_settings_change_audience"), new Utils.VoidParam("shared_link_settings_change_expiration"), new Utils.VoidParam("shared_link_settings_change_password"), new Utils.VoidParam("shared_link_settings_remove_expiration"), new Utils.VoidParam("shared_link_settings_remove_password"), new Utils.VoidParam("shared_link_share"), new Utils.VoidParam("shared_link_view"), new Utils.VoidParam("shared_note_opened"), new Utils.VoidParam("shmodel_disable_downloads"), new Utils.VoidParam("shmodel_enable_downloads"), new Utils.VoidParam("shmodel_group_share"), new Utils.VoidParam("showcase_access_granted"), new Utils.VoidParam("showcase_add_member"), new Utils.VoidParam("showcase_archived"), new Utils.VoidParam("showcase_created"), new Utils.VoidParam("showcase_delete_comment"), new Utils.VoidParam("showcase_edited"), new Utils.VoidParam("showcase_edit_comment"), new Utils.VoidParam("showcase_file_added"), new Utils.VoidParam("showcase_file_download"), new Utils.VoidParam("showcase_file_removed"), new Utils.VoidParam("showcase_file_view"), new Utils.VoidParam("showcase_permanently_deleted"), new Utils.VoidParam("showcase_post_comment"), new Utils.VoidParam("showcase_remove_member"), new Utils.VoidParam("showcase_renamed"), new Utils.VoidParam("showcase_request_access"), new Utils.VoidParam("showcase_resolve_comment"), new Utils.VoidParam("showcase_restored"), new Utils.VoidParam("showcase_trashed"), new Utils.VoidParam("showcase_trashed_deprecated"), new Utils.VoidParam("showcase_unresolve_comment"), new Utils.VoidParam("showcase_untrashed"), new Utils.VoidParam("showcase_untrashed_deprecated"), new Utils.VoidParam("showcase_view"), new Utils.VoidParam("sso_add_cert"), new Utils.VoidParam("sso_add_login_url"), new Utils.VoidParam("sso_add_logout_url"), new Utils.VoidParam("sso_change_cert"), new Utils.VoidParam("sso_change_login_url"), new Utils.VoidParam("sso_change_logout_url"), new Utils.VoidParam("sso_change_saml_identity_mode"), new Utils.VoidParam("sso_remove_cert"), new Utils.VoidParam("sso_remove_login_url"), new Utils.VoidParam("sso_remove_logout_url"), new Utils.VoidParam("team_folder_change_status"), new Utils.VoidParam("team_folder_create"), new Utils.VoidParam("team_folder_downgrade"), new Utils.VoidParam("team_folder_permanently_delete"), new Utils.VoidParam("team_folder_rename"), new Utils.VoidParam("team_selective_sync_settings_changed"), new Utils.VoidParam("account_capture_change_policy"), new Utils.VoidParam("allow_download_disabled"), new Utils.VoidParam("allow_download_enabled"), new Utils.VoidParam("app_permissions_changed"), new Utils.VoidParam("camera_uploads_policy_changed"), new Utils.VoidParam("classification_change_policy"), new Utils.VoidParam("computer_backup_policy_changed"), new Utils.VoidParam("content_administration_policy_changed"), new Utils.VoidParam("data_placement_restriction_change_policy"), new Utils.VoidParam("data_placement_restriction_satisfy_policy"), new Utils.VoidParam("device_approvals_add_exception"), new Utils.VoidParam("device_approvals_change_desktop_policy"), new Utils.VoidParam("device_approvals_change_mobile_policy"), new Utils.VoidParam("device_approvals_change_overage_action"), new Utils.VoidParam("device_approvals_change_unlink_action"), new Utils.VoidParam("device_approvals_remove_exception"), new Utils.VoidParam("directory_restrictions_add_members"), new Utils.VoidParam("directory_restrictions_remove_members"), new Utils.VoidParam("emm_add_exception"), new Utils.VoidParam("emm_change_policy"), new Utils.VoidParam("emm_remove_exception"), new Utils.VoidParam("extended_version_history_change_policy"), new Utils.VoidParam("file_comments_change_policy"), new Utils.VoidParam("file_locking_policy_changed"), new Utils.VoidParam("file_requests_change_policy"), new Utils.VoidParam("file_requests_emails_enabled"), new Utils.VoidParam("file_requests_emails_restricted_to_team_only"), new Utils.VoidParam("file_transfers_policy_changed"), new Utils.VoidParam("google_sso_change_policy"), new Utils.VoidParam("group_user_management_change_policy"), new Utils.VoidParam("integration_policy_changed"), new Utils.VoidParam("member_requests_change_policy"), new Utils.VoidParam("member_send_invite_policy_changed"), new Utils.VoidParam("member_space_limits_add_exception"), new Utils.VoidParam("member_space_limits_change_caps_type_policy"), new Utils.VoidParam("member_space_limits_change_policy"), new Utils.VoidParam("member_space_limits_remove_exception"), new Utils.VoidParam("member_suggestions_change_policy"), new Utils.VoidParam("microsoft_office_addin_change_policy"), new Utils.VoidParam("network_control_change_policy"), new Utils.VoidParam("paper_change_deployment_policy"), new Utils.VoidParam("paper_change_member_link_policy"), new Utils.VoidParam("paper_change_member_policy"), new Utils.VoidParam("paper_change_policy"), new Utils.VoidParam("paper_default_folder_policy_changed"), new Utils.VoidParam("paper_desktop_policy_changed"), new Utils.VoidParam("paper_enabled_users_group_addition"), new Utils.VoidParam("paper_enabled_users_group_removal"), new Utils.VoidParam("password_strength_requirements_change_policy"), new Utils.VoidParam("permanent_delete_change_policy"), new Utils.VoidParam("reseller_support_change_policy"), new Utils.VoidParam("rewind_policy_changed"), new Utils.VoidParam("send_for_signature_policy_changed"), new Utils.VoidParam("sharing_change_folder_join_policy"), new Utils.VoidParam("sharing_change_link_policy"), new Utils.VoidParam("sharing_change_member_policy"), new Utils.VoidParam("showcase_change_download_policy"), new Utils.VoidParam("showcase_change_enabled_policy"), new Utils.VoidParam("showcase_change_external_sharing_policy"), new Utils.VoidParam("smarter_smart_sync_policy_changed"), new Utils.VoidParam("smart_sync_change_policy"), new Utils.VoidParam("smart_sync_not_opt_out"), new Utils.VoidParam("smart_sync_opt_out"), new Utils.VoidParam("sso_change_policy"), new Utils.VoidParam("team_branding_policy_changed"), new Utils.VoidParam("team_extensions_policy_changed"), new Utils.VoidParam("team_selective_sync_policy_changed"), new Utils.VoidParam("team_sharing_whitelist_subjects_changed"), new Utils.VoidParam("tfa_add_exception"), new Utils.VoidParam("tfa_change_policy"), new Utils.VoidParam("tfa_remove_exception"), new Utils.VoidParam("two_account_change_policy"), new Utils.VoidParam("viewer_info_policy_changed"), new Utils.VoidParam("watermarking_policy_changed"), new Utils.VoidParam("web_sessions_change_active_session_limit"), new Utils.VoidParam("web_sessions_change_fixed_length_policy"), new Utils.VoidParam("web_sessions_change_idle_length_policy"), new Utils.VoidParam("team_merge_from"), new Utils.VoidParam("team_merge_to"), new Utils.VoidParam("team_profile_add_background"), new Utils.VoidParam("team_profile_add_logo"), new Utils.VoidParam("team_profile_change_background"), new Utils.VoidParam("team_profile_change_default_language"), new Utils.VoidParam("team_profile_change_logo"), new Utils.VoidParam("team_profile_change_name"), new Utils.VoidParam("team_profile_remove_background"), new Utils.VoidParam("team_profile_remove_logo"), new Utils.VoidParam("tfa_add_backup_phone"), new Utils.VoidParam("tfa_add_security_key"), new Utils.VoidParam("tfa_change_backup_phone"), new Utils.VoidParam("tfa_change_status"), new Utils.VoidParam("tfa_remove_backup_phone"), new Utils.VoidParam("tfa_remove_security_key"), new Utils.VoidParam("tfa_reset"), new Utils.VoidParam("changed_enterprise_admin_role"), new Utils.VoidParam("changed_enterprise_connected_team_status"), new Utils.VoidParam("ended_enterprise_admin_session"), new Utils.VoidParam("ended_enterprise_admin_session_deprecated"), new Utils.VoidParam("enterprise_settings_locking"), new Utils.VoidParam("guest_admin_change_status"), new Utils.VoidParam("started_enterprise_admin_session"), new Utils.VoidParam("team_merge_request_accepted"), new Utils.VoidParam("team_merge_request_accepted_shown_to_primary_team"), new Utils.VoidParam("team_merge_request_accepted_shown_to_secondary_team"), new Utils.VoidParam("team_merge_request_auto_canceled"), new Utils.VoidParam("team_merge_request_canceled"), new Utils.VoidParam("team_merge_request_canceled_shown_to_primary_team"), new Utils.VoidParam("team_merge_request_canceled_shown_to_secondary_team"), new Utils.VoidParam("team_merge_request_expired"), new Utils.VoidParam("team_merge_request_expired_shown_to_primary_team"), new Utils.VoidParam("team_merge_request_expired_shown_to_secondary_team"), new Utils.VoidParam("team_merge_request_rejected_shown_to_primary_team"), new Utils.VoidParam("team_merge_request_rejected_shown_to_secondary_team"), new Utils.VoidParam("team_merge_request_reminder"), new Utils.VoidParam("team_merge_request_reminder_shown_to_primary_team"), new Utils.VoidParam("team_merge_request_reminder_shown_to_secondary_team"), new Utils.VoidParam("team_merge_request_revoked"), new Utils.VoidParam("team_merge_request_sent_shown_to_primary_team"), new Utils.VoidParam("team_merge_request_sent_shown_to_secondary_team")])
    );
    const team_log_get_events_continue_endpt = new Utils.Endpoint("team_log", "get_events/continue",
        {
            auth: "team",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "False",
            select_admin_mode: "None",
            scope: "events.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("cursor", false)
    );
    const users_features_get_values_endpt = new Utils.Endpoint("users", "features/get_values",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "account_info.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("features", false, (index: string): Utils.Parameter => new Utils.UnionParam(index, false, [new Utils.VoidParam("paper_as_files"), new Utils.VoidParam("file_locking")]))
    );
    const users_get_account_endpt = new Utils.Endpoint("users", "get_account",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "sharing.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.TextParam("account_id", false)
    );
    const users_get_account_batch_endpt = new Utils.Endpoint("users", "get_account_batch",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "sharing.read",
            is_cloud_doc_auth: "False",
        },
        new Utils.ListParam("account_ids", false, (index: string): Utils.Parameter => new Utils.TextParam(index, false))
    );
    const users_get_current_account_endpt = new Utils.Endpoint("users", "get_current_account",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "whole_team",
            scope: "account_info.read",
            is_cloud_doc_auth: "False",
        }
    );
    const users_get_space_usage_endpt = new Utils.Endpoint("users", "get_space_usage",
        {
            auth: "user",
            host: "api",
            style: "rpc",
            is_preview: "False",
            allow_app_folder_app: "True",
            select_admin_mode: "None",
            scope: "account_info.read",
            is_cloud_doc_auth: "False",
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
                                                   files_paper_create_endpt,
                                                   files_paper_update_endpt,
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
                                                   team_members_add_v2_endpt,
                                                   team_members_add_endpt,
                                                   team_members_add_job_status_get_v2_endpt,
                                                   team_members_add_job_status_get_endpt,
                                                   team_members_delete_profile_photo_v2_endpt,
                                                   team_members_delete_profile_photo_endpt,
                                                   team_members_get_available_team_member_roles_endpt,
                                                   team_members_get_info_v2_endpt,
                                                   team_members_get_info_endpt,
                                                   team_members_list_v2_endpt,
                                                   team_members_list_endpt,
                                                   team_members_list_continue_v2_endpt,
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
                                                   team_members_set_admin_permissions_v2_endpt,
                                                   team_members_set_admin_permissions_endpt,
                                                   team_members_set_profile_v2_endpt,
                                                   team_members_set_profile_endpt,
                                                   team_members_set_profile_photo_v2_endpt,
                                                   team_members_set_profile_photo_endpt,
                                                   team_members_suspend_endpt,
                                                   team_members_unsuspend_endpt,
                                                   team_namespaces_list_endpt,
                                                   team_namespaces_list_continue_endpt,
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

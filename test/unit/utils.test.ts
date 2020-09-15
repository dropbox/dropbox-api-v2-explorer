
import * as Utils from '../../src/utils';

describe("Endpoint Tests", () => {
    it("Can be constructed", (done)=> {
        const test_endpoint = new Utils.Endpoint("users", "get_current_account",
        {
            allow_app_folder_app: "True",
            is_cloud_doc_auth: "False",
            is_preview: "False",
            select_admin_mode: "whole_team",
            style: "rpc",
            auth: "user",
            host: "api",
            scope: "account_info.read",
        });
        done();
    });
});
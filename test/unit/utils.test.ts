import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as Utils from '../../src/utils';

test('Endpoint can be constructed', () => {
  const endpoint = new Utils.Endpoint('users', 'get_current_account', {
    allow_app_folder_app: 'True',
    is_cloud_doc_auth: 'False',
    is_preview: 'False',
    select_admin_mode: 'whole_team',
    style: 'rpc',
    auth: 'user',
    host: 'api',
    scope: 'account_info.read',
  });

  assert.equal(endpoint.ns, 'users');
  assert.equal(endpoint.name, 'get_current_account');
});

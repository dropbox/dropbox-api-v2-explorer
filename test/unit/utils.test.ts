import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
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

test('Highlight renders updated source without DOM mutation', () => {
  const renderJson = (value: boolean): string => renderToStaticMarkup(
    createElement(Utils.Highlight, { className: 'json' },
      createElement('span', null, JSON.stringify({ enabled: value }))),
  );

  const enabled = renderJson(true);
  const disabled = renderJson(false);

  assert.match(enabled, /hljs-attr/);
  assert.match(enabled, /hljs-keyword[^>]*>true/);
  assert.match(disabled, /hljs-keyword[^>]*>false/);
  assert.doesNotMatch(disabled, />true</);
});

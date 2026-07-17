import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { formats } from '../../src/codeview';
import { Endpoint } from '../../src/utils';

test('HTTP code view renders a hostname without a URL scheme', () => {
  const endpoint = new Endpoint('users', 'get_current_account', {
    auth: 'user',
    host: 'api',
    style: 'rpc',
  });

  const request = renderToStaticMarkup(
    formats.http.renderRPCLike(endpoint, '<ACCESS_TOKEN>', {}, []),
  );
  const requestText = request.replace(/<[^>]+>/g, '');

  assert.match(requestText, /Host: api\.dropboxapi\.com\n/);
  assert.doesNotMatch(requestText, /Host: https:\/\//);
});

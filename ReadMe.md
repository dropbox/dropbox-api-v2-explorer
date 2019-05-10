# Dropbox API v2 Explorer

A client-side web app that lets you mess around with the [Dropbox API v2](https://www.dropbox.com/developers-preview).

[Live demo.](https://dropbox.github.io/dropbox-api-v2-explorer/)

License: [MIT](License.txt)

## Development

Make sure you have Node.js

Run `git submodule init` followed by a `git submodule update` to pull in the spec and stone sub repos.

Initial setup (and every time you do a "git pull"):
1. `# npm install`
2. `# ./node_modules/.bin/typings install`  (for Typescript definition files)

Generate endpoint definition from stone spec:
- `cd codegen`
- `./run_codegen.sh`

Building:
- `# npm run build`  (builds once; output goes in "build/")
- `# npm run watch`  (builds continuously; server available at http://localhost:8042)

Deployment:
- Replace gh-pages branch of https://github.com/dropbox/dropbox-api-v2-explorer with output under "build/"

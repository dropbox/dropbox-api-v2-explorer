
Contributing
============

Make sure you have Node.js

Run `git submodule init` followed by a `git submodule update --recursive --remote` to pull in the spec and stone sub repos.

Initial setup (and every time you do a "git pull"):
1. `# npm install`

Generate endpoint definition from stone spec:
Make sure you have python with stone installed
- `cd codegen`
- `./run_codegen.sh`

Building:
- `# npm run build`  (builds once; output goes in "build/")
- `# npm run watch`  (builds continuously; server available at http://localhost:8042)
This directory will contain a program for generating code for the endpoints for the API Explorer.

There's a minimal amount of code to actually generate, since each endpoint is wrapped up into a Typescript object,
and the API Explorer uses the object's properties; thus, all we must do is generate the constructors for the objects
themselves.

I'm planning on using our existing utilities for working with Babel files, which means I'll probably also have to
figure out how to put the API Explorer into the main codebase at the same time.

#!/usr/bin/env bash

set -euo pipefail

# Arun Debray
# 27 July 2015

# Quick wrapper for how to run the code generator from any working directory.
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$script_dir"

PYTHONPATH=stone python3 -m stone.cli -a:all codegen.stoneg.py ../src spec/*.stone

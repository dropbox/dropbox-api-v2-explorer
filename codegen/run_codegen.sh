#!/bin/bash

# Arun Debray
# 27 July 2015

# Quick wrapper for how to run my code generator
# Will be edited as necessary (e.g. with the correct path)
PYTHONPATH=stone python -m stone.cli -a:all codegen.stoneg.py test_output spec/*.stone

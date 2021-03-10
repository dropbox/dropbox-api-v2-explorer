#!/usr/bin/env python2.6

from __future__ import (
    print_function,
    unicode_literals
)

# somehow have to make this work. Maybe symbolic links?
from stone.ir.data_types import (
    is_boolean_type,
    is_float_type,
    is_integer_type,
    is_list_type,
    is_nullable_type,
    is_string_type,
    is_struct_type,
    is_timestamp_type,
    is_union_type,
    is_void_type
)
from stone.backend import CodeBackend

import copy

class APIEndpointGenerator(CodeBackend):
    """Generates API Endpoint objects for the API explorer."""

    endpoint_vars = []

    def generate(self, api):
        with self.output_to_relative_path('../../src/endpoints.ts'):
            self.outputHeader()
            with self.indent():
                for namespace in api.namespaces.values():
                    self.emit_namespace(namespace)
                self.emit()
                self.generate_multiline_list(self.endpoint_vars,
                                            delim=('',''),
                                            before='export const endpointList: Utils.Endpoint[] = [',
                                            after='];')
            self.outputFooter()

    def outputHeader(self):
        self.emit('// Automatically generated code; do not edit')
        self.emit()
        self.emit("import * as Utils from './utils';")
        self.emit()
        self.emit('module Endpoints {')

    def outputFooter(self):
        self.emit('}')
        self.emit()
        self.emit('export = Endpoints;')

    def emit_namespace(self, namespace):
        for route in namespace.routes:
            if not route.deprecated:  # Skip deprecated route.
                self.emit_route(namespace, route)


    def emit_route(self, namespace, route):
        self.endpoint_vars.append(self._var_name(route, namespace))

        def get_param_list():
            if is_union_type(route.arg_data_type):
                return [self.data_type_constructor(route.arg_data_type, "''", is_root=True)]
            else:
                return map(self.parameter_constructor, route.arg_data_type.all_fields)

        def is_empty_type(arg_type):
            return is_void_type(arg_type) or len(arg_type.all_fields) == 0

        # Right now, this is just upload_session_start
        if is_empty_type(route.arg_data_type) and 'style' in route.attrs and route.attrs['style'] == 'upload':
            self.emit('const {0} = new Utils.Endpoint("{1}", "{2}",'.format(
                self._var_name(route, namespace),
                namespace.name,
                self._route_name(route)
            ))
            with self.indent():
                self._emit_attr_dict(route.attrs)
                self.emit('new Utils.FileParam()')
            self.emit(');')

        elif 'style' in route.attrs and route.attrs['style'] == 'upload': # is upload-style, not void
            self.emit('const {0} = new Utils.Endpoint("{1}", "{2}",'.format(
                self._var_name(route, namespace),
                namespace.name,
                self._route_name(route)
            ))

            with self.indent():
                self._emit_attr_dict(route.attrs)
                self.emit('new Utils.FileParam(),')
                self.generate_multiline_list(get_param_list(), delim=('',''))
            self.emit(');')
        elif not is_empty_type(route.arg_data_type): # not upload style, and has params
            self.emit('const {0} = new Utils.Endpoint("{1}", "{2}",'.format(
                self._var_name(route, namespace),
                namespace.name,
                self._route_name(route)
            ))
            with self.indent():
                self._emit_attr_dict(route.attrs)
                self.generate_multiline_list(get_param_list(), delim=('',''))
            self.emit(');')
        else: # void, but not upload_style
            self.emit('const {0} = new Utils.Endpoint("{1}", "{2}",'.format(
                self._var_name(route, namespace),
                namespace.name,
                self._route_name(route)
            ))
            with self.indent():
                self._emit_attr_dict(route.attrs,  True)
            self.emit(');')

    def _route_name(self, route):
        if route.version == 1:
            return route.name
        else:
            return '{}_v{}'.format(route.name, route.version)

    # converts route name into Typescript variable name
    def _var_name(self, route, namespace):
        route_name = self._route_name(route)
        return namespace.name + '_' + route_name.replace('/', '_') + '_endpt'

    # Emit route attrs to dict.
    def _emit_attr_dict(self, attrs, is_last=False):
        close = '}' if is_last else  '},'
        if not attrs:
            self.emit('{' + close)
            return

        self.emit('{')
        with self.indent():
            for k, v in attrs.items():
                self.emit('{0}: "{1}",'.format(k, v))
        self.emit(close)

    # Pattern-match on the type of the parameter
    # was_nullable indicates that this was wrapped in a nullable type.
    # A parameter is optional if it was nullable or it has a default value.
    def parameter_constructor(self, param, was_nullable=None):
        # TODO: we can't guarantee that param has a 'has_default' attribute
        has_default = getattr(param, 'has_default', False)
        return self.data_type_constructor(param.data_type, '"{0}"'.format(param.name),
                                          has_default=has_default, was_nullable=was_nullable)

    def data_type_constructor(self, data_type, name, has_default=False, was_nullable=False, is_root=False):
        optional = self._emit_bool(has_default or was_nullable)
        # Since params are reused between different endpoints, making a copy prevents
        # one parameter from overwriting information about another's arguments.
        if is_nullable_type(data_type):
            return self.data_type_constructor(data_type.data_type, name, was_nullable=True)
        if is_integer_type(data_type):
            return 'new Utils.IntParam({0}, {1})'.format(name, optional)
        elif is_float_type(data_type):
            return 'new Utils.FloatParam({0}, {1})'.format(name, optional)
        # It would be nice to separate timestamps out (e.g. a bunch of selectors!)
        elif is_string_type(data_type) or is_timestamp_type(data_type):
            return 'new Utils.TextParam({0}, {1})'.format(name, optional)
        elif is_boolean_type(data_type):
            return 'new Utils.BoolParam({0}, {1})'.format(name, optional)
        elif is_union_type(data_type) or is_struct_type(data_type):
            # would be nice to make this prettier
            if is_union_type(data_type):
                param_type = 'RootUnionParam' if is_root else 'UnionParam'
            else:
                param_type = 'StructParam'

            return 'new Utils.{0}({1}, {2}, {3})'.format(
                param_type,
                name,
                optional,
                '[' + ', '.join(self.parameter_constructor(field) for field in data_type.all_fields if field.name != 'other') + ']',
            )
        elif is_void_type(data_type):
            return 'new Utils.VoidParam({0})'.format(name)
        elif is_list_type(data_type):
            return 'new Utils.ListParam({0}, {1}, (index: string): Utils.Parameter => {2})'.format(
                name,
                optional,
                self.data_type_constructor(data_type.data_type, 'index'))
        else:
            return 'null /* not implemented yet */'

    # emit Typescript representation of boolean
    def _emit_bool(self, b):
        return 'true' if b else 'false'

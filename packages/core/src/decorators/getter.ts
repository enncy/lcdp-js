import { CustomDecorator } from 'custom-decorator';
import { Controller, ControllerMetadata } from './controller/controller';
import { Api, ApiMetadata } from './controller/api';
import { Param, ParamMetadata } from './controller/param';
import { Table, TableMetadata } from './table';
import { TableItem, TableItemMetadata } from './table.item';
import { TableItemRef, TableItemRefMetadata } from './table.item.ref';
import { TableItemProvider, TableItemProviderMetadata } from './table.item.provider';
import { Route, RouteMetadata } from './route';

const get = CustomDecorator.defineGetter<{
	Controller: [typeof Controller, ControllerMetadata];
	Api: [typeof Api, ApiMetadata];
	Route: [typeof Route, RouteMetadata];
	Param: [typeof Param, ParamMetadata];
	Table: [typeof Table, TableMetadata<any, any>];
	TableItem: [typeof TableItem, TableItemMetadata];
	TableItemRef: [typeof TableItemRef, TableItemRefMetadata<any, any>];
	TableItemProvider: [typeof TableItemProvider, TableItemProviderMetadata<any, any>];
}>();

export { get as MetadataGetter };

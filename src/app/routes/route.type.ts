// shared type for routing system

import type { JSONSchemaType } from "ajv";
import type { RequestHandler, NextFunction } from "express";

export type HTTPMethod = "get" | "post" | "put" | "patch" | "delete";

export type RouteDefinition = {
    path: string;

    controller: Partial<Record<HTTPMethod, RequestHandler | NextFunction>>;

    validators?: Partial<Record<HTTPMethod, JSONSchemaType<any> | object>>;

    middlewares?: Partial<Record<HTTPMethod, RequestHandler | RequestHandler[]>>;

    version?: string; // api versioning
}

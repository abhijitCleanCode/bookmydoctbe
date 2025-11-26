import { Request } from "express";

export interface AuthPayload {
    _id: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
    [key: string]: any; // this add flexibility of adding more fields
}

export interface AuthenticatedRequest<
    P = any,
    ResBody = any,
    ReqBody = any,
    ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
    user?: AuthPayload;
}

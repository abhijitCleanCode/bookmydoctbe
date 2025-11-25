import { Request, Response, NextFunction } from "express";
import Ajv, { JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";

import { ApiError } from "@core/ApiError";

const ajv = new Ajv({ allErrors: true, removeAdditional: true });
addFormats(ajv);

export const validate = <T>(schema: JSONSchemaType<T>) => (req: Request, res: Response, next: NextFunction) => {
    const validateFn = ajv.compile(schema);

    const data = {
        ...req.body
    };

    const isValid = validateFn(data);

    if (!isValid) {
        const errors = validateFn.errors?.map((e) => e.message).join(", ");
        throw new ApiError(`Validation Error: ${errors}`, 400);
    }

    next();
}

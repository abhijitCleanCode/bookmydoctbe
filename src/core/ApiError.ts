export class ApiError extends Error {
    statusCode: number;
    originalError?: Error;

    constructor(error: string | Error, statusCode = 500) {
        const message = typeof error === "string" ? error : error.message;
        super(message);

        this.statusCode = statusCode;

        if (error instanceof Error) {
            this.originalError = error;
            this.stack = error.stack;
        }

        Error.captureStackTrace(this, this.constructor);
    }
}

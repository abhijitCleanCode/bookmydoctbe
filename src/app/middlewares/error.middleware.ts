import { Request, Response, NextFunction } from "express";

const isDev = process.env.NODE_ENV === "development";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const status = err.statusCode || 500;

    res.status(status).json({
        success: false,
        message: err.message || "Something went wrong",
        error: {
            name: err.name || "Error",
            stack: isDev ? err.stack : undefined
        },
        path: req.originalUrl,
        timestamp: new Date().toISOString()
    })
}

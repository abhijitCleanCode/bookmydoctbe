// builds routes dynamically

import { Router } from "express";
import { RouteDefinition, HTTPMethod } from "@app/routes/route.type";

export const buildRouter = (routes: RouteDefinition[]) => {
  const router = Router();

  for (const route of routes) {
    const { path, controller, validators, middlewares } = route;

    for (const method of Object.keys(controller) as HTTPMethod[]) {
      const handler = controller[method];
      if (!handler) continue;

      const methodMiddlewares: any[] = [];

      const mws = middlewares?.[method];
      if (Array.isArray(mws)) methodMiddlewares.push(...mws);
      else if (mws) methodMiddlewares.push(mws);

      if (validators?.[method]) {
        methodMiddlewares.push(validators[method] as any);
      }

      router[method](path, ...methodMiddlewares, handler);
    }
  }

  return router;
};

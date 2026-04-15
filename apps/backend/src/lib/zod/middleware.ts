import type { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export const validate = (schema: ZodObject) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate body, query, and params at once if needed
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(`{"message":"Cannot validate request with zod: + ${error.message}"`);
      }
      return res.status(500).json({ message: "Cannot validate request with zod: " });
    }
};
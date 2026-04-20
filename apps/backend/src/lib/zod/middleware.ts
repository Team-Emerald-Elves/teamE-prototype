import type { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export const validate = (schema: ZodObject) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate body, query, and params at once if needed
      
      schema.parse({
        ...req.body,
        ...req.query,
        ...req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).send(error.message);
      }
      return res.status(500).json({ message: "Cannot validate request with zod: " });
    }
};
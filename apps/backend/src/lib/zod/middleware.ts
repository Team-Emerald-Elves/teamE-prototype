import type { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

const validate =
    (schema: ZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate body, query, and params at once if needed

            const parsingData = {
                ...req.body,
                ...req.query,
                ...req.params,
            };

            //console.log(parsingData)
            schema.parse(parsingData);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).send(error.message);
            }
            return res.status(500).json({
                message: `Cannot validate request with zod: (${error})`,
            });
        }
    };

export default validate;

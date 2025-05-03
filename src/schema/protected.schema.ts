import { z } from "zod";
import { nameValidation } from "./name.schema";

export const protectedSchema= z.object({
    name:nameValidation,
    password:z.string()
            .min(6, { message: "Password must be at least 6 characters long" })
})


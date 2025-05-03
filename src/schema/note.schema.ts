import { z } from "zod";
import { nameValidation } from "./name.schema";



export const noteSchema = z
  .object({
    name: nameValidation,
    content: z
      .string()
      .trim()
      .min(1, { message: "Content cannot be empty" }),
    isProtected: z.boolean(),
    password: z.string(),
    expiry: z.number(),
  })
  .refine(
    (data) => {
      if (data.isProtected) {
        return typeof data.password === "string" && data.password.length >= 6;
      }
      return true;
    },
    {
      message: "Password must be at least 6 characters when protected",
      path: ["password"],
    }
  );

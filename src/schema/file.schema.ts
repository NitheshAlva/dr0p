import { z } from "zod";
import { nameValidation } from "./name.schema";

export const fileSchema = z
  .object({
    name: nameValidation,
    file: z
    .any()
    .refine((file) => file?.length === 1, {
      message: "File is required",
    })
    .refine((file) => file?.[0]?.size < 10 * 1024 * 1024, {
      message: "Max file size is 10MB",
    }),
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

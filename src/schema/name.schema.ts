import { z } from "zod";

export const nameValidation = z
.string()
.trim()
.min(3, { message: "Name must be at least 3 characters long" })
.max(20, { message: "Name must be at most 20 characters long" })
.regex(/^[a-zA-Z0-9-]+$/, {
  message: "Name can only contain letters, numbers, and hyphens",
})
import zod from "zod";

// ------------------------------ Sign up schema ------------------------------
export const signupSchema = zod
  .object({
    "first-name": zod
      .string()
      .trim()
      .min(2, "First name is too short.")
      .max(100, "First name is too long."),
    "last-name": zod
      .string()
      .trim()
      .min(2, "Last name is too short.")
      .max(100, "Last name is too long."),
    email: zod.string().trim().email("Invalid email format.").toLowerCase(),
    password: zod
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(82, "Password is too long."),
    "confirm-password": zod
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(82, "Password is too long."),
  })
  .refine((data) => data.password === data["confirm-password"], {
    field: "confirm-password",
    path: ["Passwords don't match"],
  });

// ------------------------------ Log in schema ------------------------------
export const loginSchema = zod.object({
  email: zod.string().trim().email("Invalid email format.").toLowerCase(),
  password: zod.string().min(1, "Password is required."),
});

"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { registerSchema } from "@/lib/validations/auth";

type ActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function registerAction(formData: FormData): Promise<ActionResult> {
  const rawData = {
    name: formData.get("name") as string,
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = registerSchema.safeParse(rawData);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.errors.forEach((err) => {
      if (err.path[0]) {
        fieldErrors[err.path[0] as string] = err.message;
      }
    });
    return { success: false, fieldErrors };
  }

  const { name, username, email, password } = parsed.data;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return { success: false, error: "Las credenciales ya están en uso" };
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.create({
      data: {
        name,
        username,
        email,
        passwordHash,
      },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Error al crear la cuenta" };
  }
}

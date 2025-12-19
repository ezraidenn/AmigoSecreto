"use server";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validations/auth";

type ActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function loginAction(formData: FormData): Promise<ActionResult> {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(rawData);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.errors.forEach((err) => {
      if (err.path[0]) {
        fieldErrors[err.path[0] as string] = err.message;
      }
    });
    return { success: false, fieldErrors };
  }

  const { email, password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "Credenciales inválidas" };
    }

    const validPassword = await verifyPassword(password, user.passwordHash);

    if (!validPassword) {
      return { success: false, error: "Credenciales inválidas" };
    }

    await createSession(user.id);

    return { success: true };
  } catch {
    return { success: false, error: "Error al iniciar sesión" };
  }
}

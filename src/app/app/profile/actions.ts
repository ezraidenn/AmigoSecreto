"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { updateProfileSchema, changePasswordSchema } from "@/lib/validations/auth";

type ActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function updateNameAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  
  const rawData = {
    name: formData.get("name") as string,
  };

  const parsed = updateProfileSchema.safeParse(rawData);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.errors.forEach((err) => {
      if (err.path[0]) {
        fieldErrors[err.path[0] as string] = err.message;
      }
    });
    return { success: false, fieldErrors };
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { name: parsed.data.name },
    });

    revalidatePath("/app/profile");
    revalidatePath("/app/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Error al actualizar el nombre" };
  }
}

export async function changePasswordAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  
  const rawData = {
    currentPassword: formData.get("currentPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = changePasswordSchema.safeParse(rawData);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.errors.forEach((err) => {
      if (err.path[0]) {
        fieldErrors[err.path[0] as string] = err.message;
      }
    });
    return { success: false, fieldErrors };
  }

  try {
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });

    if (!fullUser) {
      return { success: false, error: "Usuario no encontrado" };
    }

    const validPassword = await verifyPassword(
      parsed.data.currentPassword,
      fullUser.passwordHash
    );

    if (!validPassword) {
      return { success: false, fieldErrors: { currentPassword: "Contraseña actual incorrecta" } };
    }

    const newPasswordHash = await hashPassword(parsed.data.newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Error al cambiar la contraseña" };
  }
}

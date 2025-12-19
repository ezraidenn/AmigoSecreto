import { z } from "zod";

const INVITE_CODE_LENGTH = parseInt(process.env.INVITE_CODE_LENGTH || "8", 10);

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres"),
});

export const joinGroupSchema = z.object({
  inviteCode: z
    .string()
    .transform((val) => val.trim().toUpperCase())
    .pipe(
      z
        .string()
        .length(INVITE_CODE_LENGTH, `El código debe tener ${INVITE_CODE_LENGTH} caracteres`)
    ),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type JoinGroupInput = z.infer<typeof joinGroupSchema>;

import { z } from "zod";

const INVITE_CODE_LENGTH = parseInt(process.env.INVITE_CODE_LENGTH || "8", 10);

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres"),
  description: z
    .string()
    .max(500, "La descripción no puede tener más de 500 caracteres")
    .optional()
    .transform((val) => val?.trim() || null),
  location: z
    .string()
    .max(100, "El lugar no puede tener más de 100 caracteres")
    .optional()
    .transform((val) => val?.trim() || null),
  budgetMin: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === "") return null;
      const num = parseInt(val, 10);
      return isNaN(num) ? null : num;
    }),
  budgetMax: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === "") return null;
      const num = parseInt(val, 10);
      return isNaN(num) ? null : num;
    }),
  eventDate: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === "") return null;
      const date = new Date(val);
      return isNaN(date.getTime()) ? null : date;
    }),
});

export const updateGroupSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres"),
  description: z
    .string()
    .max(500, "La descripción no puede tener más de 500 caracteres")
    .optional()
    .transform((val) => val?.trim() || null),
  location: z
    .string()
    .max(100, "El lugar no puede tener más de 100 caracteres")
    .optional()
    .transform((val) => val?.trim() || null),
  budgetMin: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === "") return null;
      const num = parseInt(val, 10);
      return isNaN(num) ? null : num;
    }),
  budgetMax: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === "") return null;
      const num = parseInt(val, 10);
      return isNaN(num) ? null : num;
    }),
  eventDate: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === "") return null;
      const date = new Date(val);
      return isNaN(date.getTime()) ? null : date;
    }),
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
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;
export type JoinGroupInput = z.infer<typeof joinGroupSchema>;

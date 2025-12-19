"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordAction } from "./actions";

export function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setErrors({});

    const result = await changePasswordAction(formData);

    if (result.success) {
      toast.success("Contraseña actualizada");
      const form = document.getElementById("password-form") as HTMLFormElement;
      form?.reset();
    } else {
      if (result.fieldErrors) {
        setErrors(result.fieldErrors);
      }
      if (result.error) {
        toast.error(result.error);
      }
    }

    setLoading(false);
  }

  return (
    <form id="password-form" action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Contraseña actual</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          placeholder="••••••••"
          disabled={loading}
          className="h-12"
        />
        {errors.currentPassword && (
          <p className="text-sm text-destructive">{errors.currentPassword}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="newPassword">Nueva contraseña</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder="••••••••"
          disabled={loading}
          className="h-12"
        />
        {errors.newPassword && (
          <p className="text-sm text-destructive">{errors.newPassword}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          disabled={loading}
          className="h-12"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword}</p>
        )}
      </div>
      
      <Button type="submit" disabled={loading} className="min-h-[44px]">
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <KeyRound className="mr-2 h-4 w-4" />
        )}
        Cambiar contraseña
      </Button>
    </form>
  );
}

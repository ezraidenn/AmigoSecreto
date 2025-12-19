"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createGroupAction } from "./actions";

export function CreateGroupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await createGroupAction(formData);

    if (result.success && result.groupId) {
      toast.success("Grupo creado exitosamente");
      router.push(`/app/group/${result.groupId}`);
    } else {
      toast.error(result.error || "Error al crear el grupo");
    }

    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del grupo</Label>
        <Input
          id="name"
          name="name"
          placeholder="Ej: Familia López"
          disabled={loading}
        />
      </div>
      <Button type="submit" className="w-full min-h-[44px]" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Crear grupo
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createGroupAction } from "./actions";

export function CreateGroupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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
        <Label htmlFor="name">Nombre del grupo *</Label>
        <Input
          id="name"
          name="name"
          placeholder="Ej: Familia López"
          disabled={loading}
        />
      </div>

      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        {showDetails ? "Menos opciones" : "Más opciones"}
      </button>

      {showDetails && (
        <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              name="description"
              placeholder="Ej: Intercambio navideño 2024"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lugar del intercambio</Label>
            <Input
              id="location"
              name="location"
              placeholder="Ej: Casa de la abuela"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Presupuesto (opcional)</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="budgetMin"
                name="budgetMin"
                type="number"
                placeholder="Mín"
                disabled={loading}
                className="w-24"
              />
              <span className="text-muted-foreground">a</span>
              <Input
                id="budgetMax"
                name="budgetMax"
                type="number"
                placeholder="Máx"
                disabled={loading}
                className="w-24"
              />
            </div>
            <p className="text-xs text-muted-foreground">Deja vacío para sin límite</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventDate">Fecha y hora del intercambio</Label>
            <Input
              id="eventDate"
              name="eventDate"
              type="datetime-local"
              disabled={loading}
            />
          </div>
        </div>
      )}

      <Button type="submit" className="w-full min-h-[44px]" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Crear grupo
      </Button>
    </form>
  );
}

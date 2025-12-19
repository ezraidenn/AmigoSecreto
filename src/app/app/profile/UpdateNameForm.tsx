"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateNameAction } from "./actions";

interface UpdateNameFormProps {
  currentName: string;
}

export function UpdateNameForm({ currentName }: UpdateNameFormProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(currentName);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const result = await updateNameAction(formData);

    if (result.success) {
      toast.success("Nombre actualizado");
    } else {
      if (result.fieldErrors?.name) {
        setError(result.fieldErrors.name);
      } else if (result.error) {
        toast.error(result.error);
      }
    }

    setLoading(false);
  }

  const hasChanged = name !== currentName;

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre completo"
          disabled={loading}
          className="h-12"
        />
        <p className="text-xs text-muted-foreground">
          Este nombre se mostrará en los grupos y sorteos
        </p>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
      <Button 
        type="submit" 
        disabled={loading || !hasChanged || !name.trim()}
        className="min-h-[44px]"
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Check className="mr-2 h-4 w-4" />
        )}
        Guardar cambios
      </Button>
    </form>
  );
}

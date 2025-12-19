"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { startDrawAction } from "./actions";

interface StartDrawButtonProps {
  groupId: string;
  memberCount: number;
}

export function StartDrawButton({ groupId, memberCount }: StartDrawButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleStartDraw() {
    setLoading(true);
    const result = await startDrawAction(groupId);

    if (result.success) {
      toast.success("¡Sorteo realizado exitosamente!");
      setOpen(false);
    } else {
      toast.error(result.error || "Error al iniciar el sorteo");
    }

    setLoading(false);
  }

  const canStart = memberCount >= 2;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="min-h-[44px]" disabled={!canStart}>
          <Shuffle className="h-4 w-4 mr-2" />
          Iniciar sorteo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Iniciar el sorteo?</DialogTitle>
          <DialogDescription>
            Esta acción asignará aleatoriamente un amigo secreto a cada miembro.
            <strong className="block mt-2">Esta acción no se puede deshacer.</strong>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleStartDraw} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar sorteo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

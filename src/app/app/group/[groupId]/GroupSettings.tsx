"use client";

import { useState } from "react";
import { toast } from "sonner";
import { 
  Settings, 
  Pencil, 
  Trash2, 
  RefreshCw, 
  LogOut, 
  UserMinus,
  Loader2,
  AlertTriangle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  updateGroupNameAction,
  deleteGroupAction,
  regenerateInviteCodeAction,
  leaveGroupAction,
} from "./group-actions";

interface GroupSettingsProps {
  groupId: string;
  groupName: string;
  isOwner: boolean;
  isDrawStarted: boolean;
}

export function GroupSettings({ groupId, groupName, isOwner, isDrawStarted }: GroupSettingsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState(groupName);

  async function handleUpdateName() {
    setLoading(true);
    const result = await updateGroupNameAction(groupId, newName);
    if (result.success) {
      toast.success("Nombre actualizado");
      setEditOpen(false);
    } else {
      toast.error(result.error || "Error al actualizar");
    }
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteGroupAction(groupId);
    } catch {
      toast.error("Error al eliminar el grupo");
      setLoading(false);
    }
  }

  async function handleLeave() {
    setLoading(true);
    try {
      await leaveGroupAction(groupId);
    } catch {
      toast.error("Error al abandonar el grupo");
      setLoading(false);
    }
  }

  async function handleRegenerateCode() {
    setLoading(true);
    const result = await regenerateInviteCodeAction(groupId);
    if (result.success) {
      toast.success("Código regenerado");
    } else {
      toast.error(result.error || "Error al regenerar código");
    }
    setLoading(false);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="min-h-[44px] min-w-[44px]">
            <Settings className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Opciones del grupo</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {isOwner && !isDrawStarted && (
            <>
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Editar nombre
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRegenerateCode} disabled={loading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerar código
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {isOwner ? (
            <DropdownMenuItem 
              onClick={() => setDeleteOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar grupo
            </DropdownMenuItem>
          ) : !isDrawStarted ? (
            <DropdownMenuItem 
              onClick={() => setLeaveOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Abandonar grupo
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Name Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar nombre del grupo</DialogTitle>
            <DialogDescription>
              Cambia el nombre de tu grupo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nombre del grupo"
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateName} disabled={loading || !newName.trim()}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Group Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Eliminar grupo
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar <strong>{groupName}</strong>?
              <br />
              <span className="text-destructive font-medium">
                Esta acción no se puede deshacer.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Group Dialog */}
      <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Abandonar grupo
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas abandonar <strong>{groupName}</strong>?
              <br />
              Podrás volver a unirte con el código de invitación.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setLeaveOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleLeave} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Abandonar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface RemoveMemberButtonProps {
  groupId: string;
  memberId: string;
  memberName: string;
}

export function RemoveMemberButton({ groupId, memberId, memberName }: RemoveMemberButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRemove() {
    setLoading(true);
    const { removeMemberAction } = await import("./group-actions");
    const result = await removeMemberAction(groupId, memberId);
    if (result.success) {
      toast.success(`${memberName} fue removido del grupo`);
      setOpen(false);
    } else {
      toast.error(result.error || "Error al remover miembro");
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
          <UserMinus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover miembro</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas remover a <strong>{memberName}</strong> del grupo?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleRemove} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Remover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinGroupAction } from "./actions";

export function JoinGroupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await joinGroupAction(formData);

    if (result.success && result.groupId) {
      toast.success("Te uniste al grupo");
      router.push(`/app/group/${result.groupId}`);
    } else {
      toast.error(result.error || "Error al unirse");
    }

    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="inviteCode">Código de invitación</Label>
        <Input
          id="inviteCode"
          name="inviteCode"
          placeholder="Ej: ABC12345"
          className="uppercase font-mono"
          disabled={loading}
        />
      </div>
      <Button type="submit" className="w-full min-h-[44px]" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Unirse
      </Button>
    </form>
  );
}

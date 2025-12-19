import { requireUser } from "@/lib/auth/session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Motion, MotionCard } from "@/components/motion";
import { AppHeader } from "@/components/app/AppHeader";
import { User, Lock } from "lucide-react";
import { UpdateNameForm } from "./UpdateNameForm";
import { ChangePasswordForm } from "./ChangePasswordForm";

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <AppHeader username={user.username} />
      
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-2xl">
        <Motion variant="fadeInUp">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Mi Perfil</h1>
            <p className="text-muted-foreground">Administra tu información personal</p>
          </div>
        </Motion>

        <div className="space-y-6">
          <MotionCard delay={0.1}>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Información personal
                </CardTitle>
                <CardDescription>
                  Actualiza tu nombre y datos básicos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Usuario</p>
                    <p className="font-medium">@{user.username}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <UpdateNameForm currentName={user.name} />
                </div>
              </CardContent>
            </Card>
          </MotionCard>

          <MotionCard delay={0.2}>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Seguridad
                </CardTitle>
                <CardDescription>
                  Cambia tu contraseña
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChangePasswordForm />
              </CardContent>
            </Card>
          </MotionCard>
        </div>
      </main>
    </div>
  );
}

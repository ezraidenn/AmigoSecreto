import Link from "next/link";
import { Users, Plus, Key, ArrowRight, Gift, Sparkles, CheckCircle2 } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { listUserGroups } from "@/lib/groups/service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Motion, MotionCard, MotionList, MotionItem, Float } from "@/components/motion";
import { AppHeader } from "@/components/app/AppHeader";
import { CreateGroupForm } from "./CreateGroupForm";
import { JoinGroupForm } from "./JoinGroupForm";

export default async function DashboardPage() {
  const user = await requireUser();
  const groups = await listUserGroups(user.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <AppHeader username={user.username} />
      
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        <Motion variant="fadeInUp">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <Gift className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Mis Grupos</h1>
              <p className="text-sm text-muted-foreground">Hola, {user.username} 👋</p>
            </div>
          </div>
        </Motion>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MotionCard delay={0.1} className="md:col-span-2 lg:col-span-2">
            <Card className="border-0 shadow-lg h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Tus grupos
                </CardTitle>
                <CardDescription>
                  Grupos donde participas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {groups.length === 0 ? (
                  <div className="text-center py-12">
                    <Float>
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                        <Users className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </Float>
                    <p className="font-medium text-foreground mb-1">Aún no tienes grupos</p>
                    <p className="text-sm text-muted-foreground">Crea uno o únete con un código de invitación</p>
                  </div>
                ) : (
                  <MotionList className="space-y-3">
                    {groups.map((group) => (
                      <MotionItem key={group.id}>
                        <Link href={`/app/group/${group.id}`}>
                          <div className="flex items-center justify-between p-4 rounded-xl border bg-gradient-to-r from-card to-card/50 hover:from-accent/50 hover:to-accent/30 transition-all shadow-sm hover:shadow-md group">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium truncate">{group.name}</span>
                                <Badge variant={group.role === "OWNER" ? "default" : "secondary"} className="text-xs">
                                  {group.role === "OWNER" ? "Dueño" : "Miembro"}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {group.memberCount}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  {group.isDrawStarted ? (
                                    <>
                                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                                      <span className="text-green-600">Sorteado</span>
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="h-3 w-3" />
                                      Pendiente
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Link>
                      </MotionItem>
                    ))}
                  </MotionList>
                )}
              </CardContent>
            </Card>
          </MotionCard>

          <div className="space-y-6">
            <MotionCard delay={0.2}>
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-500/10 to-green-600/5 pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-green-600" />
                    Crear grupo
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <CreateGroupForm />
                </CardContent>
              </Card>
            </MotionCard>

            <MotionCard delay={0.3}>
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-blue-600" />
                    Unirse con código
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <JoinGroupForm />
                </CardContent>
              </Card>
            </MotionCard>
          </div>
        </div>
      </main>
    </div>
  );
}

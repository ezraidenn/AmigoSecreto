import Link from "next/link";
import { ArrowLeft, Copy, Users, Gift, Crown, Sparkles } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getGroupOverview } from "@/lib/groups/service";
import { getMyAssignment } from "@/lib/draw/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Motion, MotionCard, RevealText, Float } from "@/components/motion";
import { AppHeader } from "@/components/app/AppHeader";
import { CopyButton } from "./CopyButton";
import { StartDrawButton } from "./StartDrawButton";
import { GroupSettings, RemoveMemberButton } from "./GroupSettings";

interface PageProps {
  params: Promise<{ groupId: string }>;
}

export default async function GroupPage({ params }: PageProps) {
  const { groupId } = await params;
  const user = await requireUser();
  
  let groupData;
  try {
    groupData = await getGroupOverview(user.id, groupId);
  } catch {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader username={user.username} />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">No tienes acceso a este grupo</p>
              <Button asChild>
                <Link href="/app/dashboard">Volver al dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const assignment = groupData.isDrawStarted 
    ? await getMyAssignment(user.id, groupId) 
    : null;

  const isOwner = groupData.currentUserRole === "OWNER";

  return (
    <div className="min-h-screen bg-background">
      <AppHeader username={user.username} />
      
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <Motion>
          <div className="flex items-center justify-between gap-2 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/dashboard">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            </Button>
            <GroupSettings 
              groupId={groupId}
              groupName={groupData.name}
              isOwner={isOwner}
              isDrawStarted={groupData.isDrawStarted}
            />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-6">{groupData.name}</h1>
        </Motion>

        <div className="grid gap-6 md:grid-cols-2">
          <MotionCard delay={0.1}>
            <Card className="h-full border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Copy className="h-5 w-5 text-primary" />
                  Código de invitación
                </CardTitle>
                <CardDescription>
                  Comparte este código para que otros se unan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-4 py-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl font-mono text-lg break-all border">
                    {groupData.inviteCode}
                  </code>
                  <CopyButton text={groupData.inviteCode} />
                </div>
              </CardContent>
            </Card>
          </MotionCard>

          <MotionCard delay={0.2}>
            <Card className="h-full border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Miembros ({groupData.members.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {groupData.members.map((member) => (
                    <li key={member.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-sm font-medium">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="flex-1">{member.name}</span>
                      {member.role === "OWNER" && (
                        <Badge variant="secondary" className="text-xs">
                          <Crown className="h-3 w-3 mr-1" />
                          Dueño
                        </Badge>
                      )}
                      {isOwner && member.role !== "OWNER" && !groupData.isDrawStarted && (
                        <RemoveMemberButton 
                          groupId={groupId}
                          memberId={member.id}
                          memberName={member.name}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </MotionCard>

          <MotionCard delay={0.3} className="md:col-span-2">
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  Tu asignación
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {!groupData.isDrawStarted ? (
                  <div className="text-center py-8">
                    <Float>
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                        <Gift className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </Float>
                    <p className="text-muted-foreground mb-4">
                      El sorteo aún no ha sido iniciado
                    </p>
                    {isOwner && (
                      <Motion variant="fadeInUp" delay={0.2}>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            Como dueño del grupo, puedes iniciar el sorteo cuando todos estén listos
                          </p>
                          <StartDrawButton 
                            groupId={groupId} 
                            memberCount={groupData.members.length} 
                          />
                        </div>
                      </Motion>
                    )}
                    {!isOwner && (
                      <p className="text-sm text-muted-foreground">
                        Espera a que el dueño inicie el sorteo
                      </p>
                    )}
                  </div>
                ) : assignment ? (
                  <div className="text-center py-8">
                    <RevealText delay={0.1}>
                      <p className="text-sm text-muted-foreground mb-3">
                        Le regalarás a:
                      </p>
                    </RevealText>
                    <RevealText delay={0.3}>
                      <div className="relative inline-block">
                        <Sparkles className="absolute -top-2 -left-4 h-5 w-5 text-yellow-500 animate-pulse" />
                        <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent py-2">
                          {assignment.receiverName}
                        </p>
                        <Sparkles className="absolute -bottom-1 -right-4 h-5 w-5 text-yellow-500 animate-pulse" />
                      </div>
                    </RevealText>
                    <RevealText delay={0.5}>
                      <p className="text-sm text-muted-foreground mt-6 flex items-center justify-center gap-2">
                        <span className="text-lg">🤫</span>
                        Secreto: solo tú puedes ver esto
                      </p>
                    </RevealText>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No se encontró tu asignación
                  </p>
                )}
              </CardContent>
            </Card>
          </MotionCard>
        </div>
      </main>
    </div>
  );
}

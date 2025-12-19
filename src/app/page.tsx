import Link from "next/link";
import { Gift, Users, Shuffle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Motion, MotionCard, Float } from "@/components/motion";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="container relative mx-auto px-4 py-12 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <Motion variant="bounceIn">
            <Float>
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 mb-8 shadow-lg">
                <Gift className="w-12 h-12 text-primary" />
              </div>
            </Float>
          </Motion>
          
          <Motion variant="fadeInUp" delay={0.1}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
              Amigo Secreto
            </h1>
          </Motion>
          
          <Motion variant="fadeInUp" delay={0.2}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10">
              Organiza tu intercambio de regalos de manera simple, rápida y divertida
            </p>
          </Motion>

          <Motion variant="fadeInUp" delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Button asChild size="lg" className="min-h-[52px] px-8 text-base shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/auth/register">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Crear cuenta
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-h-[52px] px-8 text-base">
                <Link href="/auth/login">Iniciar sesión</Link>
              </Button>
            </div>
          </Motion>

          <div className="grid gap-6 md:grid-cols-3">
            <MotionCard delay={0.4}>
              <div className="p-8 rounded-2xl bg-card/80 backdrop-blur border shadow-lg hover:shadow-xl transition-all h-full">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 mb-5">
                  <Users className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Crea tu grupo</h3>
                <p className="text-sm text-muted-foreground">
                  Invita a tus amigos o familiares con un código único
                </p>
              </div>
            </MotionCard>

            <MotionCard delay={0.5}>
              <div className="p-8 rounded-2xl bg-card/80 backdrop-blur border shadow-lg hover:shadow-xl transition-all h-full">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/10 mb-5">
                  <Gift className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Únete con código</h3>
                <p className="text-sm text-muted-foreground">
                  Ingresa el código de invitación para unirte al grupo
                </p>
              </div>
            </MotionCard>

            <MotionCard delay={0.6}>
              <div className="p-8 rounded-2xl bg-card/80 backdrop-blur border shadow-lg hover:shadow-xl transition-all h-full">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 mb-5">
                  <Shuffle className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Sorteo automático</h3>
                <p className="text-sm text-muted-foreground">
                  El dueño inicia el sorteo y cada quien ve su amigo secreto
                </p>
              </div>
            </MotionCard>
          </div>
        </div>
      </div>
    </div>
  );
}

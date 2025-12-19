"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Motion, Float } from "@/components/motion";
import { loginAction } from "./actions";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setErrors({});

    const result = await loginAction(formData);

    if (result.success) {
      toast.success("¡Bienvenido de vuelta!");
      router.push("/app/dashboard");
    } else {
      if (result.fieldErrors) {
        setErrors(result.fieldErrors);
      }
      if (result.error) {
        toast.error(result.error);
      }
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background via-background to-primary/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative w-full max-w-md">
        <Motion variant="bounceIn">
          <Link href="/" className="flex justify-center mb-8">
            <Float>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg">
                <Gift className="w-8 h-8 text-primary" />
              </div>
            </Float>
          </Link>
        </Motion>

        <Motion variant="fadeInUp" delay={0.1}>
          <Card className="border-0 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Bienvenido de vuelta</CardTitle>
              <CardDescription>
                Ingresa tus credenciales para continuar
              </CardDescription>
            </CardHeader>
            <form action={handleSubmit}>
              <CardContent className="space-y-4 pt-4">
                <Motion variant="fadeInUp" delay={0.2}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      autoComplete="email"
                      disabled={loading}
                      className="h-12"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive animate-in fade-in slide-in-from-top-1">{errors.email}</p>
                    )}
                  </div>
                </Motion>
                <Motion variant="fadeInUp" delay={0.25}>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      disabled={loading}
                      className="h-12"
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive animate-in fade-in slide-in-from-top-1">{errors.password}</p>
                    )}
                  </div>
                </Motion>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-2">
                <Motion variant="fadeInUp" delay={0.3} className="w-full">
                  <Button type="submit" className="w-full min-h-[48px] text-base shadow-lg hover:shadow-xl transition-all" disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="mr-2 h-4 w-4" />
                    )}
                    Iniciar sesión
                  </Button>
                </Motion>
                <Motion variant="fadeIn" delay={0.4}>
                  <p className="text-sm text-muted-foreground text-center">
                    ¿No tienes cuenta?{" "}
                    <Link href="/auth/register" className="text-primary font-medium hover:underline">
                      Regístrate
                    </Link>
                  </p>
                </Motion>
              </CardFooter>
            </form>
          </Card>
        </Motion>
      </div>
    </div>
  );
}

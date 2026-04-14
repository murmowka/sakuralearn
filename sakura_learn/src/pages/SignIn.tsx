import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function SignIn() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // ВАЖНО: здесь ОБЯЗАТЕЛЬНО должно быть async
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Здесь await работает, так как функция выше помечена как async
      await login(formData.email, formData.password);
      toast.success("Вход успешен! Перенаправляю...");
      setTimeout(() => {
        navigate?.("/dashboard");
      }, 1000);
    } catch (error: any) {
      console.error("ОШИБКА ВХОДА:", error);
      toast.error(error.message || "Неверный email или пароль");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card to-background flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-pink-200/50">
        <div className="container flex items-center justify-between py-4 mx-auto px-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate?.("/")}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="sakura-heading text-xl">SakuraLearn</span>
          </div>
          <Button
            onClick={() => navigate?.("/")}
            variant="outline"
            className="px-6 py-3 rounded-full font-medium transition-all duration-200 border-2 border-primary text-primary hover:bg-primary/10"
          >
            Вернуться
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container py-12 md:py-20 flex items-center justify-center mx-auto px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-xl border border-pink-100">
          <div className="text-center mb-8">
            <h1 className="sakura-heading-2 mb-2 text-2xl">Войти в аккаунт</h1>
            <p className="text-foreground text-sm md:text-base">
              Рады видеть вас снова в SakuraLearn
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-2xl border-border/30 focus:border-primary focus:ring-primary"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ваш пароль"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="rounded-2xl border-border/30 focus:border-primary focus:ring-primary pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 rounded-2xl font-bold bg-primary text-primary-foreground hover:opacity-90 text-lg shadow-lg shadow-primary/20 transition-all active:scale-95 mt-6"
            >
              {isLoading ? "Вход..." : "Войти"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-foreground text-sm">
              Нет аккаунта?{" "}
              <button
                onClick={() => navigate?.("/signup")}
                className="text-primary hover:text-primary/80 font-medium transition-colors underline"
              >
                Зарегистрироваться
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/20 bg-white py-8 mt-20">
        <div className="container mx-auto text-center text-foreground text-sm">
          <p>© 2026 SakuraLearn. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}

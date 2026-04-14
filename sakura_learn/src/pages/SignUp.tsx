import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";

export default function SignUp() {
  const [, navigate] = useLocation();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
const [currentStep, setCurrentStep] = useState(1); // Добавьте это здесь

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email обязателен";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Введите корректный email";
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    } else if (formData.password.length < 8) {
      newErrors.password = "Пароль должен быть минимум 8 символов";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Подтверждение пароля обязательно";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    if (!agreedToTerms) {
    newErrors.terms = "Вы должны согласиться с условиями";
    toast.error("Пожалуйста, примите условия конфиденциальности"); // Добавим уведомление
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    await register(
      formData.email,
      formData.password,
      formData.confirmPassword
    );

    toast.success("Регистрация успешна!");
    // ВАЖНО: Убираем setTimeout для проверки, перенаправляем сразу
    navigate("/profile-setup");
  } catch (error: any) {
    toast.error(error.message || "Ошибка при регистрации");
  } finally {
    setIsLoading(false);
  }
};



const handleStart = async () => {
  setIsLoading(true);
  try {
    // Сохраняем данные из приветствия на сервер
    await apiClient.updateProfile({
      level: selectedLevel,
      learning_goal: userGoal || "Изучение японского",
      daily_goal: parseInt(dailyGoal) || 30
    });

    // Устанавливаем никнейм по умолчанию
    await apiClient.updateUserInfo({
      first_name: formData.email.split('@')[0]
    });

    toast.success("Всё готово! 🌸");
    setTimeout(() => navigate?.("/dashboard"), 1500);
  } catch (error) {
    console.error("Ошибка сохранения профиля:", error);
    // Если профиль не сохранился, всё равно пускаем дальше
    navigate?.("/dashboard");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card to-background flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-pink-200/50">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate?.("/")}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="sakura-heading text-xl">SakuraLearn</span>
          </div>
          <Button onClick={() => navigate?.("/")} variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/10">
            Вернуться
          </Button>
        </div>
      </nav>

      <main className="flex-1 container py-12 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-xl border border-pink-100">
          <div className="text-center mb-8">
            <h1 className="sakura-heading-2 mb-2">Регистрация</h1>
            <p className="text-muted-foreground text-sm">Присоединяйтесь к SakuraLearn</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} className="rounded-2xl" disabled={isLoading} />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Минимум 8 символов" value={formData.password} onChange={handleChange} className="rounded-2xl pr-10" disabled={isLoading} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
              <div className="relative">
                <Input id="confirmPassword" name="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="Повторите пароль" value={formData.confirmPassword} onChange={handleChange} className="rounded-2xl pr-10" disabled={isLoading} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-start gap-3 py-2">
              <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="w-5 h-5 rounded mt-0.5 cursor-pointer accent-primary" />
              <span className="text-sm text-muted-foreground">
                Я согласен с <button type="button" className="text-primary underline font-medium">условиями конфиденциальности</button>
              </span>
            </div>
            {errors.terms && <p className="text-xs text-red-500">{errors.terms}</p>}



            {/* Submit Button */}
            <Button
  type="submit"
  disabled={isLoading || !agreedToTerms} // Кнопка будет серой, пока нет галочки
  className={`w-full py-6 rounded-2xl font-bold transition-all ${
    !agreedToTerms ? "bg-gray-500 cursor-not-allowed" : "bg-primary hover:bg-primary/90 shadow-lg"
  }`}
>
  {isLoading ? "Регистрация..." : "Создать аккаунт"}
</Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-foreground text-sm">
              Уже есть аккаунт?{" "}
            <button
              onClick={() => navigate?.("/login")}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Войти
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/20 bg-white py-8 mt-20">
        <div className="container text-center text-foreground text-sm">
          <p>© 2026 SakuraLearn. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}

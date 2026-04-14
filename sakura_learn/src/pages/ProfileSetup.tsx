import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api"; // Путь к вашему API клиенту
import { useAuth } from "@/contexts/AuthContext"; // Проверьте правильность пути к контексту

const PROFICIENCY_LEVELS = [
  { value: "beginner", label: "Начинающий (Я только начинаю)" },
  { value: "elementary", label: "Элементарный (Я знаю базовые фразы)" },
  { value: "intermediate", label: "Средний (Я могу вести простые разговоры)" },
  { value: "upper_intermediate", label: "Выше среднего (Я говорю довольно хорошо)" },
  { value: "advanced", label: "Продвинутый (Я говорю свободно)" },
];

export default function ProfileSetup() {
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    proficiencyLevel: "beginner",
    learningGoal: "",
    dailyMinutes: "30",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Имя обязательно";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Имя должно быть минимум 2 символа";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

// Сначала убедитесь, что вы достали setUser из useAuth() в начале компонента:
const { setUser } = useAuth();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsLoading(true);
  try {
    // 1. Обновляем имя пользователя (first_name)
    const updatedUser = await apiClient.updateUserInfo({
      first_name: formData.fullName,
    });

    // 2. Обновляем данные профиля (уровень, время И ЦЕЛЬ)
    await apiClient.updateProfile({
  level: formData.proficiencyLevel,
  daily_goal: parseInt(formData.dailyMinutes, 10),
  learning_goal: formData.learningGoal, // Теперь это поле есть в интерфейсе!
});


    // 3. Обновляем локальное состояние, чтобы имя сразу появилось в шапке
    if (setUser && updatedUser) {
      setUser(updatedUser);
    }

    toast.success("Профиль успешно обновлен!");

    // Даем немного времени на сохранение и переходим на дашборд
    setTimeout(() => {
      navigate?.("/dashboard");
    }, 1000);

  } catch (error) {
    console.error("Ошибка сохранения профиля:", error);
    toast.error("Не удалось сохранить все данные");
  } finally {
    setIsLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card to-background flex flex-col">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/20">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="sakura-heading text-xl">SakuraLearn</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 container py-12 md:py-20 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="sakura-heading-2 mb-2">Завершите ваш профиль</h1>
            <p className="text-foreground text-sm md:text-base">
              Расскажите нам о себе, чтобы мы могли персонализировать ваше обучение
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-foreground font-medium">Полное имя</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Ваше имя"
                value={formData.fullName}
                onChange={handleChange}
                className="rounded-2xl border-border/30 focus:border-primary focus:ring-primary text-foreground placeholder:text-muted-foreground"
                disabled={isLoading}
              />
              {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="proficiency" className="text-foreground font-medium">Ваш уровень японского</Label>
              <Select value={formData.proficiencyLevel} onValueChange={(v) => handleSelectChange("proficiencyLevel", v)}>
                <SelectTrigger className="rounded-2xl border-border/30 focus:border-primary focus:ring-primary text-foreground">
                  <SelectValue placeholder="Выберите уровень" />
                </SelectTrigger>
                <SelectContent>
                  {PROFICIENCY_LEVELS.map(level => (
                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="learningGoal" className="text-foreground font-medium">Ваша цель обучения</Label>
              <textarea
                id="learningGoal"
                name="learningGoal"
                placeholder="Например: Хочу говорить по-японски с друзьями..."
                value={formData.learningGoal}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-border/30 focus:border-primary focus:ring-primary text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2"
                rows={4}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyMinutes" className="text-foreground font-medium">Сколько минут в день вы готовы учиться?</Label>
              <Select value={formData.dailyMinutes} onValueChange={(v) => handleSelectChange("dailyMinutes", v)}>
                <SelectTrigger className="rounded-2xl border-border/30 focus:border-primary focus:ring-primary text-foreground">
                  <SelectValue placeholder="Выберите время" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 минут</SelectItem>
                  <SelectItem value="30">30 минут</SelectItem>
                  <SelectItem value="45">45 минут</SelectItem>
                  <SelectItem value="60">1 час</SelectItem>
                  <SelectItem value="120">Больше часа</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full font-medium transition-all duration-200 hover:shadow-lg active:scale-95 bg-primary text-primary-foreground hover:opacity-90 text-base mt-8"
            >
              {isLoading ? "Сохранение..." : "Завершить профиль"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate?.("/dashboard")}
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Пропустить на данный момент
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

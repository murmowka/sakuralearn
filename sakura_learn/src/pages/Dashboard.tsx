import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, UserProfile } from "@/lib/api";
import {
  BookOpen,
  Settings,
  LogOut,
  Award,
  Clock,
  Zap,
  ChevronRight,
  BookMarked,
  Layout,
  PenTool,
  MessageCircle
} from "lucide-react";

const LEVEL_MAP: Record<string, string> = {
  "beginner": "Начинающий",
  "elementary": "Элементарный",
  "intermediate": "Средний",
  "upper_intermediate": "Выше среднего",
  "advanced": "Продвинутый",
};

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        if (!user) return;
        const profileData = await apiClient.getProfile();
        setProfile(profileData);
      } catch (error) {
        console.error("Ошибка при загрузке профиля на дашборде:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, [user]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-blue-50/30 flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-pink-200/50">
        <div className="container flex items-center justify-between py-4 mx-auto px-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate?.("/")}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="sakura-heading text-xl">SakuraLearn</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate?.("/profile")}
              className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary"
            >
              <Settings className="w-6 h-6" />
            </button>
            <button
              onClick={logout}
              className="p-2 hover:bg-red-50 rounded-full transition-colors text-red-500"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 container py-12 mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="sakura-heading text-4xl mb-2">
              Привет, {user?.first_name || user?.username || "Путешественник"}! 🌸
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-foreground/60">Твой текущий уровень:</span>
              <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold border border-primary/20 shadow-sm">
                {profile ? (LEVEL_MAP[profile.level] || profile.level) : "Загрузка..."}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={<Zap className="text-orange-500" />}
            label="Серия занятий"
            value={`${profile?.study_streak || 0} дн.`}
          />
          <StatCard
            icon={<BookMarked className="text-primary" />}
            label="Выучено слов"
            value={profile?.words_learned || 0}
          />
          <StatCard
            icon={<Clock className="text-blue-500" />}
            label="Время в обучении"
            value={`${profile?.hours_studied || 0}ч`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SectionCard
            title="Хирагана и Катакана"
            description="Изучи основы японской письменности с нуля до продвинутого уровня"
            icon={<Award className="w-12 h-12 text-primary" />}
            onClick={() => navigate?.("/hiragana")}
          />
          <SectionCard
            title="Словарь и Фразы"
            description="Пополняй свой словарный запас и учись строить предложения"
            icon={<Layout className="w-12 h-12 text-blue-500" />}
            onClick={() => navigate?.("/dictionary")}
          />
          <SectionCard
            title="Кандзи"
            description="Иероглифы: от простых ключей до сложных сочетаний"
            icon={<PenTool className="w-12 h-12 text-orange-500" />}
            onClick={() => navigate?.("/kanji")}
          />
          <SectionCard
            title="Разговорная практика"
            description="Тренируй произношение и понимание речи на слух"
            icon={<MessageCircle className="w-12 h-12 text-green-500" />}
            onClick={() => navigate?.("/speaking")}
          />
        </div>
      </main>

      <footer className="border-t border-border/20 bg-white py-8 mt-20">
        <div className="container mx-auto text-center text-foreground text-sm">
          <p>© 2026 SakuraLearn. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-sm text-foreground/50">{label}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function SectionCard({ title, description, icon, onClick }: { title: string, description: string, icon: React.ReactNode, onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group bg-white p-8 rounded-[2.5rem] border border-pink-100 shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden flex flex-col gap-4"
    >
      {/* Основная иконка (слева сверху) - стала мягче (opacity-80) */}
      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform opacity-80">
        {icon}
      </div>

      <div>
        <h3 className="sakura-heading text-2xl mb-2">{title}</h3>
        <p className="text-foreground/60 mb-6">{description}</p>
      </div>

      <div className="flex items-center text-primary font-bold group-hover:gap-2 transition-all">
        Начать обучение <ChevronRight size={20} />
      </div>

      {/* Фоновая иконка (справа сверху) - стала заметнее (opacity-15) */}
      <div className="absolute top-0 right-0 p-4 opacity-15 group-hover:opacity-25 transition-opacity pointer-events-none">
        <div className="scale-[2.5] rotate-12 translate-x-4 -translate-y-4"> {/* Сделал её крупнее и интереснее */}
          {icon}
        </div>
      </div>
    </div>
  );

}

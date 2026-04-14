import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Edit2, Save, X, LogOut, Bell, Moon } from "lucide-react";
import { toast } from "sonner";
import { apiClient, UserProfile as UserProfileType } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const LEVEL_MAP: Record<string, string> = {
  "beginner": "Начинающий",
  "elementary": "Элементарный",
  "intermediate": "Средний",
  "upper_intermediate": "Выше среднего",
  "advanced": "Продвинутый",
};

interface UserData {
  name: string;
  email: string;
  level: string;
  joinDate: string;
  studyStreak: number;
  wordsLearned: number;
  hoursStudied: number;
  dailyGoal: string;
  learningGoal: string; // Добавьте это поле
}


export default function UserProfile() {
  const [, navigate] = useLocation();
  const { user, logout, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editData, setEditData] = useState<UserData | null>(null);
  const [profile, setProfile] = useState<UserProfileType | null>(null);

  // Состояние для настроек
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!user) {
          navigate?.("/login");
          return;
        }

        const profileData = await apiClient.getProfile();
        setProfile(profileData);

        const joinDate = new Date(profileData.created_at).toLocaleDateString('ru-RU', {
          year: 'numeric', month: 'long', day: 'numeric',
        });

        const data: UserData = {
  name: user.first_name || user.username,
  email: user.email,
  level: profileData.level,
  joinDate,
  studyStreak: profileData.study_streak,
  wordsLearned: profileData.words_learned,
  hoursStudied: profileData.hours_studied,
  dailyGoal: profileData.daily_goal.toString(),
  learningGoal: profileData.learning_goal || "Для путешествий", // Берем с сервера или ставим по умолчанию
};


        setUserData(data);
        setEditData(data);
      } catch (error) {
        toast.error("Ошибка при загрузке профиля");
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [user, navigate]);

  // Эффект для проверки параметра ?edit=true
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("edit") === "true") {
      setIsEditing(true);
    }
  }, []);

  const handleSave = async () => {
    if (!editData || !profile) return;
    setIsLoading(true);
    try {
      if (editData.name !== userData?.name) {
        const updatedUser = await apiClient.updateUserInfo({
          first_name: editData.name
        });
        if (setUser) setUser(updatedUser);
      }

      await apiClient.updateProfile({
  level: editData.level,
  daily_goal: parseInt(editData.dailyGoal) || 30,
  learning_goal: editData.learningGoal, // Добавьте эту строку
});


      setUserData(editData);
      setIsEditing(false);
      toast.success("Профиль обновлён!");
    } catch (error: any) {
      console.error("ОШИБКА СОХРАНЕНИЯ:", error);
      toast.error(error.message || "Ошибка при сохранении");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserData, value: string | number) => {
    if (editData) setEditData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading || !userData) return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-pink-50/50 to-blue-50/30">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-pink-200/50">
        <div className="container flex items-center justify-between py-4 mx-auto px-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate?.("/dashboard")} className="p-2 hover:bg-muted rounded-lg"><ArrowLeft /></button>
            <h1 className="sakura-heading text-xl">Мой профиль</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={isEditing ? handleSave : () => setIsEditing(true)} className="p-2 rounded-lg bg-primary text-primary-foreground px-4 flex gap-2">
              {isEditing ? <><Save size={20}/> Сохранить</> : <><Edit2 size={20}/> Редактировать</>}
            </button>
            <button onClick={logout} className="p-2 rounded-lg bg-red-100 text-red-600 px-4 flex gap-2"><LogOut size={20}/> Выход</button>
          </div>
        </div>
      </header>

      <main className="container py-12 mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 border-2 border-pink-200/60 mb-8 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="space-y-4 w-full max-w-md">
              <div>
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Никнейм</label>
                {isEditing ? (
                  <input value={editData.name} onChange={e => handleInputChange("name", e.target.value)} className="w-full p-3 border-2 border-pink-100 rounded-xl mt-1 focus:border-primary outline-none transition-all" />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email (нельзя изменить)</label>
                <input value={userData.email} disabled className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl mt-1 text-gray-400" />
              </div>
            </div>
            {isEditing && <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border-2 border-pink-200/60 text-center shadow-sm">
            <p className="text-sm text-gray-500 mb-2 font-medium">Уровень</p>
            {isEditing ? (
              <select value={editData.level} onChange={e => handleInputChange("level", e.target.value)} className="w-full p-2 border-2 border-pink-100 rounded-lg outline-none">
                <option value="beginner">Начинающий</option>
                <option value="elementary">Элементарный</option>
                <option value="intermediate">Средний</option>
                <option value="upper_intermediate">Выше среднего</option>
                <option value="advanced">Продвинутый</option>
              </select>
            ) : (
              <span className="font-bold text-lg text-primary">{LEVEL_MAP[userData.level] || userData.level}</span>
            )}
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-pink-200/60 text-center shadow-sm">
            <p className="text-sm text-gray-500 mb-2 font-medium">Серия</p>
            <span className="font-bold text-lg text-orange-500">{userData.studyStreak} дн.</span>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-pink-200/60 text-center shadow-sm">
            <p className="text-sm text-gray-500 mb-2 font-medium">Слов</p>
            <span className="font-bold text-lg text-blue-500">{userData.wordsLearned}</span>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-pink-200/60 text-center shadow-sm">
            <p className="text-sm text-gray-500 mb-2 font-medium">Часов</p>
            <span className="font-bold text-lg text-green-500">{userData.hoursStudied}ч</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Цели */}
          <div className="bg-white rounded-3xl p-8 border-2 border-pink-200/60 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">🎯 Цели и аккаунт</h3>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-2 font-medium">Ежедневная цель</p>
                {isEditing ? (
                  <select value={editData.dailyGoal} onChange={e => handleInputChange("dailyGoal", e.target.value)} className="w-full p-3 border-2 border-pink-100 rounded-xl outline-none">
                    <option value="15">15 минут</option>
                    <option value="30">30 минут</option>
                    <option value="45">45 минут</option>
                    <option value="60">1 час</option>
                    <option value="90">1.5 часа</option>
                  </select>
                ) : (
                  <span className="font-bold text-lg text-gray-700">{userData.dailyGoal} мин.</span>
                )}
              </div>
              <div>
  <p className="text-sm text-gray-500 mb-2 font-medium">Цель обучения</p>
  {isEditing ? (
    <input
      value={editData.learningGoal}
      onChange={e => handleInputChange("learningGoal", e.target.value)}
      placeholder="Например: Для переезда"
      className="w-full p-3 border-2 border-pink-100 rounded-xl outline-none focus:border-primary"
    />
  ) : (
    <span className="font-bold text-lg text-gray-700">{userData.learningGoal}</span>
  )}
</div>

              <div>
                <p className="text-sm text-gray-500 mb-2 font-medium">В SakuraLearn с</p>
                <span className="font-bold text-lg text-gray-700">{userData.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Настройки */}
          <div className="bg-white rounded-3xl p-8 border-2 border-pink-200/60 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">⚙️ Настройки</h3>
            <div className="space-y-6">
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-50 rounded-lg text-primary group-hover:bg-pink-100 transition-colors">
                    <Bell size={20} />
                  </div>
                  <span className="font-medium text-gray-700">Уведомления о напоминаниях</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={() => setSettings(s => ({...s, notifications: !s.notifications}))}
                  className="w-6 h-6 accent-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-500 group-hover:bg-blue-100 transition-colors">
                    <Moon size={20} />
                  </div>
                  <span className="font-medium text-gray-700">Темная тема</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={() => setSettings(s => ({...s, darkMode: !s.darkMode}))}
                  className="w-6 h-6 accent-blue-200 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

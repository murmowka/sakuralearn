import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { BookOpen, Sparkles, Users, Zap } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card to-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/20">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="sakura-heading text-xl">SakuraLearn</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-foreground hover:text-primary transition-colors">
              Возможности
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              О проекте
            </a>
            {isAuthenticated && user ? (
              <Button
                onClick={() => (window.location.href = "/dashboard")}
                className="px-6 py-3 rounded-full font-medium transition-all duration-200 hover:shadow-lg active:scale-95 bg-primary text-primary-foreground hover:opacity-90"
              >
                Мой кабинет
              </Button>
            ) : (
              <Button
                onClick={() => {
                  window.location.href = "/login";
                }}
                >
                Войти
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20 md:py-32 flex flex-col items-center text-center">
        <div className="max-w-3xl">
          <h1 className="sakura-heading-1 mb-6 text-foreground">
            Изучайте японский язык с помощью <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ИИ-ассистента</span>
          </h1>
          <p className="text-foreground mb-8 text-lg leading-relaxed">
            SakuraLearn — это инновационная платформа для изучения японского языка, которая сочетает интерактивные уроки, разговорную практику и персональное обучение с поддержкой искусственного интеллекта.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => (window.location.href = "/signup")}
              className="px-6 py-3 rounded-full font-medium transition-all duration-200 hover:shadow-lg active:scale-95 bg-primary text-primary-foreground hover:opacity-90 text-lg"
            >
              Начать обучение
            </Button>
            <Button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 py-3 rounded-full font-medium transition-all duration-200 hover:shadow-lg active:scale-95 border-2 border-primary text-primary bg-white hover:bg-primary/10 text-lg"
            >
              Узнать больше
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-20 md:py-32">
        <h2 className="sakura-heading-2 text-center mb-16">Почему выбирают SakuraLearn?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Sparkles className="w-8 h-8" />,
              title: "ИИ-ассистент",
              description: "Персональный помощник для разговорной практики и ответов на вопросы",
            },
            {
              icon: <BookOpen className="w-8 h-8" />,
              title: "Полный курс",
              description: "От хираганы и катаканы до сложных кандзи и грамматики",
            },
            {
              icon: <Zap className="w-8 h-8" />,
              title: "Интерактивные уроки",
              description: "Карточки, упражнения и тесты для закрепления материала",
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "Сообщество",
              description: "Общайтесь с другими учащимися и делитесь прогрессом",
            },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white rounded-3xl shadow-sm border border-border/30 p-6 text-center hover:shadow-md transition-shadow duration-200">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4 text-primary">
                {feature.icon}
              </div>
              <h3 className="sakura-heading-3 mb-3 text-lg">{feature.title}</h3>
              <p className="text-foreground text-sm md:text-base leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Content Preview Section */}
      <section className="container py-20 md:py-32">
        <h2 className="sakura-heading-2 text-center mb-16">Что вы изучите</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Хирагана и Катакана",
              description: "Освойте две основные системы письма японского языка с помощью интерактивных карточек и упражнений.",
              color: "from-primary",
            },
            {
              title: "Кандзи",
              description: "Изучайте иероглифы постепенно, начиная с самых распространённых и заканчивая сложными символами.",
              color: "from-primary",
            },
            {
              title: "Разговорная практика",
              description: "Практикуйте произношение и диалоги в реальных ситуациях с помощью ИИ-ассистента.",
              color: "from-primary",
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl shadow-sm border border-border/30 p-8 hover:shadow-md transition-shadow duration-200">
              <div className={`h-2 w-12 rounded-full bg-gradient-to-r ${item.color} to-secondary mb-6`}></div>
              <h3 className="sakura-heading-3 mb-4">{item.title}</h3>
              <p className="text-foreground text-sm md:text-base leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section id="about" className="container py-20 md:py-32 text-center">
        <div className="bg-white rounded-3xl shadow-sm border border-border/30 p-12 max-w-2xl mx-auto hover:shadow-md transition-shadow duration-200">
          <h2 className="sakura-heading-2 mb-6">Готовы начать?</h2>
          <p className="text-foreground text-sm md:text-base leading-relaxed mb-8">
            Присоединяйтесь к тысячам учащихся, которые уже начали изучать японский язык с SakuraLearn.
          </p>
            <Button
              onClick={() => (window.location.href = "/signup")}
              className="px-6 py-3 rounded-full font-medium transition-all duration-200 hover:shadow-lg active:scale-95 bg-primary text-primary-foreground hover:opacity-90 text-lg"
            >
              Создать аккаунт
            </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 bg-white py-8 mt-20">
        <div className="container text-center text-foreground text-sm">
          <p>© 2026 SakuraLearn. Все права защищены.</p>
          <p className="mt-2">Платформа для изучения японского языка с ИИ-ассистентом</p>
        </div>
      </footer>
    </div>
  );
}

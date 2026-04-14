import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-pink-50/50 to-blue-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-pink-200/50">
        <div className="container flex items-center gap-4 py-4">
          <button
            onClick={() => navigate?.("/signup")}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="sakura-heading text-xl">Условия конфиденциальности</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 md:py-12">
        <div className="bg-white rounded-3xl p-8 border-2 border-pink-200/60 max-w-4xl mx-auto">
          <div className="prose prose-sm max-w-none">
            <h2 className="sakura-heading-2 mb-6 text-foreground">🚧 В разработке</h2>
            
            <p className="text-foreground mb-4">
              Страница условий конфиденциальности находится в разработке. 
              Мы работаем над подробным описанием политики обработки ваших персональных данных.
            </p>

            <p className="text-foreground/70 text-sm">
              Пожалуйста, вернитесь позже для получения полной информации о том, как мы обрабатываем и защищаем ваши данные.
            </p>

            <div className="mt-8 p-6 bg-pink-50 rounded-2xl border-2 border-pink-200">
              <h3 className="sakura-heading text-lg mb-3 text-foreground">Что мы планируем включить:</h3>
              <ul className="space-y-2 text-foreground/70 text-sm">
                <li>✓ Информация о сборе данных</li>
                <li>✓ Использование персональной информации</li>
                <li>✓ Защита данных и безопасность</li>
                <li>✓ Права пользователей</li>
                <li>✓ Контактная информация для вопросов</li>
              </ul>
            </div>

            <div className="mt-8">
              <button
                onClick={() => navigate?.("/signup")}
                className="px-6 py-3 rounded-full font-medium bg-primary text-primary-foreground hover:opacity-90 transition-all"
              >
                Вернуться к регистрации
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-pink-200/50 bg-white py-8 mt-20">
        <div className="container text-center text-foreground text-sm">
          <p>© 2026 SakuraLearn. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}

import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2 } from "lucide-react";
import { toast } from "sonner";

type Script = "hiragana" | "katakana";

interface Character {
  id: string;
  character: string;
  romaji: string;
  pronunciation: string;
}

const HIRAGANA_DATA: Character[] = [
  { id: "a", character: "あ", romaji: "a", pronunciation: "а" },
  { id: "i", character: "い", romaji: "i", pronunciation: "и" },
  { id: "u", character: "う", romaji: "u", pronunciation: "у" },
  { id: "e", character: "え", romaji: "e", pronunciation: "э" },
  { id: "o", character: "お", romaji: "o", pronunciation: "о" },
  { id: "ka", character: "か", romaji: "ka", pronunciation: "ка" },
  { id: "ki", character: "き", romaji: "ki", pronunciation: "ки" },
  { id: "ku", character: "く", romaji: "ku", pronunciation: "ку" },
  { id: "ke", character: "け", romaji: "ke", pronunciation: "кэ" },
  { id: "ko", character: "こ", romaji: "ko", pronunciation: "ко" },
  { id: "sa", character: "さ", romaji: "sa", pronunciation: "са" },
  { id: "shi", character: "し", romaji: "shi", pronunciation: "ши" },
];

const KATAKANA_DATA: Character[] = [
  { id: "a", character: "ア", romaji: "a", pronunciation: "а" },
  { id: "i", character: "イ", romaji: "i", pronunciation: "и" },
  { id: "u", character: "ウ", romaji: "u", pronunciation: "у" },
  { id: "e", character: "エ", romaji: "e", pronunciation: "э" },
  { id: "o", character: "オ", romaji: "o", pronunciation: "о" },
  { id: "ka", character: "カ", romaji: "ka", pronunciation: "ка" },
  { id: "ki", character: "キ", romaji: "ki", pronunciation: "ки" },
  { id: "ku", character: "ク", romaji: "ku", pronunciation: "ку" },
  { id: "ke", character: "ケ", romaji: "ke", pronunciation: "кэ" },
  { id: "ko", character: "コ", romaji: "ko", pronunciation: "ко" },
  { id: "sa", character: "サ", romaji: "sa", pronunciation: "са" },
  { id: "shi", character: "シ", romaji: "shi", pronunciation: "ши" },
];

export default function HiraganaKatakana() {
  const [, navigate] = useLocation();
  const [script, setScript] = useState<Script>("hiragana");
  const [flipped, setFlipped] = useState<Set<string>>(new Set());

  const characters = script === "hiragana" ? HIRAGANA_DATA : KATAKANA_DATA;

  const toggleFlip = (id: string) => {
    const newFlipped = new Set(flipped);
    if (newFlipped.has(id)) {
      newFlipped.delete(id);
    } else {
      newFlipped.add(id);
    }
    setFlipped(newFlipped);
  };

  const handleSpeak = (romaji: string) => {
    toast.success(`Произношение: ${romaji}`);
    // TODO: Implement actual text-to-speech
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/20">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate?.("/dashboard")}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="sakura-heading text-xl">
              {script === "hiragana" ? "Хирагана" : "Катакана"}
            </h1>
          </div>

          {/* Script Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setScript("hiragana");
                setFlipped(new Set());
              }}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                script === "hiragana"
                  ? "text-primary border-2 border-primary"
                  : "text-foreground border-2 border-transparent hover:border-primary/30"
              }`}
            >
              Хирагана
            </button>
            <button
              onClick={() => {
                setScript("katakana");
                setFlipped(new Set());
              }}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                script === "katakana"
                  ? "text-primary border-2 border-primary"
                  : "text-foreground border-2 border-transparent hover:border-primary/30"
              }`}
            >
              Катакана
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 md:py-12">
        {/* Info Section */}
        <div className="mb-12">
          <h2 className="sakura-heading-2 mb-2">Изучайте символы</h2>
          <p className="text-foreground text-sm md:text-base">
            Нажимайте на карточки, чтобы увидеть произношение. Используйте кнопку звука для прослушивания.
          </p>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          {characters.map(char => (
            <div
              key={char.id}
              onClick={() => toggleFlip(char.id)}
              className="cursor-pointer group"
            >
              <div
                className={`
                  relative w-full aspect-square rounded-2xl border-2 border-border/40
                  transition-all duration-300 transform group-hover:scale-105
                  flex items-center justify-center
                  ${
                    flipped.has(char.id)
                      ? "bg-gradient-to-br from-blue-100 to-blue-50"
                      : "bg-gradient-to-br from-pink-100 to-pink-50"
                  }
                `}
              >
                {/* Sound Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(char.romaji);
                  }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm hover:shadow-md"
                  title="Прослушать"
                >
                  <Volume2 className="w-4 h-4 text-foreground" />
                </button>

                {flipped.has(char.id) ? (
                  <div className="text-center">
                    <p className="text-sm md:text-base font-medium text-foreground mb-1">
                      {char.romaji}
                    </p>
                    <p className="text-xs text-foreground">{char.pronunciation}</p>
                  </div>
                ) : (
                  <p className="text-4xl md:text-5xl font-bold text-foreground">
                    {char.character}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Practice Section */}
        <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-3xl p-8 border-2 border-pink-200">
          <h2 className="sakura-heading-2 mb-6">Практика произношения</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border-2 border-border/40">
              <h3 className="text-lg font-bold text-foreground mb-4">💡 Совет</h3>
              <p className="text-foreground text-sm">
                Каждый символ хирагана и катакана представляет один слог. Попробуйте произносить символы вслух для лучшего запоминания.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-border/40">
              <h3 className="text-lg font-bold text-foreground mb-4">🌟 Прогресс</h3>
              <p className="text-foreground text-sm">
                Вы изучили <span className="font-bold">{flipped.size}</span> из <span className="font-bold">{characters.length}</span> символов.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate?.("/dashboard")}
            className="px-8 py-3 rounded-full font-medium transition-all duration-200 hover:shadow-lg active:scale-95 bg-primary text-primary-foreground hover:opacity-90"
          >
            Вернуться на главную
          </Button>
          <Button
            onClick={() => navigate?.(`/hiragana-test?script=${script}`)}
            className="px-8 py-3 rounded-full font-medium transition-all duration-200 hover:shadow-lg active:scale-95 bg-secondary text-secondary-foreground hover:opacity-90"
          >
            Пройти тест
          </Button>
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

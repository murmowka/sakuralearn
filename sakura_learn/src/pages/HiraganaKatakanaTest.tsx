import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

type Script = "hiragana" | "katakana";
type TestLevel = "level1" | "level2" | "study";
type TestPhase = "study" | "test" | "results";

interface TestQuestion {
  id: string;
  character: string;
  options: string[];
  correctAnswer: string;
}

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
];

const HIRAGANA_DATA_LEVEL2: Character[] = [
  { id: "ta", character: "た", romaji: "ta", pronunciation: "та" },
  { id: "ti", character: "ち", romaji: "ti", pronunciation: "ти" },
  { id: "tsu", character: "つ", romaji: "tsu", pronunciation: "цу" },
  { id: "te", character: "て", romaji: "te", pronunciation: "тэ" },
  { id: "to", character: "と", romaji: "to", pronunciation: "то" },
  { id: "na", character: "な", romaji: "na", pronunciation: "на" },
  { id: "ni", character: "に", romaji: "ni", pronunciation: "ни" },
  { id: "nu", character: "ぬ", romaji: "nu", pronunciation: "ну" },
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
];

const KATAKANA_DATA_LEVEL2: Character[] = [
  { id: "ta", character: "タ", romaji: "ta", pronunciation: "та" },
  { id: "ti", character: "チ", romaji: "ti", pronunciation: "ти" },
  { id: "tsu", character: "ツ", romaji: "tsu", pronunciation: "цу" },
  { id: "te", character: "テ", romaji: "te", pronunciation: "тэ" },
  { id: "to", character: "ト", romaji: "to", pronunciation: "то" },
  { id: "na", character: "ナ", romaji: "na", pronunciation: "на" },
  { id: "ni", character: "ニ", romaji: "ni", pronunciation: "ни" },
  { id: "nu", character: "ヌ", romaji: "nu", pronunciation: "ну" },
];

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper function to create test questions with randomized options
function createTestQuestions(baseQuestions: TestQuestion[]): TestQuestion[] {
  return baseQuestions.map(q => ({
    ...q,
    options: shuffleArray(q.options),
  }));
}

const HIRAGANA_TEST_LEVEL1_BASE: TestQuestion[] = [
  {
    id: "1",
    character: "あ",
    options: ["a", "i", "u", "e"],
    correctAnswer: "a",
  },
  {
    id: "2",
    character: "い",
    options: ["a", "i", "u", "e"],
    correctAnswer: "i",
  },
  {
    id: "3",
    character: "う",
    options: ["a", "i", "u", "e"],
    correctAnswer: "u",
  },
  {
    id: "4",
    character: "え",
    options: ["a", "i", "u", "e"],
    correctAnswer: "e",
  },
  {
    id: "5",
    character: "お",
    options: ["a", "i", "u", "o"],
    correctAnswer: "o",
  },
  {
    id: "6",
    character: "か",
    options: ["ka", "ki", "ku", "ke"],
    correctAnswer: "ka",
  },
  {
    id: "7",
    character: "き",
    options: ["ka", "ki", "ku", "ke"],
    correctAnswer: "ki",
  },
  {
    id: "8",
    character: "く",
    options: ["ka", "ki", "ku", "ke"],
    correctAnswer: "ku",
  },
];

const HIRAGANA_TEST_LEVEL2_BASE: TestQuestion[] = [
  {
    id: "1",
    character: "た",
    options: ["ta", "ti", "tsu", "te"],
    correctAnswer: "ta",
  },
  {
    id: "2",
    character: "ち",
    options: ["ta", "ti", "tsu", "te"],
    correctAnswer: "ti",
  },
  {
    id: "3",
    character: "つ",
    options: ["ta", "ti", "tsu", "te"],
    correctAnswer: "tsu",
  },
  {
    id: "4",
    character: "て",
    options: ["ta", "ti", "te", "to"],
    correctAnswer: "te",
  },
  {
    id: "5",
    character: "と",
    options: ["ta", "to", "tsu", "te"],
    correctAnswer: "to",
  },
  {
    id: "6",
    character: "な",
    options: ["na", "ni", "nu", "ne"],
    correctAnswer: "na",
  },
  {
    id: "7",
    character: "に",
    options: ["na", "ni", "nu", "no"],
    correctAnswer: "ni",
  },
  {
    id: "8",
    character: "ぬ",
    options: ["na", "ni", "nu", "ne"],
    correctAnswer: "nu",
  },
];

const KATAKANA_TEST_LEVEL1_BASE: TestQuestion[] = [
  {
    id: "1",
    character: "ア",
    options: ["a", "i", "u", "e"],
    correctAnswer: "a",
  },
  {
    id: "2",
    character: "イ",
    options: ["a", "i", "u", "e"],
    correctAnswer: "i",
  },
  {
    id: "3",
    character: "ウ",
    options: ["a", "i", "u", "e"],
    correctAnswer: "u",
  },
  {
    id: "4",
    character: "エ",
    options: ["a", "i", "u", "e"],
    correctAnswer: "e",
  },
  {
    id: "5",
    character: "オ",
    options: ["a", "i", "u", "o"],
    correctAnswer: "o",
  },
  {
    id: "6",
    character: "カ",
    options: ["ka", "ki", "ku", "ke"],
    correctAnswer: "ka",
  },
  {
    id: "7",
    character: "キ",
    options: ["ka", "ki", "ku", "ke"],
    correctAnswer: "ki",
  },
  {
    id: "8",
    character: "ク",
    options: ["ka", "ki", "ku", "ke"],
    correctAnswer: "ku",
  },
];

const KATAKANA_TEST_LEVEL2_BASE: TestQuestion[] = [
  {
    id: "1",
    character: "タ",
    options: ["ta", "ti", "tsu", "te"],
    correctAnswer: "ta",
  },
  {
    id: "2",
    character: "チ",
    options: ["ta", "ti", "tsu", "te"],
    correctAnswer: "ti",
  },
  {
    id: "3",
    character: "ツ",
    options: ["ta", "ti", "tsu", "te"],
    correctAnswer: "tsu",
  },
  {
    id: "4",
    character: "テ",
    options: ["ta", "ti", "te", "to"],
    correctAnswer: "te",
  },
  {
    id: "5",
    character: "ト",
    options: ["ta", "to", "tsu", "te"],
    correctAnswer: "to",
  },
  {
    id: "6",
    character: "ナ",
    options: ["na", "ni", "nu", "ne"],
    correctAnswer: "na",
  },
  {
    id: "7",
    character: "ニ",
    options: ["na", "ni", "nu", "no"],
    correctAnswer: "ni",
  },
  {
    id: "8",
    character: "ヌ",
    options: ["na", "ni", "nu", "ne"],
    correctAnswer: "nu",
  },
];

export default function HiraganaKatakanaTest() {
  const [location, navigate] = useLocation();
  const [script, setScript] = useState<Script>("hiragana");
  const [testLevel, setTestLevel] = useState<TestLevel>("level1");
  const [phase, setPhase] = useState<TestPhase>("test");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [testCompleted, setTestCompleted] = useState(false);
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [questions, setQuestions] = useState<TestQuestion[]>([]);

  // Parse script and level from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlScript = urlParams.get("script") as Script | null;
    const urlLevel = urlParams.get("level") as TestLevel | null;
    
    if (urlScript === "hiragana" || urlScript === "katakana") {
      setScript(urlScript);
      // Store in sessionStorage to persist across page reloads
      sessionStorage.setItem("selectedScript", urlScript);
    } else {
      // Try to get from sessionStorage
      const stored = sessionStorage.getItem("selectedScript") as Script | null;
      if (stored) {
        setScript(stored);
      }
    }
    
    if (urlLevel === "level1" || urlLevel === "level2") {
      setTestLevel(urlLevel);
    }
  }, []);

  // Initialize questions when script or level changes
  useEffect(() => {
    let baseQuestions: TestQuestion[];

    if (script === "hiragana") {
      baseQuestions = testLevel === "level1" 
        ? HIRAGANA_TEST_LEVEL1_BASE 
        : HIRAGANA_TEST_LEVEL2_BASE;
    } else {
      baseQuestions = testLevel === "level1" 
        ? KATAKANA_TEST_LEVEL1_BASE 
        : KATAKANA_TEST_LEVEL2_BASE;
    }

    setQuestions(createTestQuestions(baseQuestions));
  }, [script, testLevel]);

  // Debug: Log current script
  useEffect(() => {
    console.log("Current script:", script);
  }, [script]);

  const getCharacterData = (script: Script, level: TestLevel): Character[] => {
    if (script === "hiragana") {
      return level === "level1" ? HIRAGANA_DATA : HIRAGANA_DATA_LEVEL2;
    } else {
      return level === "level1" ? KATAKANA_DATA : KATAKANA_DATA_LEVEL2;
    }
  };

  const characterData = getCharacterData(script, testLevel);
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = (answer: string) => {
    if (answered) return;

    setSelectedAnswer(answer);
    setAnswered(true);

    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
      toast.success("Правильно! ✨");
    } else {
      toast.error(`Неправильно. Правильный ответ: ${currentQuestion.correctAnswer}`);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      setTestCompleted(true);
    }
  };

  const handleContinueToLevel2 = () => {
    setTestLevel("level2");
    setPhase("study");
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setTestCompleted(false);
    setFlipped(new Set());
  };

  const handleStartLevel2Test = () => {
    setPhase("test");
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setTestCompleted(false);
  };

  const handleRestartTest = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setTestCompleted(false);
    setPhase("test");
    // Re-randomize questions
    let baseQuestions: TestQuestion[];
    if (script === "hiragana") {
      baseQuestions = testLevel === "level1" 
        ? HIRAGANA_TEST_LEVEL1_BASE 
        : HIRAGANA_TEST_LEVEL2_BASE;
    } else {
      baseQuestions = testLevel === "level1" 
        ? KATAKANA_TEST_LEVEL1_BASE 
        : KATAKANA_TEST_LEVEL2_BASE;
    }
    setQuestions(createTestQuestions(baseQuestions));
  };

  const toggleFlip = (id: string) => {
    const newFlipped = new Set(flipped);
    if (newFlipped.has(id)) {
      newFlipped.delete(id);
    } else {
      newFlipped.add(id);
    }
    setFlipped(newFlipped);
  };

  // Study Phase
  if (phase === "study") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-pink-50/50 to-blue-50/30">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-pink-200/50">
          <div className="container flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  navigate?.("/hiragana");
                  sessionStorage.removeItem("selectedScript");
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="sakura-heading text-xl">Изучение</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container py-12 md:py-20">
          <div className="mb-8">
            <h2 className="sakura-heading-2 text-center mb-8">
              {script === "hiragana" ? "Хирагана" : "Катакана"} - Уровень 2
            </h2>
          </div>

          {/* Characters Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {characterData.map(char => (
              <div
                key={char.id}
                onClick={() => toggleFlip(char.id)}
                className="h-32 bg-white rounded-2xl border-2 border-pink-200/60 cursor-pointer flex items-center justify-center transition-all hover:shadow-lg active:scale-95 relative"
              >
                <div className="text-center">
                  {flipped.has(char.id) ? (
                    <div>
                      <p className="text-lg font-medium text-foreground">{char.romaji}</p>
                      <p className="text-sm text-foreground/70">{char.pronunciation}</p>
                    </div>
                  ) : (
                    <p className="text-5xl font-bold text-foreground">{char.character}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          {/* Action Button - фиксированный розовый цвет и белый текст */}
<div className="flex justify-center">
  <button
    onClick={handleStartLevel2Test}
    className="px-10 py-4 rounded-full font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
    style={{ backgroundColor: "#ffb7c5" }} // Тот самый Sakura Pink
  >
    Начать тест
  </button>
</div>

        </main>
      </div>
    );
  }

  // Results Phase
  if (testCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-pink-50/50 to-blue-50/30">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-pink-200/50">
          <div className="container flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  navigate?.("/hiragana");
                  sessionStorage.removeItem("selectedScript");
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="sakura-heading text-xl">Результаты теста</h1>
            </div>
          </div>
        </header>

        {/* Results */}
        <main className="container py-12 md:py-20 flex items-center justify-center">
  <div className="w-full max-w-md text-center">

    {/* Универсальный кружок с иконкой */}
    <div className="flex flex-col items-center mb-8">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-sm transition-all duration-500"
        style={{
          backgroundColor: percentage >= 80 ? "#8dcc9220" : percentage >= 60 ? "#fef3c7" : "#fee2e2"
        }}
      >
        {percentage >= 80 ? (
          <CheckCircle2 size={56} style={{ color: "#8dcc92" }} />
        ) : percentage >= 60 ? (
          <div className="text-4xl">📊</div> // Можно оставить иконку графика или заменить на другую
        ) : (
          <XCircle size={56} className="text-red-400" />
        )}
      </div>

      <h2 className="sakura-heading-2 mb-2 text-3xl">
        {percentage >= 80
          ? "Отлично!"
          : percentage >= 60
            ? "Хорошо!"
            : "Попробуй ещё раз!"}
      </h2>

      <p className="text-foreground/60 text-sm md:text-base">
        {percentage >= 80
          ? "Вы прекрасно справились с тестом!"
          : "Новый уровень откроется при результате от 80%"}
      </p>
    </div>



            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-pink-100 mb-8">
  <p className="text-foreground/50 text-sm font-medium uppercase tracking-wider mb-4">
    Ваш результат
  </p>
  <div className="space-y-1">
    <p className="sakura-heading text-6xl text-primary">
      {score}/{questions.length}
    </p>
    <p className="text-2xl font-bold text-foreground/80">{percentage}%</p>
  </div>
</div>


            <div className="space-y-4">
  {/* Кнопка следующего уровня (если доступна) */}
  {percentage >= 80 && testLevel === "level1" && (
    <button
  onClick={handleContinueToLevel2}
  className="w-full py-4 rounded-2xl font-bold text-white hover:opacity-90 shadow-lg shadow-green-100 transition-all active:scale-95"
  style={{ backgroundColor: "#8dcc92" }} // Устанавливаем ваш цвет здесь
>
  Следующий уровень
</button>

              )}
              {testLevel === "level2" && (
                <button
                  disabled
                  className="w-full px-6 py-3 rounded-full font-medium bg-gray-300 text-gray-700 cursor-not-allowed opacity-60"
                >
                  ⏳ В процессе разработки
                </button>
              )}
                <button
    onClick={handleRestartTest}
    className="w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95"
    style={{ backgroundColor: "#f2b0c0" }}
  >
    Пройти тест ещё раз
  </button>
              <button
    onClick={() => {
      navigate?.("/hiragana");
      sessionStorage.removeItem("selectedScript");
    }}
    className="w-full py-4 rounded-2xl font-bold border-2 border-primary text-primary bg-transparent hover:bg-primary/5 transition-all active:scale-95"
  >
    Вернуться к урокам
  </button>
</div>
          </div>
        </main>
      </div>
    );
  }

  // Test Phase - show loading if questions not yet initialized
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-pink-50/50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground/70">Загрузка теста...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-pink-50/50 to-blue-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-pink-200/50">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                navigate?.("/hiragana");
                sessionStorage.removeItem("selectedScript");
              }}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="sakura-heading text-xl">Тест</h1>
          </div>

          {/* Level Indicator */}
          <div className="text-sm text-foreground/70">
            Уровень: {testLevel === "level1" ? "1" : "2"}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12 md:py-20 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-foreground/70">
                Вопрос {currentQuestionIndex + 1} из {questions.length}
              </span>
              <span className="text-sm text-foreground/70">
                Правильно: {score}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-3xl p-8 border-2 border-pink-200/60 mb-8">
            <div className="text-center mb-8">
              <p className="text-foreground/70 text-sm mb-2">Что это?</p>
              <p className="text-7xl font-bold text-foreground mb-4">
                {currentQuestion.character}
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map(option => (
                <button
                  key={option}
                  onClick={() => handleAnswerClick(option)}
                  disabled={answered}
                  className={`p-4 rounded-2xl font-medium transition-all ${
                    selectedAnswer === option
                      ? option === currentQuestion.correctAnswer
                        ? "text-white"
                        : "text-white"
                      : answered && option === currentQuestion.correctAnswer
                        ? "text-white"
                        : "bg-gray-200 text-foreground hover:bg-gray-200 disabled:opacity-100"
                  }`}
                  style={
  selectedAnswer === option
    ? option === currentQuestion.correctAnswer
      ? { backgroundColor: "#8dcc92" } // Мягкий зеленый (пастельный)
      : { backgroundColor: "#cc5e60" } // Мягкий красный/коралловый (не вырвиглазный)
    : answered && option === currentQuestion.correctAnswer
      ? { backgroundColor: "#8dcc92" } // Подсветка правильного мягким зеленым
      : {}
}

                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Next Button */}
          {answered && (
            <button
              onClick={handleNextQuestion}
              className="w-full px-6 py-3 rounded-full font-medium text-white hover:opacity-90 transition-all"
              style={{ backgroundColor: "#ffb7c5" }}
            >
              {currentQuestionIndex < questions.length - 1
                ? "Следующий вопрос"
                : "Завершить тест"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

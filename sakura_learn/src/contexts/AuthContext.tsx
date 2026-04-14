import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

interface User {
  id: number;
  email: string;
  name?: string;
  level?: string;
  learning_goal?: string;
  daily_goal?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  register: (email: string, pass: string, confirm: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User | null) => void; // Добавили сюда
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // Для совместимости
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await apiClient.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

const register = async (email: string, pass: string, confirm: string) => {
  setError(null);
  try {
    const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email,          // Сервер ждет username (используем email как username )
        email: email,             // Поле email тоже отправляем на всякий случай
        password: pass,           // Пароль
        password_confirm: confirm // Сервер ждет password_confirm (а не confirm_password)
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.username?.[0] || errorData.password_confirm?.[0] || "Ошибка регистрации");
    }

    const data = await response.json();

    // Если сервер возвращает токен сразу после регистрации:
    if (data.access) {
      localStorage.setItem("access", data.access);
      const newUser = await apiClient.getCurrentUser();
      setUser(newUser);
    } else {
      // Если токена нет, просто перенаправляем на логин
      toast.success("Регистрация успешна! Теперь войдите в аккаунт.");
      navigate("/login");
    }
  } catch (err: any) {
    setError(err.message);
    toast.error(err.message);
    throw err;
  }
};


  const login = async (email: string, pass: string) => {
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass } ),
      });
      if (!response.ok) throw new Error("Неверный логин или пароль");
      const data = await response.json();
      localStorage.setItem("access", data.access); // Сохраняем токен!
      const loggedInUser = await apiClient.getCurrentUser();
      setUser(loggedInUser);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    apiClient.logout();
    toast.success("Выход выполнен");
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        clearError,
        setUser, // Теперь эта функция существует!
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface UserProfile {
  id: number;
  user: number;
  level: string;
  study_streak: number;
  words_learned: number;
  hours_studied: number;
  daily_goal: number;
  created_at: string;
  updated_at: string;
  learning_goal: string;
}

class ApiClient {
  private baseUrl: string = "http://127.0.0.1:8000/api";

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
   ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem("access");

    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem("access");
      // Не делаем редирект здесь, чтобы не зациклить приложение
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.error || "Ошибка запроса");
    }

    return response.json();
  }

  // Методы API
  async getCurrentUser(): Promise<User> {
    return this.request<User>("/auth/me/");
  }

  async getProfile(): Promise<UserProfile> {
    return this.request<UserProfile>("/profile/get_profile/");
  }

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    return this.request<UserProfile>("/profile/update_profile/", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async updateUserInfo(data: { first_name?: string; email?: string }): Promise<User> {
    return this.request<User>("/profile/update_user_info/", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  }
}

export const apiClient = new ApiClient();
export default apiClient;

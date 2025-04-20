import NetInfo from '@react-native-community/netinfo';
import { ProgressEvent } from '@/types';
import { Platform } from 'react-native';
// Удаляем импорт из auth modules
// import { authStorage } from '@/modules/auth/services';

// Добавляем интерфейс для токен-провайдера
export interface TokenProvider {
  getAuthToken(): Promise<string | null>;
}

interface HttpResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  onUploadProgress?: (progressEvent: ProgressEvent) => void;
  skipAuth?: boolean; // Флаг для пропуска авторизации, если требуется
}

interface ApiError {
  message: string;
  [key: string]: unknown;
}

type RequestBody = Record<string, unknown> | unknown[];

class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;
  private authToken: string | null = null;
  private tokenProvider: TokenProvider | null = null;

  constructor(
    baseUrl: string,
    defaultHeaders: Record<string, string> = {},
    defaultTimeout: number = 30000,
    tokenProvider: TokenProvider | null = null
  ) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
    this.defaultTimeout = defaultTimeout;
    this.tokenProvider = tokenProvider;
    
    // Загружаем токен авторизации при инициализации
    this.loadAuthToken();
  }

  /**
   * Загружает токен авторизации из хранилища
   */
  public async loadAuthToken(): Promise<void> {
    try {
      if (this.tokenProvider) {
        const token = await this.tokenProvider.getAuthToken();
        if (token) {
          this.authToken = token;
          this.setDefaultHeader('Authorization', `Bearer ${token}`);
        }
      }
    } catch (error) {
      // Удален console.error
    }
  }

  /**
   * Устанавливает токен авторизации
   * @param token Токен авторизации
   */
  public setAuthToken(token: string): void {
    this.authToken = token;
    this.setDefaultHeader('Authorization', `Bearer ${token}`);
  }

  /**
   * Очищает токен авторизации
   */
  public clearAuthToken(): void {
    this.authToken = null;
    // Удаляем заголовок авторизации
    const { Authorization, ...rest } = this.defaultHeaders;
    this.defaultHeaders = rest;
  }

  /**
   * Устанавливает заголовок по умолчанию для всех запросов
   * @param name Имя заголовка
   * @param value Значение заголовка
   */
  public setDefaultHeader(name: string, value: string): void {
    this.defaultHeaders[name] = value;
  }

  /**
   * Возвращает текущие заголовки по умолчанию
   */
  public getDefaultHeaders(): Record<string, string> {
    return { ...this.defaultHeaders };
  }

  // Проверка подключения к интернету
  private async checkNetworkConnectivity(): Promise<boolean> {
    const netInfoState = await NetInfo.fetch();
    return netInfoState.isConnected === true;
  }

  // Получение заголовков с учетом авторизации
  private async getHeaders(options?: RequestOptions): Promise<Record<string, string>> {
    const headers = {
      ...this.defaultHeaders,
      ...options?.headers,
    };

    // Если нет токена авторизации в заголовках и не установлен флаг пропуска авторизации
    if (!headers['Authorization'] && !options?.skipAuth) {
      // Попробуем загрузить токен, если его еще нет
      if (!this.authToken) {
        await this.loadAuthToken();
      }
      
      // Если токен теперь доступен, добавляем его в заголовки
      if (this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`;
      }
    }

    return headers;
  }

  // Базовый метод для выполнения запросов
  private async request<T>(
    endpoint: string,
    method: string,
    data?: RequestBody,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    const isConnected = await this.checkNetworkConnectivity();

    if (!isConnected) {
      return {
        data: null,
        error: 'Нет подключения к интернету',
        status: 0,
      };
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers = await this.getHeaders(options);

    if (Platform.OS !== 'web' && __DEV__) {
      // Удален console.log
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        options?.timeout || this.defaultTimeout
      );

      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let responseData: unknown;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        // Для текстовых ответов
        responseData = await response.text();
      }

      // Логируем ответ в режиме разработки
      // if (Platform.OS !== 'web' && __DEV__) {
      //   console.log(`${method} ответ:`, { 
      //     url, 
      //     status: response.status, 
      //     ok: response.ok,
      //     data: responseData 
      //   });
      // }

      // Если получен статус 401 (Unauthorized), токен может быть истек
      if (response.status === 401) {
        // Здесь можно добавить логику обновления токена
        // Удален console.error
      }

      return {
        data: response.ok ? (responseData as T) : null,
        error: response.ok
          ? null
          : typeof responseData === 'object' && responseData
            ? (
              // Проверяем поле 'message' в ответе (стандартное для многих API)
              'message' in responseData 
                ? (responseData as ApiError).message
                // Проверяем поле 'error' (используется в нашем бэкенде)
                : 'error' in responseData && typeof responseData.error === 'string' 
                  ? responseData.error as string
                  // Возвращаем стандартное сообщение, если ни error, ни message не найдены
                  : `Ошибка сервера (${response.status})`
            )
            : `Ошибка сервера (${response.status})`,
        status: response.status,
      };
    } catch (error) {
      if (Platform.OS !== 'web' && __DEV__) {
        // Удален console.error
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            data: null,
            error: 'Время запроса истекло',
            status: 408,
          };
        }

        return {
          data: null,
          error: error.message,
          status: 500,
        };
      }

      return {
        data: null,
        error: 'Неизвестная ошибка',
        status: 500,
      };
    }
  }

  // GET запрос
  async get<T>(endpoint: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, 'GET', undefined, options);
  }

  // POST запрос
  async post<T>(endpoint: string, data: RequestBody, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, 'POST', data, options);
  }

  // PUT запрос
  async put<T>(endpoint: string, data: RequestBody, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, 'PUT', data, options);
  }

  // PATCH запрос
  async patch<T>(endpoint: string, data: RequestBody, options?: RequestOptions): Promise<HttpResponse<T>> {
    try {
      // Для мобильных устройств логируем отправку запроса
      // if (Platform.OS !== 'web' && __DEV__) {
      //   console.log(`📡 PATCH ${this.baseUrl}${endpoint}`, {
      //     headers: options ? { ...options.headers } : {},
      //     data
      //   });
      // }
      
      // Формируем параметры запроса явно указывая Content-Type для мобильных платформ
      const requestOptions = {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options?.headers,
          'Content-Type': 'application/json'
        }
      };
      
      const response = await this.request<T>(endpoint, 'PATCH', data, requestOptions);
      
      // Для мобильных устройств логируем полученный ответ
      // if (Platform.OS !== 'web' && __DEV__) {
      //   console.log(`✅ PATCH ${this.baseUrl}${endpoint} Response:`, response);
      // }
      
      return response;
    } catch (error) {
      // Логируем ошибку детально
      // Логируем ошибку детально
      // if (Platform.OS !== 'web' && __DEV__) {
      //   console.error(`❌ PATCH ${this.baseUrl}${endpoint} Error:`, error);
      // }
      
      // Улучшенная обработка ошибок для наглядности
      if (error instanceof Error) {
        return {
          data: null,
          error: `[PATCH] ${error.name}: ${error.message}`,
          status: 500,
        };
      }
      
      return {
        data: null,
        error: 'Неизвестная ошибка при PATCH-запросе',
        status: 500,
      };
    }
  }

  // DELETE запрос
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, 'DELETE', undefined, options);
  }
}

export default HttpClient;

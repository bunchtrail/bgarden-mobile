import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

interface HttpResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;

  constructor(
    baseUrl: string, 
    defaultHeaders: Record<string, string> = {}, 
    defaultTimeout: number = 30000
  ) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
    this.defaultTimeout = defaultTimeout;
  }

  // Проверка подключения к интернету
  private async checkNetworkConnectivity(): Promise<boolean> {
    const netInfoState = await NetInfo.fetch();
    return netInfoState.isConnected === true;
  }

  // Базовый метод для выполнения запросов
  private async request<T>(
    endpoint: string,
    method: string,
    data?: any,
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
    const headers = {
      ...this.defaultHeaders,
      ...options?.headers,
    };

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

      let responseData: any;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        // Для текстовых ответов
        responseData = await response.text();
      }
      
      return {
        data: response.ok ? responseData : null,
        error: response.ok ? null : 
               typeof responseData === 'object' && responseData.message 
               ? responseData.message 
               : 'Произошла ошибка',
        status: response.status,
      };
    } catch (error) {
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
  async post<T>(endpoint: string, data: any, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, 'POST', data, options);
  }

  // PUT запрос
  async put<T>(endpoint: string, data: any, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, 'PUT', data, options);
  }

  // PATCH запрос
  async patch<T>(endpoint: string, data: any, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, 'PATCH', data, options);
  }

  // DELETE запрос
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, 'DELETE', undefined, options);
  }
}

export default HttpClient; 
import { InjectionToken } from '@angular/core';
import { environment } from '../../environments/environment';

export interface ApiConfig {
  baseUrl: string;
}

export const API_CONFIG = new InjectionToken<ApiConfig>('api.config');

export const apiConfig: ApiConfig = {
  baseUrl: environment.apiBaseUrl
};

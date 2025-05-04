import { APIRequestContext, APIResponse } from '@playwright/test';

export class AuthClient {
  private request: APIRequestContext;
  private apiKey: string;
  private baseURL: string;

  constructor(request: APIRequestContext, apiKey = 'reqres-free-v1') {
    this.request = request;
    this.apiKey = apiKey;
    this.baseURL = 'https://reqres.in/api/';
  }

  async get(endpoint: string): Promise<APIResponse> {
    return await this.request.get(`${this.baseURL}${endpoint}`, {
      headers: {
        'x-api-key': this.apiKey,
      },
    });
  }

  async post(endpoint: string, payload: object): Promise<APIResponse> {
    return await this.request.post(`${this.baseURL}${endpoint}`, {
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      data: payload,
    });
  }
}

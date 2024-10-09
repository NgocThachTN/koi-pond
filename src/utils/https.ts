import axios, { AxiosInstance } from "axios";
class Http {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL:
        "https://koipondconstructionmanagement20241004010355.azurewebsites.net/api/",
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });

    // Thêm interceptor để log response
    this.instance.interceptors.response.use((response) => {
      console.log('Response:', response);
      return response;
    }, (error) => {
      console.error('Response error:', error);
      return Promise.reject(error);
    });
  }
}

const http = new Http().instance;
export default http;

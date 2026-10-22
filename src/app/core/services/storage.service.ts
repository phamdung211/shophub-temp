import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  //T là generic type, cho phép hàm trả về kiểu dữ liệu mà bạn chỉ định.
  getItem<T>(key: string, fallback: T): T {
    try {
      const value = localStorage.getItem(key);

      if (value === null) {
        //giá trị mặc định nếu chưa có dữ liệu hoặc dữ liệu JSON không hợp lệ.
        return fallback;
      }

      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  //tự chuyển object/array thành JSON trước khi lưu, giúp nơi sử dụng không phải lặp lại logic này.
  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Không thể lưu dữ liệu:', error);
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}

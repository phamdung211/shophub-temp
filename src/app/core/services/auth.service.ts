import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthResponse, LoginCredentials, User } from '../model/user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Trạng thái đăng nhập giả lập bằng Angular Signal
  // Dùng !! để ép kiểu: nếu có token -> true, nếu null -> false
  private _isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly apiUrl = 'https://dummyjson.com/auth/login';
  // Đọc thông tin user đã lưu trước đó (nếu có)
  private getInitialUser(): User | null {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  }

  currentUser = signal<User | null>(this.getInitialUser());

  isAuthenticated = computed(() => !!this.currentUser());



  // Read-only signal công khai để các component/guard theo dõi
  isLoggedIn = this._isLoggedIn.asReadonly();

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, credentials).pipe(
      tap((res) => {
        // 1. Lưu accessToken vào localStorage (key 'token' để auth.interceptor đọc)
        localStorage.setItem('token', res.accessToken);

        // 2. Cập nhật Signal currentUser với thông tin user trả về
        this.currentUser.set(res);

        // 3. Đánh dấu _isLoggedIn là true
        this._isLoggedIn.set(true);

        //lưu user
        localStorage.setItem('user', JSON.stringify(res));
      })
    );
  }

  /**
   * Cập nhật thông tin người dùng trong Signal và localStorage
   * Đồng thời kích hoạt reactivity tức thì trên toàn ứng dụng (Header, Avatar, Profile...)
   */
  updateUserProfile(updatedData: Partial<User>): void {
    const current = this.currentUser();
    if (!current) return;

    const updatedUser: User = {
      ...current,
      ...updatedData,
    };

    this.currentUser.set(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }

  logout(): void {
    localStorage.removeItem('token');

    this._isLoggedIn.set(false);

    this.router.navigate(['/products'])

    this.currentUser.set(null);
    //xóa user
    localStorage.removeItem('user');
  }
}
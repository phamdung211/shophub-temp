import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Trạng thái đăng nhập giả lập bằng Angular Signal
  private _isLoggedIn = signal<boolean>(false);

  // Read-only signal công khai để các component/guard theo dõi
  isLoggedIn = this._isLoggedIn.asReadonly();

  login(): void {
    this._isLoggedIn.set(true);
  }

  logout(): void {
    this._isLoggedIn.set(false);
  }
}
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  authService = inject(AuthService);
  // 1. Inject thêm Router
  private router = inject(Router);

  toggleLogin(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.logout();

      // 2. Nếu đang đứng ở trang admin mà đăng xuất -> lập tức đẩy về /products
      if (this.router.url.startsWith('/admin')) {
        alert('Bạn đã đăng xuất khỏi phiên làm việc Admin!');
        this.router.navigate(['/products']);
      }
    } else {
      this.authService.login();
    }
  }
}

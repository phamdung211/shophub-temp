import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyService } from '../../../core/services/currency.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
  private router = inject(Router);
  currencyService = inject(CurrencyService);
  toggleLogin(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.logout();

      // Nếu đang đứng ở trang admin mà đăng xuất -> lập tức đẩy về /products
      if (this.router.url.startsWith('/admin')) {
        alert('Bạn đã đăng xuất khỏi phiên làm việc Admin!');
        this.router.navigate(['/products']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}

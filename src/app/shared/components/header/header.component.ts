import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyService } from '../../../core/services/currency.service';
import { ThemeService } from '../../../core/services/theme.service';

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
  readonly themeService = inject(ThemeService);
  private router = inject(Router);
  private elementRef = inject(ElementRef);
  currencyService = inject(CurrencyService);

  // Trạng thái mở/đóng dropdown menu người dùng
  isUserMenuOpen = signal<boolean>(false);

  toggleUserMenu(): void {
    this.isUserMenuOpen.update((open) => !open);
  }

  closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }

  onLogout(): void {
    this.closeUserMenu();
    this.authService.logout();
    if (
      this.router.url.startsWith('/admin') ||
      this.router.url.startsWith('/profile') ||
      this.router.url.startsWith('/orders')
    ) {
      this.router.navigate(['/products']);
    }
  }

  // Tự động đóng dropdown khi click ra ngoài header
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeUserMenu();
    }
  }

  toggleLogin(): void {
    if (this.authService.isLoggedIn()) {
      this.onLogout();
    } else {
      this.router.navigate(['/login']);
    }
  }
}

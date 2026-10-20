import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appHoverCard]',
  standalone: true,
})
export class HoverCardDirective {
  @HostBinding('style.transition')
  transition = 'transform 200ms ease, box-shadow 200ms ease';

  @HostBinding('style.transform')
  transform = 'translateY(0)';

  @HostBinding('style.boxShadow')
  boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.transform = 'translateY(-4px)';
    this.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.14)';
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.transform = 'translateY(0)';
    this.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';
  }
}

import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: 'img[appImageFallback]',
  standalone: true,
})
export class ImageFallbackDirective {
  @Input() appImageFallback = 'assets/images/product-placeholder.svg';

  constructor(
    private readonly elementRef: ElementRef<HTMLImageElement>,
    private readonly renderer: Renderer2,
  ) {}

  @HostListener('error')
  onImageError(): void {
    const img = this.elementRef.nativeElement;

    if (img.dataset['fallbackApplied'] === 'true') {
      return;
    }

    this.renderer.setAttribute(img, 'data-fallback-applied', 'true');

    this.renderer.setAttribute(img, 'src', this.appImageFallback);
  }
}

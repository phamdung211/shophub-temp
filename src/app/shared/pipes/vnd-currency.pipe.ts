import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vndCurrency',
  standalone: true,
  pure: true,
})
export class VndCurrencyPipe implements PipeTransform {
  private readonly exchangeRate = 25400;

  transform(usd: number | null | undefined): string {
    if (usd == null || !Number.isFinite(usd)) {
      return '—';
    }

    const vnd = usd * this.exchangeRate;

    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(vnd);
  }
}

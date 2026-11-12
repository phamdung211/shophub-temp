import { inject, Pipe, PipeTransform } from '@angular/core';
import { CurrencyService } from '../../core/services/currency.service';

@Pipe({
  name: 'vndCurrency',
  standalone: true,
  pure: false,
})
export class VndCurrencyPipe implements PipeTransform {
  private readonly exchangeRate = 25400;
  private currencyService = inject(CurrencyService);
  transform(usd: number | null | undefined): string {
    return this.currencyService.format(usd);
  }
}

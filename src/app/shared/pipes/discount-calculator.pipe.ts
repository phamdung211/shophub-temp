import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discountCalculator',
  standalone: true,
  pure: true,
})
export class DiscountCalculatorPipe implements PipeTransform {
  transform(
    price: number | null | undefined,
    discountPercentage: number | null | undefined,
  ): number {
    if (
      price == null ||
      discountPercentage == null ||
      !Number.isFinite(price) ||
      !Number.isFinite(discountPercentage) ||
      price < 0 ||
      discountPercentage < 0 ||
      discountPercentage > 100
    ) {
      return 0;
    }

    return price * (1 - discountPercentage / 100);
  }
}

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Kiểm tra số nguyên không âm
export const integerMinZeroValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value;

  if (value === null || value === '') {
    return null; // Để Validators.required xử lý
  }

  const numberValue = Number(value);

  return Number.isInteger(numberValue) && numberValue >= 0
    ? null
    : { integerMinZero: true };
};

// Kiểm tra URL ảnh
export const imageUrlValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value;

  if (value == null || value === '') {
    return null; // Để Validators.required xử lý
  }

  try {
    const url = new URL(value);

    return url.protocol === 'http:' || url.protocol === 'https:'
      ? null
      : { invalidUrl: true };
  } catch {
    return { invalidUrl: true };
  }
};

// Kiểm tra giá sau giảm không âm
export const priceDiscountValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const price = control.get('price')?.value;
  const discount = control.get('discountPercentage')?.value;

  if (price == null || discount == null || price === '' || discount === '') {
    return null;
  }

  const numericPrice = Number(price);
  const numericDiscount = Number(discount);

  if (!Number.isFinite(numericPrice) || !Number.isFinite(numericDiscount)) {
    return null;
  }

  const finalPrice = numericPrice * (1 - numericDiscount / 100);

  return finalPrice < 0 ? { invalidPriceDiscount: true } : null;
};

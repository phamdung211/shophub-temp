import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Product } from '../../../core/model/product.model';
import { ProductService } from '../../../core/services/product.service';
import { ValidationMessageComponent } from '../../../shared/components/validation-message/validation-message.component';

import {
  imageUrlValidator,
  integerMinZeroValidator,
  priceDiscountValidator,
} from './product-form.validators';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);

  categories = [
    { label: 'Laptop', value: 'laptops' },
    { label: 'Điện thoại', value: 'smartphones' },
    { label: 'Phụ kiện', value: 'accessories' },
    { label: 'Nước hoa', value: 'fragrances' },
  ];

  productForm = this.fb.group(
    {
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
        ],
      ],
      price: [0, [Validators.required, Validators.min(Number.MIN_VALUE)]],
      discountPercentage: [
        0,
        [Validators.required, Validators.min(0), Validators.max(90)],
      ],
      stock: [0, [Validators.required, integerMinZeroValidator]],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      thumbnail: ['', [Validators.required, imageUrlValidator]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    },
    {
      validators: [priceDiscountValidator],
    },
  );

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const value = this.productForm.getRawValue();
    const products = this.productService.getProducts();

    const nextId =
      products.reduce(
        (maxId, product) => Math.max(maxId, Number(product.id)),
        0,
      ) + 1;

    const newProduct: Product = {
      id: nextId,
      title: value.title!,
      description: value.description!,
      price: Number(value.price),
      discountPercentage: Number(value.discountPercentage),
      rating: 0,
      stock: Number(value.stock),
      brand: value.brand!,
      category: value.category!,
      thumbnail: value.thumbnail!,
      images: [value.thumbnail!],
    };

    this.productService.addProduct(newProduct);

    void this.router.navigate(['/']);
  }
}

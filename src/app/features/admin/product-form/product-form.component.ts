import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Product } from '../../../core/model/product.model';
import { ProductService } from '../../../core/services/product.service';
import { ValidationMessageComponent } from '../../../shared/components/validation-message/validation-message.component';
import { HasUnsavedChanges } from '../../../core/guards/unsaved-changes.guard';

import {
  imageUrlValidator,
  integerMinZeroValidator,
  priceDiscountValidator,
} from './product-form.validators';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit, HasUnsavedChanges {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  isSubmitted = false;
  isSubmitting = false;

  // Trong class ProductFormComponent:
  @Input() id?: string; // Nhận id từ URL /admin/products/edit/:id

  get isEditMode(): boolean {
    return !!this.id;
  }

  categories: { label: string; value: string }[] = [
    { label: 'Laptop', value: 'laptops' },
    { label: 'Điện thoại', value: 'smartphones' },
    { label: 'Phụ kiện', value: 'mobile-accessories' },
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

  ngOnInit(): void {
    // Tải danh mục thực tế từ API DummyJSON
    this.productService.getCategories().subscribe({
      next: (apiCats) => {
        if (apiCats && apiCats.length > 0) {
          this.categories = apiCats.map((c) => ({
            label: c.name || c.slug,
            value: c.slug,
          }));
        }
      },
      error: (err) => console.warn('Không thể tải categories cho form:', err),
    });
    //load dữ liệu cũ khi sửa
    if (this.isEditMode && this.id) {
      this.productService.getProductById(this.id).subscribe({
        next: (product) => {
          this.productForm.patchValue({
            title: product.title,
            price: product.price,
            discountPercentage: product.discountPercentage,
            stock: product.stock,
            category: product.category,
            brand: product.brand,
            thumbnail: product.thumbnail,
            description: product.description,
          });
        },
        error: (err) => {
          console.error('Không tìm thấy sản phẩm cần sửa:', err);
          this.toastService.error('Không tìm thấy thông tin sản phẩm!');
          this.router.navigate(['/admin/products']);
        },
      });
    }
  }

  hasUnsavedChanges(): boolean {
    if (this.isSubmitted) {
      return false;
    }
    return this.productForm.dirty;
  }

  onSubmit(): void {
    if (!this.authService.isLoggedIn()) {
      this.toastService.warning('Phiên làm việc đã hết hạn. Bạn cần đăng nhập Admin để lưu!');
      this.router.navigate(['/products']);
      return;
    }
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const value = this.productForm.getRawValue();

    const newProduct: Partial<Product> = {
      title: value.title!,
      description: value.description!,
      price: Number(value.price),
      discountPercentage: Number(value.discountPercentage),
      rating: 5,
      stock: Number(value.stock),
      brand: value.brand!,
      category: value.category!,
      thumbnail: value.thumbnail!,
      images: [value.thumbnail!],
    };

    this.isSubmitting = true;
    if (this.isEditMode && this.id) {
      this.productService.updateProduct(this.id, newProduct).subscribe({
        next: (updated) => {
          this.toastService.success(`Cập nhật sản phẩm "${updated.title}" thành công!`);
          this.isSubmitted = true;
          this.isSubmitting = false;
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          this.toastService.error('Cập nhật thất bại!');
          this.isSubmitting = false;
        }
      });
    } else {
      this.productService.addProduct(newProduct).subscribe({
        next: (created) => {
          this.toastService.success(`Thêm sản phẩm "${created.title}" thành công! (Mã: #${created.id})`);
          this.isSubmitted = true;
          this.isSubmitting = false;
          void this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          console.error('Lỗi khi thêm sản phẩm:', err);
          this.toastService.error('Có lỗi xảy ra khi gọi DummyJSON API!');
          this.isSubmitting = false;
        },
      });
    }
  }
}

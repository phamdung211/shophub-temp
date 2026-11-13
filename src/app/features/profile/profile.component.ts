import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { User } from '../../core/model/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  readonly authService = inject(AuthService);
  private toastService = inject(ToastService);

  profileForm!: FormGroup;
  isSaving = false;

  constructor() {
    // Tự động đồng bộ form nếu Signal currentUser thay đổi
    effect(() => {
      const user = this.authService.currentUser();
      if (user && this.profileForm && this.profileForm.pristine) {
        this.populateForm(user);
      }
    });
  }

  ngOnInit(): void {
    this.buildForm();
    const user = this.authService.currentUser();
    if (user) {
      this.populateForm(user);
    }
  }

  private buildForm(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.pattern(/^(0|84)[3|5|7|8|9][0-9]{8}$/)]],
      image: ['']
    });
  }

  private populateForm(user: User): void {
    this.profileForm.patchValue({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      username: user.username || '',
      phone: user.phone || '',
      image: user.image || ''
    });
    this.profileForm.markAsPristine();
  }

  // Tiện ích kiểm tra lỗi từng trường
  hasError(controlName: string, errorName?: string): boolean {
    const control = this.profileForm.get(controlName);
    if (!control || !control.touched) return false;
    return errorName ? control.hasError(errorName) : control.invalid;
  }

  // Xem trước avatar trực tiếp từ form hoặc từ signal
  get avatarPreview(): string {
    const formImage = this.profileForm?.get('image')?.value;
    return formImage?.trim() || this.authService.currentUser()?.image || 'https://dummyjson.com/icon/kminchelle/128';
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.toastService.warning('Vui lòng điền đầy đủ và đúng thông tin!');
      return;
    }

    this.isSaving = true;
    const formValues = this.profileForm.value;

    try {
      this.authService.updateUserProfile({
        firstName: formValues.firstName.trim(),
        lastName: formValues.lastName.trim(),
        email: formValues.email.trim(),
        username: formValues.username.trim(),
        phone: formValues.phone?.trim() || '',
        image: formValues.image?.trim() || this.avatarPreview
      });

      this.profileForm.markAsPristine();
      this.toastService.success('Cập nhật hồ sơ cá nhân thành công!');
    } catch {
      this.toastService.error('Có lỗi xảy ra khi cập nhật hồ sơ!');
    } finally {
      this.isSaving = false;
    }
  }

  onReset(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.populateForm(user);
      this.toastService.info('Đã khôi phục thông tin ban đầu!');
    }
  }
}


import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-validation-message',
  standalone: true,
  template: `
    @if (control && control.touched && control.invalid) {
      <div class="validation-message">
        @if (control.hasError('required')) {
          <span>{{ label }} là bắt buộc.</span>
        } @else if (control.hasError('minlength')) {
          <span> {{ label }} chưa đạt độ dài tối thiểu. </span>
        } @else if (control.hasError('maxlength')) {
          <span> {{ label }} vượt quá độ dài cho phép. </span>
        } @else if (control.hasError('min')) {
          <span>{{ label }} phải lớn hơn 0.</span>
        } @else if (control.hasError('max')) {
          <span>{{ label }} vượt quá giới hạn cho phép.</span>
        } @else if (control.hasError('integerMinZero')) {
          <span> {{ label }} phải là số nguyên không âm. </span>
        } @else if (control.hasError('invalidUrl')) {
          <span>Vui lòng nhập URL HTTP/HTTPS hợp lệ.</span>
        }
      </div>
    }
  `,
  styles: [
    `
      .validation-message {
        color: #dc2626;
        font-size: 13px;
        margin-top: 4px;
      }
    `,
  ],
})
export class ValidationMessageComponent {
  @Input() control: AbstractControl | null = null;
  @Input() label = 'Trường dữ liệu';
}

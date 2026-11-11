import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
})
export class ConfirmModalComponent {
  //trạng thái đóng/mở modal
  @Input() isOpen = false;

  //nội dung hiển thị có thể tùy biến
  @Input() title = 'Xác nhận hành động';
  @Input() message = 'Bạn có chắc chắn muốn thực hiện hành động này?';
  @Input() confirmText = 'Xác nhận';
  @Input() cancelText = 'Hủy bỏ';
  @Input() isDanger = true; //nếu là hành động xóa/nguy hiểm -> nút màu đỏ

  //bắn sự kiện ra component cha
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
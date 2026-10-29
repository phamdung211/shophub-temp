import { CanDeactivateFn } from '@angular/router';

export interface HasUnsavedChanges {
  hasUnsavedChanges: () => boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) => {
  if (component && typeof component.hasUnsavedChanges === 'function') {
    if (component.hasUnsavedChanges()) {
      return confirm('⚠️ Bạn có thay đổi chưa lưu! Bạn có chắc chắn muốn rời khỏi trang này?');
    }
  }
  return true;
};


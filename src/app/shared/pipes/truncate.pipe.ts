import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
  pure: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, limit = 50): string {
    if (!value) {
      return '';
    }

    const safeLimit = Math.max(0, Math.floor(limit));

    if (value.length <= safeLimit) {
      return value;
    }

    return value.slice(0, safeLimit) + '...';
  }
}

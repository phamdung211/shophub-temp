import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-filter-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-filter-bar.component.html',
  styleUrl: './product-filter-bar.component.scss',
})
export class ProductFilterBarComponent {
  searchText = '';
  selectedCategory = 'all';

  @Output() searchChange = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<string>();

  onSearchChange(): void {
    this.searchChange.emit(this.searchText);
  }

  onCategoryChange(): void {
    this.categoryChange.emit(this.selectedCategory);
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFilterBarComponent } from './product-filter-bar.component';

describe('ProductFilterBarComponent', () => {
  let component: ProductFilterBarComponent;
  let fixture: ComponentFixture<ProductFilterBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFilterBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductFilterBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

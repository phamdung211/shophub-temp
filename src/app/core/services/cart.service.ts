import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { CartItem } from '../model/cart.model';
import { Product } from '../model/product.model';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly storageService = inject(StorageService);
  private readonly STORAGE_KEY = 'shophub_cart_items';
  private readonly toastService = inject(ToastService);
  // State: Cart items quản lý toàn diện qua Angular Signal
  readonly cartItems = signal<CartItem[]>(this.loadInitialCart());

  // Computed: Tổng số lượng món hàng trong giỏ
  readonly totalItemsCount = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );

  // Computed: Tổng giá trị giỏ hàng sau khi tính chiết khấu của từng món (USD)
  readonly totalCartPrice = computed(() =>
    this.cartItems().reduce((sum, item) => {
      const discount = item.product.discountPercentage || 0;
      const unitPrice =
        discount > 0
          ? item.product.price * (1 - discount / 100)
          : item.product.price;
      return sum + unitPrice * item.quantity;
    }, 0)
  );

  // Computed: Tổng giá trị hàng gốc trước khi giảm (USD)
  readonly totalOriginalPrice = computed(() =>
    this.cartItems().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
  );

  // Computed: Tổng số tiền tiết kiệm được từ chiết khấu (USD)
  readonly totalSavings = computed(() =>
    Math.max(0, this.totalOriginalPrice() - this.totalCartPrice())
  );

  // Computed: Giỏ hàng có đang trống không
  readonly isEmpty = computed(() => this.cartItems().length === 0);

  constructor() {
    // Effect: Tự động lưu giỏ hàng vào LocalStorage khi cartItems Signal thay đổi
    effect(() => {
      const items = this.cartItems();
      this.storageService.setItem(this.STORAGE_KEY, items);
    });
  }

  /**
   * Thêm sản phẩm vào giỏ hàng
   * @param product Thông tin sản phẩm
   * @param quantity Số lượng muốn thêm (mặc định 1)
   */
  addToCart(product: Product, quantity: number = 1): boolean {
    if (!product || quantity <= 0) return false;

    //kiểm tra nếu sản phẩm đã hết hàng trong kho
    if (product.stock == null || product.stock <= 0) {
      this.toastService.error(`Sản phẩm "${product.title}" hiện đã hết hàng!`);
      return false;
    }

    //Kiểm tra nếu số lượng trong giỏ + số lượng muốn thêm vượt quá tồn kho
    const currentQty = this.getItemQuantity(product.id);
    if (currentQty + quantity > product.stock) {
      this.toastService.warning(
        `Kho chỉ còn ${product.stock} sản phẩm. Bạn đã có ${currentQty} món trong giỏ!`
      );
      return false;
    }

    //đủ điều kiện -> Cập nhật giỏ hàng
    this.cartItems.update((items) => {
      const index = items.findIndex((i) => i.product.id === product.id);

      if (index > -1) {
        return items.map((item, i) =>
          i === index ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [...items, { product, quantity }];
    });

    this.toastService.success(`Đã thêm "${product.title}" vào giỏ hàng!`);
    return true;
  }

  /**
   * Cập nhật số lượng của 1 sản phẩm trong giỏ
   * @param productId Mã sản phẩm
   * @param quantity Số lượng mới
   */
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.cartItems.update((items) =>
      items.map((item) => {
        if (item.product.id === productId) {
          const maxStock = item.product.stock;
          const finalQty =
            maxStock != null ? Math.min(quantity, maxStock) : quantity;
          return { ...item, quantity: finalQty };
        }
        return item;
      })
    );
  }

  /**
   * Xóa sản phẩm khỏi giỏ hàng theo ID
   * @param productId Mã sản phẩm
   */
  removeFromCart(productId: number | string): void {
    this.cartItems.update((items) =>
      items.filter((item) => String(item.product.id) !== String(productId)));
  }

  /**
   * Xóa toàn bộ giỏ hàng
   */
  clearCart(): void {
    this.cartItems.set([]);
  }

  /**
   * Lấy số lượng hiện có của một sản phẩm trong giỏ
   */
  getItemQuantity(productId: number | string): number {
    const item = this.cartItems().find((i) => String(i.product.id) === String(productId));
    return item ? item.quantity : 0;
  }

  /**
   * Khôi phục dữ liệu giỏ hàng ban đầu từ Storage
   */
  private loadInitialCart(): CartItem[] {
    const data = this.storageService.getItem<CartItem[]>(this.STORAGE_KEY, []);
    return Array.isArray(data) ? data : [];
  }
  /**
 * Kiểm tra xem sản phẩm có đủ tồn kho để thêm vào giỏ hay không
 * @param product Sản phẩm cần kiểm tra
 * @param quantityToAdd Số lượng muốn mua thêm (mặc định là 1)
 */
  canAddToCart(product: Product, quantityToAdd: number = 1): boolean {
    if (!product || product.stock == null || product.stock <= 0) {
      return false; // Hết hàng hoàn toàn
    }

    const currentQtyInCart = this.getItemQuantity(product.id);
    return (currentQtyInCart + quantityToAdd) <= product.stock;
  }
}


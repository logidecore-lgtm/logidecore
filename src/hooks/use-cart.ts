import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // unique local ID or DB ID
  productId: string;
  productVariantId?: string | null;
  quantity: number;
  customText?: string | null;
  customImageUrl?: string | null;
  product: {
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number | null;
    imageUrl?: string | null;
    sku: string;
  };
  variant?: {
    size: string;
    thickness: string;
    priceOffset: number;
  } | null;
}

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discountPercentage: number;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  getTotals: () => {
    subtotal: number;
    discount: number;
    gst: number;
    shipping: number;
    total: number;
  };
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discountPercentage: 0,

      addItem: (newItem) => {
        set((state) => {
          // Check if item with same product, variant, customText, customImageUrl exists
          const existingIndex = state.items.findIndex(
            (item) =>
              item.productId === newItem.productId &&
              item.productVariantId === newItem.productVariantId &&
              item.customText === newItem.customText &&
              item.customImageUrl === newItem.customImageUrl
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += newItem.quantity;
            return { items: updatedItems };
          }

          const id = Math.random().toString(36).substring(2, 9);
          return { items: [...state.items, { ...newItem, id }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }));
      },

      applyCoupon: (code, discount) => {
        set({ couponCode: code, discountPercentage: discount });
      },

      removeCoupon: () => {
        set({ couponCode: null, discountPercentage: 0 });
      },

      clearCart: () => {
        set({ items: [], couponCode: null, discountPercentage: 0 });
      },

      setItems: (items) => {
        set({ items });
      },

      getTotals: () => {
        const { items, discountPercentage } = get();
        
        // Subtotal calculated with variant offset if any
        const subtotal = items.reduce((acc, item) => {
          const basePrice = Number(item.product.price);
          const offset = item.variant ? Number(item.variant.priceOffset) : 0;
          return acc + (basePrice + offset) * item.quantity;
        }, 0);

        const discount = subtotal * (discountPercentage / 100);
        const subtotalAfterDiscount = subtotal - discount;
        
        // GST is 18% inclusive or exclusive. Let's make it 18% of the discounted price
        const gst = subtotalAfterDiscount * 0.18;
        
        // Shipping is Rs. 99 if subtotal is below Rs. 1500, free otherwise
        const shipping = subtotalAfterDiscount > 0 && subtotalAfterDiscount < 1500 ? 99 : 0;
        
        const total = subtotalAfterDiscount + gst + shipping;

        return {
          subtotal,
          discount,
          gst,
          shipping,
          total,
        };
      },
    }),
    {
      name: 'logidecore-cart-storage',
    }
  )
);

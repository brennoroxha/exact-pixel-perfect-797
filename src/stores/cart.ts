import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageKey: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  coupon: string | null;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setCoupon: (c: string | null) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      coupon: null,
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.slug === item.slug);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.slug === item.slug ? { ...i, quantity: i.quantity + qty } : i,
              ),
            };
          }
          return { items: [...s.items, { ...item, quantity: qty }] };
        }),
      remove: (slug) => set((s) => ({ items: s.items.filter((i) => i.slug !== slug) })),
      setQty: (slug, qty) =>
        set((s) => ({
          items: qty <= 0
            ? s.items.filter((i) => i.slug !== slug)
            : s.items.map((i) => (i.slug === slug ? { ...i, quantity: qty } : i)),
        })),
      clear: () => set({ items: [], coupon: null }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      setCoupon: (coupon) => set({ coupon }),
    }),
    { name: "flora-luxe-cart", partialize: (s) => ({ items: s.items, coupon: s.coupon }) },
  ),
);

export const cartCount = (items: CartItem[]) =>
  items.reduce((acc, i) => acc + i.quantity, 0);

export const cartSubtotal = (items: CartItem[]) =>
  items.reduce((acc, i) => acc + i.quantity * i.price, 0);

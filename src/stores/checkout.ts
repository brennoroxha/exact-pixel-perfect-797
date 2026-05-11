import { create } from "zustand";

export type CheckoutForm = {
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  recipientName: string;
  recipientPhone: string;
  recipientIsBuyer: boolean;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  cardMessage: string;
  includeCard: boolean;
  deliveryDate: string;
  deliveryPeriod: "manha" | "tarde" | "noite";
  paymentMethod: "pix" | "credit";
};

type State = {
  step: 1 | 2 | 3 | 4;
  form: CheckoutForm;
  setStep: (s: 1 | 2 | 3 | 4) => void;
  patch: (p: Partial<CheckoutForm>) => void;
  reset: () => void;
};

const initial: CheckoutForm = {
  buyerName: "",
  buyerPhone: "",
  buyerEmail: "",
  recipientName: "",
  recipientPhone: "",
  recipientIsBuyer: true,
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  cardMessage: "",
  includeCard: true,
  deliveryDate: "",
  deliveryPeriod: "tarde",
  paymentMethod: "pix",
};

export const useCheckoutStore = create<State>((set) => ({
  step: 1,
  form: initial,
  setStep: (step) => set({ step }),
  patch: (p) => set((s) => ({ form: { ...s.form, ...p } })),
  reset: () => set({ step: 1, form: initial }),
}));

import { create } from "zustand";

export const useVerifyCode = create((set) => ({
  verifyCode: null,
  setVerifyCode: (vCode) => {
    console.log("vCode", vCode);
    set({ verifyCode: vCode });
  },
  removeVerifyCode: () => set({ verifyCode: null }),
}));

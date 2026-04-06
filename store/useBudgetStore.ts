import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface BudgetState {
  init: boolean;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set) => ({
      init: true,
    }),
    {
      name: '@flowwise/budget',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

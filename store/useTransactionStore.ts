import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// We'll create simple placeholders for these for now, 
// using generic storage keys until phase 2 fully fleshes them out.
interface TransactionState {
  // state and actions will go here
  init: boolean;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      init: true,
    }),
    {
      name: '@flowwise/transactions',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

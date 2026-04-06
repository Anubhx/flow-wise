import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface GoalState {
  init: boolean;
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set) => ({
      init: true,
    }),
    {
      name: '@flowwise/goals',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

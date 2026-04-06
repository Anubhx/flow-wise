import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface MoodState {
  init: boolean;
}

export const useMoodStore = create<MoodState>()(
  persist(
    (set) => ({
      init: true,
    }),
    {
      name: '@flowwise/mood_score',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

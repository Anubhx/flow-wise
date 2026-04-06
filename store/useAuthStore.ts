import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants';

interface Profile {
  name: string;
  email?: string;
  persona?: 'first_jobber' | 'freelancer' | 'student';
  avatarUri?: string | null;
}

interface AuthState {
  hasCompletedOnboarding: boolean;
  profile: Profile | null;
  setOnboardingComplete: () => void;
  setProfile: (profile: Profile | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      profile: null,
      setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),
      setProfile: (profile) => set({ profile }),
    }),
    {
      name: STORAGE_KEYS.HAS_COMPLETED_ONBOARDING,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

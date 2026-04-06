import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';

export default function Index() {
  const { hasCompletedOnboarding } = useAuthStore();
  
  if (hasCompletedOnboarding) {
    return <Redirect href="/(tabs)" />;
  }
  
  return <Redirect href="/(auth)" />;
}

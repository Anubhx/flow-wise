import { Tabs } from 'expo-router';
import { FlowWiseTabBar } from '@/components/ui/FlowWiseTabBar';

/**
 * Tab layout — uses fully custom FlowWiseTabBar.
 * All visual styling is handled inside FlowWiseTabBar.tsx.
 * Do not set tabBarStyle here — it's ignored when tabBar prop is used.
 */
export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FlowWiseTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index"    options={{ title: 'Home'     }} />
      <Tabs.Screen name="spend"    options={{ title: 'Spend'    }} />
      <Tabs.Screen name="goals"    options={{ title: 'Goals'    }} />
      <Tabs.Screen name="insights" options={{ title: 'Insights' }} />
    </Tabs>
  );
}
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZE, TAB_BAR } from '@/constants';

// Pure SVG-free icon set using Unicode/emoji — works in Expo Go with no native deps
function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, focused && styles.iconActive]}>{icon}</Text>
      {focused && <View style={styles.dot} />}
    </View>
  );
}

const ICONS: Record<string, string> = {
  index:    '⌂',
  spend:    '◈',
  goals:    '◎',
  insights: '✦',
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#161920',
          borderTopColor: COLORS.border,
          borderTopWidth: 0.5,
          height: TAB_BAR.height,
          paddingBottom: TAB_BAR.paddingBottom,
          paddingTop: 10,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabelStyle: {
          fontFamily: FONTS.bodyMedium,
          fontSize: FONT_SIZE.caption,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon icon="⌂" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="spend"
        options={{
          title: 'Spend',
          tabBarIcon: ({ focused }) => <TabIcon icon="◈" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ focused }) => <TabIcon icon="◎" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ focused }) => <TabIcon icon="✦" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 26,
  },
  icon: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  iconActive: {
    color: COLORS.primary,
  },
  dot: {
    position: 'absolute',
    bottom: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
});

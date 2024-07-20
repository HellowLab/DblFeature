import { Tabs,  } from 'expo-router';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function Stack2Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs>
        <Tabs.Screen name="(home)" options={{headerShown:false}}/>
        <Tabs.Screen name="(stack2)" options={{headerShown:false}} />
      </Tabs>
    </GestureHandlerRootView>

  );
}

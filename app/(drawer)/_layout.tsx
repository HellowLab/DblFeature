import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { View } from 'react-native'
import { useRouter } from 'expo-router';

// Import Custom Components
import { AppLogoDarkMode, AppLogoLightMode } from '@/src/components/images/AppLogo';
import SubmitButton from '@/src/components/Buttons/SubmitButton';
import MyButton from '@/src/components/Buttons/Button';

// Import Styles
import { myStyles } from '@/src/utils/constants/styles';

// Import Stores
import useThemeStore from '@/src/utils/store/ThemeStore';

export default function Layout() {
  return (
    // GestureHandlerRootView is required to enable gesture handling in the app
    // Flex 1 ensures that the component takes up the full height of its parent
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => {  
          return <CustomDrawerContent drawerPosition={undefined} {...props} />
        }}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen
          name='(home)'
          options={{title:"Home"}}

        />
        <Drawer.Screen
          name="(matches)"
          options={{title:"My Matches"}}
        />
        <Drawer.Screen
          name="(search)"
          options={{title:"Search"}}
        />
        <Drawer.Screen
          name="(tabs)" 
          options={{title:"Show Tab Navigator"}}

        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

import {DrawerContentScrollView, DrawerItemList,} from '@react-navigation/drawer';

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { theme, toggleTheme } = useThemeStore();
  
  
  return (
    <DrawerContentScrollView {...props}>
      <View style={myStyles.LogoStyle}>
          {theme === 'dark' ? (<AppLogoDarkMode/>) : (<AppLogoLightMode/>)}
      </View>
      <DrawerItemList {...props} />
      <View style={{flex: 1, alignContent: 'center', alignItems: 'center', gap:8}}>
        <MyButton width="full" color='primary' textcolor='white' rounded={false} onPress={() => router.replace('/(login)')}> Logout </MyButton>
        <MyButton width="full" onPress={toggleTheme} rounded={false}> Toggle Theme </MyButton>
      </View>
    </DrawerContentScrollView>
  );
}
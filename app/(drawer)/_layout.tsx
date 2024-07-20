import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Text, Button, View } from 'react-native'
import { Link, useRouter } from 'expo-router';
import { AppLogoDarkMode, AppLogoLightMode } from '@/src/components/images/AppLogo';
import { myStyles } from '@/src/utils/constants/styles';
import { useColorScheme } from 'react-native';

import SubmitButton from '@/src/components/Buttons/SubmitButton';

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
          options={{ headerShown:false}}
        />
        <Drawer.Screen
          name="(tabs)" 
          options={{ headerShown:false }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

import {DrawerContentScrollView, DrawerItemList,} from '@react-navigation/drawer';

function CustomDrawerContent(props) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  
  return (
    // <Text>Hello</Text>
    <DrawerContentScrollView {...props}>
      <View style={myStyles.LogoStyle}>
          {colorScheme === 'dark' ? (<AppLogoDarkMode/>) : (<AppLogoLightMode/>)}
      </View>
      <DrawerItemList {...props} />
      {/* <Button title="Logout" onPress={() => router.replace('/(login)')}/> */}
        <SubmitButton buttonText='Logout' onButtonClick={() => router.replace('/(login)')}/>
    </DrawerContentScrollView>
  );
}
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { View } from 'react-native'
import { useRouter } from 'expo-router';
import {DrawerContentScrollView, DrawerItemList,} from '@react-navigation/drawer';

// Import Custom Components
import { AppLogo } from '@/src/components/images/AppLogo';
import MyButton from '@/src/components/Buttons/Button';

// Import Styles
import { myStyles } from '@/src/utils/constants/styles';

// Import Stores
import useThemeStore from '@/src/utils/store/ThemeStore';
import { useUserStore } from '@/src/utils/store/UserStore'; 
import { deleteToken } from '@/src/utils/store/TokenStore';
import MyText from '@/src/components/TextOutput/TextOutput';

import { updateMovieResult } from '@/src/utils/APIs/api';
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
          name="(mymovies)"
          options={{title:"My Movies"}}
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



function CustomDrawerContent(props: any) {
  const { toggleTheme } = useThemeStore();
  const { clearUser, user } = useUserStore();
  const router = useRouter();

  // handle logout press
  const handleLogoutPress = () => {
    clearUser();
    deleteToken();
    router.replace('/(login)');
  }
  
  return (
    <DrawerContentScrollView {...props}>
      <View style={myStyles.LogoStyle}>
          <AppLogo />
      </View>
      <View style={{alignItems: "center", marginBottom: 8}}>
        <MyText size='large' >Welcome {user?.username}</MyText>
      </View>
      <DrawerItemList {...props} />
      <View style={{flex: 1, alignContent: 'center', alignItems: 'center', gap:8}}>
        <MyButton width="full" color='primary' textcolor='white' rounded={false} onPress={handleLogoutPress}> Logout </MyButton>
        <MyButton width="full" onPress={toggleTheme} rounded={false}> Toggle Theme </MyButton>
        <MyButton width="full" onPress={() =>   updateMovieResult(69, "diehard", false)} rounded={false}> swipe api </MyButton>
      </View>
    </DrawerContentScrollView>
  );
}
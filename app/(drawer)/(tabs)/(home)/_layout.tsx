import { Stack } from 'expo-router';
import { Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DrawerToggleButton } from "@react-navigation/drawer";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
      headerStyle: {backgroundColor: '#0284c7',},
      // headerTintColor: '#fff',
      headerTitleStyle: {fontWeight: 'bold',},
      // headerLeft: () => <MaterialIcons name="menu" size={24} color="black" />,
      headerLeft: () => <DrawerToggleButton  />,
      headerRight: () => <MaterialIcons name="account-circle" size={24} color="black" />,
    }}>
      <Stack.Screen options={{title:"Home"}} name="index" />
      <Stack.Screen options={{title:"Details"}} name="details" />
    </Stack>
  );
}

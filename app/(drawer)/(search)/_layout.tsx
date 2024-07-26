import { Stack } from 'expo-router';
import { Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DrawerToggleButton } from "@react-navigation/drawer";
import { useTheme } from '@react-navigation/native';

export default function HomeLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
      headerStyle: {backgroundColor: colors.primary,},
      headerTitleStyle: {fontWeight: 'bold',},
      // headerLeft: () => <MaterialIcons name="menu" size={24} color="black" />,
      headerLeft: () => <DrawerToggleButton tintColor={colors.inverted}/>,
      headerRight: () => <MaterialIcons name="account-circle" size={24} color={colors.inverted} />,
    }}>
      <Stack.Screen options={{title:"Home"}} name="index" />
      {/* <Stack.Screen options={{title:"Details"}} name="details" /> */}
    </Stack>
  );
}

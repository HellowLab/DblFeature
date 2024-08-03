import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen options={{title:"Login", headerShown: false}} name="index" />
      {/* <Stack.Screen options={{title:"Forgot Password"}} name="forgotpassword" />
      <Stack.Screen options={{title:"Create Account"}} name="register" />
      <Stack.Screen options={{title:"Confirmation"}} name="emailconfirmation" /> */}

    </Stack>
  );
}

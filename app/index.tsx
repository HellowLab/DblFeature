import { Redirect } from "expo-router";

// This can be used as the splash screen to perform any api calls or other async tasks 
// and then redirect to the login screen or any other screen if the user is already logged in.
const Index = () => {
  // since we don't have any async tasks to perform, we can just redirect to the login screen
  // once we have user auth, we can add the logic here to check if the user is logged in and redirect accordingly
	return <Redirect href="/(login)" />;

  // for testing purposes, we can ignore the login screen and redirect to the drawer directly
  // return <Redirect href="/(drawer)" />;
};
export default Index;
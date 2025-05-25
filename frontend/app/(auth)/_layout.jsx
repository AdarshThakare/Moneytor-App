import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { StatusBar } from "react-native";
import { COLORS } from "../../constants/colors";
import PageLoader from "../../components/PageLoader";

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <PageLoader />;
  if (isSignedIn) {
    return <Redirect href={"/"} />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={COLORS.background}
      />
    </>
  );
}

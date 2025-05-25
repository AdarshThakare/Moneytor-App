import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { StatusBar } from "react-native";
import { COLORS } from "../../constants/colors";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

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

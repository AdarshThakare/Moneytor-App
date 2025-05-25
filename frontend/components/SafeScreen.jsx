import { View, Text } from "react-native";
import { COLORS } from "../constants/colors.js";
import { SafeAreaView } from "react-native-safe-area-context";

const SafeScreen = ({ children }) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      {children}
    </SafeAreaView>
  );
};

export default SafeScreen;

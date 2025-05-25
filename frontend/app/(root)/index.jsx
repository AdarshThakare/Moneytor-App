import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SignOutButton } from "../../components/SignOutButton";
import { SafeAreaView } from "react-native-safe-area-context";
import useTransactions from "../../hooks/useTransactions.js";
import { useEffect } from "react";
import PageLoader from "../../components/PageLoader.jsx";
import { styles } from "../../assets/styles/home.styles.js";
import { Ionicons } from "@expo/vector-icons";
import BalanceCard from "../../components/BalanceCard.jsx";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();

  const { transactions, summary, isLoading, loadData, deleteTrans } =
    useTransactions(user.id);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) return <PageLoader />;
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/heroimg.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                router.push("/create");
              }}
            >
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        <View style={{ paddingHorizontal: 10 }}>
          <Text style={styles.welcomeText}>
            Welcome,{"  "}
            <Text style={styles.usernameText}>
              {user?.emailAddresses[0]?.emailAddress
                .split("@")[0]
                .toLocaleUpperCase()}
            </Text>
          </Text>
        </View>
        <BalanceCard summary={summary} />
      </View>
    </View>
  );
}

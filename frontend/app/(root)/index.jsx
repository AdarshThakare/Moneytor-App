import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SignOutButton } from "../../components/SignOutButton";
import { SafeAreaView } from "react-native-safe-area-context";
import useTransactions from "../../hooks/useTransactions.js";
import { useEffect } from "react";
import PageLoader from "../../components/PageLoader.jsx";
import { styles } from "../../assets/styles/home.styles.js";
import { Ionicons } from "@expo/vector-icons";
import BalanceCard from "../../components/BalanceCard.jsx";
import TransactionItem from "../../components/TransactionItem.jsx";
import NoTransactionsFound from "../../components/NoTransactionsFound.jsx";
import { useState } from "react";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const { transactions, summary, isLoading, loadData, deleteTrans } =
    useTransactions(user.id);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure, you want to delete this transaction ?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTrans(id),
        },
      ]
    );
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading && !refreshing) return <PageLoader />;
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

        <View style={{ padding: 10, paddingTop: 0 }}>
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

      {/* FLATLIST */}
      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<NoTransactionsFound />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

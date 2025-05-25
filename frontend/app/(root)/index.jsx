import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SignOutButton } from "../../components/SignOutButton";
import { SafeAreaView } from "react-native-safe-area-context";
import useTransactions from "../../hooks/useTransactions.js";

export default function Page() {
  const { user } = useUser();

  const { transactions, summary, isLoading, loadData, deleteTrans } =
    useTransactions(user.id);

  useEffect(() => {
    loadData();
  }, [loadData]);
  return (
    <SafeAreaView>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </SafeAreaView>
  );
}

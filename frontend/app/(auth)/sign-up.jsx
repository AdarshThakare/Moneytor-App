import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { styles } from "../../assets/styles/auth.styles.js";
import { COLORS } from "../../constants/colors.js";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      if (err.errors[0]?.code === "form_password_incorrect") {
        setError(
          err.errors[0]?.message ||
            JSON.stringify(err, null, 2) ||
            "Your Password is incorrect. Please try again."
        );
      } else {
        setError(
          err.errors[0]?.message ||
            JSON.stringify(err, null, 2) ||
            "An error occured. Please try again."
        );
      }
      console.log(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      if (err.errors[0]?.code === "form_password_incorrect") {
        setError(
          err.errors[0]?.message ||
            "Your Password is incorrect. Please try again."
        );
      } else {
        setError("An error occured. Please try again.");
      }
    }
  };

  if (pendingVerification) {
    return (
      <>
        <View style={styles.verificationContainer}>
          <Image
            source={require("../../assets/images/image.png")}
            alt="sdf"
            style={{ width: 300, height: 300 }}
          />
          <Text style={styles.verificationTitle}>Verify Your Email</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => setError("")}>
                <Ionicons name="close" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          ) : null}
          <TextInput
            style={[styles.verificationInput, error && styles.errorInput]}
            value={code}
            placeholder="Enter the OTP Code"
            onChangeText={(code) => setCode(code)}
          />
          <TouchableOpacity style={styles.button} onPress={onVerifyPress}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <ScrollView>
      <KeyboardAwareScrollView
        style={{
          flex: 1,
          // alignItems: "center",
          // justifyContent: "center",
          // backgroundColor: COLORS.background,
        }}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndrooid={true}
        enableOnAutomaticScroll={true}
        extraScrollHeight={100}
      >
        <View style={styles.container}>
          <View
            style={{
              flex: 0,
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/images/heroimg.png")}
              style={{
                height: 70,
                width: 120,
              }}
            />
          </View>
          <Image
            source={require("../../assets/images/revenue-i2.png")}
            style={styles.illustration}
          />
          <Text style={styles.title}>Create An Account</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => setError("")}>
                <Ionicons name="close" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          ) : null}
          <Text
            style={{
              fontSize: 15,
              padding: 6,
              paddingTop: 0,
              fontWeight: 500,
              color: "#5E2E1E",
              letterSpacing: 0.4,
            }}
          >
            Your Email -
          </Text>

          <TextInput
            style={[styles.input, error & styles.errorInput]}
            autoCapitalize="none"
            value={emailAddress}
            placeholderTextColor="#9a8478"
            placeholder="Enter email"
            onChangeText={(email) => setEmailAddress(email)}
          />

          <Text
            style={{
              fontSize: 15,
              padding: 6,
              fontWeight: 500,
              color: "#5E2E1E",
              letterSpacing: 0.4,
            }}
          >
            Your Password -
          </Text>
          <View style={{ position: "relative" }}>
            <TextInput
              style={[styles.input, error & styles.errorInput]}
              autoCapitalize="none"
              value={password}
              placeholderTextColor="#9a8478"
              placeholder="Enter password"
              secureTextEntry={!showPassword}
              onChangeText={(password) => setPassword(password)}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                width: 20,
                height: 40,
              }}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <Text style={styles.linkText}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
}

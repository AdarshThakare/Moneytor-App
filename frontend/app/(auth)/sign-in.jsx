import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "../../assets/styles/auth.styles";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../constants/colors.js";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
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
            source={require("../../assets/images/revenue-i4.png")}
            style={styles.illustration}
          />
          <Text style={styles.title}>Welcome Back!</Text>

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

          <TouchableOpacity style={styles.button} onPress={onSignInPress}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => {
                router.push("/sign-up");
              }}
            >
              <Text style={styles.linkText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
}

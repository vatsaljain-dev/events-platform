import React, { useContext, useState } from "react";
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "./_layout";
import { useRouter } from "expo-router";
import API_URL from "../utils/config";

export default function Login() {
  const { setCurrentUser } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const router = useRouter();

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      await AsyncStorage.setItem("token", data.token);
      setCurrentUser(data.user);
      router.replace("/");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 20,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                textAlign: "center",
                marginBottom: 30,
              }}
            >
              Welcome Back 👋
            </Text>

            {/* Email Input */}
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={{ marginBottom: 5, backgroundColor: "white" }}
              mode="outlined"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {errors.email && (
              <Text style={{ color: "red", marginBottom: 10 }}>
                {errors.email}
              </Text>
            )}

            {/* Password Input */}
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={{ marginBottom: 15, backgroundColor: "white" }}
              mode="outlined"
            />
            {errors.password && (
              <Text style={{ color: "red", marginBottom: 15 }}>
                {errors.password}
              </Text>
            )}

            {/* Login Button */}
            <Button
              mode="contained"
              onPress={handleLogin}
              style={{ marginBottom: 15, borderRadius: 8 }}
              contentStyle={{ paddingVertical: 10 }}
              disabled={!email || !password}
            >
              Login
            </Button>

            {/* Go to Signup */}
            <Button
              onPress={() => router.push("/signup")}
              mode="outlined"
              style={{ borderRadius: 8 }}
              contentStyle={{ paddingVertical: 10 }}
            >
              Go to Signup
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

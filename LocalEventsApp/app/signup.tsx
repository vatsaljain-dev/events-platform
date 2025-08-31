import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import API_URL from "../utils/config";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const router = useRouter();

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("Signup successful, please login.");
      router.replace("/login");
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
              Create Account ✨
            </Text>

            <TextInput
              label="Name"
              value={name}
              onChangeText={setName}
              style={{ marginBottom: 5, backgroundColor: "white" }}
              mode="outlined"
            />
            {errors.name && (
              <Text style={{ color: "red", marginBottom: 10 }}>
                {errors.name}
              </Text>
            )}

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

            <Button
              mode="contained"
              onPress={handleSignup}
              style={{ marginBottom: 15, borderRadius: 8 }}
              contentStyle={{ paddingVertical: 10 }}
              disabled={!name || !email || !password}
            >
              Sign Up
            </Button>

            <Button
              onPress={() => router.push("/login")}
              mode="outlined"
              style={{ borderRadius: 8 }}
              contentStyle={{ paddingVertical: 10 }}
            >
              Go to Login
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

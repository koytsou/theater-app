import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ImageBackground,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Image,
} from "react-native";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { createUserProfile } from "../services/userService";
import { Ionicons } from "@expo/vector-icons";

import { auth } from "../../firebase";

export default function RegisterScreen({ navigation }) {
  const { height } = useWindowDimensions();
  const isSmallDevice = height < 700;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  
  const handleRegister = async () => {
  if (!name.trim() || !email.trim() || !password.trim()) {
    Alert.alert("Σφάλμα", "Συμπλήρωσε όλα τα πεδία.");
    return;
  }

  try {
    setLoading(true);

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    const user = userCredential.user;

    await createUserProfile(user, name);

    Alert.alert("Επιτυχία", "Ο λογαριασμός δημιουργήθηκε.");
    navigation.navigate("Home");
  } catch (error) {
    Alert.alert("Register Error", error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <ImageBackground
      source={require("../../assets/theater-bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboard}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 0}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={true}
            alwaysBounceVertical={true}
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={[
              styles.scroll,
              {
                paddingTop: isSmallDevice ? 18 : 46,
                paddingBottom: isSmallDevice ? 180 : 200,
              },
            ]}
          >
            <View style={styles.hero}>
              <Image
                source={require("../../assets/masks.png")}
                style={[
                  styles.maskImage,
                  {
                    width: isSmallDevice ? 170 : 220,
                    height: isSmallDevice ? 170 : 220,
                  },
                ]}
                resizeMode="contain"
              />

              <Text style={styles.logo}>Εγγραφή</Text>
              <Text style={styles.logoSub}>ΘΕΑΤΡΟ ΕΙΣΙΤΗΡΙΑ</Text>

              <Text style={styles.subtitle}>
                Δημιούργησε λογαριασμό και κράτησε τις αγαπημένες σου θέσεις.
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputBox}>
                <Ionicons name="person-outline" size={25} color="#A6A6A6" />
                <TextInput
                  placeholder="Ονοματεπώνυμο"
                  placeholderTextColor="#9A9A9A"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputBox}>
                <Ionicons name="mail-outline" size={25} color="#A6A6A6" />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#9A9A9A"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputBox}>
                <Ionicons name="lock-closed-outline" size={25} color="#A6A6A6" />
                <TextInput
                  placeholder="Κωδικός πρόσβασης"
                  placeholderTextColor="#9A9A9A"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                />
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleRegister}
                disabled={loading}
                style={[styles.registerButton, loading && { opacity: 0.7 }]}
              >
                <Text style={styles.registerButtonText}>
                  {loading ? "Δημιουργία..." : "Δημιουργία λογαριασμού"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate("Login")}
                style={styles.loginButton}
              >
                <Text style={styles.loginText}>
                  Έχεις ήδη λογαριασμό?{" "}
                  <Text style={styles.loginStrong}>Σύνδεση</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#000",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.64)",
  },

  safeArea: {
    flex: 1,
  },

  keyboard: {
    flex: 1,
  },

  scroll: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 28,
  },

  hero: {
    alignItems: "center",
  },

  maskImage: {
    marginBottom: -80,
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "900",
    marginTop: 2,
    letterSpacing: -1,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },

  logoSub: {
    color: "#D8B45A",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 5,
    marginTop: 4,
  },

  subtitle: {
    color: "#B8B8BE",
    fontSize: 17,
    textAlign: "center",
    lineHeight: 25,
    marginTop: 32,
    maxWidth: 330,
    fontWeight: "500",
  },

  form: {
    width: "100%",
    marginTop: 30,
  },

  inputBox: {
    height: 66,
    borderRadius: 18,
    backgroundColor: "rgba(22,22,22,0.86)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 17,
    marginLeft: 15,
  },

  registerButton: {
    height: 66,
    borderRadius: 18,
    backgroundColor: "#A30D18",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#E50914",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },

  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },

  loginButton: {
    marginTop: 28,
    alignItems: "center",
  },

  loginText: {
    color: "#AFAFB5",
    fontSize: 16,
  },

  loginStrong: {
    color: "#D8B45A",
    fontWeight: "900",
  },
});
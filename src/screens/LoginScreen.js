import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  TextInput,
  useWindowDimensions,
  Image,
} from "react-native";

import { signInWithEmailAndPassword } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../firebase";

export default function LoginScreen({ navigation }) {
  const { height } = useWindowDimensions();
  const isSmallDevice = height < 700;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Σφάλμα", "Συμπλήρωσε email και password.");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigation.navigate("Home");
    } catch (error) {
      let message = "Κάτι πήγε λάθος.";

      if (error.code === "auth/invalid-email") {
        message = "Μη έγκυρο email.";
      } else if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        message = "Λάθος email ή password.";
      } else if (error.code === "auth/user-not-found") {
        message = "Ο χρήστης δεν βρέθηκε.";
      }

      Alert.alert("Login Error", message);
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
                paddingTop: isSmallDevice ? 24 : 62,
                paddingBottom: isSmallDevice ? 160 : 180,
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

              <Text style={styles.logo}>Θέατρο</Text>
              <Text style={styles.logoSub}>ΕΙΣΙΤΗΡΙΑ</Text>

              <Text style={styles.subtitle}>
                Οι καλύτερες παραστάσεις,{"\n"}ένα εισιτήριο μακριά.
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputBox}>
                <Ionicons name="person-outline" size={26} color="#A6A6A6" />
                <TextInput
                  placeholder="Email ή όνομα χρήστη"
                  placeholderTextColor="#9A9A9A"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputBox}>
                <Ionicons name="lock-closed-outline" size={26} color="#A6A6A6" />
                <TextInput
                  placeholder="Κωδικός πρόσβασης"
                  placeholderTextColor="#9A9A9A"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={secure}
                  style={styles.input}
                />

                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setSecure(!secure)}
                >
                  <Ionicons
                    name={secure ? "eye-outline" : "eye-off-outline"}
                    size={27}
                    color="#A6A6A6"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleLogin}
                disabled={loading}
                style={[styles.loginButton, loading && styles.disabledButton]}
              >
                <Text style={styles.loginText}>
                  {loading ? "Σύνδεση..." : "Σύνδεση"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate("Register")}
                style={styles.registerButton}
              >
                <Text style={styles.registerText}>
                  Δεν έχεις λογαριασμό;{" "}
                  <Text style={styles.registerStrong}>Εγγραφή</Text>
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
    backgroundColor: "rgba(0,0,0,0.62)",
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
    width: 185,
    height: 185,
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
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 9,
    marginTop: 4,
  },

  subtitle: {
    color: "#B8B8BE",
    fontSize: 20,
    textAlign: "center",
    lineHeight: 30,
    marginTop: 38,
    fontWeight: "500",
  },

  form: {
    width: "100%",
    marginTop: 34,
  },

  inputBox: {
    height: 68,
    borderRadius: 18,
    backgroundColor: "rgba(22,22,22,0.86)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 18,
    marginLeft: 16,
  },

  loginButton: {
    height: 68,
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

  disabledButton: {
    opacity: 0.75,
  },

  loginText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  registerButton: {
    marginTop: 34,
    alignItems: "center",
  },

  registerText: {
    color: "#AFAFB5",
    fontSize: 17,
  },

  registerStrong: {
    color: "#D8B45A",
    fontWeight: "900",
  },
});
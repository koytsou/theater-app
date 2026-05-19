import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { logoutUser } from "../services/authService";

export default function AdminHomeScreen({ navigation }) {
  const handleLogout = async () => {
    await logoutUser();
    navigation.replace("Login");
  };

  return (
    <ImageBackground
      source={require("../../assets/theater-bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <Image
            source={require("../../assets/masks.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.kicker}>ADMIN PANEL</Text>
          <Text style={styles.title}>Διαχείριση Θεάτρου</Text>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("AdminUsers")}
          >
            <Ionicons name="people-outline" size={30} color="#D8B45A" />
            <View>
              <Text style={styles.cardTitle}>Users Management</Text>
              <Text style={styles.cardSub}>Roles, block και διαχείριση χρηστών</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("AdminTheatres")}
          >
            <Ionicons name="grid-outline" size={30} color="#D8B45A" />
            <View>
              <Text style={styles.cardTitle}>Theatres & Seats</Text>
              <Text style={styles.cardSub}>Αλλαγή rows και columns</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
            <Text style={styles.logoutText}>Αποσύνδεση</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: "#000" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.70)",
  },
  safeArea: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: "center",
  },
  logo: {
    width: 170,
    height: 170,
    alignSelf: "center",
    marginBottom: -45,
  },
  kicker: {
    color: "#D8B45A",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 4,
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 34,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "rgba(18,18,18,0.88)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },
  cardSub: {
    color: "#B8B8BE",
    fontSize: 14,
    marginTop: 5,
    maxWidth: 250,
  },
  logoutButton: {
    height: 64,
    borderRadius: 20,
    backgroundColor: "#A30D18",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
    marginLeft: 10,
  },
});
import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  SafeAreaView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../firebase";
import {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
} from "../services/userService";

import FloatingBackButton from "../components/FloatingBackButton";

export default function AdminUsersScreen({ navigation }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const list = await getAllUsers();
      setUsers(list);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleToggleRole = async (user) => {
    if (user.id === auth.currentUser.uid) {
      Alert.alert("Error", "Δεν μπορείς να αλλάξεις το δικό σου admin role.");
      return;
    }

    const newRole = user.role === "admin" ? "user" : "admin";

    await updateUserRole(user.id, newRole);
    fetchUsers();
  };

  const handleToggleStatus = async (user) => {
    if (user.id === auth.currentUser.uid) {
      Alert.alert("Error", "Δεν μπορείς να κάνεις block τον εαυτό σου.");
      return;
    }

    const newStatus = user.status === "blocked" ? "active" : "blocked";

    await updateUserStatus(user.id, newStatus);
    fetchUsers();
  };

  const renderUser = ({ item }) => {
    const isAdmin = item.role === "admin";
    const isBlocked = item.status === "blocked";

    return (
      <View style={styles.card}>
        <View style={styles.userHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={24} color="#D8B45A" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name || "No name"}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>
        </View>

        <View style={styles.badges}>
          <View style={[styles.badge, isAdmin && styles.adminBadge]}>
            <Text style={styles.badgeText}>{item.role || "user"}</Text>
          </View>

          <View style={[styles.badge, isBlocked && styles.blockedBadge]}>
            <Text style={styles.badgeText}>{item.status || "active"}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.goldButton}
            onPress={() => handleToggleRole(item)}
          >
            <Text style={styles.actionText}>
              {isAdmin ? "Remove Admin" : "Make Admin"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.redButton}
            onPress={() => handleToggleStatus(item)}
          >
            <Text style={styles.actionText}>
              {isBlocked ? "Unblock" : "Kick / Block"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/theater-bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <FloatingBackButton navigation={navigation} />

        <View style={styles.container}>
          <Text style={styles.kicker}>ADMIN</Text>
          <Text style={styles.title}>Users Management</Text>

          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={renderUser}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        </View>
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
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 28,
  },
  kicker: {
    color: "#D8B45A",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 22,
  },
  list: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "rgba(18,18,18,0.88)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    padding: 18,
    borderRadius: 24,
    marginBottom: 16,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: "rgba(216,180,90,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },
  email: {
    color: "#B8B8BE",
    fontSize: 14,
    marginTop: 3,
  },
  badges: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  badge: {
    backgroundColor: "#2A2A2E",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  adminBadge: {
    backgroundColor: "#D8B45A",
  },
  blockedBadge: {
    backgroundColor: "#A30D18",
  },
  badgeText: {
    color: "#FFFFFF",
    fontWeight: "900",
    textTransform: "uppercase",
    fontSize: 12,
  },
  actions: {
    gap: 10,
  },
  goldButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#D8B45A",
    alignItems: "center",
    justifyContent: "center",
  },
  redButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#A30D18",
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
  },
});
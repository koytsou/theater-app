import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Image,
} from "react-native";

import {
  getUserActiveReservations,
  cancelUserReservation,
} from "../services/reservationService";

import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../firebase";
import FloatingBackButton from "../components/FloatingBackButton";

export default function ProfileScreen({ navigation }) {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchReservations();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchReservations = async () => {
  try {
    const list = await getUserActiveReservations(auth.currentUser.uid);
    setReservations(list);
  } catch (error) {
    Alert.alert("Error", error.message);
  }
};

  const cancelReservation = async (reservationId) => {
  try {
    await cancelUserReservation(reservationId);

    Alert.alert("Επιτυχία", "Η κράτηση ακυρώθηκε.");
    fetchReservations();
  } catch (error) {
    Alert.alert("Error", error.message);
  }
};

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconBox}>
          <Ionicons name="ticket-outline" size={28} color="#D8B45A" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.showTitle}</Text>
          <Text style={styles.status}>Ενεργή κράτηση</Text>
        </View>
      </View>

      <InfoRow icon="business-outline" label="Θέατρο" value={item.theatre} />
      <InfoRow icon="albums-outline" label="Θέσεις" value={item.seats?.join(", ")} />
      <InfoRow icon="cash-outline" label="Σύνολο" value={`€${item.totalPrice}`} />

      <View style={styles.buttons}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.primaryActionButton}
          onPress={() =>
            navigation.navigate("Reservation", {
              show: {
                id: item.showId,
                title: item.showTitle,
                theatre: item.theatre,
                price: item.price,
              },
            })
          }
        >
          <View style={styles.actionIconBox}>
            <Ionicons name="create-outline" size={20} color="#FFFFFF" />
          </View>

          <Text style={styles.primaryActionText}>Αλλαγή θέσεων</Text>

          <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.secondaryActionButton}
          onPress={() => cancelReservation(item.id)}
        >
          <View style={styles.actionIconBoxMuted}>
            <Ionicons name="close-circle-outline" size={20} color="#FFFFFF" />
          </View>

          <Text style={styles.secondaryActionText}>Ακύρωση κράτησης</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../assets/theater-bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <FloatingBackButton navigation={navigation} />
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.header}>
              <Image
                source={require("../../assets/masks.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />

              <Text style={styles.logo}>Θέατρο</Text>
              <Text style={styles.logoSub}>ΚΡΑΤΗΣΕΙΣ</Text>

              <Text style={styles.headerTitle}>Οι Κρατήσεις μου</Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="ticket-outline" size={58} color="#D8B45A" />
              <Text style={styles.emptyTitle}>Δεν υπάρχουν κρατήσεις</Text>
              <Text style={styles.emptyText}>
                Οι ενεργές κρατήσεις σου θα εμφανίζονται εδώ.
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <Ionicons name={icon} size={19} color="#D8B45A" />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>

      <Text style={styles.infoValue}>{value || "-"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#000",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.68)",
  },

  safeArea: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 44,
  },

  header: {
    alignItems: "center",
    marginBottom: 26,
  },

  logoImage: {
    width: 150,
    height: 150,
    marginBottom: -50,
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: -1,
  },

  logoSub: {
    color: "#D8B45A",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 8,
    marginTop: 4,
  },

  headerTitle: {
    alignSelf: "flex-start",
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 42,
  },

  card: {
    backgroundColor: "rgba(18,18,18,0.88)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    padding: 20,
    marginBottom: 18,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(216,180,90,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  status: {
    color: "#D8B45A",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.07)",
    paddingVertical: 12,
  },

  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoLabel: {
    color: "#D8B45A",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 9,
  },

  infoValue: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "right",
    marginLeft: 16,
  },

  buttons: {
    marginTop: 20,
    gap: 12,
  },

  primaryActionButton: {
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: "#A30D18",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    shadowColor: "#E50914",
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 8,
  },

  secondaryActionButton: {
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  actionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  actionIconBoxMuted: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  primaryActionText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  secondaryActionText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  emptyBox: {
    paddingVertical: 70,
    alignItems: "center",
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
    marginTop: 16,
  },

  emptyText: {
    color: "#B8B8BE",
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
});
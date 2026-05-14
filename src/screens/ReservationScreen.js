import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import {
  getActiveReservationsForShow,
  createReservation,
  updateReservation,
} from "../services/reservationService";

import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../firebase";
import FloatingBackButton from "../components/FloatingBackButton";

export default function ReservationScreen({ route, navigation }) {
  const { show } = route.params;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [myReservationId, setMyReservationId] = useState(null);
  const [saving, setSaving] = useState(false);

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const columns = Array.from({ length: 9 }, (_, i) => i + 1);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
  try {
    const reservations = await getActiveReservationsForShow(show.id);

    let allReserved = [];
    let userSeats = [];

    reservations.forEach((reservation) => {
      if (reservation.userId === auth.currentUser.uid) {
        setMyReservationId(reservation.id);
        userSeats = reservation.seats || [];
      } else {
        allReserved = [...allReserved, ...(reservation.seats || [])];
      }
    });

    setReservedSeats(allReserved);
    setSelectedSeats(userSeats);
  } catch (error) {
    Alert.alert("Error", error.message);
  }
};

  const toggleSeat = (seat) => {
    if (reservedSeats.includes(seat)) return;

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleReservation = async () => {
  if (selectedSeats.length === 0) {
    Alert.alert("Σφάλμα", "Επίλεξε τουλάχιστον μία θέση.");
    return;
  }

  try {
    setSaving(true);

    if (myReservationId) {
      await updateReservation({
        reservationId: myReservationId,
        show,
        selectedSeats,
      });

      Alert.alert("Επιτυχία", "Η κράτηση ενημερώθηκε.");
    } else {
      await createReservation({
        userId: auth.currentUser.uid,
        show,
        selectedSeats,
      });

      Alert.alert("Επιτυχία", "Η κράτηση ολοκληρώθηκε.");
    }

    navigation.navigate("Home");
  } catch (error) {
    Alert.alert("Reservation Error", error.message);
  } finally {
    setSaving(false);
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
        <FloatingBackButton navigation={navigation} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <View style={styles.header}>
            <Text style={styles.kicker}>ΚΡΑΤΗΣΗ ΘΕΣΕΩΝ</Text>
            <Text style={styles.title}>{show.title}</Text>

            <View style={styles.metaBox}>
              <InfoItem icon="business-outline" text={show.theatre} />
              <InfoItem icon="ticket-outline" text={`€${show.price} / θέση`} />
            </View>
          </View>

          <View style={styles.stageWrapper}>
            <View style={styles.stageGlow} />
            <View style={styles.stage}>
              <Text style={styles.stageText}>ΣΚΗΝΗ</Text>
            </View>
          </View>

          <View style={styles.seatCard}>
            <View style={styles.screenHint}>
              <Text style={styles.screenHintText}>Επίλεξε θέση</Text>
            </View>

            <View style={styles.seatMap}>
              {rows.map((row) => (
                <View key={row} style={styles.row}>
                  <Text style={styles.rowLabel}>{row}</Text>

                  <View style={styles.seatRow}>
                    {columns.map((col) => {
                      const seat = `${row}${col}`;
                      const isReserved = reservedSeats.includes(seat);
                      const isSelected = selectedSeats.includes(seat);

                      return (
                        <TouchableOpacity
                          key={seat}
                          activeOpacity={0.7}
                          style={[
                            styles.seat,
                            isReserved && styles.reservedSeat,
                            isSelected && styles.selectedSeat,
                          ]}
                          onPress={() => toggleSeat(seat)}
                          disabled={isReserved}
                        >
                          <Text
                            style={[
                              styles.seatText,
                              isSelected && styles.selectedSeatText,
                              isReserved && styles.reservedSeatText,
                            ]}
                          >
                            {col}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.legend}>
              <LegendItem color="#2A2A2E" label="Διαθέσιμη" />
              <LegendItem color="#166534" label="Επιλεγμένη" />
              <LegendItem color="#A30D18" label="Κρατημένη" />
            </View>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Σύνοψη κράτησης</Text>

            <Text style={styles.summaryLabel}>Επιλεγμένες θέσεις</Text>
            <Text style={styles.selectedText}>
              {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Καμία θέση"}
            </Text>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Σύνολο</Text>
              <Text style={styles.totalValue}>
                €{selectedSeats.length * show.price}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleReservation}
            disabled={saving}
            style={[styles.confirmButton, saving && { opacity: 0.7 }]}
          >
            <Ionicons name="ticket-outline" size={24} color="#FFFFFF" />

            <Text style={styles.confirmText}>
              {saving
                ? "Αποθήκευση..."
                : myReservationId
                ? "Ενημέρωση Κράτησης"
                : "Ολοκλήρωση Κράτησης"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

function InfoItem({ icon, text }) {
  return (
    <View style={styles.infoItem}>
      <Ionicons name={icon} size={18} color="#D8B45A" />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

function LegendItem({ color, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
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

  scroll: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 42,
  },

  header: {
    marginBottom: 26,
  },

  kicker: {
    color: "#D8B45A",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
  },

  metaBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(22,22,22,0.82)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  infoText: {
    color: "#EDEDED",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
  },

  stageWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },

  stageGlow: {
    width: "72%",
    height: 18,
    borderRadius: 100,
    backgroundColor: "rgba(229,9,20,0.22)",
    marginBottom: -8,
  },

  stage: {
    width: "82%",
    height: 42,
    borderRadius: 22,
    backgroundColor: "#A30D18",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E50914",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },

  stageText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 4,
  },

  seatCard: {
    backgroundColor: "rgba(18,18,18,0.88)",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    paddingVertical: 22,
    paddingHorizontal: 10,
  },

  screenHint: {
    alignItems: "center",
    marginBottom: 18,
  },

  screenHintText: {
    color: "#B8B8BE",
    fontSize: 14,
    fontWeight: "700",
  },

  seatMap: {
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  rowLabel: {
    width: 20,
    color: "#D8B45A",
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
    marginRight: 6,
  },

  seatRow: {
    flexDirection: "row",
  },

  seat: {
    width: 30,
    height: 30,
    marginHorizontal: 3,
    borderRadius: 9,
    backgroundColor: "#2A2A2E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  selectedSeat: {
    backgroundColor: "#166534",
    borderColor: "#22C55E",
    shadowColor: "#22C55E",
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 5,
  },

  reservedSeat: {
    backgroundColor: "#A30D18",
    borderColor: "#E50914",
    opacity: 0.85,
  },

  seatText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#D7D7D7",
  },

  selectedSeatText: {
    color: "#FFFFFF",
  },

  reservedSeatText: {
    color: "#FFFFFF",
  },

  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },

  legendItem: {
    alignItems: "center",
  },

  legendDot: {
    width: 18,
    height: 18,
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  legendText: {
    color: "#B8B8BE",
    fontSize: 12,
    fontWeight: "600",
  },

  summaryCard: {
    backgroundColor: "rgba(18,18,18,0.88)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    padding: 20,
    marginTop: 20,
  },

  summaryTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 18,
  },

  summaryLabel: {
    color: "#D8B45A",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
  },

  selectedText: {
    color: "#EDEDED",
    fontSize: 16,
    lineHeight: 24,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },

  totalLabel: {
    color: "#B8B8BE",
    fontSize: 17,
    fontWeight: "700",
  },

  totalValue: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
  },

  confirmButton: {
    height: 70,
    borderRadius: 20,
    backgroundColor: "#A30D18",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
    shadowColor: "#E50914",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },

  confirmText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginLeft: 10,
  },
});
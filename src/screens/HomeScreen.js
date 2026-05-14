import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";

import { getShows } from "../services/showService";
import { signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

import { db, auth } from "../../firebase";


export default function HomeScreen({ navigation }) {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
  try {
    setLoading(true);

    const showsList = await getShows();

    setShows(showsList);
  } catch (error) {
    console.log(error);
    Alert.alert("Σφάλμα", "Δεν ήταν δυνατή η φόρτωση των παραστάσεων.");
  } finally {
    setLoading(false);
  }
};

  const handleLogout = async () => {
  try {
    await signOut(auth);

    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  } catch (error) {
    Alert.alert("Σφάλμα", "Δεν ήταν δυνατή η αποσύνδεση.");
  }
};

  const renderShow = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() =>
        navigation.navigate("ShowDetails", {
          show: item,
        })
      }
    >
      

      <View style={styles.cardContent}>
        <Text style={styles.showTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <InfoRow icon="business-outline" label="Θέατρο:" value={item.theatre} />
        <InfoRow icon="location-outline" label="Τοποθεσία:" value={item.location} />
        <InfoRow icon="time-outline" label="Διάρκεια:" value={`${item.duration} λεπτά`} />
        <InfoRow icon="ticket-outline" label="Τιμή:" value={`€${item.price}`} />
      </View>

      <View style={styles.arrowCircle}>
        <Ionicons name="chevron-forward" size={30} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../../assets/theater-bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={shows}
          keyExtractor={(item) => item.id}
          renderItem={renderShow}
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
              <Text style={styles.logoSub}>ΕΙΣΙΤΗΡΙΑ</Text>

              <Text style={styles.headerTitle}>Διαθέσιμες Παραστάσεις</Text>
            </View>
          }
          ListEmptyComponent={
            loading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color="#D8B45A" />
                <Text style={styles.loadingText}>Φόρτωση παραστάσεων...</Text>
              </View>
            ) : (
              <View style={styles.emptyBox}>
                <Ionicons name="ticket-outline" size={52} color="#D8B45A" />
                <Text style={styles.emptyTitle}>Δεν υπάρχουν παραστάσεις</Text>
                <Text style={styles.emptyText}>
                  Οι διαθέσιμες παραστάσεις θα εμφανιστούν εδώ.
                </Text>
              </View>
            )
          }
          ListFooterComponent={
            <View style={styles.footer}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.reservationsButton}
                onPress={() => navigation.navigate("Profile")}
              >
                <View style={styles.footerIconBox}>
                  <Ionicons name="ticket-outline" size={30} color="#D8B45A" />
                </View>

                <Text style={styles.footerButtonText}>Οι Κρατήσεις μου</Text>

                <Ionicons name="chevron-forward" size={32} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <View style={styles.footerIconBox}>
                  <Ionicons name="log-out-outline" size={32} color="#D8B45A" />
                </View>

                <Text style={styles.logoutText}>Αποσύνδεση</Text>
              </TouchableOpacity>
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
      <Ionicons name={icon} size={19} color="#D8B45A" />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>
        {value || "-"}
      </Text>
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
    textShadowColor: "rgba(0,0,0,0.7)",
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

  headerTitle: {
    alignSelf: "flex-start",
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 44,
    marginBottom: 4,
  },

  card: {
    minHeight: 155,
    borderRadius: 22,
    backgroundColor: "rgba(22,22,22,0.84)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 10,
  },


  cardContent: {
  flex: 1,
  paddingRight: 8,
},

  showTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
  },

  infoLabel: {
    color: "#D8B45A",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
    marginRight: 5,
  },

  infoValue: {
    flex: 1,
    color: "#E8E8E8",
    fontSize: 15,
    fontWeight: "500",
  },

  arrowCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#8E0D16",
    alignItems: "center",
    justifyContent: "center",
  },

  footer: {
    marginTop: 16,
  },

  reservationsButton: {
    height: 78,
    borderRadius: 20,
    backgroundColor: "#8E0D16",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    marginBottom: 20,
    shadowColor: "#E50914",
    shadowOpacity: 0.32,
    shadowRadius: 18,
    elevation: 10,
  },

  footerIconBox: {
    width: 46,
    alignItems: "flex-start",
  },

  footerButtonText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },

  logoutButton: {
    height: 78,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D8B45A",
    backgroundColor: "rgba(0,0,0,0.36)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },

  loadingBox: {
    paddingVertical: 60,
    alignItems: "center",
  },

  loadingText: {
    color: "#B8B8BE",
    marginTop: 14,
    fontSize: 16,
  },

  emptyBox: {
    paddingVertical: 60,
    alignItems: "center",
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 14,
  },

  emptyText: {
    color: "#B8B8BE",
    textAlign: "center",
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
  },
});
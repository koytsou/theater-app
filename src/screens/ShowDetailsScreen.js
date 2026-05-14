import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function ShowDetailsScreen({ route, navigation }) {
  const { show } = route.params;

  return (
    <ImageBackground
      source={require("../../assets/theater-bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color="#FFFFFF"
          />
        </TouchableOpacity>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <View style={styles.hero}>
            <Image
              source={require("../../assets/masks.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />

            <Text style={styles.logo}>Θέατρο</Text>

            <Text style={styles.logoSub}>ΠΑΡΑΣΤΑΣΗ</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.titleRow}>
              <View style={styles.redLine} />

              <Text style={styles.title}>{show.title}</Text>
            </View>

            <InfoRow
              icon="business-outline"
              label="Θέατρο"
              value={show.theatre}
            />

            <InfoRow
              icon="location-outline"
              label="Τοποθεσία"
              value={show.location}
            />

            <InfoRow
              icon="time-outline"
              label="Διάρκεια"
              value={`${show.duration} λεπτά`}
            />

            <InfoRow
              icon="ticket-outline"
              label="Τιμή"
              value={`€${show.price}`}
            />

            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionTitle}>
                Περιγραφή
              </Text>

              <Text style={styles.description}>
                {show.description || "Δεν υπάρχει διαθέσιμη περιγραφή."}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.bookButton}
              onPress={() =>
                navigation.navigate("Reservation", {
                  show: show,
                })
              }
            >
              <Ionicons
                name="ticket-outline"
                size={24}
                color="#FFFFFF"
              />

              <Text style={styles.bookButtonText}>
                Κράτηση Θέσεων
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <Ionicons
          name={icon}
          size={20}
          color="#D8B45A"
        />

        <Text style={styles.infoLabel}>
          {label}
        </Text>
      </View>

      <Text style={styles.infoValue}>
        {value}
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

  scroll: {
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 40,
  },

  hero: {
    alignItems: "center",
    marginBottom: 20,
  },

  logoImage: {
    width: 140,
    height: 140,
    marginBottom: -48,
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: -1,

    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: {
      width: 0,
      height: 3,
    },
    textShadowRadius: 8,
  },

  logoSub: {
    color: "#D8B45A",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 6,
    marginTop: 4,
  },

  card: {
    backgroundColor: "rgba(18,18,18,0.88)",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    padding: 24,

    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 12,
  },

  titleRow: {
    marginBottom: 28,
  },

  redLine: {
    width: 62,
    height: 5,
    borderRadius: 20,
    backgroundColor: "#A30D18",
    marginBottom: 18,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },

  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoLabel: {
    color: "#D8B45A",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },

  infoValue: {
    color: "#F1F1F1",
    fontSize: 16,
    fontWeight: "500",
    flexShrink: 1,
    textAlign: "right",
    marginLeft: 16,
  },

  descriptionBox: {
    marginTop: 14,
    marginBottom: 34,
  },

  descriptionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 14,
  },

  description: {
    color: "#B8B8BE",
    fontSize: 16,
    lineHeight: 28,
    fontWeight: "500",
  },

  bookButton: {
    height: 70,
    borderRadius: 20,
    backgroundColor: "#A30D18",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#E50914",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },

  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
    marginLeft: 12,
  },
  backButton: {
    position: "absolute",
    top: 18,
    left: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(15,15,15,0.82)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
});

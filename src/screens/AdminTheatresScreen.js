import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  SafeAreaView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { getShows, updateShowLayout } from "../services/showService";
import FloatingBackButton from "../components/FloatingBackButton";

export default function AdminTheatresScreen({ navigation }) {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      const list = await getShows();
      setShows(list);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const updateLocalField = (showId, field, value) => {
    setShows((prev) =>
      prev.map((show) =>
        show.id === showId ? { ...show, [field]: value } : show
      )
    );
  };

  const handleSave = async (show) => {
    const rows = Number(show.rows);
    const columns = Number(show.columns);

    if (!rows || !columns) {
      Alert.alert("Error", "Συμπλήρωσε σωστά rows και columns.");
      return;
    }

    try {
      await updateShowLayout(show.id, rows, columns);
      Alert.alert("Success", "Το μέγεθος θεάτρου ενημερώθηκε.");
      fetchShows();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const renderShow = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="film-outline" size={26} color="#D8B45A" />
        <View>
          <Text style={styles.name}>{item.title}</Text>
          <Text style={styles.text}>{item.theatre}</Text>
        </View>
      </View>

      <View style={styles.inputsRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Rows</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(item.rows)}
            onChangeText={(value) => updateLocalField(item.id, "rows", value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Columns</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(item.columns)}
            onChangeText={(value) =>
              updateLocalField(item.id, "columns", value)
            }
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => handleSave(item)}>
        <Ionicons name="save-outline" size={22} color="#fff" />
        <Text style={styles.buttonText}>Save Layout</Text>
      </TouchableOpacity>
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

        <View style={styles.container}>
          <Text style={styles.kicker}>ADMIN</Text>
          <Text style={styles.title}>Theatre Layouts</Text>

          <FlatList
            data={shows}
            keyExtractor={(item) => item.id}
            renderItem={renderShow}
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 18,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
  },
  text: {
    color: "#B8B8BE",
    fontSize: 14,
    marginTop: 3,
  },
  inputsRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    color: "#D8B45A",
    fontWeight: "900",
    marginBottom: 7,
  },
  input: {
    height: 54,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    paddingHorizontal: 14,
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
  },
  button: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#A30D18",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 17,
    marginLeft: 8,
  },
});
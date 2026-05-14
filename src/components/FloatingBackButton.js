import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function FloatingBackButton({ navigation }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.backButton}
      onPress={() => navigation.goBack()}
    >
      <Ionicons
        name="chevron-back"
        size={30}
        color="#FFFFFF"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",

    top: 52,
    left: 20,

    width: 54,
    height: 54,
    borderRadius: 27,

    backgroundColor: "rgba(15,15,15,0.88)",

    justifyContent: "center",
    alignItems: "center",

    zIndex: 999,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",

    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
});
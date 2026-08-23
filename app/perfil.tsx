import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Perfil() {
  const usuarioEmail = auth.currentUser?.email || "Usuário Anônimo";

  async function handleSair() {
    try {
      await signOut(auth);
      router.replace("/"); // Ou a sua rota de login/index inicial
    } catch (erro: any) {
      Alert.alert("Erro ao sair", erro.message);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.botaoVoltar} 
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.tituloHeader}>Perfil e Conta</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.cardUsuario}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={32} color="#7C3AED" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.rotuloConta}>Conta conectada</Text>
          <Text style={styles.emailTexto} numberOfLines={1}>{usuarioEmail}</Text>
        </View>
      </View>

      <View style={styles.secaoOpcoes}>
        <View style={styles.opcaoItem}>
          <MaterialCommunityIcons name="bell-outline" size={20} color="#64748B" />
          <Text style={styles.opcaoTexto}>Notificações diárias (17:00)</Text>
        </View>
        <View style={styles.opcaoItem}>
          <MaterialCommunityIcons name="shield-check-outline" size={20} color="#64748B" />
          <Text style={styles.opcaoTexto}>Dados protegidos e confidenciais</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.botaoSair} 
        onPress={handleSair}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        <Text style={styles.botaoSairTexto}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 24,
    paddingTop: 60,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  botaoVoltar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tituloHeader: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#1E293B",
  },
  cardUsuario: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  rotuloConta: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#94A3B8",
  },
  emailTexto: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#1E293B",
  },
  secaoOpcoes: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 24,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  opcaoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  opcaoTexto: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "#334155",
  },
  botaoSair: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  botaoSairTexto: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    color: "#EF4444",
  },
});
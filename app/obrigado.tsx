import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function Obrigado() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🙏</Text>
      <Text style={styles.titulo}>Obrigado por compartilhar!</Text>
      <Text style={styles.texto}>
        Sua resposta ajuda a construir um ambiente de trabalho mais saudável.
      </Text>

      <TouchableOpacity style={styles.botaoSecundario} onPress={() => router.push("/apoio")}>
        <Text style={styles.botaoSecundarioTexto}>Central de Apoio</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botao} onPress={() => router.push("/home")}>
        <Text style={styles.botaoTexto}>Voltar para o início</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F3FF" },
  emoji: { fontSize: 60, marginBottom: 16 },
  titulo: { fontSize: 22, fontFamily: "Poppins_700Bold", color: "#333", marginBottom: 8, textAlign: "center" },
  texto: { fontSize: 14, fontFamily: "Poppins_400Regular", color: "#666", textAlign: "center", marginBottom: 40, paddingHorizontal: 12 },
  botao: {
    backgroundColor: "#6D28D9", borderRadius: 16, paddingVertical: 18, paddingHorizontal: 32,
    alignItems: "center", width: "100%",
    shadowColor: "#6D28D9", shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4,
  },
  botaoTexto: { color: "#fff", fontSize: 15, fontFamily: "Poppins_600SemiBold" },
  botaoSecundario: {
    borderRadius: 16, paddingVertical: 16, paddingHorizontal: 32, alignItems: "center",
    width: "100%", marginBottom: 12, borderWidth: 1.5, borderColor: "#6D28D9",
  },
  botaoSecundarioTexto: { color: "#6D28D9", fontSize: 15, fontFamily: "Poppins_600SemiBold" },
});
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function Obrigado() {
  return (
    <View style={styles.container}>
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>🙏</Text>
      </View>
      
      <Text style={styles.titulo}>Obrigado por compartilhar!</Text>
      <Text style={styles.texto}>
        Sua resposta ajuda a construir um ambiente de trabalho mais saudável e acolhedor.
      </Text>

      <TouchableOpacity 
        style={styles.botaoSecundario} 
        onPress={() => router.push("/apoio")}
        activeOpacity={0.8}
      >
        <Text style={styles.botaoSecundarioTexto}>Central de Apoio</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.botao} 
        onPress={() => router.push("/home")}
        activeOpacity={0.8}
      >
        <Text style={styles.botaoTexto}>Voltar para o início</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#F8FAFC" 
  },
  emojiContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EDE9FE",
  },
  emoji: { 
    fontSize: 40 
  },
  titulo: { 
    fontSize: 24, 
    fontFamily: "Poppins_700Bold", 
    color: "#1E293B", 
    marginBottom: 8, 
    textAlign: "center" 
  },
  texto: { 
    fontSize: 14, 
    fontFamily: "Poppins_400Regular", 
    color: "#64748B", 
    textAlign: "center", 
    marginBottom: 36, 
    paddingHorizontal: 12,
    lineHeight: 20,
  },
  botao: {
    backgroundColor: "#7C3AED", 
    borderRadius: 20, 
    paddingVertical: 18, 
    paddingHorizontal: 32,
    alignItems: "center", 
    width: "100%",
    shadowColor: "#7C3AED", 
    shadowOpacity: 0.3, 
    shadowRadius: 10, 
    shadowOffset: { width: 0, height: 6 }, 
    elevation: 6,
  },
  botaoTexto: { 
    color: "#FFFFFF", 
    fontSize: 16, 
    fontFamily: "Poppins_600SemiBold" 
  },
  botaoSecundario: {
    borderRadius: 20, 
    paddingVertical: 18, 
    paddingHorizontal: 32, 
    alignItems: "center",
    width: "100%", 
    marginBottom: 12, 
    borderWidth: 1.5, 
    borderColor: "#7C3AED",
    backgroundColor: "#FFFFFF",
  },
  botaoSecundarioTexto: { 
    color: "#7C3AED", 
    fontSize: 16, 
    fontFamily: "Poppins_600SemiBold" 
  },
});
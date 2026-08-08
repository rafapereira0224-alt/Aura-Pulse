import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Apoio() {
  const opcoes = [
    { titulo: "Psicólogo da empresa", desc: "Agende uma conversa confidencial", icone: "account-heart-outline" as const, acao: () => Linking.openURL("mailto:psicologo@aurapulse.com?subject=Quero agendar uma conversa") },
    { titulo: "Canal de denúncia anônima", desc: "Relate uma situação sem se identificar", icone: "shield-alert-outline" as const, acao: () => Alert.alert("Canal anônimo", "Sua identidade não será revelada. Deseja continuar para o formulário de denúncia?") },
    { titulo: "Falar com o RH", desc: "Entre em contato direto", icone: "email-outline" as const, acao: () => Linking.openURL("mailto:rh@aurapulse.com") },
    { titulo: "Conteúdos sobre saúde mental", desc: "Artigos e materiais de apoio", icone: "book-open-outline" as const, acao: () => Alert.alert("Em breve", "Essa seção de conteúdos está em construção.") },
    { titulo: "Técnicas rápidas de respiração", desc: "Exercício de 2 minutos para reduzir o estresse", icone: "weather-windy" as const, acao: () => Alert.alert("Respiração 4-7-8", "Inspire por 4 segundos, segure por 7, solte por 8. Repita 4 vezes.") },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 12 }}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.titulo}>Central de Apoio</Text>
      <Text style={styles.subtitulo}>Você não está sozinho. Escolha uma opção abaixo.</Text>

      <View style={styles.lista}>
        {opcoes.map((opcao) => (
          <TouchableOpacity key={opcao.titulo} style={styles.card} onPress={opcao.acao}>
            <MaterialCommunityIcons name={opcao.icone} size={26} color="#6D28D9" />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.cardTitulo}>{opcao.titulo}</Text>
              <Text style={styles.cardDesc}>{opcao.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.push("/home")}>
        <Text style={styles.botaoVoltarTexto}>Voltar para o início</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 56, backgroundColor: "#F5F3FF" },
  titulo: { fontSize: 24, fontFamily: "Poppins_700Bold", color: "#333", marginBottom: 4 },
  subtitulo: { fontSize: 14, fontFamily: "Poppins_400Regular", color: "#666", marginBottom: 24 },
  lista: { gap: 12, marginBottom: 24 },
  card: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 16, padding: 16,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  cardTitulo: { fontSize: 14, fontFamily: "Poppins_600SemiBold", color: "#333", marginBottom: 2 },
  cardDesc: { fontSize: 12, fontFamily: "Poppins_400Regular", color: "#777" },
  botaoVoltar: { borderRadius: 16, paddingVertical: 15, alignItems: "center", borderWidth: 1.5, borderColor: "#6D28D9" },
  botaoVoltarTexto: { color: "#6D28D9", fontSize: 14, fontFamily: "Poppins_600SemiBold" },
});
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert, ScrollView, Platform } from "react-native";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Apoio() {
  const handleDenuncia = () => {
    if (Platform.OS === "web") {
      const confirmar = window.confirm("Canal anônimo: Sua identidade não será revelada. Deseja abrir o canal de envio?");
      if (confirmar) {
        Linking.openURL("mailto:denuncia@aurapulse.com?subject=Relato Anônimo");
      }
    } else {
      Alert.alert(
        "Canal Anônimo",
        "Sua identidade não será revelada. Deseja continuar?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Continuar", onPress: () => Linking.openURL("mailto:denuncia@aurapulse.com?subject=Relato Anônimo") }
        ]
      );
    }
  };

  const handleRespiracao = () => {
    if (Platform.OS === "web") {
      alert("🧘‍♂️ Exercício Respiração 4-7-8:\n\n1. Inspire pelo nariz por 4 segundos\n2. Segure a respiração por 7 segundos\n3. Solte o ar devagar pela boca por 8 segundos\n\nRepita esse ciclo 4 vezes.");
    } else {
      Alert.alert(
        "🧘‍♂️ Respiração 4-7-8",
        "1. Inspire por 4 segundos\n2. Segure por 7 segundos\n3. Solte por 8 segundos\n\nRepita 4 vezes para relaxar.",
        [{ text: "Entendido" }]
      );
    }
  };

  const handleConteudos = () => {
    if (Platform.OS === "web") {
      alert("Em breve: A seção de artigos e materiais de apoio sobre saúde mental estará disponível!");
    } else {
      Alert.alert("Em breve", "A seção de artigos e materiais de apoio está em construção.");
    }
  };

  const opcoes = [
    { 
      titulo: "Psicólogo da empresa", 
      desc: "Agende uma conversa confidencial", 
      icone: "account-heart-outline" as const, 
      acao: () => Linking.openURL("mailto:psicologo@aurapulse.com?subject=Quero agendar uma conversa") 
    },
    { 
      titulo: "Canal de denúncia anônima", 
      desc: "Relate uma situação sem se identificar", 
      icone: "shield-alert-outline" as const, 
      acao: handleDenuncia 
    },
    { 
      titulo: "Falar com o RH", 
      desc: "Entre em contato direto", 
      icone: "email-outline" as const, 
      acao: () => Linking.openURL("mailto:rh@aurapulse.com?subject=Contato com o RH") 
    },
    { 
      titulo: "Conteúdos sobre saúde mental", 
      desc: "Artigos e materiais de apoio", 
      icone: "book-open-outline" as const, 
      acao: handleConteudos 
    },
    { 
      titulo: "Técnicas rápidas de respiração", 
      desc: "Exercício de 2 minutos para reduzir o estresse", 
      icone: "weather-windy" as const, 
      acao: handleRespiracao 
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltarTopo} activeOpacity={0.8}>
        <Ionicons name="arrow-back" size={20} color="#1E293B" />
      </TouchableOpacity>

      <Text style={styles.titulo}>Central de Apoio</Text>
      <Text style={styles.subtitulo}>Você não está sozinho. Escolha uma opção abaixo.</Text>

      <View style={styles.lista}>
        {opcoes.map((opcao, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={opcao.acao} activeOpacity={0.8}>
            <View style={styles.iconeContainer}>
              <MaterialCommunityIcons name={opcao.icone} size={22} color="#7C3AED" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.cardTitulo}>{opcao.titulo}</Text>
              <Text style={styles.cardDesc}>{opcao.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.push("/home")} activeOpacity={0.8}>
        <Text style={styles.botaoVoltarTexto}>Voltar para o início</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8FAFC" 
  },
  contentContainer: {
    padding: 24, 
    paddingTop: 60,
    paddingBottom: 40,
  },
  botaoVoltarTopo: {
    marginBottom: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  titulo: { 
    fontSize: 26, 
    fontFamily: "Poppins_700Bold", 
    color: "#1E293B", 
    marginBottom: 4 
  },
  subtitulo: { 
    fontSize: 14, 
    fontFamily: "Poppins_400Regular", 
    color: "#64748B", 
    marginBottom: 24 
  },
  lista: { 
    gap: 12, 
    marginBottom: 24 
  },
  card: {
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#FFFFFF", 
    borderRadius: 20, 
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000", 
    shadowOpacity: 0.03, 
    shadowRadius: 6, 
    shadowOffset: { width: 0, height: 2 }, 
    elevation: 2,
  },
  iconeContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitulo: { 
    fontSize: 14, 
    fontFamily: "Poppins_600SemiBold", 
    color: "#334155", 
    marginBottom: 2 
  },
  cardDesc: { 
    fontSize: 12, 
    fontFamily: "Poppins_400Regular", 
    color: "#64748B" 
  },
  botaoVoltar: { 
    borderRadius: 20, 
    paddingVertical: 16, 
    alignItems: "center", 
    borderWidth: 1.5, 
    borderColor: "#7C3AED",
    backgroundColor: "#FFFFFF",
  },
  botaoVoltarTexto: { 
    color: "#7C3AED", 
    fontSize: 15, 
    fontFamily: "Poppins_600SemiBold" 
  },
});
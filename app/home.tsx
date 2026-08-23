import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  ScrollView,
} from "react-native";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Home() {
  const [streak, setStreak] = useState(0);
  const [historico, setHistorico] = useState<any[]>([]);
  const [graficoDados, setGraficoDados] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [saudacaoTexto, setSaudacaoTexto] = useState("Olá!");

  useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) {
      setSaudacaoTexto("Bom dia! ☀️");
    } else if (hora >= 12 && hora < 18) {
      setSaudacaoTexto("Boa tarde! 🌤️");
    } else {
      setSaudacaoTexto("Boa noite! 🌙");
    }

    async function carregarDados() {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        setCarregando(false);
        return;
      }

      const q = query(
        collection(db, "checkins"),
        where("userId", "==", uid),
        orderBy("criadoEm", "desc")
      );
      const snapshot = await getDocs(q);

      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Cálculo do Streak
      const diasUnicos = Array.from(
        new Set(
          docs.map(
            (d: any) => d.criadoEm?.toDate().toISOString().split("T")[0]
          )
        )
      )
        .sort()
        .reverse();

      let contagem = 0;
      const hoje = new Date().toISOString().split("T")[0];
      const ontem = new Date(Date.now() - 86400000).toISOString().split("T")[0];

      if (diasUnicos[0] === hoje || diasUnicos[0] === ontem) {
        contagem = 1;
        for (let i = 0; i < diasUnicos.length - 1; i++) {
          if (
            new Date(diasUnicos[i]).getTime() -
              new Date(diasUnicos[i + 1]).getTime() ===
            86400000
          )
            contagem++;
          else break;
        }
      }
      setStreak(contagem);

      // Histórico recente (últimos 3)
      setHistorico(docs.slice(0, 3));

      // Dados para o gráfico (últimos 7 dias em ordem cronológica)
      const ultimosSete = docs.slice(0, 7).reverse();
      setGraficoDados(ultimosSete);

      setCarregando(false);
    }
    carregarDados();
  }, []);

  const getEmoji = (emocao: string) => {
    switch (emocao) {
      case "Excelente":
        return "😁";
      case "Bem":
        return "🙂";
      case "Normal":
        return "😐";
      case "Cansado":
        return "🙁";
      default:
        return "😞";
    }
  };

  const getValorEmocao = (emocao: string) => {
    switch (emocao) {
      case "Excelente": return 100;
      case "Bem": return 75;
      case "Normal": return 50;
      case "Cansado": return 30;
      default: return 15;
    }
  };

  if (carregando) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.carregandoTexto}>Carregando seus dados...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Cabeçalho atualizado com o botão de Perfil */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.saudacao}>{saudacaoTexto}</Text>
          <Text style={styles.subSaudacao}>Como está sua energia hoje?</Text>
        </View>
        <TouchableOpacity 
          style={styles.botaoPerfilHeader} 
          onPress={() => router.push("/perfil")}
          activeOpacity={0.8}
        >
          <Ionicons name="person-outline" size={20} color="#7C3AED" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.botaoCheckin}
        onPress={() => router.push("/checkin")}
        activeOpacity={0.8}
      >
        <Text style={styles.botaoTexto}>✨ Fazer Check-in Diário</Text>
      </TouchableOpacity>

      <View style={[styles.dicaBox, streak >= 3 && styles.badgeTrofeu]}>
        <Text style={styles.dicaTitulo}>
          {streak >= 3 ? "🏆 Meta Batida!" : "💡 Progresso Atual"}
        </Text>
        <Text style={styles.dicaTexto}>
          {streak > 0
            ? `Você está em uma sequência de ${streak} dia(s) cuidando de si!`
            : "Comece sua sequência fazendo o check-in hoje."}
        </Text>
      </View>

      {/* Seção de Evolução do Humor (Gráfico Visual) */}
      <View style={styles.cardGrafico}>
        <View style={styles.graficoHeader}>
          <Text style={styles.graficoTitulo}>📈 Evolução Recente</Text>
          <Text style={styles.graficoSub}>Últimos registros</Text>
        </View>

        {graficoDados.length === 0 ? (
          <Text style={styles.graficoVazio}>Faça check-ins para ver sua evolução aqui!</Text>
        ) : (
          <View style={styles.barraContainer}>
            {graficoDados.map((item, index) => {
              const altura = getValorEmocao(item.emocao);
              const dataFormatada = item.criadoEm?.toDate().toLocaleDateString("pt-BR", {
                weekday: "short",
              }).replace(".", "");

              return (
                <View key={index} style={styles.colunaGrafico}>
                  <Text style={styles.emojiColuna}>{getEmoji(item.emocao)}</Text>
                  <View style={styles.trilhoBarra}>
                    <View style={[styles.preenchimentoBarra, { height: `${altura}%` }]} />
                  </View>
                  <Text style={styles.dataColuna}>{dataFormatada}</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* Atalho para a Central de Apoio */}
      <TouchableOpacity 
        style={styles.cardApoio} 
        onPress={() => router.push("/apoio")}
        activeOpacity={0.8}
      >
        <View style={styles.iconeApoioContainer}>
          <MaterialCommunityIcons name="heart-pulse" size={22} color="#7C3AED" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.apoioTitulo}>Precisa de suporte?</Text>
          <Text style={styles.apoioDesc}>Acesse canais de ajuda e conversas confidenciais</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
      </TouchableOpacity>

      {/* Cabeçalho do Histórico com o link Ver todos */}
      <View style={styles.headerHistoricoRow}>
        <Text style={styles.subtituloHistorico}>Seus últimos registros</Text>
        <TouchableOpacity onPress={() => router.push("/historico")} activeOpacity={0.7}>
          <Text style={styles.linkVerTodos}>Ver todos</Text>
        </TouchableOpacity>
      </View>
      
      {historico.length === 0 ? (
        <View style={styles.vazioBox}>
          <Text style={styles.vazioEmoji}>🌱</Text>
          <Text style={styles.vazioTexto}>Nenhum check-in registrado ainda.</Text>
        </View>
      ) : (
        <View style={styles.listaHistorico}>
          {historico.map((item) => (
            <View key={item.id} style={styles.itemHistorico}>
              <View style={styles.itemHeaderCard}>
                <Text style={styles.itemData}>
                  {item.criadoEm?.toDate().toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </Text>
                <Text style={styles.itemEmoji}>{getEmoji(item.emocao)}</Text>
              </View>
              <Text style={styles.itemEmocaoNome} numberOfLines={1}>
                {item.emocao || "Check-in"}
              </Text>
              {item.motivo && (
                <Text style={styles.itemMotivo} numberOfLines={1}>
                  {item.motivo}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.botaoNotificacao}
        onPress={async () => {
          if (Platform.OS !== "web") {
            await Notifications.scheduleNotificationAsync({
              content: { title: "Teste Aura Pulse", body: "Notificação funcionando!" },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 5,
              },
            });
          } else {
            alert("Notificações agendadas (simulado na web)");
          }
        }}
      >
        <Text style={styles.botaoNotificacaoTexto}>Testar Notificação (5s)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  contentContainer: {
    padding: 24,
    paddingTop: 64,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  saudacao: {
    fontSize: 28,
    fontFamily: "Poppins_700Bold",
    color: "#1E293B",
  },
  subSaudacao: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#64748B",
  },
  botaoPerfilHeader: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  carregandoTexto: {
    marginTop: 16,
    fontFamily: "Poppins_400Regular",
    color: "#64748B",
  },
  botaoCheckin: {
    backgroundColor: "#7C3AED",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 16,
  },
  botaoTexto: {
    color: "#FFFFFF",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  dicaBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  badgeTrofeu: {
    backgroundColor: "#FEF3C7",
    borderColor: "#F59E0B",
  },
  dicaTitulo: {
    fontFamily: "Poppins_600SemiBold",
    color: "#1E293B",
    fontSize: 15,
    marginBottom: 4,
  },
  dicaTexto: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#475569",
    lineHeight: 18,
  },
  cardGrafico: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  graficoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  graficoTitulo: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    color: "#1E293B",
  },
  graficoSub: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#94A3B8",
  },
  graficoVazio: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    paddingVertical: 12,
  },
  barraContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    paddingTop: 10,
  },
  colunaGrafico: {
    alignItems: "center",
    flex: 1,
  },
  emojiColuna: {
    fontSize: 14,
    marginBottom: 6,
  },
  trilhoBarra: {
    width: 12,
    height: 70,
    backgroundColor: "#F1F5F9",
    borderRadius: 6,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  preenchimentoBarra: {
    width: "100%",
    backgroundColor: "#7C3AED",
    borderRadius: 6,
  },
  dataColuna: {
    fontSize: 11,
    fontFamily: "Poppins_500Medium",
    color: "#64748B",
    marginTop: 6,
    textTransform: "capitalize",
  },
  cardApoio: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  iconeApoioContainer: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
  },
  apoioTitulo: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#334155",
    marginBottom: 1,
  },
  apoioDesc: {
    fontSize: 11,
    fontFamily: "Poppins_400Regular",
    color: "#64748B",
  },
  headerHistoricoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  subtituloHistorico: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#1E293B",
  },
  linkVerTodos: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: "#7C3AED",
  },
  listaHistorico: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  itemHistorico: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 20,
    flex: 1,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  itemHeaderCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemData: {
    fontSize: 11,
    fontFamily: "Poppins_500Medium",
    color: "#94A3B8",
  },
  itemEmoji: {
    fontSize: 20,
  },
  itemEmocaoNome: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
    color: "#334155",
  },
  itemMotivo: {
    fontSize: 11,
    fontFamily: "Poppins_400Regular",
    color: "#64748B",
    marginTop: 2,
  },
  vazioBox: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  vazioEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  vazioTexto: {
    fontFamily: "Poppins_400Regular",
    color: "#64748B",
    fontSize: 13,
  },
  botaoNotificacao: {
    marginTop: 32,
    padding: 12,
    alignItems: "center",
  },
  botaoNotificacaoTexto: {
    color: "#94A3B8",
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
  },
});
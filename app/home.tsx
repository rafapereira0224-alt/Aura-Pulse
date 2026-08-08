import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export default function Home() {
  const [streak, setStreak] = useState(0);
  const [historico, setHistorico] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        setCarregando(false);
        return;
      }

      const q = query(
        collection(db, "checkins"),
        where("userId", "==", uid),
        orderBy("criadoEm", "desc"),
      );
      const snapshot = await getDocs(q);

      const diasUnicos = Array.from(
        new Set(
          snapshot.docs.map(
            (d) => d.data().criadoEm?.toDate().toISOString().split("T")[0],
          ),
        ),
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

      setHistorico(
        snapshot.docs.slice(0, 3).map((doc) => ({ id: doc.id, ...doc.data() })),
      );
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

  if (carregando) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#6D28D9" />
        <Text
          style={{
            marginTop: 16,
            fontFamily: "Poppins_400Regular",
            color: "#666",
          }}
        >
          Carregando seus dados...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.saudacao}>Olá! 👋</Text>

      <TouchableOpacity
        style={styles.botaoCheckin}
        onPress={() => router.push("/checkin")}
      >
        <Text style={styles.botaoTexto}>Fazer Check-in Diário</Text>
      </TouchableOpacity>

      <View style={[styles.dicaBox, streak >= 3 && styles.badgeTrofeu]}>
        <Text style={styles.dicaTitulo}>
          {streak >= 3 ? "🏆 Meta Batida!" : "💡 Dica"}
        </Text>
        <Text style={styles.dicaTexto}>
          {streak > 0
            ? `Sequência de ${streak} dias!`
            : "Mantenha o foco hoje."}
        </Text>
      </View>

      <Text style={styles.subtituloHistorico}>Seus últimos registros:</Text>
      <View style={styles.listaHistorico}>
        {historico.map((item) => (
          <View key={item.id} style={styles.itemHistorico}>
            <Text style={styles.itemData}>
              {item.criadoEm?.toDate().toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
              })}
            </Text>
            <Text style={styles.itemEmoji}>{getEmoji(item.emocao)}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={{ marginTop: 30 }}
        onPress={async () => {
          if (Platform.OS !== "web") {
            await Notifications.scheduleNotificationAsync({
              content: { title: "Teste Aura Pulse", body: "Funcionando!" },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 5,
              },
            });
          }
        }}
      >
        <Text style={{ color: "#999", textAlign: "center" }}>
          Testar Notificação (5s)
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 64,
    backgroundColor: "#F5F3FF",
  },
  saudacao: { fontSize: 26, fontFamily: "Poppins_700Bold" },
  botaoCheckin: {
    backgroundColor: "#6D28D9",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  botaoTexto: { color: "#fff", fontFamily: "Poppins_600SemiBold" },
  dicaBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginTop: 20,
  },
  badgeTrofeu: {
    backgroundColor: "#FEF3C7",
    borderColor: "#F59E0B",
    borderWidth: 1,
  },
  dicaTitulo: { fontFamily: "Poppins_600SemiBold" },
  dicaTexto: { fontSize: 13, color: "#666" },
  subtituloHistorico: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#333",
    marginTop: 24,
    marginBottom: 12,
  },
  listaHistorico: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  itemHistorico: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    flex: 1,
    alignItems: "center",
    elevation: 2,
  },
  itemData: { fontSize: 12, color: "#999", marginBottom: 4 },
  itemEmoji: { fontSize: 24 },
});

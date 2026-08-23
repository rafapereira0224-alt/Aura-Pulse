import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

export default function HistoricoCompleto() {
  const [historico, setHistorico] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarTodosDados() {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        setCarregando(false);
        return;
      }

      try {
        const q = query(
          collection(db, "checkins"),
          where("userId", "==", uid),
          orderBy("criadoEm", "desc")
        );
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setHistorico(docs);
      } catch (erro) {
        console.error("Erro ao carregar histórico:", erro);
      } finally {
        setCarregando(false);
      }
    }

    carregarTodosDados();
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
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.carregandoTexto}>Carregando seu histórico...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerRow}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.botaoVoltar} 
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.tituloHeader}>Histórico Completo</Text>
        <View style={{ width: 40 }} />
      </View>

      {historico.length === 0 ? (
        <View style={styles.vazioBox}>
          <Text style={styles.vazioEmoji}>🌱</Text>
          <Text style={styles.vazioTexto}>Nenhum check-in registrado ainda.</Text>
        </View>
      ) : (
        <View style={styles.lista}>
          {historico.map((item) => (
            <View key={item.id} style={styles.cardItem}>
              <View style={styles.cardTop}>
                <View style={styles.emocaoContainer}>
                  <Text style={styles.emoji}>{getEmoji(item.emocao)}</Text>
                  <Text style={styles.emocaoNome}>{item.emocao}</Text>
                </View>
                <Text style={styles.dataTexto}>
                  {item.criadoEm?.toDate().toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </Text>
              </View>

              {item.motivo && (
                <View style={styles.motivoBadge}>
                  <Text style={styles.motivoTexto}>📌 {item.motivo}</Text>
                </View>
              )}

              {item.comentario && (
                <Text style={styles.comentarioTexto}>"{item.comentario}"</Text>
              )}
            </View>
          ))}
        </View>
      )}
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
    paddingTop: 60,
    paddingBottom: 40,
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
  carregandoTexto: {
    marginTop: 16,
    fontFamily: "Poppins_400Regular",
    color: "#64748B",
  },
  lista: {
    gap: 12,
  },
  cardItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  emocaoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emoji: {
    fontSize: 22,
  },
  emocaoNome: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    color: "#1E293B",
  },
  dataTexto: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: "#94A3B8",
  },
  motivoBadge: {
    backgroundColor: "#F5F3FF",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  motivoTexto: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: "#7C3AED",
  },
  comentarioTexto: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#475569",
    fontStyle: "italic",
    marginTop: 4,
  },
  vazioBox: {
    backgroundColor: "#FFFFFF",
    padding: 32,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 20,
  },
  vazioEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  vazioTexto: {
    fontFamily: "Poppins_400Regular",
    color: "#64748B",
    fontSize: 14,
  },
});
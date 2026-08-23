import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

const motivos = ["Sobrecarga de trabalho", "Prazos", "Liderança", "Relacionamento com a equipe", "Questões pessoais", "Outro"];

export default function Pergunta() {
  const { emocao } = useLocalSearchParams<{ emocao: string }>();
  const [motivoSelecionado, setMotivoSelecionado] = useState<string | null>(null);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleEnviar() {
    if (!motivoSelecionado) return;
    setEnviando(true);
    try {
      await addDoc(collection(db, "checkins"), {
        userId: auth.currentUser?.uid ?? "anonimo",
        emocao: emocao ?? "não informado",
        motivo: motivoSelecionado,
        comentario: comentario || null,
        criadoEm: Timestamp.now(),
      });
      router.push("/obrigado");
    } catch (erro: any) {
      Alert.alert("Erro ao salvar", erro.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltarTopo} activeOpacity={0.8}>
        <Ionicons name="arrow-back" size={24} color="#1E293B" />
      </TouchableOpacity>

      <Text style={styles.titulo}>O que mais contribuiu para o seu dia?</Text>

      <View style={styles.opcoes}>
        {motivos.map((motivo) => {
          const ehSelecionado = motivoSelecionado === motivo;
          return (
            <TouchableOpacity
              key={motivo}
              style={[styles.opcao, ehSelecionado && styles.opcaoSelecionada]}
              onPress={() => setMotivoSelecionado(motivo)}
              activeOpacity={0.8}
            >
              <Text style={[styles.opcaoTexto, ehSelecionado && styles.opcaoTextoSelecionado]}>
                {motivo}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TextInput
        style={styles.comentario}
        placeholder="Quer comentar mais alguma coisa? (opcional)"
        placeholderTextColor="#94A3B8"
        value={comentario}
        onChangeText={setComentario}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity
        style={[styles.botao, !motivoSelecionado && styles.botaoDesabilitado]}
        onPress={handleEnviar}
        disabled={!motivoSelecionado || enviando}
        activeOpacity={0.8}
      >
        <Text style={styles.botaoTexto}>{enviando ? "Enviando..." : "Enviar"}</Text>
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
    marginBottom: 20,
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
    fontSize: 22, 
    fontFamily: "Poppins_700Bold", 
    color: "#1E293B", 
    marginBottom: 24, 
    textAlign: "left" 
  },
  opcoes: { 
    gap: 12, 
    marginBottom: 20 
  },
  opcao: {
    backgroundColor: "#FFFFFF", 
    borderRadius: 20, 
    paddingVertical: 16, 
    paddingHorizontal: 20,
    borderWidth: 1.5, 
    borderColor: "#E2E8F0",
    shadowColor: "#000", 
    shadowOpacity: 0.03, 
    shadowRadius: 6, 
    shadowOffset: { width: 0, height: 2 }, 
    elevation: 2,
  },
  opcaoSelecionada: { 
    borderColor: "#7C3AED", 
    backgroundColor: "#F5F3FF" 
  },
  opcaoTexto: { 
    fontSize: 15, 
    fontFamily: "Poppins_400Regular", 
    color: "#475569" 
  },
  opcaoTextoSelecionado: { 
    color: "#7C3AED", 
    fontFamily: "Poppins_600SemiBold" 
  },
  comentario: {
    backgroundColor: "#FFFFFF", 
    borderRadius: 20, 
    padding: 18, 
    fontSize: 14, 
    fontFamily: "Poppins_400Regular",
    textAlignVertical: "top", 
    marginBottom: 24, 
    minHeight: 100,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    color: "#1E293B",
    shadowColor: "#000", 
    shadowOpacity: 0.03, 
    shadowRadius: 6, 
    shadowOffset: { width: 0, height: 2 }, 
    elevation: 2,
  },
  botao: {
    backgroundColor: "#7C3AED", 
    borderRadius: 20, 
    paddingVertical: 18, 
    alignItems: "center",
    shadowColor: "#7C3AED", 
    shadowOpacity: 0.3, 
    shadowRadius: 10, 
    shadowOffset: { width: 0, height: 6 }, 
    elevation: 6,
  },
  botaoDesabilitado: { 
    backgroundColor: "#E2E8F0", 
    shadowOpacity: 0,
    elevation: 0,
  },
  botaoTexto: { 
    color: "#FFFFFF", 
    fontSize: 16, 
    fontFamily: "Poppins_600SemiBold" 
  },
});
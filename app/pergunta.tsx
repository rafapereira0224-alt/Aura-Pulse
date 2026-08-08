import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

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
    <View style={styles.container}>
      <Text style={styles.titulo}>O que mais contribuiu para o seu dia?</Text>

      <View style={styles.opcoes}>
        {motivos.map((motivo) => (
          <TouchableOpacity
            key={motivo}
            style={[styles.opcao, motivoSelecionado === motivo && styles.opcaoSelecionada]}
            onPress={() => setMotivoSelecionado(motivo)}
          >
            <Text style={[styles.opcaoTexto, motivoSelecionado === motivo && styles.opcaoTextoSelecionado]}>
              {motivo}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.comentario}
        placeholder="Quer comentar mais alguma coisa? (opcional)"
        placeholderTextColor="#999"
        value={comentario}
        onChangeText={setComentario}
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity
        style={[styles.botao, !motivoSelecionado && styles.botaoDesabilitado]}
        onPress={handleEnviar}
        disabled={!motivoSelecionado || enviando}
      >
        <Text style={styles.botaoTexto}>{enviando ? "Enviando..." : "Enviar"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 72, backgroundColor: "#F5F3FF" },
  titulo: { fontSize: 19, fontFamily: "Poppins_600SemiBold", color: "#333", marginBottom: 24, textAlign: "center" },
  opcoes: { gap: 10, marginBottom: 20 },
  opcao: {
    backgroundColor: "#fff", borderRadius: 14, paddingVertical: 14, paddingHorizontal: 18,
    borderWidth: 2, borderColor: "#fff",
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  opcaoSelecionada: { borderColor: "#6D28D9", backgroundColor: "#EDE9FE" },
  opcaoTexto: { fontSize: 14, fontFamily: "Poppins_400Regular", color: "#333" },
  opcaoTextoSelecionado: { color: "#6D28D9", fontFamily: "Poppins_600SemiBold" },
  comentario: {
    backgroundColor: "#fff", borderRadius: 14, padding: 16, fontSize: 13, fontFamily: "Poppins_400Regular",
    textAlignVertical: "top", marginBottom: 24, minHeight: 80,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  botao: {
    backgroundColor: "#6D28D9", borderRadius: 16, paddingVertical: 18, alignItems: "center",
    shadowColor: "#6D28D9", shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4,
  },
  botaoDesabilitado: { backgroundColor: "#C4B5FD", shadowOpacity: 0 },
  botaoTexto: { color: "#fff", fontSize: 15, fontFamily: "Poppins_600SemiBold" },
});
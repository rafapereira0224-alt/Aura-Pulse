import { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { router } from "expo-router";

const opcoes = [
  { emoji: "😁", texto: "Excelente" },
  { emoji: "🙂", texto: "Bem" },
  { emoji: "😐", texto: "Normal" },
  { emoji: "🙁", texto: "Cansado" },
  { emoji: "😞", texto: "Muito difícil" },
];

export default function Checkin() {
  const [selecionado, setSelecionado] = useState<string | null>(null);

  // Criando uma animação simples de pulso para cada botão
  const animacao = useRef(new Animated.Value(1)).current;

  function handleSelecionar(texto: string) {
    setSelecionado(texto);
    // Pequeno efeito de "pulo" no botão selecionado
    Animated.sequence([
      Animated.timing(animacao, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animacao, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function handleContinuar() {
    router.push({ pathname: "/pergunta", params: { emocao: selecionado } });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Como você está terminando o dia hoje?</Text>

      <View style={styles.opcoes}>
        {opcoes.map((opcao) => {
          const ehSelecionado = selecionado === opcao.texto;
          return (
            <TouchableOpacity
              key={opcao.texto}
              activeOpacity={0.7}
              style={[styles.opcao, ehSelecionado && styles.opcaoSelecionada]}
              onPress={() => handleSelecionar(opcao.texto)}
            >
              <Text style={styles.emoji}>{opcao.emoji}</Text>
              <Text
                style={[
                  styles.opcaoTexto,
                  ehSelecionado && styles.opcaoTextoSelecionado,
                ]}
              >
                {opcao.texto}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.botao, !selecionado && styles.botaoDesabilitado]}
        onPress={handleContinuar}
        disabled={!selecionado}
      >
        <Text style={styles.botaoTexto}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 72,
    backgroundColor: "#F5F3FF",
  },
  titulo: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    color: "#1e293b",
    marginBottom: 32,
    textAlign: "center",
  },
  opcoes: { gap: 14, marginBottom: 32 },
  opcao: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "transparent",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  opcaoSelecionada: { borderColor: "#6D28D9", backgroundColor: "#F3E8FF" },
  emoji: { fontSize: 32, marginRight: 16 },
  opcaoTexto: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: "#475569",
  },
  opcaoTextoSelecionado: { fontFamily: "Poppins_700Bold", color: "#6D28D9" },
  botao: {
    backgroundColor: "#6D28D9",
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#6D28D9",
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  botaoDesabilitado: { backgroundColor: "#C4B5FD" },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
});

import { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const opcoes = [
  { emoji: "😁", texto: "Excelente" },
  { emoji: "🙂", texto: "Bem" },
  { emoji: "😐", texto: "Normal" },
  { emoji: "🙁", texto: "Cansado" },
  { emoji: "😞", texto: "Muito difícil" },
];

export default function Checkin() {
  const [selecionado, setSelecionado] = useState<string | null>(null);

  const animacao = useRef(new Animated.Value(1)).current;

  function handleSelecionar(texto: string) {
    setSelecionado(texto);
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
      <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltarTopo}>
        <Ionicons name="arrow-back" size={24} color="#1E293B" />
      </TouchableOpacity>

      <Text style={styles.titulo}>Como você está terminando o dia hoje?</Text>

      <View style={styles.opcoes}>
        {opcoes.map((opcao) => {
          const ehSelecionado = selecionado === opcao.texto;
          return (
            <TouchableOpacity
              key={opcao.texto}
              activeOpacity={0.8}
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
        activeOpacity={0.8}
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
    paddingTop: 60,
    backgroundColor: "#F8FAFC",
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
    textAlign: "left",
  },
  opcoes: { 
    gap: 12, 
    marginBottom: 32 
  },
  opcao: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
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
  emoji: { 
    fontSize: 28, 
    marginRight: 16 
  },
  opcaoTexto: {
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
    color: "#475569",
  },
  opcaoTextoSelecionado: { 
    fontFamily: "Poppins_600SemiBold", 
    color: "#7C3AED" 
  },
  botao: {
    backgroundColor: "#7C3AED",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
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
    fontFamily: "Poppins_600SemiBold",
  },
});
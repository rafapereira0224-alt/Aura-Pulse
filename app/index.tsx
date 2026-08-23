import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleEntrar() {
    if (!email || !senha) {
      Alert.alert("Ops", "Preencha e-mail e senha.");
      return;
    }
    setCarregando(true);
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      router.push("/home");
    } catch (erro: any) {
      Alert.alert("Erro ao entrar", erro.message);
    } finally {
      setCarregando(false);
    }
  }

  async function handleCriarConta() {
    if (!email || !senha) {
      Alert.alert("Ops", "Preencha e-mail e senha.");
      return;
    }
    setCarregando(true);
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      router.push("/home");
    } catch (erro: any) {
      Alert.alert("Erro ao criar conta", erro.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <LinearGradient colors={["#7C3AED", "#9333EA", "#C084FC"]} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.logoBox}>
          <Text style={styles.emojiLogo}>🌿</Text>
          <Text style={styles.logo}>Aura Pulse</Text>
          <Text style={styles.subtitulo}>Como você está hoje?</Text>
        </View>

        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#94A3B8"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#94A3B8"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.botao}
            onPress={handleEntrar}
            disabled={carregando}
            activeOpacity={0.8}
          >
            <Text style={styles.botaoTexto}>
              {carregando ? "Entrando..." : "Entrar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCriarConta} disabled={carregando}>
            <Text style={styles.linkCriarConta}>
              Ainda não tem conta? Criar conta
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  logoBox: {
    alignItems: "center",
    marginBottom: 36,
  },
  emojiLogo: {
    fontSize: 52,
    marginBottom: 8,
  },
  logo: {
    fontSize: 32,
    fontFamily: "Poppins_700Bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    color: "#F3E8FF",
    textAlign: "center",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    color: "#1E293B",
  },
  botao: {
    backgroundColor: "#7C3AED",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 6,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  botaoTexto: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  linkCriarConta: {
    textAlign: "center",
    color: "#7C3AED",
    marginTop: 20,
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
  },
});
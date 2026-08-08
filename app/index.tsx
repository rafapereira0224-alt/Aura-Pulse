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
    <LinearGradient colors={["#6D28D9", "#A855F7", "#F5F3FF"]} style={styles.gradient}>
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
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#999"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.botao}
            onPress={handleEntrar}
            disabled={carregando}
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
    marginBottom: 40,
  },
  emojiLogo: {
    fontSize: 48,
    marginBottom: 8,
  },
  logo: {
    fontSize: 30,
    fontFamily: "Poppins_700Bold",
    color: "#fff",
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
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  input: {
    backgroundColor: "#F5F3FF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    marginBottom: 14,
  },
  botao: {
    backgroundColor: "#6D28D9",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
  },
  linkCriarConta: {
    textAlign: "center",
    color: "#6D28D9",
    marginTop: 16,
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
  },
});

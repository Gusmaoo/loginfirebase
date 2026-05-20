import { initializeApp } from "firebase/app";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList
} from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword
} from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const firebaseConfig = {
  apiKey: "AIzaSyAplCMQxH2NqighBjpxMCS1gRjefw7lYbw",
  authDomain: "jeffgusmao-4273e.firebaseapp.com",
  projectId: "jeffgusmao-4273e",
  storageBucket: "jeffgusmao-4273e.firebasestorage.app",
  messagingSenderId: "28979212139",
  appId: "1:28979212139:web:d0a9242226ac40e481a62e",
  measurementId: "G-PYH0VBH4EK"
};

const app = initializeApp(firebaseConfig);
const Stack = createNativeStackNavigator();

// CADASTRO
function CadastroScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCadastro = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Usuário criado!");
        navigation.navigate("Login");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Senha"
        placeholderTextColor="#999"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

// LOGIN
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigation.navigate("Home");
      })
      .catch(() => {
        alert("Erro ao fazer login");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Senha"
        placeholderTextColor="#999"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
        <Text style={styles.link}>Criar conta</Text>
      </TouchableOpacity>
    </View>
  );
}

// ALTERAR SENHA
function ConfigScreen({ navigation }) {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const handleAlterarSenha = () => {
    if (!novaSenha || !confirmar) {
      alert("Preencha todos os campos.");
      return;
    }
    if (novaSenha !== confirmar) {
      alert("As senhas não coincidem.");
      return;
    }
    if (novaSenha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Usuário não autenticado.");
      return;
    }

    updatePassword(user, novaSenha)
      .then(() => {
        alert("Senha alterada com sucesso!");
        setNovaSenha("");
        setConfirmar("");
        navigation.goBack();
      })
      .catch((error) => {
        // Se o token estiver expirado o Firebase pede reautenticação
        if (error.code === "auth/requires-recent-login") {
          alert(
            "Por segurança, faça logout e login novamente antes de alterar a senha."
          );
        } else {
          alert(error.message);
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alterar Senha</Text>

      <TextInput
        placeholder="Nova senha"
        placeholderTextColor="#999"
        style={styles.input}
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
      />

      <TextInput
        placeholder="Confirmar nova senha"
        placeholderTextColor="#999"
        style={styles.input}
        value={confirmar}
        onChangeText={setConfirmar}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleAlterarSenha}>
        <Text style={styles.buttonText}>SALVAR NOVA SENHA</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

// HOME
function HomeScreen({ navigation }) {
  const [data, setData] = useState({});
  const [updatedAt, setUpdatedAt] = useState("");
  const [favorites, setFavorites] = useState([]);

  const auth = getAuth();

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://economia.awesomeapi.com.br/json/all"
      );
      const json = await response.json();
      setData(json);
      const now = new Date();
      setUpdatedAt(now.toLocaleString());
    } catch (error) {
      alert("Erro ao buscar cotações");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigation.navigate("Login"))
      .catch(() => alert("Erro ao sair"));
  };

  // Ordena: favoritos primeiro, depois o restante
  const getSortedData = () => {
    const items = Object.values(data);
    const favs = items.filter((item) => favorites.includes(item.code));
    const rest = items.filter((item) => !favorites.includes(item.code));
    return [...favs, ...rest];
  };

  const toggleFavorite = (code) => {
    setFavorites((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const getImage = (code) => {
    const flags = {
      USD: "us",
      EUR: "eu",
      GBP: "gb",
      CAD: "ca",
      AUD: "au",
      JPY: "jp",
      CHF: "ch",
      CNY: "cn",
      ILS: "il",
      ARS: "ar"
    };

    const crypto = {
      BTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
      ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      LTC: "https://cryptologos.cc/logos/litecoin-ltc-logo.png",
      XRP: "https://cryptologos.cc/logos/xrp-xrp-logo.png",
      DOGE: "https://cryptologos.cc/logos/dogecoin-doge-logo.png"
    };

    if (crypto[code]) return crypto[code];
    if (flags[code]) return `https://flagcdn.com/w40/${flags[code]}.png`;
    return "https://via.placeholder.com/40";
  };

  const renderCard = ({ item }) => {
    const isFav = favorites.includes(item.code);
    return (
      <View style={[styles.card, isFav && styles.cardFav]}>
        <Image source={{ uri: getImage(item.code) }} style={styles.flagImg} />

        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{item.code} / BRL</Text>
          <Text style={styles.cardSubtitle}>{item.name}</Text>
        </View>

        <Text style={styles.value}>
          R$ {parseFloat(item.bid).toFixed(2)}
        </Text>

        {/* Botão favoritar */}
        <TouchableOpacity
          onPress={() => toggleFavorite(item.code)}
          style={styles.starButton}
        >
          <Text style={styles.starIcon}>{isFav ? "⭐" : "☆"}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#759ee6" }}>
      <Text style={styles.title}>COTAÇÃO DE MOEDAS</Text>
      <Text style={styles.subtitle}>ATUALIZADO EM: {updatedAt}</Text>

      {favorites.length > 0 && (
        <Text style={styles.favLabel}>⭐ Favoritos aparecem no topo</Text>
      )}

      <FlatList
        data={getSortedData()}
        keyExtractor={(item) => item.code}
        renderItem={renderCard}
        contentContainerStyle={{ padding: 20 }}
      />

      <TouchableOpacity style={styles.button} onPress={fetchData}>
        <Text style={styles.buttonText}>ATUALIZAR COTAÇÕES</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>SAIR</Text>
      </TouchableOpacity>

      {/* NAVBAR */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>💰</Text>
          <Text style={styles.navText}>COTAÇÕES</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navText}>HISTÓRICO</Text>
        </TouchableOpacity>

        {/* Botão CONFIG agora navega para a tela de alterar senha */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Config")}
        >
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navText}>CONFIG</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// APP
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Cadastro">
        <Stack.Screen
          name="Cadastro"
          component={CadastroScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "CONVERSOR DE MOEDAS" }}
        />
        <Stack.Screen
          name="Config"
          component={ConfigScreen}
          options={{ title: "CONFIGURAÇÕES" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#759ee6",
    justifyContent: "center",
    padding: 20
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 10,
    marginTop: 20
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15
  },
  button: {
    backgroundColor: "#000000",
    padding: 15,
    borderRadius: 8,
    margin: 20
  },
  buttonText: {
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "bold"
  },
  link: {
    color: "#fff",
    marginTop: 15,
    textAlign: "center"
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12
  },
  // Card com borda dourada quando favoritado
  cardFav: {
    borderWidth: 2,
    borderColor: "#f5c518"
  },
  cardTitle: {
    fontWeight: "bold",
    color: "#759ee6"
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#555"
  },
  value: {
    fontWeight: "bold",
    color: "#759ee6"
  },
  subtitle: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 10
  },
  logout: {
    padding: 10
  },
  logoutText: {
    color: "#ffffff",
    textAlign: "center"
  },
  flagImg: {
    width: 40,
    height: 30,
    borderRadius: 4,
    marginRight: 10
  },
  navbar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 12,
    justifyContent: "space-around",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  navItem: {
    alignItems: "center"
  },
  navIcon: {
    fontSize: 20
  },
  navText: {
    fontSize: 12,
    color: "#759ee6"
  },
  starButton: {
    marginLeft: 10,
    padding: 4
  },
  starIcon: {
    fontSize: 20
  },
  favLabel: {
    color: "#fff",
    textAlign: "center",
    fontSize: 12,
    marginBottom: 4,
    opacity: 0.85
  }
});
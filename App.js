import { initializeApp } from "firebase/app";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
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

//cadastro
function CadastroScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCadastro = () => {
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
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

//login
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigation.navigate("Home");
      })
      .catch((error) => {
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

//tela principal
function HomeScreen({ navigation }) {
  const [usd, setUsd] = useState(null);
  const [eur, setEur] = useState(null);
  const [updatedAt, setUpdatedAt] = useState("");

  const auth = getAuth();

  const fetchData = async () => {
    try {
      const response = await fetch("https://economia.awesomeapi.com.br/json/all");
      const data = await response.json();

      setUsd(data.USD);
      setEur(data.EUR);

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
      .then(() => {
        navigation.navigate("Login");
      })
      .catch(() => {
        alert("Erro ao sair");
      });
  };

  const renderCard = (currency, flagUrl, name) => {
    if (!currency) return null;

    return (
      <View style={styles.card}>
        <Image source={{ uri: flagUrl }} style={styles.flagImg} />

        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{currency.code} / BRL</Text>
          <Text style={styles.cardSubtitle}>{name}</Text>
        </View>

        <Text style={styles.value}>
          R$ {parseFloat(currency.bid).toFixed(2)}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#759ee6" }}>
      <View style={{ flex: 1, padding: 20 }}></View>
      <Text style={styles.title}>COTAÇÃO DE MOEDAS</Text>
      <Text style={styles.subtitle}>ATUALIZADO EM: {updatedAt}</Text>

      {renderCard(
        usd,
        "https://flagcdn.com/w40/us.png",
        "1 DÓLAR AMERICANO"
      )}

      {renderCard(
        eur,
        "https://flagcdn.com/w40/eu.png",
        "1 EURO"
      )}

      <TouchableOpacity style={styles.button} onPress={fetchData}>
        <Text style={styles.buttonText}>ATUALIZAR COTAÇÕES</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>SAIR</Text>
      </TouchableOpacity>

    <View style={styles.navbar}>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcon}>💰</Text>
        <Text style={styles.navText}>COTAÇÕES</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcon}>📊</Text>
        <Text style={styles.navText}>HISTÓRICO</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcon}>⚙️</Text>
        <Text style={styles.navText}>CONFIG</Text>
      </TouchableOpacity>
    </View>

    </View>
  );
}



//app 
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Cadastro">
        <Stack.Screen name="Cadastro" component={CadastroScreen}  options={{ headerShown: false }}  />
        <Stack.Screen name="Login" component={LoginScreen}  options={{ headerShown: false }}  />
        <Stack.Screen name="Home" component={HomeScreen}   options={{ title: "CONVERSOR DE MOEDAS" }}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


//styles
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
    marginBottom: 20
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
    borderRadius: 8
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

flag: {
  fontSize: 24,
  marginRight: 10
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
  marginBottom: 20
},

logout: {
  marginTop: 20,
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
  borderTopRightRadius: 20,
  elevation: 10
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
}
});

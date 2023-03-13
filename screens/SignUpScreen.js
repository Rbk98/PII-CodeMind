import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TextInput,
  Image,
  Alert,
  Text,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Button } from "../components/Button";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import firebase from "../firebaseConfig.js";

const SignUpScreen = ({ navigation }) => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValidate, setPasswordValidate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onHandleSignup = () => {
    if (password !== passwordValidate) {
      setErrorMessage("Les mots de passe ne correspondent pas");
      return;
    }
    if (email !== "" && password !== "") {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Stockage du nom de l'utilisateur dans Firestore
          const user = userCredential.user;
          // Enregistrement des informations supplémentaires dans Firebase Realtime Database
          const currentDate = new Date().toISOString();
          const userRef = firebase.db
            .collection("users")
            .doc(userCredential.user.uid);
          await userRef
            .set({
              nickname,
              email,
              createdAt: currentDate,
            })
            .catch((error) => console.error(error));
        })
        .then(() => {
          navigation.navigate("Accueil");
        })
        .catch((err) => Alert.alert("Erreur de connexion :", err.message));
    } else {
      setErrorMessage("Attention ! Veuillez remplir tous les champs.");
      return;
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ImageBackground
        source={require("../assets/authentification.png")}
        resizeMode="cover"
        style={styles.container}
      >
        <Image style={styles.logo} source={require("../assets/icon-512.png")} />
        <Text
          style={{
            color: "#00216d",
            fontWeight: "600",
            fontSize: 14,
            paddingBottom: 10,
          }}
        >
          Veuillez inscrire les données suivantes :
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Surnom"
            value={nickname}
            onChangeText={(nickname) => setNickname(nickname)}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(email) => setEmail(email)}
            style={styles.input}
          />
          <TextInput
            placeholder="Mot de passe"
            value={password}
            onChangeText={(password) => setPassword(password)}
            style={styles.input}
            secureTextEntry
          />
          <TextInput
            placeholder="Saisir à nouveau le mot de passe"
            value={passwordValidate}
            onChangeText={(passwordValidate) =>
              setPasswordValidate(passwordValidate)
            }
            style={styles.input}
            secureTextEntry
          />
          {errorMessage ? (
            <Text
              style={{
                color: "red",
                textAlign: "center",
                fontSize: 16,
                marginTop: 10,
              }}
            >
              {errorMessage}
            </Text>
          ) : null}
        </View>
        <Button action={onHandleSignup} text="Créer mon compte" />
        <View style={styles.login}>
          <Text style={{ color: "dimgrey", fontWeight: "600", fontSize: 14 }}>
            Déjà inscrit ?{" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginButton}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 220,
    height: 220,
    marginTop: 30,
    marginBottom: 30,
  },
  inputContainer: {
    width: "80%",
    fontSize: 16,
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 8,
  },
  login: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  loginButton: { color: "#00216d", fontWeight: "600", fontSize: 15 },
});

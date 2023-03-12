import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TextInput,
  Image,
  Alert,
  Text,
} from "react-native";
import React, { useState } from "react";
import { Button } from "../components/Button";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import firebase from "../firebaseConfig.js";

const SignUpScreen = ({ navigation }) => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onHandleSignup = () => {
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
      setErrorMessage("Veuillez remplir tous les champs");
      return;
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Image style={styles.logo} source={require("../assets/logo.png")} />

      <View style={styles.inputContainer}>
        {errorMessage ? (
          <Text style={{ color: "red", textAlign: "center" }}>
            {errorMessage}
          </Text>
        ) : null}
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
          value={password}
          onChangeText={(password) => setPassword(password)}
          style={styles.input}
          secureTextEntry
        />
      </View>
      <Button action={onHandleSignup} text="Créer mon compte" />
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
    width: 150,
    height: 150,
    marginBottom: 40,
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
});

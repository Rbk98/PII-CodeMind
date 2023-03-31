import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { CourseCard } from "../components/CourseCard";
import { Input } from "../components/Input";
import { CoursesServices } from "../services/CoursesServices";

const CourseScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(false);
  const [searchText, setSearchText] = useState("");

  const loadCourses = async () => {
    try {
      const courses = await CoursesServices.fetchCourses();
      setCourses(courses);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  const searchCourses = async (name) => {
    try {
      const courses = await CoursesServices.searchCourses(name);
      setCourses(courses);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const onPressCourse = (course) => {
    navigation.navigate("Sequence", { courseId: course.id });
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text === "") {
      loadCourses();
    } else {
      searchCourses(text);
    }
  };

  const handleReset = () => {
    setSearchText("");
    loadCourses();
  };

  return (
    <ImageBackground
      source={require("../assets/home.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.headerSearch}>
          <View style={styles.content}>
            <Text style={styles.title}>Rechercher des cours</Text>
            <Text style={styles.subtitle}>
              A l'aide de la barre de recherche, tu peux chercher les cours qui
              t'intéressent.
            </Text>
          </View>
          <Image
            source={require("../assets/romy/romysmilefilled.png")}
            style={styles.icon}
          />
        </View>
        <Input
          style={styles.search}
          placeholder="Rechercher un cours..."
          value={searchText}
          onSearch={handleSearch}
        />
        {searchText !== "" && (
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.seeAllButtonText}>Voir tout</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        style={styles.main}
        data={courses}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CourseCard item={item} onPress={() => onPressCourse(item)} />
        )}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    backgroundColor: "#335296",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderWidth: 1,
    borderColor: "#00216d",
    paddingBottom: 16,
    paddingHorizontal: 15,
    marginBottom: 6,
  },
  headerSearch: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  seeAllButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginVertical: 4,
    color: "white",
  },
  subtitle: {
    fontSize: 14,
    color: "white",
  },
  icon: {
    width: 80,
    height: 80,
  },
  main: {
    padding: 15,
  },
});

export default CourseScreen;

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CourseScreen from "../screens/CourseScreen";
import SequenceScreen from "../screens/SequenceScreen";

// Screen stack for home tab
const CourseStack = createNativeStackNavigator();

const CourseStackNavigator = () => {
  return (
    <CourseStack.Navigator initialRouteName="Apprendre">
      <CourseStack.Screen
        name="Apprendre"
        component={CourseScreen}
        options={{ title: "Apprendre" }}
      />
      <CourseStack.Screen name="Sequence" component={SequenceScreen} />
    </CourseStack.Navigator>
  );
};

export default CourseStackNavigator;

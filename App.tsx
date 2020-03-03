import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>oneMoon</Text>
      <Image
        style={{ width: 500, height: 300 }}
        source={{
          uri: "https://source.unsplash.com/collection/190727/1600x900"
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

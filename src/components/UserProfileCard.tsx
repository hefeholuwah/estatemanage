import React from "react";
import { View, Text, Image, StyleSheet, ImageBackground } from "react-native";

interface UserProfileCardProps {
  name: string;
  apartment: string;
  backgroundImage: string;
  profileImage: string;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  name,
  apartment,
  backgroundImage,
  profileImage,
}) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: backgroundImage }}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.apartment}>{apartment}</Text>
          </View>
          <Image
            source={{ uri: profileImage }}
            style={styles.profileImage}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  background: {
    width: "100%",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#31111D",
    height: 140,
  },
  textContainer: {
    flexDirection: "column",
  },
  name: {
    fontSize: 32,
    fontWeight: "500",
    color: "#FFFFFF",
    fontFamily: "Raleway_500Medium",
  },
  apartment: {
    fontSize: 20,
    fontWeight: "400",
    color: "#FFFFFF",
    marginTop: 4,
    fontFamily: "Raleway_400Regular",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});

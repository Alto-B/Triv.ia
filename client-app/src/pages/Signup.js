import React, { useContext, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Button, Title, Text, TextInput } from 'react-native-paper';
import { SocketContext } from '../SocketProvider';

import joinImg from "../../assets/join.png"


export default function Signup({ navigation }) {
  const { user, authenticate } =  useContext(SocketContext);

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const signup = async () => {
    const result = await authenticate(username, password, "signup")
    if(result) navigation.navigate('Home')
  }

  return (
    <View style={styles.container}>
      {/* {user ? navigation.navigate('Home') : null} */}
      <Title style={{
          position: "absolute",
          top: 48,
          left: 20
      }}
      >
          triv.ia
        </Title>

        <Image style={{width: 400, height: 300}} source={joinImg} resizeMode="contain"/>

      <View style={styles.form}>
        <TextInput
            autoCapitalize="none"
            style={styles.field}
            label="Username"
            value={username}
            onChangeText={value => setUsername(value)}
        />
        <TextInput
            autoCapitalize="none"
            style={styles.field}
            label="Password"
            value={password}
            onChangeText={value => setPassword(value)}
        />
        <TextInput
            autoCapitalize="none"
            style={styles.field}
            label="Confirm password"
        />
      </View>

      <Button mode="contained" style={styles.button} onPress={signup}>Signup</Button>

      <View
        style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        }}
      >
          
        <Text>Already have an account?</Text>
        <Button onPress={() => navigation.navigate('Login')}>Login</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },

  form: {
      width: "100%",
      paddingBottom: 20
  },

  field: {
      marginBottom: 12,
      backgroundColor: "transparent"
  },

  button: {
      width: "100%",
  }
});

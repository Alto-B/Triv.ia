import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Title, Text, TextInput } from 'react-native-paper';
import { SocketContext } from '../SocketProvider';

export default function Login({ navigation }) {
  const { user, authenticate } =  useContext(SocketContext);

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const login = async () => {
    const result = await authenticate(username, password)
    if(result) navigation.navigate('Home')
  }

  useEffect(() => {
    if(user) navigation.navigate('Home')
  }, [user])

  return (
    <View style={styles.container}>
      <Title style={{
          position: "absolute",
          top: 48,
          left: 20
      }}
      >
          triv.ia
        </Title>

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
      </View>

      <Button mode="contained" style={styles.button} onPress={login}>Login</Button>

      <View
        style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        }}
      >
          
        <Text>Don't have an account?</Text>
        <Button onPress={() => navigation.navigate('Signup')}>Signup</Button>
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
      paddingTop: 300,
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

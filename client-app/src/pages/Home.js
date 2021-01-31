import React, { useContext, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { SocketContext } from '../SocketProvider';
import { Title, Card, Text, Button } from 'react-native-paper'

const colors = ["#9B51E0", "#2F80ED", "#27AE60", "#EB5757"]

export default function Home() {
  const { question } = useContext(SocketContext)
  const [selected, setSelected] = useState(-1)

  if(!question) return (
    <View style={styles.container}>
      <Text>Game is starting shortly.</Text>
    </View>
  )

  return (
    <View style={styles.container}>

      <View>
        <Title style={styles.question}>Question {question.step + 1}</Title>
        <Title style={styles.prompt}>{question.prompt}</Title>
      </View>

      <View style={styles.answers}>
      {
        question.answers.map((answer,index) => (
          <TouchableOpacity style={styles[`answer${index}`]} key={index}>
            <View key={index}>
              <Title key={`title-${index}`} style={styles.answerText}>{answer.text}</Title>
            </View>
          </TouchableOpacity>
        ))
      }
      </View>

    </View>
  );
}

const answer = {
  width: "48%",
  height: "30%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 6,
  margin: 2,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },

  question: {
    paddingTop: 140,
    color: "#888"
  },

  prompt: {
    paddingBottom: 40
  },

  answers: {
    width: "100%",
    height: "90%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap"
  },

  answer0: {
    ...answer,
    backgroundColor: colors[0],
  },

  answer1: {
    ...answer,
    backgroundColor: colors[1],
  },

  answer2: {
    ...answer,
    backgroundColor: colors[2],
  },

  answer3: {
    ...answer,
    backgroundColor: colors[3],
  },

  answerText: {
    textAlign: "center",
    color: "white"
  }
});

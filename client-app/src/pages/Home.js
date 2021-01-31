import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { SocketContext } from '../SocketProvider';
import { Title, ProgressBar, Text, Button, Colors  } from 'react-native-paper'

const colors = ["#9B51E0", "#2F80ED", "#27AE60", "#EB5757"]

export default function Home() {
  const { gameData, ended, setEnded, sendAnswer, connectToSocket } = useContext(SocketContext)
  const [selected, setSelected] = useState(-1)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setSelected(-1)
    setSubmitted(false)
  }, [gameData])

  if(ended) return (
    <View style={styles.container}>
      <Text>game over</Text>
      <Button
          onPress={() => setEnded(false)}
          mode={"outlined"}
        >
          Restart
      </Button>
    </View>
  )

  if(!gameData) return (
    <View style={styles.container}>
      <Text>Game is starting shortly.</Text>
      <Button
          onPress={connectToSocket}
          mode={"outlined"}
        >
          Connect
        </Button>
    </View>
  )

  const getStyle = (index) => {
    if(selected == index ) {
      return [
        styles[`answer${index}`],
        styles.answerText
      ]
    }

    return [
      styles.answer,
      styles[`answerText${index}`]
    ]
  }

  const selectAnswer = (index) => {
    if(submitted) return

    if(selected == index) {
      setSelected(-1)
    } else {
      setSelected(index)
    }
  }

  const submitAnswer = () => {
    if(selected == -1) return
    setSubmitted(true)

    console.log("answerID:", question.answers[selected]._id)

    sendAnswer(question.answers[selected]._id)
  }

  const {question, step, totalSteps} = gameData

  return (
    <View style={styles.container}>

      <View>
        <Title style={styles.question}>Question {step + 1}</Title>
        <Title style={styles.prompt}>{question.prompt}</Title>
      </View>

      <View style={styles.answers}>
      {
        question.answers.map((answer,index) => (
          <TouchableOpacity
            style={getStyle(index)[0]}
            key={index}
            onPress={() => selectAnswer(index)}
            disabled={submitted}
          >
              <Title key={`title-${index}`} style={getStyle(index)[1]}>{answer.text}</Title>
          </TouchableOpacity>
        ))
      }

        <Button
          style={styles.btn}
          onPress={submitted ? null : submitAnswer}
          mode={submitted ? "contained" : "outlined" }
          color={selected == -1 ? "#eee" : colors[selected]}
          >
            {submitted ? "Submitted" : "Submit" }
        </Button>
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
  backgroundColor: "#eee"
}

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    marginTop: 40,
  },

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
    height: "70%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap"
  },

  answer,

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
  },

  answerText0: {
    textAlign: "center",
    color: colors[0]
  },

  answerText1: {
    textAlign: "center",
    color: colors[1]
  },

  answerText2: {
    textAlign: "center",
    color: colors[2]
  },

  answerText3: {
    textAlign: "center",
    color: colors[3]
  },
});

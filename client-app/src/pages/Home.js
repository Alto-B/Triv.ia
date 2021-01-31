import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { SocketContext } from '../SocketProvider';
import { Title, DataTable, Text, Button, Colors, TextInput  } from 'react-native-paper'

import lobbyImg from "../../assets/lobby.png"

const colors = ["#9B51E0", "#2F80ED", "#27AE60", "#EB5757"]

const PLACE_SUFFIX = {
  0: 'last',
  1: 'st',
  2: 'nd',
  3: 'rd'
}

export default function Home() {
  const { user, gameData, ended, setEnded, sendAnswer, connectToSocket, report } = useContext(SocketContext)
  const [selected, setSelected] = useState(-1)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setSelected(-1)
    setSubmitted(false)
  }, [gameData])

  const getPlacement = () => {
    let place = 0;
    if(!report) return PLACE_SUFFIX[place]

    let lb = [...report.leaderboard].sort((a, b) => b.score - a.score)

    for(let i=0; i<lb.length; i++) {
      if(lb[i].userID == user) {
        place = i+1
        break;
      }
    }

    if(!PLACE_SUFFIX[place]) return `${place}th`

    return `${place}${PLACE_SUFFIX[place]}`
  }

  const renderLobby = () => (
    <View style={styles.container}>
      <View style={styles.lobby}>
        <Title style={styles.question}>Join a Game</Title>
        <Title style={styles.prompt}>Use the event code to join</Title>

        <View style={{display: "flex", alignItems: "center"}}>
        <Image style={{width: 300, height: 300}} source={lobbyImg} resizeMode="cover"/>
        </View>

        <View>
        <TextInput
            autoCapitalize="characters"
            style={styles.field}
            label="Event code"
        />

        <Button
            onPress={connectToSocket}
            mode={"outlined"}
          >
            Join
        </Button>
        </View>
      </View>
    </View>
  )

  const renderLeaderboard = () => (
    <View style={styles.container}>
      <View style={styles.lobby}>
        <Title style={styles.question}>Game Over</Title>
        <Title style={styles.prompt}>You finished {getPlacement()}</Title>

        <DataTable style={{marginBottom: 12}}>
          <DataTable.Header>
            <DataTable.Title>Username</DataTable.Title>
            <DataTable.Title numeric>Score</DataTable.Title>
            <DataTable.Title numeric>Correct</DataTable.Title>
            <DataTable.Title numeric>Attempted</DataTable.Title>
          </DataTable.Header>

          {
            report?.leaderboard.sort((a, b) => b.score - a.score).map((x, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell>{x.username}</DataTable.Cell>
                <DataTable.Cell numeric>{x.score}</DataTable.Cell>
                <DataTable.Cell numeric>{x.correct}</DataTable.Cell>
                <DataTable.Cell numeric>{x.attempted}</DataTable.Cell>
              </DataTable.Row>
            ))
          }
          
        </DataTable>

        <View>
        <Button
            onPress={() => setEnded(false)}
            mode={"outlined"}
          >
            Back to Lobby
        </Button>
        </View>
      </View>
    </View>
  )

  if(ended) return renderLeaderboard()

  // TODO: returnLobby()
  if(!gameData) return renderLobby()

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

  field: {
    marginBottom: 12,
    backgroundColor: "transparent"
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },

  lobby: {
    width: "100%"
  },

  question: {
    paddingTop: 40,
    color: "#888"
  },

  prompt: {
    fontSize: 24,
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

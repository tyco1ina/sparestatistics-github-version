import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import { useState, useRef } from 'react';
import Scorecard from '../components/Scorecard';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function SelectGamePage({ navigation, route }) {

    const { symbolsLists } = route.params;

    const handleScoresList = (symbolsToConvert) => {
      // Convert the symbols to a list of numbers
      let combinedSymbols = symbolsToConvert.join()
      combinedSymbols = combinedSymbols.replace(/,/g, "")

      let rollsList = []
      for (let i = 0; i < combinedSymbols.length; i++) {
          if (combinedSymbols[i] == "X") {
              rollsList.push(10)
          } else if (combinedSymbols[i] == "-") {
              rollsList.push(0)
          } else if (combinedSymbols[i] == "/") {
              rollsList.push(10 - rollsList[i-1])
          } else {
              rollsList.push(parseInt(combinedSymbols[i]))
          }
      }

      let scoreList = []
      let cumilativeScore = 0
      let currentFrame = 0
      let currentRoll = 0
      while (scoreList.length <= 8) {
          if (rollsList[currentRoll] == 10) { // It's a strike
              cumilativeScore = cumilativeScore + 10
              cumilativeScore = cumilativeScore + rollsList[currentRoll + 1] + rollsList[currentRoll + 2]
              scoreList.push(cumilativeScore)
              currentRoll++
          } else {
              cumilativeScore = cumilativeScore + rollsList[currentRoll]
              currentRoll++
              if (rollsList[currentRoll] + rollsList[currentRoll - 1] == 10) { // Its a spare
                  cumilativeScore = cumilativeScore + rollsList[currentRoll]
                  cumilativeScore = cumilativeScore + rollsList[currentRoll + 1]
                  scoreList.push(cumilativeScore)
                  currentRoll++
              } else {
                  cumilativeScore = cumilativeScore + rollsList[currentRoll]
                  scoreList.push(cumilativeScore)
                  currentRoll++
              }
          }
      }

      // 10th frame
      for (let i = currentRoll; i < rollsList.length; i++) {
          cumilativeScore = cumilativeScore + rollsList[i]
      }
      scoreList.push(cumilativeScore)

      return scoreList
    }

    const selectGame = (symbolsList) => {
      console.log("selecting game")
      console.log(symbolsList)
      console.log(typeof symbolsList)
      navigation.navigate('EnterScore', {
        symbolsSubmitted: JSON.stringify(symbolsList)
    })
    }

    return (
        <View style={styles.container}>
          {/* Main Content Container */}
          <ScrollView style={styles.contentContainer}>
                <Text style={styles.headerText}>Select Your Game</Text>
                <Text style={styles.dateText}>Multiple games were found</Text>

                {symbolsLists.map((item, index) => (
                  <Scorecard 
                    key={index}
                    symbols={symbolsLists[index]}
                    scores={handleScoresList(symbolsLists[index])}
                    highlightedFrame={0}
                    onPress={()=>selectGame(symbolsLists[index])}
                  ></Scorecard>
                ))}
          </ScrollView>
        </View>
      );
}

let font = 'Avenir'
let heavyFont = 'Avenir-Heavy'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2a2b4c',
        alignItems:'center'
      },
      contentContainer: {
        // borderColor:'white', // use for spacial reasoning purposes
        // borderWidth:'1px',
        width:'90%',
      },
      
      headerText: {
        color:'white',
        fontSize:30,
        fontFamily: heavyFont
      },

      dateText: {
        marginLeft:2,
        color:'white',
        fontSize:13,
        fontFamily:font
      },

      planSectionHeaderText: {
        marginTop:30,
        marginLeft:5,
        color:'white',
        fontSize:20,
        fontFamily: heavyFont
      },

      statsContainer: {
        marginTop:4,
        padding:5,
        width:'100%',
        backgroundColor:'#353666',
        borderRadius:10,
    
        // Align the boxes in the center
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        flexWrap: 'wrap',
      },

      statsContainerLeft: {
        width:'70%',
        padding:10,
      },

      statsContainerRight: {
        width:'30%',
        padding:10,
        alignItems: 'flex-end',
      },

      statTitleText: {
        color:'white',
        fontSize:15,
        fontFamily:font
      },

      buttonContainer: {
        marginTop:10,

        width:'100%',
        height:10,
        alignSelf:'center'
      },

      deleteButton: {
        width: 200,
        height:50,
        backgroundColor:'#353666',
        borderRadius:10,

        alignSelf:'center',
        alignItems:'center',
        justifyContent:'center'
      },

      deleteText: {
        color: 'white',
        fontFamily: font
      }
});

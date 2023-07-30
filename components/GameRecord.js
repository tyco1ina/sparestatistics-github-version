import { StatusBar } from 'expo-status-bar';
import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import Scorecard from './Scorecard';

export default function GameRecord({ symbols, scores, score, date, sparePercent, onPress, isDefault }) {

    const extractDayAndMonth = (date) => {
      const monthDayPart = date.substring(0, date.lastIndexOf('/'));
      return monthDayPart
    }

    if (isDefault) {
      return (
        <View style={styles.gameContainerDefault}>
          <View style={styles.datePortion}>
            <Text style={styles.dateText}>Date</Text>
          </View>
          <View style={styles.scorePortion}>
          <Text style={styles.scoreText}>Score</Text>
          </View>
        </View>
    )
    }

    return (
        <TouchableOpacity style={styles.gameContainer} onPress={onPress}>
          <View style={styles.datePortion}>
            <Text style={styles.dateText}>{date}</Text>
          </View>
          <View style={styles.scorePortion}>
          <Text style={styles.scoreText}>{score}</Text>
          </View>
        </TouchableOpacity>
    )
}

let font = 'Avenir'
let heavyFont = 'Avenir-Heavy'

const styles = StyleSheet.create({
      gameContainer: {
        height:50,
        padding:5,
        width:'100%',
        borderTopColor:'white',
        borderTopWidth:0.5,

        // Align the boxes in the center
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        flexWrap: 'wrap',
      },

      gameContainerDefault: {
        height:50,
        padding:5,
        width:'100%',

        // Align the boxes in the center
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        flexWrap: 'wrap',
      },

      datePortion: {
        width:'50%',
        height:'100%',
        justifyContent:'center'
      },

      dateText: {
        color:'white',
        fontSize:17,
        fontFamily:heavyFont
      },

      scorePortion: {
        width:'50%',
        height:'100%',
        justifyContent:'center',
        alignItems:"flex-end"
      },

      scoreText: {
        color:'white',
        fontSize:17,
        fontFamily:heavyFont
      }
});

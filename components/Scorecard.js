import { StatusBar } from 'expo-status-bar';
import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';

export default function Scorecard({ symbols, scores, highlightedFrame, onPress }) {

    renderHeaderHighlight = (frame) => {
        if (frame === highlightedFrame) {
            return {
                backgroundColor:'#36cfdf',
                height:30,
                width:'10%',
                justifyContent:'center',
                
            }
        } else {
            return {
                backgroundColor:'#353666',
                height:30,
                width:'10%',
                justifyContent:'center'
            }
        }
    }

    renderFrameHighlight = (frame) => {
        if (frame === highlightedFrame) {
            return {
                width:'10%',
                backgroundColor:'#36cfdf',
                height:40,
                justifyContent:'center'
            }
        } else {
            return {
                width:'10%',
                backgroundColor:'#353666',
                height:40,
                justifyContent:'center'
            }
        }
    }

    const checkIfNaN = (frame) => {
        if (isNaN(scores[frame])) {
            return ""
        } else {
            return scores[frame]
        }
    }

    const handlePress = () => {
        if (onPress !== undefined) {
            onPress()
        }
    }

    return (
        <TouchableOpacity style={styles.scorecardContainer} onPress={handlePress}>
          <View style={renderHeaderHighlight(1)}><Text style={styles.frameText}>1</Text></View>
          <View style={renderHeaderHighlight(2)}><Text style={styles.frameText}>2</Text></View>
          <View style={renderHeaderHighlight(3)}><Text style={styles.frameText}>3</Text></View>
          <View style={renderHeaderHighlight(4)}><Text style={styles.frameText}>4</Text></View>
          <View style={renderHeaderHighlight(5)}><Text style={styles.frameText}>5</Text></View>
          <View style={renderHeaderHighlight(6)}><Text style={styles.frameText}>6</Text></View>
          <View style={renderHeaderHighlight(7)}><Text style={styles.frameText}>7</Text></View>
          <View style={renderHeaderHighlight(8)}><Text style={styles.frameText}>8</Text></View>
          <View style={renderHeaderHighlight(9)}><Text style={styles.frameText}>9</Text></View>
          <View style={renderHeaderHighlight(10)}><Text style={styles.frameText}>10</Text></View>

          <View style={renderFrameHighlight(1)}><Text style={styles.frameText}>{symbols[0]}</Text></View>
          <View style={renderFrameHighlight(2)}><Text style={styles.frameText}>{symbols[1]}</Text></View>
          <View style={renderFrameHighlight(3)}><Text style={styles.frameText}>{symbols[2]}</Text></View>
          <View style={renderFrameHighlight(4)}><Text style={styles.frameText}>{symbols[3]}</Text></View>
          <View style={renderFrameHighlight(5)}><Text style={styles.frameText}>{symbols[4]}</Text></View>
          <View style={renderFrameHighlight(6)}><Text style={styles.frameText}>{symbols[5]}</Text></View>
          <View style={renderFrameHighlight(7)}><Text style={styles.frameText}>{symbols[6]}</Text></View>
          <View style={renderFrameHighlight(8)}><Text style={styles.frameText}>{symbols[7]}</Text></View>
          <View style={renderFrameHighlight(9)}><Text style={styles.frameText}>{symbols[8]}</Text></View>
          <View style={renderFrameHighlight(10)}><Text style={styles.frameText}>{symbols[9]}</Text></View>

          <View style={renderFrameHighlight(1)}><Text style={styles.frameText}>{checkIfNaN(0)}</Text></View>
          <View style={renderFrameHighlight(2)}><Text style={styles.frameText}>{checkIfNaN(1)}</Text></View>
          <View style={renderFrameHighlight(3)}><Text style={styles.frameText}>{checkIfNaN(2)}</Text></View>
          <View style={renderFrameHighlight(4)}><Text style={styles.frameText}>{checkIfNaN(3)}</Text></View>
          <View style={renderFrameHighlight(5)}><Text style={styles.frameText}>{checkIfNaN(4)}</Text></View>
          <View style={renderFrameHighlight(6)}><Text style={styles.frameText}>{checkIfNaN(5)}</Text></View>
          <View style={renderFrameHighlight(7)}><Text style={styles.frameText}>{checkIfNaN(6)}</Text></View>
          <View style={renderFrameHighlight(8)}><Text style={styles.frameText}>{checkIfNaN(7)}</Text></View>
          <View style={renderFrameHighlight(9)}><Text style={styles.frameText}>{checkIfNaN(8)}</Text></View>
          <View style={renderFrameHighlight(10)}><Text style={styles.frameText}>{checkIfNaN(9)}</Text></View>
        </TouchableOpacity>
    )
}

let font = 'Avenir'
let heavyFont = 'Avenir-Heavy'

const styles = StyleSheet.create({
    scorecardContainer: {
        marginTop:10,
        width: '100%',
        borderWidth:1,
        borderColor:'white',

        // Inline block the contents

        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        flexWrap: 'wrap',
    },
    frameHeader: {
        // borderBottomWidth:1,
        // borderBottomColor:'white',
        height:30,
        width:'10%',
        justifyContent:'center'
    },
    frameText: {
        color:'white',
        textAlign:'center',
        fontFamily: font
    },

    upperFrame: {
        width:'10%',
        height:40,
        justifyContent:'center'
    },

    lowerFrame: {
        width:'10%',
        height:40,
        justifyContent:'center'
    }
});

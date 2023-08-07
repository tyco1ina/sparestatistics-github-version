import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import { useState, useRef } from 'react';
import Scorecard from '../components/Scorecard';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function SelectGamePage({ navigation, route }) {

    const { symbolsLists } = route.params;

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
                    scores={['','','','','','','','','','']}
                    highlightedFrame={0}
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

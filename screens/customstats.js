import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import GameRecord from '../components/GameRecord';
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType, RewardedInterstitialAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function CustomStatsPage() {

  const [userGames, setUserGames] = useState(null)
  const [textInput, setTextInput] = useState("")
  const [textInputLength, setTextInputLength] = useState(0)
  const [responseText, setResponseText] = useState("")

  const loadGames = async () => {
    try {
      console.log("GETTING GAMES")
      let games = await AsyncStorage.getItem("games")

      if (games !== null) {
        console.log("GAMES")
        console.log(games)
        setUserGames(JSON.parse(games).reverse())
      }
    } catch (error) {
      alert(error)
    }
  }

  const handleChangeText = (newText) => {
    setTextInput(newText)
    setTextInputLength(newText.length)
  }

  const submitPrompt = () => {
    console.log(textInput)
  }

  useEffect(() => {
    loadGames()
  }, []);

  return (
    <View style={styles.container}>
      {/* Main Content Container */}
      <ScrollView style={styles.contentContainer}>
            <Text style={styles.headerText}>Custom Stats</Text>
            <Text style={styles.directionsText}>Calculate custom game statistics for your last 6 games with the power of AI. Be descriptive for best results. </Text>

            {/* Prompt section */}
            <Text style={styles.sectionHeaderText}>Prompt</Text>
            <Text style={styles.charCount}>({textInputLength}/100)</Text>
            <View style={styles.promptContainer}>
                <TextInput onChangeText={handleChangeText} value={textInput} maxLength={100} multiline style={styles.promptInput}>

                </TextInput>
                <TouchableOpacity style={styles.promptEnterButton} onPress={submitPrompt}>
                    <Text style={styles.promptEnterButtonText}>Enter</Text>
                </TouchableOpacity>
            </View>

            {/* Recent prompts */}
            <Text style={styles.recentPromptHeader}>Use a Recent Prompt</Text>
            <TouchableOpacity style={styles.recentPromptButton}>

            </TouchableOpacity>
            <TouchableOpacity style={styles.recentPromptButton}>

            </TouchableOpacity>
            <TouchableOpacity style={styles.recentPromptButton}>

            </TouchableOpacity>


            {/* Response */}
            <Text style={styles.sectionHeaderText}>Response</Text>
            <View style={styles.responseOutput}>

            </View>
            <Text style={styles.warningText}>(May occasionally generate incorrect information)</Text>


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

      directionsText: {
        margin:10,
        color:'white',
        fontSize:15,
        fontWeight: '400',
        fontFamily: font
      },

      sectionHeaderText: {
        marginTop:10,
        color:'white',
        fontSize:20,
        fontFamily: heavyFont
      },
      
      promptContainer: {
        width:'100%',
        height:100,

        // Align the boxes in the center
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        flexWrap: 'wrap',
      },

      promptInput: {
        marginTop:10,
        marginRight: '2%',
        padding:10,
        width:'68%',
        height: 80,
        backgroundColor:'#353666',
        borderRadius:10,
        color: 'white'
      },

      promptEnterButton: {
        marginTop:10,
        marginleft:10,
        padding:5,
        width:'30%',
        height: 80,
        backgroundColor:'#353666',
        borderRadius:10,
    
        alignItems: 'center',
        justifyContent: 'center',
      },

      promptEnterButtonText: {
        color:'white',
        fontFamily:heavyFont
      },

      recentPromptHeader: {
        color:'white',
        fontFamily:heavyFont,
      },

      recentPromptButton: {
        marginTop: 5,
        width:'100%',
        height: 40,
        backgroundColor:'#353666',
        borderRadius:10,
      },

      responseOutput: {
        marginTop:5,
        padding:10,
        width:'100%',
        height: 90,
        backgroundColor:'#353666',
        borderRadius:10,
      },
      warningText: {
        color:'white',
        marginLeft:1,
        fontSize:8
      },

      charCount: {
        color:'white',
        fontSize:10
      }
});

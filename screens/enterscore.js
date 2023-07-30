import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import Scorecard from '../components/Scorecard';
import { useState, useRef, useEffect } from 'react';
// import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType, RewardedInterstitialAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { getScore, getNumSpares, getNumStrikes, getNumOpens, getAvgFirstBallPinfall, getSpareConvertPercent, getOnePinConvertPercent, getAvgScoreDifference, getBestFrame, getWorstFrame, verifyTenthFrame } from './statsUtility';
import AsyncStorage from '@react-native-async-storage/async-storage'
// import * as ImagePicker from 'expo-image-picker'
import { v4 as uuidv4 } from 'uuid'

export default function EnterScorePage({ navigation, route }) {

    const { symbolsSubmitted } = route.params;

    const frameInputRef = useRef(null);

    let symbolsFromCapture = []
    if (symbolsSubmitted === "manual") {
        symbolsFromCapture = ['','','','','','','','','','']
    } else {
        symbolsFromCapture = JSON.parse(symbolsSubmitted)
    }

    let [symbols, setSymbols] = useState(symbolsFromCapture)
    let [currentFrame, setCurrentFrame] = useState(1)
    let [currentFrameSymbolInput, setCurrentFrameSymbolInput] = useState('')
    let [submittingGame, setSubmittingGame] = useState(false);
    let [hasGalleryPermissions, setHasGalleryPermissions] = useState(null)
    let [image, setImage] = useState(null)
    let [uploadingImage, setUploadingImage] = useState(false)

    let leftArrow = "<"
    let rightArrow = ">"

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

  let [scores, setScores] = useState(handleScoresList(symbolsFromCapture))

    const updateCurrentFrame = (direction) => {
        if (direction === 'left' && currentFrame === 1) {
            return
        }

        if (direction === 'right' && currentFrame === 10) {
            return
        }

        if (direction === 'right') {
            setCurrentFrame(currentFrame + 1)
        } else {
            setCurrentFrame(currentFrame - 1)
        }
    }

    const handleSymbolChange = (text) => {
      setCurrentFrameSymbolInput(text)
    }

    const handleSymbolChangeSubmit = (strike) => {
      let newSymbols = []
      let inputValue = currentFrameSymbolInput;

      for (let i = 0; i < symbols.length; i++) {
        if (i === currentFrame - 1) {
          if (strike) {
            newSymbols.push("X")  
          } else {
            newSymbols.push(inputValue)
          }
        } else {
          newSymbols.push(symbols[i])
        }
      }
      setSymbols(newSymbols)
      setScores(handleScoresList(newSymbols))
      updateCurrentFrame('right')
    }

    const verifyFrame = (symbol, isTenth) => {
      if (!isTenth) {
        let total = 0
        if (symbol === "X") {
          return true
        } else {
          if (symbol.length !== 2) {
            return false
          }

          let rolls = ['-', '1', '2', '3', '4', '5', '6', '7', '8', '9']

          if (!rolls.includes(symbol[0])) {
            return false
          }

          if (symbol[0] !== "-") {
            total = total + parseInt(symbol[0])
          }

          if (symbol[1] === "/") {
            return true
          }

          if (symbol[1] === "-") {
            total = total + 0
          } else {
            total = total + parseInt(symbol[1])
          }

          if (total < 10) {
            return true
          } else {
            return false
          }

        }
      }

      return verifyTenthFrame(symbol)
    }

    const showAlert = () => {
      Alert.alert(
        'Unable to Submit',
        'One or more frames is invalid.',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') }
        ],
        { cancelable: false }
      );
    };

    const saveGame = async (game) => {
      try {
        let games = await AsyncStorage.getItem("games")
        games = JSON.parse(games)
        games.push(game)
        await AsyncStorage.setItem("games", JSON.stringify(games))
      } catch (err) {
        alert(err)
      }
    }

    const handleSubmit = async () => {

      if (submittingGame) {
        return
      }

      setSubmittingGame(true)

      for (let i = 0; i < symbols.length; i++) {
        if (i == 9) {
          if (!verifyFrame(symbols[9], true)) {
            showAlert()
            setSubmittingGame(false)
            return
          }
        } else {
          if (!verifyFrame(symbols[i], false)) {
            showAlert()
            setSubmittingGame(false)
            return
          }
        }
      }
      /*
      Game data example
      {
        id: 1234567890,
        score: 205,
        symbolsList: [whatever],
        scoresList: [whatever],

        strikes: 6
        spares: 4
        opens: 1
        spareConvertPercent: 80
        avgFirstBallPinfall: 9.4
        onePinConvertPercent: 66

        avgScoreDifference: 20.5
        worstFrame: 8 (null if there is a tie)
        bestFrame: null (null if there is a tie)
      }
      */

      // Create a new Date object
      var currentDate = new Date();

      // Get the current date
      var date = currentDate.getDate();

      // Get the current month (Note: January is 0, February is 1, and so on)
      var month = currentDate.getMonth() + 1; // Adding 1 to match the human-readable format

      // Get the current year
      var year = currentDate.getFullYear();

      // Output the date in a desired format

      let data = {
        id: uuidv4(),

        date: month + "/" + date + "/" + year,
        score: parseInt(getScore(scores)),
        symbolsList: symbols,
        scoresList: scores,

        strikes: getNumStrikes(symbols),
        spares: getNumSpares(symbols),
        opens: getNumOpens(symbols),
        spareConvertPercent: getSpareConvertPercent(symbols),
        avgFirstBallPinfall: parseFloat(getAvgFirstBallPinfall(symbols)),
        onePinConvertPercent: parseInt(getOnePinConvertPercent(symbols)),

        avgScoreDifference: parseInt(getAvgScoreDifference(scores)),
        bestFrame: getBestFrame(scores),
        worstFrame: getWorstFrame(scores)
      }

      saveGame(data)

      const url = 'https://8l5amkvz24.execute-api.us-east-1.amazonaws.com/prod/strikezone-put-game';
        try {

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify(data)
            })

            if (response.status === 200) {
                const result = await response.text();

                Alert.alert(
                  'Game Saved',
                  'Your game has been saved.',
                  [
                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                  ],
                  { cancelable: false }
                );
            } else {
                console.log('Error uploading game. Status code:', response.status);
                console.log(response)
            }
        } catch (error) {
            console.log('Error uploadgin game:', error);
        }

        setSubmittingGame(false)
    }

    const renderCorrectSubmitButton = () => {
      if (!submittingGame) {
        return {
          marginTop: 20,
          alignSelf:'center',
          backgroundColor:'#353666',
          height:50,
          width:200,
          borderRadius: 10,
          justifyContent:'center'
        }
      } else {
        return {
          marginTop: 20,
          alignSelf:'center',
          backgroundColor:'#28284dff',
          height:50,
          width:200,
          borderRadius: 10,
          justifyContent:'center'
        }
      }
    }

    const renderCorrectUploadButton = () => {
      if (!uploadingImage) {
        return {
          marginBottom: 10,

          backgroundColor:'#353666',
          height:45,
          width:170,
          borderRadius: 10,
          justifyContent:'center'
        }
      } else {
        return {
          marginBottom: 10,
          backgroundColor:'#28284dff',
          height:45,
          width:170,
          borderRadius: 10,
          justifyContent:'center'
        }
      }
    }

    const renderCorrectSubmitText = () => {
      if (!submittingGame) {
        return "Submit"
      } else {
        return "Submitting..."
      }
    }

    const renderCorrectUploadText = () => {
      if (!uploadingImage) {
        return "Upload Image"
      } else {
        return "Uploading..."
      }
    }

    useEffect(() => {
      (async () => {
        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
        setHasGalleryPermissions(galleryStatus.status === 'granted')
      })
    })

    const pickImage = async () => {

      if (uploadingImage) {
        return
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1
      })

      console.log(result)

      if (!result.canceled) {
        setImage(result.uri)
        uploadImage(result.uri)
      }
    }

    const uploadImage = async (imageUri) => {
      const url = 'https://8l5amkvz24.execute-api.us-east-1.amazonaws.com/prod/sparestatistics-full-image-uploader';
      const response = await fetch(imageUri)
      const imgBlob = await response.blob()

      try {

          setUploadingImage(true)
          const response = await fetch(url, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/octet-stream'
              }, 
              body: imgBlob
          })

          if (response.status === 200) {
              const result = await response.text();
              console.log(result);

              if (result === "Reading scorecard was unsuccessful") {
                  setUploadingImage(false)
                  return
              }

              setSymbols(JSON.parse(result))
              setScores(handleScoresList(JSON.parse(result)))
              setUploadingImage(false)
          } else {
              console.log('Error uploading image. Status code:', response.status);
              console.log(response)
              setUploadingImage(false)
          }
      } catch (error) {
          console.log('Error reading file:', error);
          setUploadingImage(false)
      }
  };

  return (
    
    <View style={styles.container}>
      {/* Main Content Container */}
      <ScrollView style={styles.contentContainer}>

            {/* Describe the scorecard */}
            <Text style={styles.headerText}>Enter a Score</Text>
            <TouchableOpacity style={renderCorrectUploadButton()} onPress={() => pickImage()}>
              <Text style={styles.submitButtonText}>{renderCorrectUploadText()}</Text>
            </TouchableOpacity>

            <Scorecard symbols={symbols} scores={scores} highlightedFrame={currentFrame}></Scorecard>

            {/* Frame Input */}
            <View style={styles.frameInputContainer}>
                <View style={styles.frameInputContainerLeft}>
                    <TouchableOpacity style={styles.arrowButton} onPress={()=>{updateCurrentFrame('left')}}><Text style={styles.arrowButtonText}>{leftArrow}</Text></TouchableOpacity>
                    <View style={styles.frameInput}><Text style={styles.frameInputText}>{currentFrame}</Text></View>
                    <TouchableOpacity style={styles.arrowButton} onPress={()=>{updateCurrentFrame('right')}}><Text style={styles.arrowButtonText}>{rightArrow}</Text></TouchableOpacity>
                </View>
                <View style={styles.frameInputContainerRight}>
                    <TextInput onSubmitEditing={()=>handleSymbolChangeSubmit(false)} onChangeText={handleSymbolChange} style={styles.symbolsInput}>{symbols[currentFrame - 1]}</TextInput>
                    <TouchableOpacity style={styles.symbolsInputEnter} onPress={() => {handleSymbolChangeSubmit(false)}}><Text style={styles.symbolsInputButtonText}>Enter</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.symbolsInputEnterX} onPress={() => {handleSymbolChangeSubmit(true)}}><Text style={styles.symbolsInputButtonTextX}>X</Text></TouchableOpacity>
                </View>
            </View>

            {/* <View style={styles.adContainer}> 
              <BannerAd
                unitId={TestIds.BANNER}
                size={BannerAdSize.LARGE_BANNER}
                requestOptions={{
                  requestNonPersonalizedAdsOnly: true
                }}
              />
            </View> */}

            {/* Basic Stats */}
            <Text style={styles.statsSectionHeaderText}>Your Game at a Glance</Text>
            <View style={styles.basicStatsContainer}>
                <View style={styles.statsContainerBox}>
                    <Text style={styles.statsContainerBoxNumber}>{getScore(scores)}</Text>
                    <Text style={styles.statsContainerBoxDesc}>Score</Text>
                </View>
                <View style={styles.statsContainerBox}>
                    <Text style={styles.statsContainerBoxNumber}>{getSpareConvertPercent(symbols)}</Text>
                    <Text style={styles.statsContainerBoxDesc}>Spare Conversion %</Text>
                </View>
                <View style={styles.statsContainerBox}>
                    <Text style={styles.statsContainerBoxNumber}>{getAvgFirstBallPinfall(symbols)}</Text>
                    <Text style={styles.statsContainerBoxDesc}>Avg First Ball Pinfall</Text>
                </View>
                <View style={styles.statsContainerBox}>
                    <Text style={styles.statsContainerBoxNumber}>{getNumStrikes(symbols)}</Text>
                    <Text style={styles.statsContainerBoxDesc}># Strikes</Text>
                </View>
                <View style={styles.statsContainerBox}>
                    <Text style={styles.statsContainerBoxNumber}>{getNumSpares(symbols)}</Text>
                    <Text style={styles.statsContainerBoxDesc}># Spares</Text>
                </View>
                <View style={styles.statsContainerBox}>
                    <Text style={styles.statsContainerBoxNumber}>{getNumOpens(symbols)}</Text>
                    <Text style={styles.statsContainerBoxDesc}># Opens</Text>
                </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={renderCorrectSubmitButton()} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>{renderCorrectSubmitText()}</Text>
            </TouchableOpacity>
      </ScrollView>
    </View>
  )
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

      uploadImageButton: {
        marginBottom: 10,

        backgroundColor:'#353666',
        height:40,
        width:200,
        borderRadius: 10,
        justifyContent:'center'
      },  

      frameInputContainer: {
        marginTop:30,
        width: '100%',

        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        flexWrap: 'wrap',
      },

      frameInputContainerLeft: {
        marginTop:30,

        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        flexWrap: 'wrap',
      },

      frameInput: {
        width:50,
        height:50,
        justifyContent:'center',
        alignItems:'center'
      },

      frameInputText: {
        color:'white',
        fontSize:20,
        fontFamily: font
      },

      arrowButton: {
        width:30,
        height:50,
        backgroundColor:'#353666',
        borderRadius:10,

        justifyContent:'center',
        alignItems:'center'
      },

      arrowButtonText: {
        color:'white'
      },

      frameInputContainerRight: {
        marginLeft: 30,
        marginTop:30,

        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        flexWrap: 'wrap',
      },

      symbolsInput: {
        width:50,
        height:50,
        justifyContent:'center',
        textAlign:'center',
        color:'white',
        borderWidth:1,
        borderColor:'white',
        borderRadius:10,
        fontSize:20,
        fontFamily: font
      },

      symbolsInputEnter: {
        marginLeft: 10,
        width:90,
        height:50,
        backgroundColor:'#353666',
        borderRadius:10,

        justifyContent:'center',
        alignItems:'center'
      },

      symbolsInputEnterX: {
        marginLeft: 10,
        width:50,
        height:50,
        backgroundColor:'#353666',
        borderRadius:10,

        justifyContent:'center',
        alignItems:'center'
      },

      symbolsInputButtonText: {
        color:'white',
        fontSize:14,
        fontFamily: font
      },

      symbolsInputButtonTextX: {
        color:'white',
        fontSize:20,
        fontFamily: font
      },

      adContainer: {
        marginTop:10,
        padding:10,
        width:'100%',
        backgroundColor:'#353666',
        borderRadius:10,
    
        // Align the boxes in the center
        alignItems: 'center',
      },

      statsSectionHeaderText: {
        marginTop:30,
        color:'white',
        fontSize:20,
        fontFamily: heavyFont
      },
    
      basicStatsContainer: {
        marginTop:10,
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
    
      statsContainerBox: {
        width:'25%',
        height:100,
        margin:10,
        // Align number and desc in the center
        alignItems: 'center',
        justifyContent: 'center',
      },
    
      statsContainerBoxNumber: {
        color:'white',
        fontSize:30,
        fontFamily: font,
      },
    
      statsContainerBoxDesc: {
        color:'gray',
        fontSize:13,
        fontFamily: font,
        textAlign:'center'
      },

      submitButton: {
        marginTop: 20,
        alignSelf:'center',
        backgroundColor:'#353666',
        height:50,
        width:200,
        borderRadius: 10,
        justifyContent:'center'
      },

      submitButtonText: {
        fontSize:15,
        alignSelf:'center',
        color:'white',
        fontFamily: heavyFont
      }
    }
)
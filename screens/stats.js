import { StatusBar } from 'expo-status-bar';
import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { calcAvgMetric, findMedian, findBest } from './statsUtility';
import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';
import Purchases from 'react-native-purchases';
import { API_KEY, ENTITLEMENT_ID } from '../constants';

export default function StatsPage({ navigation }) {
  
    const [numGames, setNumGames] = useState(3)
    const [globalGameData, setGlobalGameData] = useState([])
    const [numLastGames, changeNumLastGames] = useState(3)
    const [userGameData, setUserGameData] = useState({
      "average": "N/A",
      "median": "N/A",
      "highScore": "N/A",
      "avgStrikesPerGame": "N/A",
      "avgSparesPerGame": "N/A",
      "avgOpensPerGame": "N/A",
      "avgSpareConvertPercent": "N/A",
      "avgFirstBallPinfall": "N/A",
      "avgOnePinConvertPercent": "N/A",
      "avgBestFrame": "N/A",
      "avgWorstFrame" : "N/A",
      "avgScoreDiff": "N/A"
    })
    const [userGames, setUserGames] = useState([])
    const [interstitialLoaded, setInterstitialLoaded] = useState(false)
    const [plan, setPlan] = useState('basic')

    // Navigates to the correct page
    const navigate = (loc) => {
        navigation.navigate(loc)
    }

    // Fetch global game data from the backend
    const fetchData = async () => {
      const resp = await fetch("https://8l5amkvz24.execute-api.us-east-1.amazonaws.com/prod/get-all-game-data")
      const data = await resp.json()
      setGlobalGameData(data)
    };

    // If this is the first time the user is opening the app, save the necessary things in storage
    const initializeApp = async () => {
      const firstTime = await AsyncStorage.getItem("firstTime5")
      if (firstTime === null) {
        AsyncStorage.setItem("firstTime5", "no")
        AsyncStorage.setItem("games", JSON.stringify([]))
        AsyncStorage.setItem("uploadsRemaining", "5")
      }
    }

    /*
    Function to calculate the game statistics shown on the screen
    Input: Number of games to show
    Output: Nothing
    */
    const calculateGameStats = async (numGamesSetting) => {

      try {
        let games = await AsyncStorage.getItem("games")
  
        if (games !== null) {
          games = JSON.parse(games)
          setUserGames(games)

          // Set the average
          let userGameDataTemp = userGameData
          userGameDataTemp['average'] = calcAvgMetric(games, 'score', numGamesSetting)
          userGameDataTemp['median'] = findMedian(games, numGamesSetting)
          userGameDataTemp['highScore'] = findBest(games, numGamesSetting)

          userGameDataTemp['avgStrikesPerGame'] = calcAvgMetric(games, 'strikes', numGamesSetting)
          userGameDataTemp['avgSparesPerGame'] = calcAvgMetric(games, 'spares', numGamesSetting)
          userGameDataTemp['avgOpensPerGame'] = calcAvgMetric(games, 'opens', numGamesSetting)
          userGameDataTemp['avgSpareConvertPercent'] = calcAvgMetric(games, 'spareConvertPercent', numGamesSetting)
          userGameDataTemp['avgFirstBallPinfall'] = calcAvgMetric(games, 'avgFirstBallPinfall', numGamesSetting)
          userGameDataTemp['avgOnePinConvertPercent'] = calcAvgMetric(games, 'onePinConvertPercent', numGamesSetting)

          userGameDataTemp['avgBestFrame'] = calcAvgMetric(games, 'bestFrame', numGamesSetting)
          userGameDataTemp['avgWorstFrame'] = calcAvgMetric(games, 'worstFrame', numGamesSetting)
          userGameDataTemp['avgScoreDiff'] = calcAvgMetric(games, 'avgScoreDifference', numGamesSetting)

          setUserGameData(userGameDataTemp)
          return userGameDataTemp
        } else {
        }
      } catch (error) {
        alert(error)
      }
    }

    // Updates the state of the number of games to calculate statistics for
    const updateNumGames = async (games) => {
      let gameStats = await calculateGameStats(games)
      setNumGames(games)
      setUserGameData(gameStats)
    }

    // Renders the correct color for the number of games buttons at the top
    const timeButtonCorrectRender = (button) => {
      if (button === numGames) {
          return {
            ...styles.timePeriodSwitchButton
        }
      } else {
        return styles.timePeriodSwitchButton
      }
    }

    
    // Determines whether or not to display the message describing global scores
    // If the user has the premium plan, the message is loaded
    const doRenderGlobalScoreDescription = () => {
      if (plan === 'pro') {
        return <Text style={{color:'white', fontFamily:font, marginTop:20}}>Global statistics are in parenthesis and are based on the last 1,000 games submitted worldwide.</Text>
      } else {
        return
      }
    }

    // Determines whether or not global metrics are rendered
    // If the user has the premium plan, the stat is loaded
    const doRenderGlobalScores = (metric) => {
      if (plan === 'pro') {
        return ` (${globalGameData[metric]})`
      } else {
        return ""
      }
    }

    // Check if the user has paid for pro
    const checkUserSubscription = async () => {

      // Configure the Purchases object
      await Purchases.configure({apiKey: API_KEY})

      // Get the customer info
      const purchaserInfo = await Purchases.getCustomerInfo()

      // If the user is subscribed, set the subscription state to pro
      if (typeof purchaserInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined") {
        setPlan('pro')
      } else {
        setPlan('basic')
      }
    }

    // useEffect for when the component is rendered for the first time
    useEffect(() => {
      // Get global game data
      fetchData();

      // Set the necessary things in storage if this is the first time the user is opening the app
      initializeApp();

      // Check whether or not the user is subscribed
      checkUserSubscription()

      // Calculate the game statistics
      calculateGameStats(numGames);
    }, []);

    // This block of code runs whenever the user navigates to this page
    useFocusEffect(
      React.useCallback(() => {
        // Calculate gameStats
        let gameStats = calculateGameStats(numGames);
        
        // Set user game data to game stats calculated on the previous line
        setUserGameData(gameStats)

        // Check if the user has subscribed
        checkUserSubscription()
      }, [])
    );

    const paidStats = () => {
      if (plan === 'pro') {
        return (
          <View>
            <Text style={styles2.planSectionHeaderText}>Game Dynamics</Text>
            <View style={styles2.statsContainer}>
                <View style={styles2.statsContainerLeft}>
                  <Text style={styles2.statTitleText}>Average First Ball Pinfall {plan == 'pro' ? "(" + globalGameData["avgFirstBallPinfall"] + ")": ""}</Text>
                    <Text style={styles2.statTitleText}>Average Frame Score Difference</Text>
                    <Text style={styles2.statTitleText}>Average Best Frame</Text>
                    <Text style={styles2.statTitleText}>Average Worst Frame</Text>
                </View>
                <View style={styles2.statsContainerRight}>
                    <Text style={styles2.statTitleText}>{userGameData['avgFirstBallPinfall']}</Text>
                    <Text style={styles2.statTitleText}>{userGameData['avgScoreDiff']}</Text>
                    <Text style={styles2.statTitleText}>{userGameData['avgBestFrame']}</Text>
                    <Text style={styles2.statTitleText}>{userGameData['avgWorstFrame']}</Text>
                </View>
            </View>
          </View>
        )
      } else {
        return(
          <View/>
        )
      }
    }

    // Render the statistics if the user has games
    // Otherwise, render a message encouraging the user to log a game
    const renderStatsIfGames = () => {
      console.log(globalGameData)
      if (userGames.length > 0) {
        return (
            <>
            
              {/* Option to switch between all time and weekly */}
              <View style={styles.timePeriodSwitchContainer}>
                  <Text style={styles.timePeriodSwitchButtonText2}>Games: </Text>

                  <View style={{paddingRight: 5}}><TextInput onChangeText={changeNumLastGames} value={numLastGames.toString()} style={styles.textBoxInput}/></View>

                  <TouchableOpacity style={timeButtonCorrectRender('all')} onPress={()=>{updateNumGames(numLastGames.toString().toLowerCase())}}>
                      <Text style={styles.timePeriodSwitchButtonText}>Enter</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={timeButtonCorrectRender('3')} onPress={()=>{updateNumGames('all')}}>
                      <Text style={styles.timePeriodSwitchButtonText}>All Games</Text>
                  </TouchableOpacity>
              </View>

              <Text style={styles2.planSectionHeaderText}>Essential Statistics</Text>
              <View style={styles2.statsContainer}>
                  <View style={styles2.statsContainerLeft}>
                    <Text style={styles2.statTitleText}>Average Score {plan == 'pro' ? "(" + globalGameData["average"] + ")": ""}</Text>
                      <Text style={styles2.statTitleText}>Median {plan == 'pro' ? "(" + globalGameData["median"] + ")": ""}</Text>
                      <Text style={styles2.statTitleText}>High Score {plan == 'pro' ? "(" + globalGameData["highScore"] + ")": ""}</Text>
                      <Text style={styles2.statTitleText}>Avg. Strikes/Game {plan == 'pro' ? "(" + globalGameData["avgStrikesPerGame"] + ")": ""}</Text>
                      <Text style={styles2.statTitleText}>Avg. Spares/Game {plan == 'pro' ? "(" + globalGameData["avgSparesPerGame"] + ")": ""}</Text>
                      <Text style={styles2.statTitleText}>Avg. Opens/Game {plan == 'pro' ? "(" + globalGameData["avgOpensPerGame"] + ")": ""}</Text>
                      <Text style={styles2.statTitleText}>Spare Conversion</Text>
                      <Text style={styles2.statTitleText}>Single Pin Convert % {plan == 'pro' ? "(" + globalGameData["avgSinglePinConvertPercent"] + ")": ""}</Text>
                  </View>
                  <View style={styles2.statsContainerRight}>
                      <Text style={styles2.statTitleText}>{userGameData['average']}</Text>
                      <Text style={styles2.statTitleText}>{userGameData['median']}</Text>
                      <Text style={styles2.statTitleText}>{userGameData['highScore']}</Text>
                      <Text style={styles2.statTitleText}>{userGameData['avgStrikesPerGame']}</Text>
                      <Text style={styles2.statTitleText}>{userGameData['avgSparesPerGame']}</Text>
                      <Text style={styles2.statTitleText}>{userGameData['avgOpensPerGame']}</Text>
                      <Text style={styles2.statTitleText}>{userGameData['avgSpareConvertPercent']}</Text>
                      <Text style={styles2.statTitleText}>{userGameData['avgOnePinConvertPercent']}</Text>
                  </View>
              </View>
              {paidStats()}              
            </> 
        )
      } else {
        return (
          <View style={styles.noGamesContainer}>
            <Text style={styles.noGamesHeader}>Save a new game to start seeing statistics about your bowling games</Text>
            <TouchableOpacity style={styles.noGameNewGameButton} onPress={()=>{navigation.navigate('EnterScoreSelect')}}>
              <Text style={styles.timePeriodSwitchButtonText}>New Game</Text>
            </TouchableOpacity>
          </View>
        )
      }
    }

  return (
    <View style={styles.container}>
        {/* Main Content Container */}
        <ScrollView style={styles.contentContainer}>
            <Text style={styles.headerText}>SpareStatistics</Text>
            <Text style={styles.versionText}>Beta 1.2.6</Text>

            {doRenderGlobalScoreDescription()}

            {renderStatsIfGames()}    

        </ScrollView>

        <View style={styles.statsPageFooter}>
          <TouchableOpacity style={styles.footerButton} onPress={()=>navigation.navigate("EnterScoreSelect")}>
              <Text style={styles.footerButtonText}>New Game</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={()=>{navigate('Games')}}>
              <Text style={styles.footerButtonText}>Games</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={()=>{
            navigation.navigate('Settings', {
              attemptMakePurchase: false
            })
            }}>
              <Text style={styles.footerButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
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
  versionText: {
    marginLeft:2,
    color:'white',
    fontSize:13,
    fontFamily: font
  },
  timePeriodSwitchContainer: {
    marginTop: 10,

    // borderColor:'white', // use for spacial reasoning purposes
    // borderWidth:'1px',
    width:'100%',
    height:50,

    // Align the two time period buttons in the center
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    flexWrap: 'wrap',
  },
  timePeriodSwitchButton: {
    margin:5,

    width:'30%',
    height:40,
    backgroundColor:'#353666',
    borderRadius:10,

    // Align text in the center of the button
    alignItems: 'center',
    justifyContent: 'center',
  },

  timePeriodSwitchButtonText: {
    color:'white',
    fontFamily: font,
  },

  timePeriodSwitchButtonText2: {
    color:'white',
    fontFamily: font,
    fontSize: 15
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
    fontFamily: font
  },

  statsContainerBoxDesc: {
    color:'gray',
    fontSize:11,
    textAlign:'center',
    fontFamily: font
  },

  strikesSparesStatsContainer: {
    marginTop:10,
    width:'100%',
    backgroundColor:'#353666',
    borderRadius:10,

    // Align the boxes in the center
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    flexWrap: 'wrap',
  },

  advancedStatsContainer: {
    marginTop:10,
    height:40,
    padding:5,
    width:'100%',
    backgroundColor:'#353666',
    borderRadius:10,

    // Align the boxes in the center
    alignItems: 'center',
    justifyContent: 'center',
  },

  advancedStatsContainerText: {
    color:'white',
    fontFamily: font
  },

  manageGameButtonContainer: {
    marginTop: 10,
    marginBottom: 30,

    // borderColor:'white', // use for spacial reasoning purposes
    // borderWidth:'1px',
    width:'100%',
    height:50,

    // Align the two time period buttons in the center
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    flexWrap: 'wrap',
  },

  statsPageFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80, // Set the desired height for the bottom view
    backgroundColor: '#0f0f0f', // Example background color
    // Add any additional styles for the bottom view here

    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    flexWrap: 'wrap',
  },

  footerButton: {
    marginTop:20,
    margin:5,

    width:'30%',
    height:40,
    backgroundColor:'#212121',
    borderRadius:10,

    // Align text in the center of the button
    alignItems: 'center',
    justifyContent: 'center',
  },

  footerButtonText: {
    color:'white',
    fontFamily: heavyFont
  },

  customStatsButton: {
    marginTop:15,
    alignSelf:'center',

    width:'60%',
    height:40,
    backgroundColor:'#353666',
    borderRadius:10,

    // Align text in the center of the button
    alignItems: 'center',
    justifyContent: 'center',
  },

  noGamesContainer: {
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

  noGamesHeader: {
    marginTop: 20,
    padding: 10,
    fontSize:15,
    fontFamily: heavyFont,
    color: 'white',
    textAlign:'center'
  },

  noGameNewGameButton: {
    margin:5,
    marginBottom:10,

    width:'50%',
    height:40,
    backgroundColor:'#353666',
    borderRadius:10,
    borderWidth: 1,
    borderColor: 'white',

    // Align text in the center of the button
    alignItems: 'center',
    justifyContent: 'center',
  },

  textBoxInput: {
    width:50,
    height:37,
    justifyContent:'center',
    textAlign:'center',
    color:'white',
    borderWidth:1,
    borderColor:'white',
    borderRadius:10,
    fontSize:20,
    fontFamily: font
  }
});

const styles2 = StyleSheet.create({
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

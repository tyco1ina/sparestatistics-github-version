import { StatusBar } from 'expo-status-bar';
import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { calcAvgMetric, findMedian, findBest } from './statsUtility';
import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';
import Purchases from 'react-native-purchases';
import { API_KEY, ENTITLEMENT_ID } from '../constants';

// const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
//   requestNonPersonalizedAdsOnly: true
// })

export default function StatsPage({ navigation }) {
  
    const [numGames, setNumGames] = useState(3)
    const [loading, setLoading] = useState(true);
    const [globalGameData, setGlobalGameData] = useState([])
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
    const [plan, setPlan] = useState('pro')

    /*
    The next two methods are navigation methods
    */
    const navigateToEnterScore = () => {
      navigation.navigate('EnterScore', {
          symbolsSubmitted: "manual"
      })
    }

    // Navigates to the correct page
    const navigate = (loc) => {

        if (loc === "EnterScore") {
          navigation.navigate('EnterScore', {
            symbolsSubmitted: "manual"
          })
        }
        navigation.navigate(loc)
    }

    const fetchData = async () => {
      const resp = await fetch("https://8l5amkvz24.execute-api.us-east-1.amazonaws.com/prod/get-all-game-data")
      const data = await resp.json()
      setGlobalGameData(data)
    };

    const initializeApp = async () => {
      // If this is the first time the user is opening the app, save the necessary things in storage
      const firstTime = await AsyncStorage.getItem("firstTime2")
      if (firstTime === null) {
        AsyncStorage.setItem("firstTime2", "no")
        AsyncStorage.setItem("games", JSON.stringify([]))
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
          margin:5,
      
          width:'30%',
          height:40,
          backgroundColor:'#36cfdf',
          borderRadius:10,
      
          // Align text in the center of the button
          alignItems: 'center',
          justifyContent: 'center',
        }
      } else {
        return {
              margin:5,
          
              width:'30%',
              height:40,
              backgroundColor:'#353666',
              borderRadius:10,
          
              // Align text in the center of the button
              alignItems: 'center',
              justifyContent: 'center',
      }
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
        setPlan('pro')
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
      if (plan == 'pro') {
        return (
          <View>
            <Text style={styles.statsSectionHeaderText}>Pro Stats</Text>
            <View style={styles.basicStatsContainer}>
                <View style={styles.statsContainerBox}>
                    <Text style={styles.statsContainerBoxNumber}>{userGameData['avgBestFrame']}</Text>
                    <Text style={styles.statsContainerBoxDesc}>Average Best Frame</Text>
                </View>
                <View style={styles.statsContainerBox}>
                    <Text style={styles.statsContainerBoxNumber}>{userGameData['avgWorstFrame']}</Text>
                    <Text style={styles.statsContainerBoxDesc}>Average Worst Frame</Text>
                </View>
                <View style={styles.statsContainerBox}>
                    <Text style={styles.statsContainerBoxNumber}>{userGameData['avgScoreDiff']}</Text>
                    <Text style={styles.statsContainerBoxDesc}>Average Score Difference</Text>
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
      if (userGames.length > 0) {
        return (
            <>

              {/* Option to switch between all time and weekly */}
              <View style={styles.timePeriodSwitchContainer}>
                  <TouchableOpacity style={timeButtonCorrectRender(3)} onPress={()=>{updateNumGames(3)}}>
                      <Text style={styles.timePeriodSwitchButtonText}>Last 3</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={timeButtonCorrectRender(6)} onPress={()=>{updateNumGames(6)}}>
                      <Text style={styles.timePeriodSwitchButtonText}>Last 6</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={timeButtonCorrectRender('all')} onPress={()=>{updateNumGames('all')}}>
                      <Text style={styles.timePeriodSwitchButtonText}>All games</Text>
                  </TouchableOpacity>
              </View>

              <Text style={styles.statsSectionHeaderText}>Basic Stats</Text>
              <View style={styles.basicStatsContainer}>
                  <View style={styles.statsContainerBox}>
                      <Text style={styles.statsContainerBoxNumber}>{userGameData['average']}</Text>
                      <Text style={styles.statsContainerBoxDesc}>Average{doRenderGlobalScores('avgGameScore')}</Text>
                  </View>
                  <View style={styles.statsContainerBox}>
                      <Text style={styles.statsContainerBoxNumber}>{userGameData['median']}</Text>
                      <Text style={styles.statsContainerBoxDesc}>Median</Text>
                  </View>
                  <View style={styles.statsContainerBox}>
                      <Text style={styles.statsContainerBoxNumber}>{userGameData['highScore']}</Text>
                      <Text style={styles.statsContainerBoxDesc}>High Score</Text>
                  </View>
              </View>

              <Text style={styles.statsSectionHeaderText}>Strikes, Spares, & Opens</Text>
              <View style={styles.strikesSparesStatsContainer}>
                  <View style={styles.statsContainerBox}>
                      <Text style={styles.statsContainerBoxNumber}>{userGameData['avgStrikesPerGame']}</Text>
                      <Text style={styles.statsContainerBoxDesc}>Avg. Strikes/Game{doRenderGlobalScores('avgStrikesPerGame')}</Text>
                  </View>
                  <View style={styles.statsContainerBox}>
                      <Text style={styles.statsContainerBoxNumber}>{userGameData['avgSparesPerGame']}</Text>
                      <Text style={styles.statsContainerBoxDesc}>Avg. Spares/Game{doRenderGlobalScores('avgSparesPerGame')}</Text>
                  </View>
                  <View style={styles.statsContainerBox}>
                      <Text style={styles.statsContainerBoxNumber}>{userGameData['avgOpensPerGame']}</Text>
                      <Text style={styles.statsContainerBoxDesc}>Avg. Opens/Game{doRenderGlobalScores('avgOpensPerGame')}</Text>
                  </View>
                  <View style={styles.statsContainerBox}>
                      <Text style={styles.statsContainerBoxNumber}>{userGameData['avgSpareConvertPercent']}</Text>
                      <Text style={styles.statsContainerBoxDesc}>Spare Conversion{doRenderGlobalScores('avgSpareConvertPercent')}</Text>
                  </View>
                  <View style={styles.statsContainerBox}>
                      <Text style={styles.statsContainerBoxNumber}>{userGameData['avgFirstBallPinfall']}</Text>
                      <Text style={styles.statsContainerBoxDesc}>Avg. 1st Ball Pinfall{doRenderGlobalScores('avgFirstBallPinfall')}</Text>
                  </View>
                  <View style={styles.statsContainerBox}>
                      <Text style={styles.statsContainerBoxNumber}>{userGameData['avgOnePinConvertPercent']}</Text>
                      <Text style={styles.statsContainerBoxDesc}>Single Pin Convert %{doRenderGlobalScores('avgOnePinConvertPercent')}</Text>
                  </View>
              </View>

              {paidStats()}
            </>
        )
      } else {
        return (
          <View style={styles.noGamesContainer}>
            <Text style={styles.noGamesHeader}>Save a new game to start seeing statistics about your bowling games</Text>
            <TouchableOpacity style={styles.noGameNewGameButton} onPress={()=>{navigateToEnterScore()}}>
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
            <Text style={styles.versionText}>Beta 1.2.5</Text>

            {doRenderGlobalScoreDescription()}

            {renderStatsIfGames()}

            

        </ScrollView>
      <View style={styles.statsPageFooter}>
        <TouchableOpacity style={styles.footerButton} onPress={navigateToEnterScore}>
            <Text style={styles.footerButtonText}>New Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={()=>{navigate('Games')}}>
            <Text style={styles.footerButtonText}>Games</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={()=>{navigate('Settings')}}>
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
    fontFamily: font
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
  }
});
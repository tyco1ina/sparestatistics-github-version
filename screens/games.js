import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useState } from 'react';
import GameRecord from '../components/GameRecord';
import { useEffect } from 'react';
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native';

export default function GamesPage({ navigation }) {

  const [userGames, setUserGames] = useState(null)

  const loadGames = async () => {
    try {
      let games = await AsyncStorage.getItem("games")

      if (games !== null) {
        setUserGames(JSON.parse(games).reverse())
      }
    } catch (error) {
      alert(error)
    }
  }

  const goToGame = async (gameIndex) => {
    navigation.navigate('Game', {
      gameToShow: userGames[gameIndex]
    })
  }

  const renderGames = () => {
    if (userGames !== null) {
      return userGames.map((item, index) => (
        <GameRecord key={index} onPress={()=>goToGame(index)} symbols={userGames[index]['symbolsList']} scores={userGames[index]['scoresList']} score={userGames[index]['score']} date={userGames[index]['date']} sparePercent={userGames[index]['spareConvertPercent']} highlightedFrame={0}/>
      ))
    } else {
      return
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      loadGames()
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Main Content Container */}
      <ScrollView style={styles.contentContainer}>
            <Text style={styles.headerText}>Your Games</Text>
            <Text style={styles.gamesDescriptionText}>Tap on a game to view more detailed statistics</Text>

            {/* <View style={styles.adContainer}> 
              <BannerAd
                unitId={TestIds.BANNER}
                size={BannerAdSize.LARGE_BANNER}
                requestOptions={{
                  requestNonPersonalizedAdsOnly: true
                }}
              />
            </View> */}

            {/* List the games */}
            <GameRecord isDefault={true}/>
            {renderGames()}
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

      gamesDescriptionText: {
        color:'white',
        fontFamily:font,
        marginLeft:2,
        marginBottom:20,
      },

      gameContainer: {
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

      adContainer: {
        marginTop:10,
        padding:10,
        width:'100%',
        backgroundColor:'#353666',
        borderRadius:10,
    
        // Align the boxes in the center
        alignItems: 'center',
      },
});

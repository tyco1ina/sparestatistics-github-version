import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import { useState, useRef } from 'react';
import Scorecard from '../components/Scorecard';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Icon } from '@rneui/themed';

export default function GamePage({ navigation, route }) {

    const { gameToShow } = route.params;

    const [currentPlan, setCurrentPlan] = useState("basic")
    const [deletingGame, setDeletingGame] = useState(false)

    const deleteGame = async (gameId) => {
      setDeletingGame(true)

      console.log(`Deleting game with gameId ${gameId}`)
      try {
        let games = await AsyncStorage.getItem("games")
        console.log("Printing games:")
        console.log(games)
        games = JSON.parse(games)

        let newGames = []
        for (let i = 0; i < games.length; i++) {
          if (games[i]['id'] === gameId) {
            console.log(`${games[i]['id']} and ${gameId} match, not adding`)
          } else {
            console.log(`${games[i]['id']} and ${gameId} do not match, adding`)
            newGames.push(games[i])
          }
        }      
        console.log(newGames)
        await AsyncStorage.setItem("games", JSON.stringify(newGames))

        navigation.goBack()

      } catch (err) {
        alert(err)
      }
    }

    const confirmGameDelete = () => {
      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete this game?',
        [
          {
            text: 'Delete',
            onPress: () => {
              // Handle the action for Option 1
              deleteGame(gameToShow['id'])
            },
          },
          {
            text: 'Cancel',
            onPress: () => {
              // Handle the action for Option 2
              console.log('Option 2 selected');
            },
          },
          // You can add more buttons if needed
          // { text: 'Option 3', onPress: () => console.log('Option 3 selected') },
        ],
        { cancelable: false } // Prevent dismissing the alert by tapping outside
      );
    }

    const renderCorrectDeleteButton = () => {
      if (deletingGame) {
        return {
          width: 200,
          height:50,
          backgroundColor:'#28284dff',
          borderRadius:10,

          alignSelf:'center',
          alignItems:'center',
          justifyContent:'center'
        }
      } else {
        return {
          width: 200,
          height:50,
          backgroundColor:'#353666',
          borderRadius:10,

          alignSelf:'center',
          alignItems:'center',
          justifyContent:'center'
        }
      }
    }

    const renderCorrectDeleteText = () => {
      if (deletingGame) {
        return "Deleting..."
      } else {
        return "Delete Game"
      }
    }

    return (
        <View style={styles.container}>
          {/* Main Content Container */}
          <ScrollView style={styles.contentContainer}>
                <View style={styles.headerSection}>
                  <Text style={styles.headerText}>Your Game</Text>
                </View>
                <Text style={styles.dateText}>on {gameToShow['date']}</Text>
                <Scorecard 
                    symbols={gameToShow['symbolsList']}
                    scores={gameToShow['scoresList']}
                    highlightedFrame={0}
                ></Scorecard>

                {/* Game Stats Container */}
                <Text style={styles.planSectionHeaderText}>Stats</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statsContainerLeft}>
                      <Text style={styles.statTitleText}>Score</Text>
                        <Text style={styles.statTitleText}>Average First Ball Pinfall</Text>
                        <Text style={styles.statTitleText}>Strikes</Text>
                        <Text style={styles.statTitleText}>Spares</Text>
                        <Text style={styles.statTitleText}>Opens</Text>
                        <Text style={styles.statTitleText}>Conversion %</Text>
                        <Text style={styles.statTitleText}>Single Pin Conversion %</Text>
                        <Text style={styles.statTitleText}>Best Frame</Text>
                        <Text style={styles.statTitleText}>Worst Frame</Text>
                    </View>
                    <View style={styles.statsContainerRight}>
                        <Text style={styles.statTitleText}>{gameToShow['score']}</Text>
                        <Text style={styles.statTitleText}>{gameToShow['avgFirstBallPinfall']}</Text>
                        <Text style={styles.statTitleText}>{gameToShow['strikes']}</Text>
                        <Text style={styles.statTitleText}>{gameToShow['spares']}</Text>
                        <Text style={styles.statTitleText}>{gameToShow['opens']}</Text>
                        <Text style={styles.statTitleText}>{gameToShow['spareConvertPercent']}</Text>
                        <Text style={styles.statTitleText}>{gameToShow['onePinConvertPercent']}</Text>
                        <Text style={styles.statTitleText}>{gameToShow['bestFrame']}</Text>
                        <Text style={styles.statTitleText}>{gameToShow['worstFrame']}</Text>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.deleteButton} onPress={confirmGameDelete}>
                    <Text style={styles.deleteText}>{renderCorrectDeleteText()}</Text>
                  </TouchableOpacity>
                </View>
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
        fontFamily: heavyFont,
        justifyContent: "flex-start"
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
      },

      headerSection: {
        flexDirection: "row"
      }
});

import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import { useState, useRef } from 'react';
import { Button } from 'react-native'
import { Auth } from 'aws-amplify';

export default function SettingsPage() {

    const [currentPlan, setCurrentPlan] = useState("basic")

    const renderPlanHighlight = (plan) => {
        if (plan === currentPlan) {
            return {
                marginTop:10,
                height:140,
                padding:5,
                width:'100%',
                backgroundColor:'#353666',
                borderRadius:10,
                borderWidth: 1,
                borderColor: "#36cfdf",
            
                // Align the boxes in the center
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection:'row',
                flexWrap: 'wrap',
              }
        } else {
            return {
                marginTop:10,
                height:140,
                padding:5,
                width:'100%',
                backgroundColor:'#353666',
                borderRadius:10,
            
                // Align the boxes in the center
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection:'row',
                flexWrap: 'wrap',
              }
        }
    }

    const signOut = () => {
      Auth.signOut()
    }

    return (
        <View style={styles.container}>
          {/* Main Content Container */}
          <ScrollView style={styles.contentContainer}>
                <Text style={styles.headerText}>Settings</Text>

                {/* Plan Settings */}
                <Text style={styles.planSectionHeaderText}>Your Plan</Text>
                <View style={renderPlanHighlight('basic')}>
                    <View style={styles.planContainerLeft}>
                        <Text style={styles.planText}>Basic</Text>
                    </View>
                    <View style={styles.planContainerRight}>
                        <Text style={styles.planDescText}>-Save unlimited games</Text>
                        {/* <Text style={styles.planDescText}>7 successful Strikezone Captures per week</Text> */}
                        <Text style={styles.planDescText}>-Access essential statistics</Text>
                    </View>
                </View>
                <View style={renderPlanHighlight('premium')}>
                    <View style={styles.planContainerLeft}>
                        <Text style={styles.planText}>Premium</Text>
                        <Text style={styles.planPriceText}>Coming soon</Text>
                    </View>
                    <View style={styles.planContainerRight}>
                        {/* <Text style={styles.planDescText}>7 successful Strikezone captures per day </Text> */}
                        <Text style={styles.planDescText}>-Compare your statistics to worldwide averages </Text>
                        <Text style={styles.planDescText}>-Access advanced, in-depth statistics </Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
                    <Text style={styles.signOutButtonText}>Sign Out</Text>
                </TouchableOpacity>

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

      planSectionHeaderText: {
        marginTop:30,
        color:'white',
        fontSize:20,
        fontFamily: heavyFont
      },

      planContainer: {
        marginTop:10,
        marginBottom:10,
        height:140,
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

      planContainerLeft: {
        height:'100%',
        width:'50%',
        alignItems:'center',
        justifyContent:'center'
      },

      planContainerRight:{
        height:'100%',
        width:'50%',
        justifyContent:'center',
        padding:10,
        paddingTop:30,
        paddingBottom:30,
      },

      planText: {
        color:'white',
        fontSize:30,
        fontFamily:heavyFont
      },

      planPriceText: {
        color:'grey',
        fontSize:13,
        fontFamily:font
      },

      planDescText: {
        color:'white',
        fontSize:12,
        fontFamily:font
      },

      signOutButton: {
        marginTop: 15,
        alignSelf: 'center'
      },

      signOutButtonText: {
        color:'white',
        fontFamily: heavyFont
      }
});

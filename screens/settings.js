import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, Linking } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Button } from 'react-native'
import { API, Auth } from 'aws-amplify';
import Purchases from 'react-native-purchases';
import { API_KEY } from '../constants';
import { ENTITLEMENT_ID } from '../constants';

export default function SettingsPage({ navigation }) {

    const [currentPlan, setCurrentPlan] = useState("basic")
    const [packages, setPackages] = useState([])
    const [isPurchasing, setIsPurchasing] = useState(false)
    const [offerings, setOfferings] = useState(null)

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

    const checkUserSubscription = async () => {
      const purchaserInfo = await Purchases.getCustomerInfo()
      if (typeof purchaserInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined") {
        setCurrentPlan('pro')
      } else {
        setCurrentPlan('basic')
      }
    }

    const makePurchase = async () => {

      if (currentPlan === "pro") {
        return
      }

      console.log("GOT HERE 1")
      console.log(packages)

      await Purchases.configure({apiKey: API_KEY})
      try {
        console.log("Running Purchases.purchasePackage...")
        const { purchaserInfo } = await Purchases.purchasePackage(packages[0])

        if (typeof purchaserInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined") {//sus
          console.log("GOT HERE!!!!!!!!!!!!!")
          navigation.goBack()
          setCurrentPlan('pro')
        } 
      } catch (error) {
        console.log(JSON.stringify(error))
        if (error.userCancelled) {
          Alert.alert(error.message)
        }
      }

    }

    const restorePurchase = async () => {
      try {
        const restore = await Purchases.restorePurchases()

      } catch (error) {
        Alert.alert(error.message)
      }
    }

    useEffect(()=>{

      const getPackages = async () => {

        await Purchases.configure({apiKey: API_KEY})

        try {
          const offerings = await Purchases.getOfferings()
          if (offerings.current !== null) {
            const availablePackages = offerings['all']['Default']['availablePackages']
            setPackages(availablePackages)
          }
        } catch (error) {
          console.log("GOT HERE")
          console.log(error)
        }
      }

      getPackages()
      checkUserSubscription()
    }, [])

    const openURL = async (url) => {
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          console.log("Can't open URL:", url);
        }
      } catch (error) {
        console.error("Error while opening URL:", error);
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
                <TouchableOpacity style={renderPlanHighlight('basic')}>
                    <View style={styles.planContainerLeft}>
                        <Text style={styles.planText}>Basic</Text>
                    </View>
                    <View style={styles.planContainerRight}>
                        <Text style={styles.planDescText}>-Save unlimited games</Text>
                        {/* <Text style={styles.planDescText}>7 successful Strikezone Captures per week</Text> */}
                        <Text style={styles.planDescText}>-Access essential statistics</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={renderPlanHighlight('pro')} onPress={makePurchase}>
                    <View style={styles.planContainerLeft}>
                        <Text style={styles.planText}>Pro*</Text>
                        <Text style={styles.planPriceText}>$0.99 per month</Text>
                    </View>
                    <View style={styles.planContainerRight}>
                        {/* <Text style={styles.planDescText}>7 successful Strikezone captures per day </Text> */}
                        <Text style={styles.planDescText}>-Compare your statistics to worldwide averages </Text>
                    </View>
                </TouchableOpacity>
                <Text style={styles.restartAppText}>*After purchasing SpareStatistics Pro, restart the app for the effects to take place</Text>

                <TouchableOpacity style={styles.signOutButton} onPress={restorePurchase}>
                    <Text style={styles.signOutButtonText}>Restore Purchase</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.signOutButton} onPress={()=>openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')}>
                    <Text style={styles.signOutButtonText}>Terms of Use</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.signOutButton} onPress={()=>openURL('https://www.privacypolicies.com/live/e2cfc699-928a-44cc-adf6-9a77a6b79361')}>
                    <Text style={styles.signOutButtonText}>Privacy Policy</Text>
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
      },

      restartAppText: {
        color:'white',
        fontFamily: font,
        fontSize: 8,
        padding:5,
        textAlign:'center'
      }
});

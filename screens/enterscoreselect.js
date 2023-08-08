import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, Linking } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Button } from 'react-native'
import { API, Auth } from 'aws-amplify';
import Purchases from 'react-native-purchases';
import { API_KEY } from '../constants';
import { launchImageLibrary } from 'react-native-image-picker';
import { ENTITLEMENT_ID } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EnterScoreSelectPage({ navigation }) {

    const [currentPlan, setCurrentPlan] = useState("basic")
    const [packages, setPackages] = useState([])
    const [isPurchasing, setIsPurchasing] = useState(false)
    const [offerings, setOfferings] = useState(null)
    const [uploadsRemaining, setUploadsRemaining] = useState(0)

    const [uploadingImage, setUploadingImage] = useState(false)

    
    const checkUserSubscription = async () => {
      const purchaserInfo = await Purchases.getCustomerInfo()
      if (typeof purchaserInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined") {
        setCurrentPlan('pro')
      } else {
        setCurrentPlan('basic')
      }
    }

    useEffect(() => {
        (async () => {
          const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
          setHasGalleryPermissions(galleryStatus.status === 'granted')
        })
      })

    const goToEnterScoreWithManual = () => {

        if (uploadingImage) {
            return
        }

        navigation.navigate("EnterScore", {
            symbolsSubmitted: "manual"
        })
    }
  
      const pickImage = async () => {
  
        if (uploadingImage) {
          return
        }

        if (uploadsRemaining <= 0) {
          navigation.navigate("Settings", {
            attemptMakePurchase: true
          })
          return
        }
  
        const options = {
          mediaType: 'photo',
        };
  
        launchImageLibrary(options, response => {
        //   if (response['assets'][0]['uri']) {
        //     // Handle the selected image here
        //     console.log('Selected image URI:', response['assets'][0]['uri']);
        //     uploadImage(response['assets'][0]['uri'])
        //   }

          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response['assets'][0]['uri']) {
            // Handle the selected image here
            console.log('Selected image URI:', response['assets'][0]['uri']);
            uploadImage(response['assets'][0]['uri'])
          }
        });
        
      }
  
      const uploadImage = async (imageUri) => {
        const url = 'https://8l5amkvz24.execute-api.us-east-1.amazonaws.com/prod/sparestatistics-full-image-uploader';
        const response = await fetch(imageUri)
        const imgBlob = await response.blob()
  
        try {
  
            setUploadingImage(true)
            console.log("making response")
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/octet-stream'
                }, 
                body: imgBlob
            })
  
            console.log("finished response")
  
            if (response.status === 200) {
                console.log(response)
                const result = await response.text();
                console.log(result);
  
                if (result === "Reading scorecard was unsuccessful") {
                    setUploadingImage(false)
                    return
                }
  
                const symbolsLists = JSON.parse(result)
                if (symbolsLists.length === 1) {


                  const newUploadsRemaining = uploadsRemaining - 1
                  console.log(`changing newUploadsRemaining to ${newUploadsRemaining}`)
                  AsyncStorage.setItem("uploadsRemaining", JSON.stringify(newUploadsRemaining))
                  setUploadsRemaining(newUploadsRemaining)


                  navigation.navigate('EnterScore', {
                    symbolsSubmitted: JSON.stringify(symbolsLists[0])
                  })
                } else {
                  navigation.navigate('SelectGame', {
                    symbolsLists: symbolsLists
                  })
                }
  
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

    const handleRemainingUploadCount = async () => {
      let remainingUploads = await AsyncStorage.getItem("uploadsRemaining")
      remainingUploads = parseInt(remainingUploads)
      console.log(`Remaining uploads: ${remainingUploads}`)
      setUploadsRemaining(remainingUploads)
    }

    useEffect(()=>{

      // Get the packages
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

      // Check user subscription
      checkUserSubscription()

      // Load the number of games the user has remaining
      handleRemainingUploadCount()
    }, [])

    const renderCorrectUploadButton = () => {
        if (uploadingImage) {
            return {
                ...styles.methodButton,
                backgroundColor:'#28284dff',
            }
        } else {
            return styles.methodButton
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.contentContainer}>
                <Text style={styles.headerText}>Choose a Method</Text>
                {console.log(uploadsRemaining)}

                <TouchableOpacity style={renderCorrectUploadButton()} onPress={pickImage}>
                    <Text style={styles.methodText}>{uploadingImage ? "Loading..." : "Image Upload"}</Text>
                    <Text style={styles.uploadsRemainingText}>Uploads remaining: {uploadsRemaining}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.methodButton} onPress={()=>{
                    goToEnterScoreWithManual()
                }}>
                    <Text style={styles.methodText}>Manual</Text>
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

      methodButton: {
        width: '100%',
        height: 250,
        marginTop:10,

        backgroundColor:'#353666',
        borderRadius: 10,

        justifyContent:'center',
        alignItems:'center'
      },

      methodText: {
        fontFamily: font,

        color:'white',
        fontSize:25,
      },

      uploadsRemainingText: {
        fontFamily: font,
        fontSize: 10,
        color:'white',
      }
});

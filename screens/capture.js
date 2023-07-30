// import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
// import { Camera, CameraType } from "expo-camera";
// import { useState, useRef } from 'react';


// export default function CapturePage({ navigation }) {

//     let cameraRef = useRef();
//     const [type, setType] = useState(CameraType.back);
//     const [capturedImage, setCapturedImage] = useState(null);
//     const [permission, requestPermission] = Camera.useCameraPermissions();

//     const [processingPicture, setProcessingPicture] = useState(false)

//     const [symbols, setSymbols] = useState([])

//     let camera = null;

//     const navigate = () => {
//         navigation.navigate('EnterScore', {
//             symbolsSubmitted: "manual"
//         })
//     }

//     const showAlert = (message) => {
//         Alert.alert(
//           'Alert',
//           message,
//           [
//             { text: 'OK', onPress: () => console.log('OK Pressed') }
//           ],
//           { cancelable: false }
//         );
//       };

//     const handleTakePicture = async () => {

//         // Make sure that only one picture at a time is processed
//         if (processingPicture) {
//             showAlert("A picture is already being processed")
//             console.log("A picture is already being processed")
//             return
//         }
//         setProcessingPicture(true)

//         // Define options for the picture
//         let options = {
//             quality: 0.5,
//             base64: true,
//             exif: false,
//             format: 'png'
//         };

//         // Take the picture and upload the image to API gateway
//         let newPhoto = await cameraRef.current.takePictureAsync(options);

//         console.log(Object.keys(newPhoto))
//         uploadImage(newPhoto['uri'])
//         setCapturedImage(newPhoto['uri'])
//     }


//     /**
//      * Function written by ChatGPT to send the photo to the backend
//      */
//     const uploadImage = async (imageUri) => {
//         console.log(imageUri)
//         const url = 'https://8l5amkvz24.execute-api.us-east-1.amazonaws.com/strikezone-image-uploader';
//         const response = await fetch(imageUri)
//         const imgBlob = await response.blob()

//         try {

//             const response = await fetch(url, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/octet-stream'
//                 }, 
//                 body: imgBlob
//             })

//             if (response.status === 200) {
//                 const result = await response.text();
//                 console.log(result);

//                 if (result === "Reading scorecard was unsuccessful") {
//                     return
//                 }
//                 setSymbols(result)
                
//                 navigation.navigate('EnterScore', {
//                     symbolsSubmitted: result
//                 })
//             } else {
//                 console.log('Error uploading image. Status code:', response.status);
//                 showAlert(`Error uploading image. Status code: ${response.status}`)
//                 console.log(response)
//             }
//             setProcessingPicture(false)
//         } catch (error) {
//             console.log('Error reading file:', error);
//             setProcessingPicture(false)
//         }
//     };

//     const renderCorrectCaptureButton = () => {
//         console.log(processingPicture)
//         if (!processingPicture) {
//             console.log("GOT HERE")
//             return {
//                 margin:5,
    
//                 width:'45%',
//                 height:40,
//                 backgroundColor:'#353666',
//                 borderRadius:10,
            
//                 // Align text in the center of the button
//                 alignItems: 'center',
//                 justifyContent: 'center',
//             }
//         } else {
//             return {
//                 margin:5,
    
//                 width:'45%',
//                 height:40,
//                 backgroundColor:'#28284dff',
//                 borderRadius:10,
            
//                 // Align text in the center of the button
//                 alignItems: 'center',
//                 justifyContent: 'center',
//             }
//         }
//     }

//     const renderCorrectStatusText = () => {
//         if (!processingPicture) {
//             return "Capture"
//         } else {
//             return "Processing..."
//         }
//     }


//     if (!permission) {
//         return <View />;
//     }

//     if (!permission.granted) {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.permissionMessageHeader}>Strikezone Capture</Text>
//                 <Text style={styles.permissionMessage}>To use Strikezone Capture, grant us access to the camera.</Text>
//                 <TouchableOpacity style={styles.grantPermissionButton} onPress={requestPermission}>
//                     <Text style={styles.grantPermissionButtonText}>GRANT PERMISSION</Text>
//                 </TouchableOpacity>
//             </View>
//         )
//     }

//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={styles.contentContainer}>

//                 {/* Introduce the page */}
//                 <Text style={styles.headerText}>Capture</Text>

//                 {/* Describe how to use the capture feature */}
//                 <Text style={styles.directionsText}>Align the edges of the capture box with the edges of the scorecard. Be as precise as possible.</Text>
//                 <Text style={styles.directionsText}>Then, press the button underneath the capture box.</Text>

//                 {/* Camera component */}
//                 <Camera style={styles.captureScreen} zoom={0.1} type={type} ref={cameraRef}>
//                     <View style={styles.scorecardRectangle}></View>
//                 </Camera>

//                 {/* Option to either capture or enter score manually */}
//                 <View style={styles.captureManualContainer}>
//                     <TouchableOpacity style={renderCorrectCaptureButton()} onPress={handleTakePicture}>
//                         <Text style={styles.captureManualButtonText}>{renderCorrectStatusText()}</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.captureManualButton} onPress={navigate}>
//                         <Text style={styles.captureManualButtonText}>Manual</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </SafeAreaView>
//     )
// }

// let font = 'Avenir'
// let heavyFont = 'Avenir-Heavy'

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#2a2b4c',
//         alignItems:'center'
//       },
//       contentContainer: {
//         // borderColor:'white', // use for spacial reasoning purposes
//         // borderWidth:'1px',
//         width:'90%',
//       },
      
//       headerText: {
//         color:'white',
//         fontSize:30,
//         fontFamily: heavyFont
//       },
//       directionsText: {
//         margin:10,
//         color:'white',
//         fontSize:15,
//         fontWeight: '400',
//         fontFamily: font
//       },
//       permissionMessageHeader: {
//         color:'white',
//         fontSize:30,
//         fontFamily: font,
//         marginBottom:10
//       },
//       permissionMessage: {
//         textAlign:'center',
//         color:'white'
//       },
//       grantPermissionButton: {
//         margin:5,
    
//         width:200,
//         height:50,
//         backgroundColor:'#353666',
//         borderRadius:10,
    
//         // Align text in the center of the button
//         alignItems: 'center',
//         justifyContent: 'center',
//       },
//       grantPermissionButtonText: {
//         color:'white',
//         fontFamily: font
//       },

//       captureScreen: {
//         width:'100%',
//         height:'70%',
//         borderRadius:30,  
//         justifyContent:'center'
//       },

//     scorecardRectangle: {
//         opacity: 1,
//         borderColor:'yellow',
//         borderWidth: 3,
//         height:70,
//         width: '95%',
//         alignSelf:'center'
//     },
    
//     captureManualContainer: {
//         marginTop: 10,
    
//         // borderColor:'white', // use for spacial reasoning purposes
//         // borderWidth:'1px',
//         width:'100%',
//         height:50,
    
//         // Align the two time period buttons in the center
//         alignItems: 'center',
//         justifyContent: 'center',
//         flexDirection:'row',
//         flexWrap: 'wrap',
//       },
//       captureManualButton: {
//         margin:5,
    
//         width:'45%',
//         height:40,
//         backgroundColor:'#353666',
//         borderRadius:10,
    
//         // Align text in the center of the button
//         alignItems: 'center',
//         justifyContent: 'center',
//       },
    
//       captureManualButtonText: {
//         color:'white',
//         fontFamily: font
//       },
// })

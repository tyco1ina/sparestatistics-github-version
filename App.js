import * as React from 'react';
import { useEffect, useState } from 'react'
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Amplify, Auth } from 'aws-amplify'
import {withAuthenticator, AmplifyTheme } from 'aws-amplify-react-native'
import config from './src/aws-exports'

Amplify.configure(config)

import StatsPage from './screens/stats';
import GamesPage from './screens/games';
import SettingsPage from './screens/settings'
// import CapturePage from './screens/capture';
import EnterScorePage from './screens/enterscore';
import GamePage from './screens/game';
import AuthPage from './screens/auth';

const Stack = createNativeStackNavigator();

function App() {

  const [user, setUser] = useState(undefined)

  const checkUser = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser({bypassCache: true})
      setUser(authUser)
    } catch (error) {
      setUser(null)
    }
  }

  useEffect(()=>{
    checkUser()
  },[])

  if (user === undefined) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator></ActivityIndicator>
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
      initialRouteName="Stats"
      screenOptions={{
        headerStyle: { 
          backgroundColor: '#2a2b4c',
          borderBottomWidth: 0, // Remove the line at the bottom of the header
        },
        headerShadowVisible: false, // Hide the header shadow
        
        headerTitle: '', // Remove the title if desired

        }}
      >

        {user === undefined ? (
          <AuthPage></AuthPage>
        ) : (
          <>
            <Stack.Screen name="Stats" component={StatsPage} />
            <Stack.Screen name="Games" component={GamesPage} />
            <Stack.Screen name="Settings" component={SettingsPage} />
            {/* <Stack.Screen name="Capture" component={CapturePage} /> */}
            <Stack.Screen name="EnterScore" component={EnterScorePage} />
            <Stack.Screen name="Game" component={GamePage} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const signUpConfig = {
  header: "Create a new account",
  hideAllDefaults: true,
  signUpFields: [
    {
      label: "Email",
      key: "email",
      required: true,
      displayOrder: 1,
      type: "string"
    },
    {
      label: "Username",
      key: "name",
      required: true,
      displayOrder: 2,
      type: "string"
    },
    {
      label: "Password",
      key: "password",
      required: true,
      displayOrder: 3,
      type: "password"
    },
  ]
}

const customTheme = {
  ...AmplifyTheme,
  button: {
		backgroundColor:'#353666',
    borderRadius: 10,
		alignItems: 'center',
		padding: 16,
	},
	buttonDisabled: {
		backgroundColor:'#353666',
		alignItems: 'center',
		padding: 16,
	},
	buttonText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: '600',
	},
  sectionFooterLink: {
		fontSize: 14,
		color: 'black',
		alignItems: 'baseline',
		textAlign: 'center',
	},
	sectionFooterLinkDisabled: {
		fontSize: 14,
		color: 'black',
		alignItems: 'baseline',
		textAlign: 'center',
	},
}

export default withAuthenticator(App, {signUpConfig, theme: customTheme});
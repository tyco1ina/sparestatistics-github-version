import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StatsPage from './screens/stats';
import GamesPage from './screens/games';
import SettingsPage from './screens/settings'
// import CapturePage from './screens/capture';
import EnterScorePage from './screens/enterscore';
import GamePage from './screens/game';

const Stack = createNativeStackNavigator();

function App() {
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
        <Stack.Screen name="Stats" component={StatsPage} />
        <Stack.Screen name="Games" component={GamesPage} />
        <Stack.Screen name="Settings" component={SettingsPage} />
        {/* <Stack.Screen name="Capture" component={CapturePage} /> */}
        <Stack.Screen name="EnterScore" component={EnterScorePage} />
        <Stack.Screen name="Game" component={GamePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
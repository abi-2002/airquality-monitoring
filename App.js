import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Home from './screens/Home';
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';
import Info from './screens/Info';

const Stack = createNativeStackNavigator();

export default function App() {

  const customFonts = {
    'productsans': require('./assets/fonts/ProductSans-Regular.ttf'),
    'productsans_med': require('./assets/fonts/ProductSans-Medium.ttf'),
    'productsans_bold': require('./assets/fonts/ProductSans-Bold.ttf')
  }

  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  }

  useEffect(() => {
    loadFonts();
  },[]);

  if(!fontsLoaded)
    return;
 
    return(
          <NavigationContainer>
            <SafeAreaProvider>  
                <Stack.Navigator initialRouteName = {'Home'} screenOptions={{animation: "slide_from_right"}}>
                  <Stack.Screen name="Home" component={Home} options = {{headerShown:false}} />
                  <Stack.Screen name="Info" component={Info} options = {{headerShown:false}} />
                </Stack.Navigator>
            </SafeAreaProvider>
          </NavigationContainer>
    );

}

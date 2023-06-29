import {Text,  View } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {width,  fonts, shadowProps} from '../Constants'

const cardWidth = width * 0.25;

const DataCard = ({x, y, ppm, time}) => {
   
    return (

        <SafeAreaProvider>
            <View style={{   
                    ...shadowProps,
                    maxWidth : cardWidth ,
                    padding : width * 0.02,
                    borderRadius : 10,
                    backgroundColor : '#327a85',
                    position: 'absolute',
                    top: y + width * 0.04,
                    left : Math.max(x - cardWidth* 0.5, 0)
                    /* left: Math.min(Math.max(x - cardWidth* 0.5, 0), endPoint)*/           
            }}
            >
                <Text style={{fontFamily:'productsans', fontSize : fonts.small}}>
                    {`${ppm} ppm at ${time}`}
                </Text>
            </View>

        </SafeAreaProvider>
       
    );
}

export default DataCard
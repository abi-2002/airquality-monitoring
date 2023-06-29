import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ref, onValue, query, limitToLast, get } from 'firebase/database';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import Donut from '../components/Donut';

import { fonts, shadowProps, width, getCurrentDate } from '../Constants';


const getLatestValue = async (dbRef) => {
 
  const queryRef = query(dbRef, limitToLast(1));
  const snapshot = await get(queryRef);
  return Object.values(Object.values(snapshot.val())[0])[0];
};



const Home = () => {
  const nav = useNavigation();


  const [airQuality, setAirQuality] = useState({ mq135: 0, mq7: 0 });
  const { mq135, mq7 } = airQuality;

  useEffect(() => {

    let mq7_listener, mq135_listener;

    const fetchAirQuality = async () => {
      const currentDate = getCurrentDate();
      const mq7Ref = ref(db, `MQ7/${currentDate}`);
      const mq135Ref = ref(db, `MQ135/${currentDate}`);
     
      mq7_listener = onValue(mq7Ref, async (snapshot) => {

        if (snapshot.exists()) {
          
          const mq7Value = await getLatestValue(mq7Ref);
          setAirQuality(prev => ({ ...prev, mq7: mq7Value }));
        }
        else
          setAirQuality(prev => ({ ...prev, mq7: 0 }));

      });
      mq135_listener = onValue(mq135Ref, async (snapshot) => {

        if(snapshot.exists()) {
          const mq135Value = await getLatestValue(mq135Ref);
          setAirQuality(prev => ({ ...prev, mq135: mq135Value }));
        }
        else 
          setAirQuality(prev => ({ ...prev, mq135: 0 }));
      });  
    };   
    
    fetchAirQuality();

    return (() => {
      mq7_listener();
      mq135_listener();
    })
    
  }, []);

  const getMessage = (value) => {
    if (value <= 9) return 'NORMAL';
    else if (value <= 35) return 'ACCEPTABLE';
    else if (value <= 100) return 'MARGINAL';
    else if (value <= 200) return 'POOR';
    else if (value <= 400) return 'HAZARDOUS';
    else if (value <= 800) return 'DANGEROUS';
    else return 'LIFE THREATENING';
  };

  const mq7_msg = getMessage(mq7);
  
  const mq135_msg = getMessage(mq135);

  return (
    <SafeAreaView style={styles.view}>

      <View style={styles.header_view}>
        <Text style={styles.header}> Adhithyanz Air Quality Monitoring</Text>
      </View>
     
      <View style={styles.graph_view}>

        <TouchableOpacity style={styles.donut_view} onPress={() => nav.navigate('Info')}>
          <Donut color={'#43736D'} text={mq7} percentage={mq7} fill_color={'#526965'}/>
        </TouchableOpacity>

        <View style={styles.donut_view}>
          <Donut color={'#536887'} text={mq135} percentage={mq135} fill_color={'#4a5463'}/>
        </View>

      </View>

      <View style={styles.pi_view}>

        <View style={[styles.box, {backgroundColor : '#43736D'}]}>

          <View style={styles.condition}>
            <Text style={styles.text}>{mq7_msg}</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.content_text}>CO</Text>
          </View>  

        </View>


        <View style={[styles.box, {backgroundColor : '#536887'}]}>

          <View style={styles.condition}>
            <Text style={styles.text}>Hazardous</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.content_text}>OTHERS</Text>
          </View>

        </View>


        <View style={[styles.box, {backgroundColor : '#7A3C3C', padding: 20}]}>

          <View style={styles.condition}>
            <Text style={styles.text}>CALL 100</Text>
          </View>

        </View>
  
      </View>      
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({

    view:{
        backgroundColor:"#1C2735",
        display : "flex",
        flex : 1,
        padding : width * 0.035,
        alignItems : 'center'
    },
    header_view : {
      height : '15%',
      display : 'flex',
      alignItems : 'center',
      justifyContent : 'center'
    },

    header : {
        color : '#bbb',
        fontSize : fonts.large,
        textAlign : 'center',
        fontFamily : 'productsans'
    },
    graph_view : {
      ...shadowProps,
      padding : width * 0.02,
      width : '100%',
      backgroundColor : '#243345',
      borderRadius : 20,
      display : 'flex',
      flexDirection : 'row',
      alignItems : 'center',
      justifyContent : 'space-around',
     
    },
    donut_view : {
      display : 'flex',
      alignItems : 'center',
      justifyContent : 'center'
    },
    pi_view : {
      ...shadowProps,
      backgroundColor : '#243345',
      borderRadius : 20,
      display : 'flex',
      alignItems : 'center',
      justifyContent : 'space-evenly',
      width : '100%',
      height : '40%',
      margin : width * 0.035,
      
    },
    box : {
      display : 'flex',
      width : '90%',
      paddingLeft : 18,
      paddingTop : 18,
      paddingRight : 14,
      paddingBottom : 8,
      borderRadius : 20
    },
    condition : {
      alignSelf: 'flex-start',
      display : 'flex',
      alignItems : 'flex-start',
      justifyContent : 'flex-start'
    },
    content : {
      alignSelf : 'flex-end',
      display : 'flex',
    },

    text : {
      fontSize : fonts.medium,
      fontFamily : 'productsans'
    },
    content_text : {
      fontSize : fonts.small,
      fontFamily : 'productsans_bold'
    }
});

export default Home;
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ref, onValue, query, limitToLast, get, remove, set } from 'firebase/database';
import { db } from '../firebase';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import Donut from '../components/Donut';


import { StatusBar } from 'expo-status-bar';


import { fonts, shadowProps, width, getCurrentDate, getMessageMQ135, getMessageMQ7 } from '../Constants';


const getLatestValue = async (dbRef) => {
 
  const queryRef = query(dbRef, limitToLast(1));
  const snapshot = await get(queryRef);
  return Object.values(Object.values(snapshot.val())[0])[0];
};


const Home = () => {
  const nav = useNavigation();

  const currentDate = getCurrentDate();
  const mq7Ref = ref(db, `MQ7/${currentDate}`);
  const mq135Ref = ref(db, `MQ135/${currentDate}`);
  const statusRef = ref(db, 'status');


  const [airQuality, setAirQuality] = useState({ mq135: 0, mq7: 0 });
  const { mq135, mq7 } = airQuality;
  const [ mq7PathExists, setmq7Path ] = useState(false);
  const [ mq135PathExists, setmq135Path ] = useState(false);
  const [ deviceStatus, setDeviceStatus ] = useState('Offline');


  const devicePowerOff = () => {
    set(statusRef, 'Offline');
    setDeviceStatus('Offline');
  }

  useEffect(() => {

    let mq7_listener, mq135_listener, status_listener;

    const fetchAirQuality = async () => {
    
      mq7_listener = onValue(mq7Ref, async(snapshot) => {

        if (snapshot.exists()) {
          
          const mq7Value = await getLatestValue(mq7Ref);

          setAirQuality(prev => ({ ...prev, mq7: mq7Value }));

          if(!mq7PathExists)
            setmq7Path(true);
        }
        else {
          setAirQuality(prev => ({ ...prev, mq7: 0 }));
          setmq7Path(false);
        }
      });


      mq135_listener = onValue(mq135Ref, async (snapshot) => {

        if(snapshot.exists()) {
          const mq135Value = await getLatestValue(mq135Ref);
          setAirQuality(prev => ({ ...prev, mq135: mq135Value }));
          if(!mq135PathExists)
            setmq135Path(true);
        }
        else {
          setAirQuality(prev => ({ ...prev, mq135: 0 }));
          setmq135Path(false);
        }
      });
      
      status_listener = onValue(statusRef, async (snapshot) => {

        if (snapshot.exists())
          setDeviceStatus(snapshot.val());
      
      })
    };   
    
    fetchAirQuality();

    return (() => {
      mq7_listener();
      mq135_listener();
      status_listener();
    })
    
  }, []);

  
  const mq7_msg = getMessageMQ7(mq7);
  
  const mq135_msg = getMessageMQ135(mq135);

  return (
    <SafeAreaView style={styles.view}>

      <TouchableOpacity style={styles.status} onLongPress={() => devicePowerOff()}>
        <View style={styles[`circle_${deviceStatus}`]}></View>
        <Text style={styles.content_text}>{`Device ${deviceStatus}`}</Text>

      </TouchableOpacity>

      <View style={styles.header_view}>
        <Text style={styles.header}> AIR QUALITY MONITORING SYSTEM</Text>
      </View>

     
     
      <View style={styles.graph_view}>

        <TouchableOpacity 
          style={styles.donut_view}
          onLongPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              remove(mq7Ref);
            }
          } 
          disabled = {!mq7PathExists} 
          onPress={() => nav.navigate('Info', {dbPath : `MQ7/${currentDate}`, heading : 'Carbon Monoxide levels', sensor : 'MQ7'})}
        >
          <Donut color={'#43736D'} text={mq7} percentage={mq7} fill_color={'#526965'}/>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.donut_view} 
          disabled = {!mq135PathExists} 
          onLongPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            remove(mq135Ref);
          
          }} 
          onPress={() => nav.navigate('Info', {dbPath : `MQ135/${currentDate}`, heading : 'MQ135 Readings', sensor : 'MQ135'})}
        >
          <Donut color={'#536887'} text={mq135} percentage={mq135} fill_color={'#4a5463'}/>
        </TouchableOpacity>

      </View>

      <View style={styles.box_container}>

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
            <Text style={styles.text}>{mq135_msg}</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.content_text}>OTHERS</Text>
          </View>

        </View>


        <TouchableOpacity onPress={() => nav.navigate('Emergency')} style={styles.emergency_call}>

          <View style={styles['condition']}>
            <Text style={[styles.text, {fontSize : fonts.medium - 3}]}>CALL EMERGENCY SERVICES</Text>
          </View>

        </TouchableOpacity>
  
      </View>      
      <StatusBar backgroundColor="#1C2735" />
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
        justifyContent : 'center',
      },

      header : {
          color : '#627670',
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
    box_container : {
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
    },
    emergency_call : {
      backgroundColor : '#7A3C3C',
      width : '90%',
      padding : width * 0.04,
      borderRadius : 15
    },
    status : {
      alignSelf : 'flex-start',
      backgroundColor : '#455680',
      padding : width * 0.02,
      borderRadius : 15,
      display : 'flex',
      flexDirection : 'row',
      alignItems : 'center',
      justifyContent : 'space-between'
    },
    circle_Online : {
      margin : width * 0.01,
      width : width * 0.02,
      height : width * 0.02,
      borderRadius : width * 0.01,
      backgroundColor : '#43736D'
    },
    circle_Offline : {
      margin : width * 0.01,
      width : width * 0.02,
      height : width * 0.02,
      borderRadius : width * 0.01,
      backgroundColor : '#7A3C3C',

    }

});

export default Home;
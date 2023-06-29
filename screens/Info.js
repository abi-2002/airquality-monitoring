import { Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { db } from '../firebase';
import { LineChart } from "react-native-chart-kit";
import { onChildAdded, ref } from 'firebase/database';
import DataCard from '../components/DataCard';
import { width, fonts, shadowProps, getCurrentDate } from '../Constants';

const Info = () => {

  const [ graphData, setGraphData ] = useState({labels : [], datasets : [{ data: []}]});
  const [clickedDataPoint, setClickedDataPoint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataCardClicked, setClickedDataCard] = useState(false); 
  let mq7_listener;
 
  useEffect(() => {

    if (!loading) return;

    const mq7_ref = ref(db, `MQ7/${getCurrentDate()}`);


    mq7_listener = onChildAdded(mq7_ref, (snapshot) => {
      const data = snapshot.val();
      const val = Object.values(data)[0];
      const key = Object.keys(data)[0];
 
      setGraphData((prev) => ({
            labels: [...prev.labels, key],
            datasets: [{ data: [...prev.datasets[0].data, val] }]
        }));

      if(loading)
        setLoading(false);
    });

    return (() => {
      mq7_listener();
    })
  }, []);

  return (
  <SafeAreaProvider>
    <TouchableOpacity style={styles.view} onPress={() => setClickedDataCard(true)} activeOpacity={1}>
      <Text style={styles.heading}>MQ7 Readings</Text>

    
      <ScrollView style={styles.scroll_view_container}
       horizontal 
       showsHorizontalScrollIndicator={false}
       >
        {loading ? null : (

        <LineChart     
                data={graphData}
                width = {width * 10}
               
                onDataPointClick={({index}) => {
                  setClickedDataCard(false);
                  setClickedDataPoint(index);
                }}
                withVerticalLabels = {true}
                withVerticalLines = {true}
                withHorizontalLabels = {true}
                withHorizontalLines = {true}
                height={200}
                withDots ={true}
                getDotColor={(dataPoint, dataPointIndex) => {
                  if (dataPointIndex !== clickedDataPoint || dataCardClicked)
                    return "#43736D90"
                  return "#49a67e"
                          
                }}            
                yAxisLabel=""
                yAxisSuffix=""
                yAxisInterval={500} 
                
                chartConfig={{
                  backgroundColor: "#1C2735",
                  backgroundGradientFrom : "#1C2735",
                  backgroundGradientTo : "#1C2735",
                
                  decimalPlaces: 0, 
                  color: (opacity = 1) => '#43736D90',
                  labelColor: (opacity = 1) => '#43736D',
                  
                  propsForDots: {
                    r: "2",
                    strokeWidth: "0",
                    
                  },
                 
                }}
                bezier
                style={{           
                  /*
                  paddingRight : width * 0.004,
                  paddingBottom : -width * 0.03,*/
                
                 
                }}
                renderDotContent={({ x, y, index }) => {
                  if (index !== clickedDataPoint || dataCardClicked) 
                    return null;
                  
                  return <DataCard x={x} y = {y} key={index}
                          ppm={graphData.datasets[0].data[index]} 
                          time={graphData.labels[index]} 
                          onPress={() => setClickedDataCard(true)}
                        />
                
                }}
                segments={2}
              />           
           
              )}
              

              </ScrollView> 

    </TouchableOpacity>
  </SafeAreaProvider>
  );
   
}


export default Info;


const styles = StyleSheet.create({
  view:{
    backgroundColor:"#1C2735",
    display : "flex",
    flex : 1,
    padding : width * 0.03,
    overflow : 'visible',
    alignItems : 'center',
    justifyContent : 'center'
  },

  heading : {
    fontFamily : 'productsans_med', 
    fontSize : fonts.large,
    color : '#50827e' ,
  
    padding : width * 0.01
    
  
  },

  scroll_view_container : {
    ...shadowProps,
    overflow : 'visible',
    backgroundColor : '#1C2735',
    minHeight : '22%',
    width : '100%',
    borderWidth : 0,
    borderColor : '#555555',
    borderRadius : 15,  
    padding : width * 0.01,
    paddingRight : 0,
    display : 'flex',
    flexGrow : 0,
 
  },
  scroll_view : {
    flexGrow : 0, 
    padding : 0,
  },
  

});
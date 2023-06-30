import { Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../firebase';
import { LineChart } from "react-native-chart-kit";
import { onChildAdded, ref } from 'firebase/database';
import DataCard from '../components/DataCard';
import { width, fonts, shadowProps, getCurrentDate } from '../Constants';

const Info = ({ route, navigation }) => {
  const [graphData, setGraphData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [clickedDataPoint, setClickedDataPoint] = useState(null);
  const [loading, setLoading] = useState(true);

  const { dbPath, heading} = route.params;
  
  let listener;

  useEffect(() => {
    
    if (!loading) return;

    const dbRef = ref(db, dbPath);

    listener = onChildAdded(dbRef, (snapshot) => {
      const data = snapshot.val();
      const val = Object.values(data)[0];
      const key = Object.keys(data)[0];

      setGraphData((prev) => ({
        labels: [...prev.labels, key],
        datasets: [{ data: [...prev.datasets[0].data, val] }]
      }));

      if (loading) setLoading(false);
    });

    return () => {
      listener();
    };
  }, []);

  return (
    <SafeAreaView style={styles.view}>
      <Text style={styles.heading}>{heading}</Text>

      <ScrollView
        style={styles.scroll_view_container}
        horizontal
        showsHorizontalScrollIndicator={false}
       
      >
        {loading ? null : (
          <LineChart
            data={graphData}
            width={width * 10}
            onDataPointClick={({ index }) => {
         
              setClickedDataPoint(index);
            }}
            withVerticalLabels={true}
            withVerticalLines={true}
            withHorizontalLabels={true}
            withHorizontalLines={true}
            height={300}
            withDots={true}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={500}
            chartConfig={{
              backgroundColor: "#1C2735",
              backgroundGradientFrom: "#1C2735",
              backgroundGradientTo: "#1C2735",
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
              paddingRight: width * 0.1,
              paddingBottom: -width * 0.03,
            }}
            renderDotContent={({ x, y, index }) => {
              if (index !== clickedDataPoint) return null;
              return (
                <TouchableOpacity key={index} >
                  <DataCard
                    x={x}
                    y={y} 
                    ppm={graphData.datasets[0].data[index]}
                    time={graphData.labels[index]}
                  />
                </TouchableOpacity>
              );
            }}
            segments={2}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Info;

const styles = StyleSheet.create({
  view: {
    backgroundColor: "#1C2735",
    flex: 1,
    padding: width * 0.03,
    alignItems: 'center',
    justifyContent: 'center'
  },
  heading: {
    fontFamily: 'productsans_med',
    fontSize: fonts.large,
    color: '#50827e',
    padding: width * 0.01
  },
  scroll_view_container: {
    ...shadowProps,
    backgroundColor: '#1C2735',
    minHeight: '22%',
    borderWidth: 0,
    borderColor: '#555555',
    borderRadius: 15,
    padding: width * 0.01,
    paddingRight: 0,
    display: 'flex',
    flexGrow: 0,
  },
});

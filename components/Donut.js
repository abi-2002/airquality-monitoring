import { Text, View, Animated, Easing, StyleSheet} from 'react-native'
import Svg,  {  G, Circle, Defs, RadialGradient, Stop} from 'react-native-svg';
import React, { useEffect, useRef } from 'react'
import { fonts } from '../Constants';

const Donut = ({duration = 750, max = 1000, color, text="default", percentage, fill_color}) => {

  const circumference = Math.PI * 80;

  const animated = useRef(new Animated.Value(0)).current;

  const circleRef = useRef();
  const width = 150, height = 150;
 
  useEffect(() => {
    const animation = Animated.timing(animated, {
      toValue: percentage,
      duration,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    });

    const listener = animated.addListener((v) => {
      const Perc = 100 * v.value / max;
      
      const strokeDashoffset = circumference - (circumference * Perc) / 100;
      
      if (circleRef?.current) {
        circleRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });

    animation.start();

    return () => {
      animated.removeListener(listener);
    };
  }, [animated, circumference, duration, max, percentage]);

  return (
  <>
    <Svg width={width} height={height} viewBox={`0 0 100 100`} color={'#243345'} stroke={'#243345'}>
      <G>
        <Circle cx='50%' cy='50%' stroke={color} strokeWidth={10} r={40}
          strokeOpacity={0.2}
          fill={'transparent'} /> 

        <Circle cx='50%' cy='50%' stroke={color} strokeWidth={10} r={40}
          strokeDasharray={Math.PI * 80} 
          strokeDashoffset={Math.PI * 80}
          strokeLinecap='round'
          ref={circleRef}
          fill={'transparent'}/>    


        <Defs>
          <RadialGradient id="shadow" cx="50%" cy="50%" strokeWidth={0}>
            <Stop offset="0%" stopOpacity="1" stopColor="#000" strokeWidth={0} />
            <Stop offset="100%" stopOpacity="0.11" stopColor="#000" strokeWidth={0} />
          </RadialGradient>
        </Defs>
        
        <Circle cx='50%' cy='50%' r={45} fill={"url(#shadow)"} strokeWidth={0}/>
        <Circle cx='50%' cy='50%' r={35} fill={fill_color} strokeWidth={0}/>

      </G>  
    </Svg>

    <Text style={styles.text}>
     {text}
    </Text>

    </>

    );
}
const styles = StyleSheet.create({
  text : {
    fontFamily : 'productsans_med', 
    position : 'absolute', 
    fontSize : fonts.medium,
    color : '#191919'
  }
}) 


export default Donut;
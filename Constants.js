
import { Dimensions, Platform } from "react-native";

export const {width, height } = Dimensions.get('window');

export const fonts = {

    small : Platform.OS === 'ios' ? height * 0.015 : height * 0.02,
    medium : Platform.OS === 'ios' ? height * 0.02 : height * 0.03,
    large :  Platform.OS === 'ios' ? height * 0.03 : height * 0.04

}

export const shadowProps = {
    shadowColor : '#000000',
    elevation : 8,
    shadowOpacity : 0.7,
    shadowRadius : 4,
    shadowOffset : {
        x : 10,
        y : 5
    }
}
export const getCurrentDate = () => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
  };

export const getMessageMQ7 = (value) => {
    if (value <= 9) return 'NORMAL';
    else if (value <= 35) return 'ACCEPTABLE';
    else if (value <= 100) return 'MARGINAL';
    else if (value <= 200) return 'POOR';
    else if (value <= 400) return 'HAZARDOUS';
    else if (value <= 800) return 'DANGEROUS';
    else return 'LIFE THREATENING';
  };

export const getMessageMQ135 = value => {

    if (value <= 50 ) return "GOOD";
    else if (value<=100) return 'MODERATE';
    else if (value <= 200) return 'SENSITIVE';
    else if (value <= 300) return 'UNHEALTHY';
    else if (value <= 500) return 'HAZARDOUS';
    else return 'DANGEROUS'
  }

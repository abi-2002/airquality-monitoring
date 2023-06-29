import { View } from "react-native";

const CustomDecorator = ({ x, y, data }) => {
    return data.map((value, index) => (
      <View
        key={index}
        style={{
          position: 'absolute',
          left: x(index),
          top: 0,
          bottom: 0,
          width: 1, // Width of the vertical line
          backgroundColor: 'red', // Color of the vertical line
        }}
      />
    ));
  };

  export default CustomDecorator;
import { LayoutRectangle, Text, View } from "react-native";
import { Bin, Rectangle } from "./utils";

interface ParentDivProps {
  sheet: Bin;
  windowDivs: Rectangle[];
}

function find_dimesions(layout: LayoutRectangle){
  const {x, y, width, height} = layout;
  console.log(x);
  console.log(y);
  console.log(width);
  console.log(height);
}

export const ParentDiv = ({ sheet, windowDivs }: ParentDivProps) => (
  <View
    style={{
      position: 'relative',
      // width: '100%', // Use responsive units
      // height: '100%', // Use responsive units
      // height: sheet.height,
      // paddingBottom: `${(sheet.height / sheet.width) * 100}%`, // Set the aspect ratio for responsive height
      backgroundColor: 'black',
      flex: 1,
      borderWidth: 2,
      borderColor: 'green',
      overflow: 'visible',
    }}
  >
    {windowDivs.map((rectangle) => {
      const backgroundColor = rectangle.id < 0 ? undefined : 'rgba(128, 128, 128, 0.5)';
      const border = rectangle.id < 0 ? '1px solid yellow' : '1px dashed white';
      console.log('rectangle width', rectangle)
      console.log('sheet', sheet);
      return (
        <View
          key={rectangle.id}
          style={{
            position: 'absolute',
            // left: rectangle.left,
            // top: rectangle.top,
            // width: rectangle.width,
            // height: rectangle.height,
            left: `${(rectangle.left / sheet.width) * 100}%`, // Use relative units
            top: `${(rectangle.top / sheet.height) * 100}%`, // Use relative units
            width: `${(rectangle.width / sheet.width) * 100}%`, // Use relative units
            height: `${(rectangle.height / sheet.height) * 100}%`, // Use relative units
            backgroundColor,
            // color: 'white',
            // fontWeight: 'bold',
            borderWidth: 1,
            borderColor: 'white',
            borderStyle: 'dashed',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white' }}>
            {`Id: ${rectangle.id}`}
          </Text>
          <Text style={{ color: 'white' }}>
            {`Width: ${parseFloat(rectangle?.width?.toFixed(4))}`}
          {/* {`${(rectangle.width / sheet.width) * 100}%`} */}
          </Text>
          <Text style={{ color: 'white' }}>
            {`Height: ${parseFloat(rectangle?.height?.toFixed(4))}`}
          {/* {`${(rectangle.height / sheet.height) * 100}%`} */}
          </Text>
        </View>
      );
    })}
    <View 
      style={{
        position: 'absolute',
        left: 0,
        top: '50%',
        width: '50%',
        height: '50%',
        borderWidth: 1,
        borderColor: 'gray',
        borderStyle: 'dashed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onLayout={(event) => { find_dimesions(event.nativeEvent.layout) }}
    >
      <Text style={{ color: 'white' }}>test</Text>
    </View>
  </View>
);
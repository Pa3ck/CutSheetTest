import { Text, View } from "react-native";
import { Bin, Rectangle } from "./utils";

interface ParentDivProps {
  sheet: Bin;
  windowDivs: Rectangle[];
}

export const ParentDiv = ({ sheet, windowDivs }: ParentDivProps) => (
  <View
    style={{
      position: 'relative',
      width: '100%', // Use responsive units
      height: '100%', // Use responsive units
      // height: sheet.height,
      paddingBottom: `${(sheet.height / sheet.width) * 100}%`, // Set the aspect ratio for responsive height
      backgroundColor: 'black',
      flex: 1,
      borderWidth: 1,
      borderColor: 'yellow',
    }}
  >
    {windowDivs.map((rectangle) => {
      const backgroundColor = rectangle.id < 0 ? undefined : 'rgba(128, 128, 128, 0.5)';
      const border = rectangle.id < 0 ? '1px solid yellow' : '1px dashed white';
      console.log('rectangle', rectangle)
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
          <Text>
            {`Id: ${rectangle.id}`}
          </Text>
          <Text>
            {`Width: ${parseFloat(rectangle.width.toFixed(4))}`}
          {/* {`${(rectangle.width / sheet.width) * 100}%`} */}
          </Text>
          <Text>
            {`Height: ${parseFloat(rectangle.height.toFixed(4))}`}
          {/* {`${(rectangle.height / sheet.height) * 100}%`} */}
          </Text>
        </View>
      );
    })}
  </View>
);
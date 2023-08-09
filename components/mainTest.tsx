import { useCallback, useEffect, useState } from 'react';
import { Button, Text, View, TextInput, NativeSyntheticEvent, TextInputChangeEventData, ScrollView } from 'react-native';
import DropDownPicker, { ValueType } from 'react-native-dropdown-picker';
import { ChildDivProps, DropDownItem, Rectangle, cmToPixels } from './utils';
import { skyline } from './Algorithms/Skyline';
import { bestFitDecreasing, bottomLeftBinPacking, firstFitDecreasing, guillotineCut, nextFit, rectangleMerge } from './Algorithms/Algorithms';
import { ParentDiv } from './ParentDiv';

export default function MainTest() {
  const isAutoFilled = true;
  const [manuallyUpdated, setManuallyUpdated] = useState<boolean>(!isAutoFilled);
  const [rowCount, setRowCount] = useState<string>(isAutoFilled ? '10' : '0');
  const [sheetWidth, setSheetWidth] = useState<string>(isAutoFilled ? '10' : '0');
  const [sheetHeight, setSheetHeight] = useState<string>(isAutoFilled ? '10' : '0');

  /** Drop down select */
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<ValueType | null>('Skyline');
  const [items, setItems] = useState<DropDownItem[]>([
    {label: 'Skyline', value: 'Skyline'},
    {label: 'Guillotine Cut', value: 'GuillotineCut'},
    {label: 'First Fit Decreasing', value: 'FirstFitDecreasing'},
    {label: 'Best Fit Decreasing', value: 'BestFitDecreasing'},
    {label: 'Next Fit', value: 'NextFit'},
    {label: 'BottomLeftBinPacking', value: 'BottomLeftBinPacking'},
    {label: 'RectangleMerge', value: 'RectangleMerge'},
  ]);

  const [rows, setRows] = useState<ChildDivProps[]>(
    isAutoFilled
      ? [
          { id: 1, width: 1, height: 2 },
          { id: 2, width: 2, height: 3 },
          { id: 3, width: 4, height: 4 },
          { id: 4, width: 4, height: 4 },
          { id: 5, width: 4, height: 4 },
          { id: 6, width: 2, height: 2 },
          { id: 7, width: 2, height: 2 },
          { id: 8, width: 3, height: 3 },
          { id: 9, width: 8, height: 2 },
          { id: 10, width: 1, height: 1 },
        ]
      : []
  );

  const [windowSheet, setWindowSheet] = useState<Rectangle[]>(
    isAutoFilled
      ? [
          { id: 1, width: 1, height: 2, top: 0, left: 0 },
          { id: 2, width: 2, height: 3, top: 0, left: 0 },
          { id: 3, width: 4, height: 4, top: 0, left: 0 },
          { id: 4, width: 4, height: 4, top: 0, left: 0 },
          { id: 5, width: 4, height: 4, top: 0, left: 0 },
          { id: 6, width: 2, height: 2, top: 0, left: 0 },
          { id: 7, width: 2, height: 2, top: 0, left: 0 },
          { id: 8, width: 3, height: 3, top: 0, left: 0 },
          { id: 9, width: 8, height: 2, top: 0, left: 0 },
          { id: 10, width: 1, height: 1, top: 0, left: 0 },
        ]
      : []
  );

  

  const handleRowCountChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    if (Number.isNaN(event.nativeEvent.text)) {
      return;
    }
    const count = event.nativeEvent.text;
    setRowCount(count);
    setManuallyUpdated(true);
  };

  const handleSheetWidthChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    if (Number.isNaN(event.nativeEvent.text) || event.nativeEvent.text === '') {
      console.log('not a number');
      setSheetWidth('0');
      return;
    }
    const value = parseInt(event.nativeEvent.text, 10);
    setSheetWidth(value.toString());
  };

  const handleSheetHeightChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    if (Number.isNaN(event.nativeEvent.text) || event.nativeEvent.text === '') {
      console.log('not a number');
      setSheetHeight('0');
      return;
    }
    const value = parseInt(event.nativeEvent.text, 10);
    setSheetHeight(value.toString());
  };

  const onCalculate = useCallback(() => {
    const newWindowSheet: Rectangle[] = rows.map((row) => ({
      id: row.id,
      width: cmToPixels(row.width),
      height: cmToPixels(row.height),
      top: 0,
      left: 0,
    }));

    let packedRectangles: Rectangle[][] = [];

    switch (selectedValue) {
      case 'Skyline':
        packedRectangles = skyline(newWindowSheet, {
          width: cmToPixels(parseInt(sheetWidth)),
          height: cmToPixels(parseInt(sheetHeight)),
        });

        break;
      case 'GuillotineCut':
        packedRectangles = guillotineCut(newWindowSheet, {
          width: cmToPixels(parseInt(sheetWidth)),
          height: cmToPixels(parseInt(sheetHeight)),
        });
        break;
      case 'BestFitDecreasing':
        packedRectangles = bestFitDecreasing(newWindowSheet, {
          width: cmToPixels(parseInt(sheetWidth)),
          height: cmToPixels(parseInt(sheetHeight)),
        });
        break;
      case 'FirstFitDecreasing':
        packedRectangles = firstFitDecreasing(newWindowSheet, {
          width: cmToPixels(parseInt(sheetWidth)),
          height: cmToPixels(parseInt(sheetHeight)),
        });
        break;
      case 'NextFit':
        packedRectangles = nextFit(newWindowSheet, {
          width: cmToPixels(parseInt(sheetWidth)),
          height: cmToPixels(parseInt(sheetHeight)),
        });
        break;
      case 'BottomLeftBinPacking':
        packedRectangles = bottomLeftBinPacking(newWindowSheet, {
          width: cmToPixels(parseInt(sheetWidth)),
          height: cmToPixels(parseInt(sheetHeight)),
        });
        break;
      case 'RectangleMerge':
        packedRectangles = rectangleMerge(newWindowSheet, {
          width: cmToPixels(parseInt(sheetWidth)),
          height: cmToPixels(parseInt(sheetHeight)),
        });
        break;
      default:
        break;
    }

    setWindowSheet(packedRectangles.flatMap((row) => row));
  }, [selectedValue, sheetWidth, sheetHeight, rows]);

  const handleRowInputChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
    id: number,
    field: 'width' | 'height'
  ) => {
    const { text: value } = event.nativeEvent;
    setRows((prevRows) => prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  useEffect(() => {
    if (isAutoFilled && !manuallyUpdated) {
      return;
    }

    setRows(
      Array.from({ length: parseInt(rowCount) }, (_, index) => ({
        id: index + 1,
        width: 0,
        height: 0,
      }))
    );
  }, [rowCount, isAutoFilled, manuallyUpdated]);

  return (
    <ScrollView style={{ margin: 20, borderColor: 'red', borderWidth: 1, height: '100%' }}>
      <View
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 10,
          borderWidth: 1,
          borderColor: 'blue',
          flexDirection: 'column',
        }}
      >
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 1, borderWidth: 1, borderColor: 'black'}}>
          <Text style={{ paddingRight: 5}}>Window Amounts: </Text>
          <TextInput keyboardType="number-pad" value={rowCount} onChange={handleRowCountChange} placeholder="Number of windows" />
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'black'}}>
          <Text style={{ paddingRight: 5}}>Sheet Width</Text>
          <TextInput keyboardType="number-pad" value={sheetWidth} onChange={handleSheetWidthChange} placeholder="Sheet width" />
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'black'}}>
          <Text style={{ paddingRight: 5}}>Sheet Height</Text>
          <TextInput keyboardType="number-pad" value={sheetHeight} onChange={handleSheetHeightChange} placeholder="Sheet height" />
        </View>
        <View>
          <Text style={{ borderWidth: 1, borderColor: 'green' }}>Algorithm 4</Text>
          <DropDownPicker
            open={open}
            value={selectedValue}
            items={items}
            setOpen={setOpen}
            setValue={setSelectedValue}
            setItems={setItems}
            style={{ width: 200 }}
          />
        </View>
        <Button title="Re-run" onPress={onCalculate} />
      </View>

      <View style={{ display: 'flex', justifyContent: 'flex-start', height: '100%' }}>
        <View id="rows" style={{ width: 200 }}>
          {rows.map((row) => (
            <View key={`rows-${row.id}`} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderColor: 'black' }}>
              <Text>{row.id}</Text>
              <TextInput 
                keyboardType="number-pad"
                value={row.width.toString()}
                onChange={(e) => handleRowInputChange(e, row.id, 'width')}
                placeholder="Enter width"
              />
              <TextInput 
                keyboardType="number-pad"
                value={row.height.toString()}
                onChange={(e) => handleRowInputChange(e, row.id, 'height')}
                placeholder="Enter height"
              />
            </View>
          ))}
        </View>

        <View style={{ display: 'flex', justifyContent: 'center', flex: 1, width: '100%', padding: 5, height: '100%' }}>
          <ParentDiv
            sheet={{ width: cmToPixels(parseInt(sheetWidth)), height: cmToPixels(parseInt(sheetHeight)) }}
            windowDivs={windowSheet}
          />
        </View>
      </View>
    </ScrollView>
  );
}
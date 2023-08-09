import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MainTest from './components/mainTest';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Prueba</Text>
      <MainTest />
      {/* <Text>prueba de los cambios</Text> */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%',
    height:'100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

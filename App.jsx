import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TextRecognition from '@react-native-ml-kit/text-recognition';

function App() {
  const result = TextRecognition.recognize('./test.jpg');
  console.log('Recognized text:asdsa');

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {

  return (
    <View style={styles.container}>
      <Text>sdasasdasdd</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center'
  },
});

export default App;

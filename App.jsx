import React, { useEffect, useState, useRef } from 'react';
import { StatusBar, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import KeepAwake from 'react-native-keep-awake';

function App() {
  const [recognizedText, setRecognizedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const camera = useRef(null);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const takePicture = async () => {
    if (!camera.current) return;
    
    setIsProcessing(true);
    try {
      const photo = await camera.current.takePhoto({
        qualityPrioritization: 'balanced',
      });
      
      const photoUri = `file://${photo.path}`;
      console.log('Photo path:', photoUri);
      const result = await TextRecognition.recognize(photoUri);
      console.log('Recognized text:', result.text);
      
      // Split text into lines and format with numbers
      const lines = result.text.split('\n').filter(line => line.trim() !== '');
      const numberedText = lines.map((line, index) => `${index + 1}. ${line}`).join('\n');
      setRecognizedText(numberedText);
    } catch (error) {
      console.error('Error taking picture or recognizing text:', error);
      setRecognizedText('Error: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };


  // !! DELETE THIS
  KeepAwake.activate();

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={'light-content'} />
      <AppContent 
        recognizedText={recognizedText}
        setRecognizedText={setRecognizedText}
        hasPermission={hasPermission}
        device={device}
        camera={camera}
        takePicture={takePicture}
        isProcessing={isProcessing}
      />
    </SafeAreaProvider>
  );
}

function AppContent({ recognizedText, setRecognizedText, hasPermission, device, camera, takePicture, isProcessing }) {
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission required</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />
      
      <View style={styles.overlay}>
        {recognizedText ? (
          <View style={styles.textContainer}>
            <Text style={styles.recognizedText}>{recognizedText}</Text>
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setRecognizedText('')}
            >
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View />
        )}
        
        <View style={styles.bottomControls}>
          <TouchableOpacity 
            style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}
            onPress={takePicture}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: '#000'
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  textContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    maxHeight: '40%',
  },
  recognizedText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  clearButton: {
    marginTop: 15,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bottomControls: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
});

export default App;

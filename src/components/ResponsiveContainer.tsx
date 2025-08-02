import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  Dimensions, 
  ScrollView, 
  Platform,
  StatusBar as RNStatusBar,
  ScaledSize,
  KeyboardAvoidingView
} from 'react-native';

// Design specs dimensions
const DESIGN_WIDTH = 412;
const DESIGN_HEIGHT = 892;

interface ResponsiveContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  backgroundColor?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ 
  children, 
  scrollable = true,
  keyboardAvoiding = true,
  backgroundColor = '#FFFFFF'
}) => {
  const [dimensions, setDimensions] = useState<ScaledSize>(Dimensions.get('window'));
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    
    return () => subscription?.remove();
  }, []);
  
  // Calculate scale factors based on design specs
  const widthScale = dimensions.width / DESIGN_WIDTH;
  const heightScale = dimensions.height / DESIGN_HEIGHT;
  
  // Use the smaller scale factor to ensure the content fits on the screen
  const scale = Math.min(widthScale, heightScale);
  
  // Calculate container dimensions
  const containerWidth = Math.min(DESIGN_WIDTH, dimensions.width);
  const containerHeight = Math.min(DESIGN_HEIGHT, dimensions.height * 0.95);
  
  // Calculate padding for status bar on iOS
  const statusBarHeight = Platform.OS === 'ios' ? RNStatusBar.currentHeight || 0 : 0;
  
  const Container = scrollable ? ScrollView : View;
  
  const content = (
    <Container 
      contentContainerStyle={scrollable ? styles.scrollContent : undefined}
      showsVerticalScrollIndicator={false}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </Container>
  );
  
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={styles.centeredContainer}>
        <View 
          style={[
            styles.container, 
            { 
              width: containerWidth, 
              height: containerHeight,
              marginTop: statusBarHeight
            }
          ]}
        >
          {keyboardAvoiding ? (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
            >
              {content}
            </KeyboardAvoidingView>
          ) : (
            content
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#CAC4D0",
    overflow: "hidden",
    position: 'relative',
  },
  scrollContent: {
    flexGrow: 1,
  }
}); 
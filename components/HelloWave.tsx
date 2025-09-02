import { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';

interface HelloWaveProps {
  size?: number;
  style?: ViewStyle;
}

export function HelloWave({ size = 28, style }: HelloWaveProps) {
  const rotationAnimation = useSharedValue(0);

  useEffect(() => {
    rotationAnimation.value = withRepeat(
      withSequence(withTiming(25, { duration: 150 }), withTiming(0, { duration: 150 })),
      4 // Run the animation 4 times
    );
  }, [rotationAnimation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationAnimation.value}deg` }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      <ThemedText style={[styles.text, { fontSize: size, lineHeight: size + 4 }]}>👋</ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  text: {
    marginTop: -6,
  },
});

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Provider = 'github' | 'google';

interface SocialAuthButtonProps {
  provider: Provider;
  onPress: () => Promise<void>;
  style?: any;
  disabled?: boolean;
}

interface ProviderConfig {
  label: string;
  icon: string;
  colors: {
    default: string;
    pressed: string;
    border: string;
    pressedBorder: string;
  };
}

const providerConfigs: Record<Provider, ProviderConfig> = {
  github: {
    label: 'Continue with GitHub',
    icon: 'logo-github',
    colors: {
      default: '#24292e',
      pressed: '#1b1f23',
      border: '#1b1f23',
      pressedBorder: '#000000',
    },
  },
  google: {
    label: 'Continue with Google',
    icon: 'logo-google',
    colors: {
      default: '#EA4335',
      pressed: '#D32F2F',
      border: '#D32F2F',
      pressedBorder: '#B71C1C',
    },
  },
};

export function SocialAuthButton({ provider, onPress, style, disabled }: SocialAuthButtonProps) {
  const config = providerConfigs[provider];
  
  const handlePress = async () => {
    if (disabled) return;
    try {
      await onPress();
    } catch (error) {
      console.error(`${provider} sign-in error:`, error);
    }
  };
  
  return (
    <Pressable 
      disabled={!!disabled}
      style={({pressed}) => [
        styles.button,
        {
          backgroundColor: disabled
            ? '#9e9e9e'
            : pressed
            ? config.colors.pressed
            : config.colors.default,
          borderColor: disabled
            ? '#9e9e9e'
            : pressed
            ? config.colors.pressedBorder
            : config.colors.border,
          opacity: disabled ? 0.7 : 1,
        },
        style
      ]}
      onPress={handlePress}
    >
      <Ionicons name={config.icon as any} size={24} color="#ffffff" style={styles.icon} />
      <Text style={styles.buttonText}>{config.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    marginRight: 10,
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
    color: '#888888',
  },
});

export default SocialAuthButton;

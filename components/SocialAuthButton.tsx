import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Provider = 'github' | 'google';

interface SocialAuthButtonProps {
  provider: Provider;
  onPress: () => Promise<void>;
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
  disclaimer: string;
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
    disclaimer: "By signing in with GitHub, you'll be able to share your skills and repositories with other users.",
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
    disclaimer: "By signing in with Google, you'll get personalized recommendations based on your skills.",
  },
};

export function SocialAuthButton({ provider, onPress }: SocialAuthButtonProps) {
  const config = providerConfigs[provider];
  
  const handlePress = async () => {
    try {
      await onPress();
    } catch (error) {
      console.error(`${provider} sign-in error:`, error);
    }
  };
  
  return (
    <View style={styles.container}>
      <Pressable 
        style={({pressed}) => [
          styles.button,
          {
            backgroundColor: pressed ? config.colors.pressed : config.colors.default,
            borderColor: pressed ? config.colors.pressedBorder : config.colors.border,
          }
        ]}
        onPress={handlePress}
      >
        <Ionicons name={config.icon as any} size={24} color="#ffffff" style={styles.icon} />
        <Text style={styles.buttonText}>{config.label}</Text>
      </Pressable>
      
      <Text style={styles.disclaimer}>
        {config.disclaimer}
      </Text>
    </View>
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
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    marginRight: 12,
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

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useDice } from '@/hooks/useDice';

interface ImageUploaderProps {
  onImageSelected: (uri: string) => void;
  currentImage?: string;
}

export function ImageUploader({ onImageSelected, currentImage }: ImageUploaderProps) {
  const { theme } = useDice();
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to your photos');
        return;
      }

      setUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        const fileSize = result.assets[0].fileSize || 0;
        
        if (fileSize > 5 * 1024 * 1024) {
          Alert.alert('File too large', 'Please select an image under 5MB');
          return;
        }
        
        onImageSelected(uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          borderColor: theme.primary,
          backgroundColor: theme.surfaceVariant,
        },
      ]}
      onPress={pickImage}
      disabled={uploading}
    >
      {currentImage ? (
        <View style={styles.imagePreview}>
          <Image source={{ uri: currentImage }} style={styles.image} contentFit="cover" />
          <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
            <MaterialIcons name="edit" size={24} color={theme.primary} />
          </View>
        </View>
      ) : (
        <View style={styles.uploadPrompt}>
          <MaterialIcons name="cloud-upload" size={48} color={theme.primary} />
          <Text style={[styles.uploadText, { color: theme.primary }]}>
            {uploading ? 'Loading...' : 'Click to upload'}
          </Text>
          <Text style={[styles.uploadHint, { color: theme.textSecondary }]}>
            JPG, PNG, GIF (max 5MB)
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 160,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadPrompt: {
    alignItems: 'center',
    padding: SPACING.md,
  },
  uploadText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    marginTop: SPACING.sm,
  },
  uploadHint: {
    ...TYPOGRAPHY.caption,
    marginTop: SPACING.xs,
  },
});

// src/components/commons/ResourceCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { Resource } from '../../types';
import { theme } from '../../config/theme';

interface ResourceCardProps {
  resource: Resource;
  onPress?: (resource: Resource) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onPress }) => {

  const handleOpenResource = () => {
    if (resource.url_resource) {
      Linking.openURL(resource.url_resource)
        .catch(err => {
          console.error('Failed to open resource URL:', err);
          Alert.alert('Error', 'No se pudo abrir el recurso. Asegúrate de que la URL sea válida.');
        });
    } else {
      Alert.alert('Información', 'Este recurso no tiene una URL asociada.');
    }
  };

  const handleCardPress = () => {
    if (onPress) {
      onPress(resource);
    } else {
      handleOpenResource(); // Por defecto, si no hay onPress, intenta abrir el recurso
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleCardPress} activeOpacity={0.8}>
      <View style={styles.header}>
      
        <View style={styles.headerText}>
          <Text style={styles.title}>{resource.title}</Text>
          <Text style={styles.type}>{resource.type_resource.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.detailText}>{resource.detail}</Text>
        <View style={styles.metaInfo}>
          <Text style={styles.createdAt}>
            Creado: {new Date(resource.created_at).toLocaleDateString()}
          </Text>
          <Text style={styles.createdBy}>
            Por: {resource.created_by_user_email}
          </Text>
        </View>
      </View>

      {resource.url_resource && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.openButton} onPress={handleOpenResource}>
            
            <Text style={styles.openButtonText}>Abrir Recurso</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.backgroundWhite,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.inputBorder,
  },
  resourceIcon: {
    marginRight: 15,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textDark,
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    color: theme.primaryDarkBlue,
    fontWeight: '600',
  },
  detailSection: {
    marginBottom: 15,
  },
  detailText: {
    fontSize: 15,
    color: theme.textDark,
    lineHeight: 22,
  },
  metaInfo: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  createdAt: {
    fontSize: 12,
    color: theme.textMuted,
  },
  createdBy: {
    fontSize: 12,
    color: theme.textMuted,
    marginLeft: 10,
  },
  footer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.inputBorder,
    alignItems: 'flex-end',
  },
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.accentLightBlue,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    shadowColor: theme.accentLightBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  openButtonText: {
    color: theme.backgroundWhite,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default ResourceCard;
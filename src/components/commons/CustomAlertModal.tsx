// src/components/commons/CustomAlertModal.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '../../config/theme';

interface CustomAlertModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  iconName: string;
  iconColor: string;
  buttonText?: string;
  showButton?: boolean;
}

const CustomAlertModal: React.FC<CustomAlertModalProps> = ({
  isVisible,
  onClose,
  title,
  message,
  iconName,
  iconColor,
  buttonText = 'OK',
  showButton = true,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Icon name={iconName} size={60} color={iconColor} style={modalStyles.modalIcon} />
          <Text style={modalStyles.modalTitle}>{title}</Text>
          <Text style={modalStyles.modalMessage}>{message}</Text>

          {showButton && (
            <TouchableOpacity
              style={[modalStyles.button, { backgroundColor: iconColor }]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={modalStyles.textStyle}>{buttonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%', // Ancho del modal
    maxWidth: 400, // Ancho máximo para pantallas grandes
  },
  modalIcon: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: theme.textDark,
  },
  modalMessage: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    color: theme.textMuted,
  },
  button: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    minWidth: 100,
    alignSelf: 'stretch', // Ocupar todo el ancho disponible
    marginTop: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default CustomAlertModal;
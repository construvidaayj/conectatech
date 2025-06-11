import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { StackScreenProps } from '@react-navigation/stack';
import { theme } from '../../config/theme';
import { MainDrawerParamList } from '../../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePostFetchData } from '../../hooks/usePostFetchData';
import { useQueryClient } from '@tanstack/react-query';
import CustomHeader from '../../components/commons/CustomHeader';
import usePermissionAlert from '../../hooks/usePermissionAlert';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import SectionTitle from '../../components/commons/SectionTitle';
import useFeedbackModal from '../../hooks/useFeedbackModal';

const ConectaTechLogo = require('../../assets/images/ConectaTech2.png');
type ContactFormScreenProps = StackScreenProps<MainDrawerParamList, 'ContactForm'>;

interface CreateContactPayload {
  full_name: string;
  boss_name: string;
  position: string;
  vehicle_plate?: string;
  vehicle_type?: string;
  contact_numbers: string[];
}

const ContactFormScreen: React.FC<ContactFormScreenProps> = ({ navigation }) => {
  const drawerNavigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const { hasPermission, renderPermissionAlert } = usePermissionAlert({
    requiredRoles: ['maestro', 'supervisor'], // Confirmar si los roles son 'maestro' y 'supervisor' o 'admin'
    redirectScreen: 'Contacts',
    alertTitle: 'Acceso Restringido',
    alertMessage: 'Esta sección solo está disponible para administradores y supervisores.',
    alertIconName: 'shield-half-outline',
    alertIconColor: theme.errorRed,
  });

  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState('');
  const [bossName, setBossName] = useState('');
  const [position, setPosition] = useState('');
  const [contactNumbers, setContactNumbers] = useState<string[]>(['']);
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleType, setVehicleType] = useState('');

  const [formErrors, setFormErrors] = useState<{
    fullName?: string;
    bossName?: string;
    position?: string;
    contactNumbers?: string;
    vehiclePlate?: string;
    vehicleType?: string;
  }>({});

  const { mutate, isPending, isError, error, isSuccess } = usePostFetchData<
    { message: string; id: number },
    CreateContactPayload
  >('/contacts');

    // llamando el hook del modal
  const { showModal, FeedbackModalComponent } = useFeedbackModal();

  // Función para resetear el formulario
  const resetForm = () => {
    setFullName('');
    setBossName('');
    setPosition('');
    setContactNumbers(['']);
    setVehiclePlate('');
    setVehicleType('');
    setFormErrors({}); 
  };

  // Efecto para manejar el éxito de la creación
  React.useEffect(() => {
    if (isSuccess) {
      showModal({
        title: 'Éxito',
        message: 'Contacto creado exitosamente.',
        iconName: 'checkmark-circle-outline',
        iconColor: theme.successGreen,
        showButton: true,
        onCloseCallback: () => { 
          resetForm();
          queryClient.invalidateQueries({ queryKey: ['contacts'] });
          navigation.goBack();
        },
      });
    }
  }, [isSuccess, navigation, queryClient, showModal]);
    // Efecto para manejar el falló de la creación
  React.useEffect(() => {
    if (isError) {
      const errorMessage = 'Ocurrió un error inesperado al crear el contacto.';
      showModal({
        title: 'Error',
        message: errorMessage,
        iconName: 'close-circle-outline',
        iconColor: theme.errorRed,
        showButton: true, 
      });
    }
  }, [isError, error, showModal]); 

  if (!hasPermission) {
    return (
      <>
        {renderPermissionAlert()}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: theme.backgroundWhite }}>
          <Text style={{ fontSize: 18, textAlign: 'center', color: theme.textMuted }}>
            Cargando permisos de acceso...
          </Text>
        </View>
      </>
    );
  }

  const addContactNumberField = () => {
    setContactNumbers([...contactNumbers, '']);
  };

  const removeContactNumberField = (index: number) => {
    const newNumbers = [...contactNumbers];
    newNumbers.splice(index, 1);
    setContactNumbers(newNumbers);
  };

  const handleContactNumberChange = (text: string, index: number) => {
    const newNumbers = [...contactNumbers];
    newNumbers[index] = text;
    setContactNumbers(newNumbers);
  };

  const handleSubmit = () => {
    setFormErrors({});
    let isValid = true;
    const errors: typeof formErrors = {};

    if (!fullName.trim()) {
      errors.fullName = 'El nombre completo es requerido.';
      isValid = false;
    }
    if (!bossName.trim()) {
      errors.bossName = 'El nombre del jefe es requerido.';
      isValid = false;
    }
    if (!position.trim()) {
      errors.position = 'El cargo es requerido.';
      isValid = false;
    }
    const hasValidNumber = contactNumbers.some(num => num.trim() !== '');
    if (!hasValidNumber) {
      errors.contactNumbers = 'Debes añadir al menos un número de contacto.';
      isValid = false;
    } else {
      contactNumbers.forEach((num, index) => {
        if (num.trim() && !/^\+?[0-9\s-()]+$/.test(num.trim())) {
          errors.contactNumbers = 'Formato de número inválido. Usa solo dígitos, +, -, ().';
          isValid = false;
        }
      });
    }

    if (!vehiclePlate.trim()) {
      errors.vehiclePlate = 'La placa es requerida.';
      isValid = false;
    }

    if (!vehicleType.trim()) {
      errors.vehicleType = 'El tipo es requerido.';
      isValid = false;
    }

    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    const payload: CreateContactPayload = {
      full_name: fullName,
      boss_name: bossName,
      position: position,
      vehicle_plate: vehiclePlate,
      vehicle_type: vehicleType,
      contact_numbers: contactNumbers.filter(num => num.trim() !== ''),
    };

    mutate(payload);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader
        leftImageSource={ConectaTechLogo}
        onLeftPress={() => drawerNavigation.openDrawer()}
        leftIcon="menu"
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <SectionTitle title="Crear Nuevo Contacto" />

            <Text style={styles.sectionTitle}>Información Principal</Text>
            <View style={[styles.inputWrapper, formErrors.fullName && styles.inputErrorBorder]}>
              <Icon name="person-outline" size={22} color={theme.primaryDarkBlue} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre completo del contacto"
                placeholderTextColor={theme.textMuted}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
            {formErrors.fullName && <Text style={styles.errorText}>{formErrors.fullName}</Text>}

            <View style={[styles.inputWrapper, formErrors.bossName && styles.inputErrorBorder]}>
              <Icon name="briefcase-outline" size={22} color={theme.primaryDarkBlue} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre del jefe"
                placeholderTextColor={theme.textMuted}
                value={bossName}
                onChangeText={setBossName}
              />
            </View>
            {formErrors.bossName && <Text style={styles.errorText}>{formErrors.bossName}</Text>}

            <View style={[styles.inputWrapper, formErrors.position && styles.inputErrorBorder]}>
              <Icon name="medal-outline" size={22} color={theme.primaryDarkBlue} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Cargo o posición"
                placeholderTextColor={theme.textMuted}
                value={position}
                onChangeText={setPosition}
              />
            </View>
            {formErrors.position && <Text style={styles.errorText}>{formErrors.position}</Text>}

            <Text style={styles.sectionTitle}>Números de Contacto</Text>
            {contactNumbers.map((number, index) => (
              <View key={index} style={[styles.inputWrapper, styles.contactNumberInputWrapper, formErrors.contactNumbers && styles.inputErrorBorder]}>
                <Icon name="call-outline" size={22} color={theme.primaryDarkBlue} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={`Número de contacto ${index + 1}`}
                  placeholderTextColor={theme.textMuted}
                  keyboardType="phone-pad"
                  value={number}
                  onChangeText={(text) => handleContactNumberChange(text, index)}
                />
                {contactNumbers.length > 1 && (
                  <TouchableOpacity onPress={() => removeContactNumberField(index)} style={styles.removeButton}>
                    <Icon name="close-circle" size={24} color={theme.errorRed} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {formErrors.contactNumbers && <Text style={styles.errorText}>{formErrors.contactNumbers}</Text>}

            <TouchableOpacity onPress={addContactNumberField} style={styles.addNumberButton}>
              <Icon name="add-circle-outline" size={20} color={theme.primaryDarkBlue} />
              <Text style={styles.addNumberButtonText}>Añadir otro número</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Información del Vehículo</Text>
            <View style={[styles.inputWrapper, formErrors.vehiclePlate && styles.inputErrorBorder]}>
              <Icon name="car-outline" size={22} color={theme.primaryDarkBlue} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Placa del vehículo"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="characters"
                value={vehiclePlate}
                onChangeText={setVehiclePlate}
              />
            </View>
            {formErrors.vehiclePlate && <Text style={styles.errorText}>{formErrors.vehiclePlate}</Text>}

            <View style={[styles.inputWrapper, formErrors.vehicleType && styles.inputErrorBorder]}>
              <Icon name="settings-outline" size={22} color={theme.primaryDarkBlue} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Tipo de vehículo (ej. Moto,Carry)"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="characters"
                value={vehicleType}
                onChangeText={setVehicleType}
              />
            </View>
            {formErrors.vehicleType && <Text style={styles.errorText}>{formErrors.vehicleType}</Text>}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color={theme.backgroundWhite} />
              ) : (
                <Text style={styles.submitButtonText}>Guardar Contacto</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <FeedbackModalComponent />
    </SafeAreaView>
  );
};

export default ContactFormScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.backgroundWhite,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.textDark,
    marginTop: 20,
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgroundWhite,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: theme.inputBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.textDark,
  },
  errorText: {
    color: theme.errorRed,
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 5,
  },
  inputErrorBorder: {
    borderColor: theme.errorRed,
  },
  contactNumberInputWrapper: {
    marginBottom: 10,
  },
  removeButton: {
    marginLeft: 10,
    padding: 5,
  },
  addNumberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.accentLightBlue,
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.primaryDarkBlue,
  },
  addNumberButtonText: {
    color: theme.primaryDarkBlue,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: theme.accentLightBlue,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: theme.accentLightBlue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  submitButtonText: {
    color: theme.backgroundWhite,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.8,
  },
});
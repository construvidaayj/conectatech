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
  StatusBar,
  ScrollView,
  // Alert, // <-- ELIMINADO: Ya no usaremos Alert
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
import { Picker } from '@react-native-picker/picker';

import { Resource } from '../../types';
import usePermissionAlert from '../../hooks/usePermissionAlert';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../components/commons/CustomHeader';
import SectionTitle from '../../components/commons/SectionTitle';
import useFeedbackModal from '../../hooks/useFeedbackModal'; // <-- ¡IMPORTADO: El nuevo hook!

const ConectaTechLogo = require('../../assets/images/ConectaTech2.png');
type ResourceFormScreenProps = StackScreenProps<MainDrawerParamList, 'ResourceForm'>;

interface CreateResourcePayload {
  title: string;
  detail: string;
  type_resource: Resource['type_resource'];
  url_resource: string;
}

const validResourceTypes: Resource['type_resource'][] = ['documento', 'video'];

const ResourceFormScreen: React.FC<ResourceFormScreenProps> = ({ navigation }) => {
  const drawerNavigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const { hasPermission, renderPermissionAlert } = usePermissionAlert({
    requiredRoles: ['maestro', 'supervisor'],
    redirectScreen: 'Contacts',
    alertTitle: 'Acceso Restringido',
    alertMessage: 'Esta sección solo está disponible para administradores y supervisores.',
    alertIconName: 'shield-half-outline',
    alertIconColor: theme.errorRed,
  });

  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [typeResource, setTypeResource] = useState<Resource['type_resource']>(validResourceTypes[0] || 'documento');
  const [urlResource, setUrlResource] = useState('');
  const [formErrors, setFormErrors] = useState<{
    title?: string;
    detail?: string;
    typeResource?: string;
    urlResource?: string;
  }>({});

  // ¡USANDO EL HOOK DEL MODAL!
  const { showModal, FeedbackModalComponent } = useFeedbackModal();

  const { mutate, isPending, isError, error, isSuccess } = usePostFetchData<
    { message: string; id: number },
    CreateResourcePayload
  >('/resources');

  // FUNCION DE RESETEO DEL FORMULARIO
  const resetForm = () => {
    setTitle('');
    setDetail('');
    setTypeResource(validResourceTypes[0] || 'documento');
    setUrlResource('');
    setFormErrors({}); // ¡IMPORTANTE: también limpiar errores de formulario!
  };

  // Lógica para mostrar modal de éxito y manejar navegación/reseteo
  React.useEffect(() => {
    if (isSuccess) {
      showModal({
        title: 'Éxito',
        message: 'Recurso creado exitosamente.',
        iconName: 'checkmark-circle-outline',
        iconColor: theme.successGreen,
        showButton: true,
        onCloseCallback: () => {
          resetForm(); // <-- Resetea el formulario al cerrar el modal de éxito
          queryClient.invalidateQueries({ queryKey: ['resources'] });
          navigation.goBack();
        },
      });
    }
  }, [isSuccess, navigation, queryClient, showModal]);

  // Lógica para mostrar modal de error
  React.useEffect(() => {
    if (isError) {
      const errorMessage = 'Ocurrió un error inesperado al crear el recurso.';
      showModal({
        title: 'Error',
        message: errorMessage,
        iconName: 'close-circle-outline',
        iconColor: theme.errorRed,
        showButton: true,
        // No se define onCloseCallback aquí para que el formulario no se borre y el usuario pueda corregir
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

  const handleSubmit = () => {
    setFormErrors({});
    let isValid = true;
    const errors: typeof formErrors = {};

    if (!title.trim()) {
      errors.title = 'El título es requerido.';
      isValid = false;
    }

    if (!detail.trim()) {
      errors.detail = 'La descripción es requerida.';
      isValid = false;
    }

    if (!typeResource || !validResourceTypes.includes(typeResource)) {
      errors.typeResource = 'Selecciona un tipo de recurso válido.';
      isValid = false;
    }
    if (!urlResource.trim()) {
      errors.urlResource = 'La URL del recurso es requerida.';
      isValid = false;
    } else if (!/^https?:\/\/\S+$/.test(urlResource.trim())) {
      errors.urlResource = 'Ingresa una URL válida (ej. https://ejemplo.com/recurso).';
      isValid = false;
    }

    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    const payload: CreateResourcePayload = {
      title: title.trim(),
      detail: detail.trim(),
      type_resource: typeResource,
      url_resource: urlResource.trim(),
    };

    mutate(payload);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.backgroundWhite} />
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
            <SectionTitle title="Crear Nuevo Recurso"/>

            <Text style={styles.sectionTitle}>Detalles del Recurso</Text>

            <View style={[styles.inputWrapper, formErrors.title && styles.inputErrorBorder]}>
              <Icon name="text-outline" size={22} color={theme.primaryDarkBlue} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Título del recurso"
                placeholderTextColor={theme.textMuted}
                value={title}
                onChangeText={setTitle}
              />
            </View>
            {formErrors.title && <Text style={styles.errorText}>{formErrors.title}</Text>}

            <View style={[styles.inputWrapper, formErrors.detail && styles.inputErrorBorder, { height: 100 }]}>
              <Icon name="information-circle-outline" size={22} color={theme.primaryDarkBlue} style={[styles.inputIcon, { alignSelf: 'flex-start', paddingTop: 14 }]} />
              <TextInput
                style={[styles.input, { height: '70%' }]}
                placeholder="Detalle o descripción"
                placeholderTextColor={theme.textMuted}
                value={detail}
                onChangeText={setDetail}
                multiline
                textAlignVertical="top"
              />
            </View>
            {formErrors.detail && <Text style={styles.errorText}>{formErrors.detail}</Text>}

            <Text style={styles.label}>Tipo de Recurso:</Text>
            <View style={[styles.inputWrapper, styles.pickerWrapper, formErrors.typeResource && styles.inputErrorBorder]}>
              <Icon name="layers-outline" size={22} color={theme.primaryDarkBlue} style={styles.pickerIcon} />
              <Picker
                selectedValue={typeResource}
                onValueChange={(itemValue) => setTypeResource(itemValue as Resource['type_resource'])}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {validResourceTypes.map((type) => (
                  <Picker.Item key={type} label={type.charAt(0).toUpperCase() + type.slice(1)} value={type} />
                ))}
              </Picker>
            </View>
            {formErrors.typeResource && <Text style={styles.errorText}>{formErrors.typeResource}</Text>}

            <View style={[styles.inputWrapper, formErrors.urlResource && styles.inputErrorBorder]}>
              <Icon name="link-outline" size={22} color={theme.primaryDarkBlue} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="URL del recurso (ej. https://ejemplo.com/doc.pdf)"
                placeholderTextColor={theme.textMuted}
                keyboardType="url"
                autoCapitalize="none"
                value={urlResource}
                onChangeText={setUrlResource}
              />
            </View>
            {formErrors.urlResource && <Text style={styles.errorText}>{formErrors.urlResource}</Text>}

            {/* <--- ELIMINADO: Este bloque de error ya no es necesario, se maneja por el modal ---> */}
            {/* {isError && (
              <Text style={styles.errorText}>
                Error al crear recurso: {'Ocurrió un error inesperado.'}
              </Text>
            )} */}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color={theme.backgroundWhite} />
              ) : (
                <Text style={styles.submitButtonText}>Guardar Recurso</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* <--- ¡AÑADIDO: Renderiza el componente del modal aquí! ---> */}
      <FeedbackModalComponent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.backgroundWhite,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  placeholderRight: {
    width: 28 + 10,
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
    minHeight: 52,
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
  pickerIcon: {
    marginLeft: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.textDark,
    paddingVertical: Platform.OS === 'ios' ? 15 : 0,
  },
  label: {
    fontSize: 15,
    color: theme.textDark,
    marginBottom: 8,
    fontWeight: '600',
  },
  pickerWrapper: {
    paddingHorizontal: 0,
    height: 52,
  },
  picker: {
    flex: 1,
    color: theme.textMuted,
  },
  pickerItem: {
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
  hintText: {
    fontSize: 12,
    color: theme.textMuted,
    marginBottom: 16,
    marginLeft: 5,
    marginTop: -10,
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

export default ResourceFormScreen;
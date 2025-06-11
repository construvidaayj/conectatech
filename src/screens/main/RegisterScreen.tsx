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
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { StackScreenProps } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import { theme } from '../../config/theme';
import { MainDrawerParamList } from '../../navigation/types';
import { registerUser } from '../../services/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import usePermissionAlert from '../../hooks/usePermissionAlert';
import useFeedbackModal from '../../hooks/useFeedbackModal'; 
import { User } from '../../types/auth';
import CustomHeader from '../../components/commons/CustomHeader';
import SectionTitle from '../../components/commons/SectionTitle';

const ConectaTechLogo = require('../../assets/images/ConectaTech2.png');
type RegisterScreenProps = StackScreenProps<MainDrawerParamList, 'Register'>;

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const drawerNavigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<User['role']>('normal');
  const [securePassword, setSecurePassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formErrors, setFormErrors] = useState<{
    nombre?: string;
    apellido?: string;
    email?: string;
    password?: string;
    role?: string;
    api?: string;
  }>({});

  const { hasPermission, renderPermissionAlert } = usePermissionAlert({
    requiredRoles: ['maestro', 'supervisor'],
    redirectScreen: 'Contacts',
    alertTitle: 'Acceso Restringido',
    alertMessage: 'Esta sección solo está disponible para administradores y supervisores.',
    alertIconName: 'shield-half-outline',
    alertIconColor: theme.errorRed,
  });

  const availableRoles: User['role'][] = ['normal', 'supervisor', 'maestro'];


  const { showModal, FeedbackModalComponent } = useFeedbackModal();

  const resetForm = () => {
    setNombre('');
    setApellido('');
    setEmail('');
    setPassword('');
    setSelectedRole('normal');
    setSecurePassword(true);
    setFormErrors({}); 
  };

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

  const handleRegister = async () => {
    setFormErrors({});
    setLoading(true);

    let errors: typeof formErrors = {};
    if (!nombre.trim()) { errors.nombre = 'El nombre es requerido.'; }
    if (!apellido.trim()) { errors.apellido = 'El apellido es requerido.'; }
    if (!email.trim()) { errors.email = 'El correo electrónico es requerido.'; }
    else if (!/\S+@\S+\.\S+/.test(email)) { errors.email = 'Ingresa un correo electrónico válido.'; }
    if (!password.trim()) { errors.password = 'La contraseña es requerida.'; }
    else if (password.length < 6) { errors.password = 'La contraseña debe tener al menos 6 caracteres.'; }
    if (!selectedRole) { errors.role = 'Debes seleccionar un rol.'; }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = await registerUser({
        nombre,
        apellido,
        email,
        password,
        role: selectedRole
      });

      if (response && response.user && response.user.id) {
    
        showModal({
          title: 'Éxito',
          message: `Usuario ${response.user.email} creado exitosamente con el rol: ${response.user.role}.`,
          iconName: 'checkmark-circle-outline',
          iconColor: theme.successGreen,
          showButton: true,
          onCloseCallback: () => {
            resetForm(); 
          },
        });
      } else {
       
        showModal({
          title: 'Error de Registro',
          message: 'Error al crear el usuario. Inténtalo de nuevo. Detalles: ' + (response?.message || 'Respuesta inesperada del servidor.'),
          iconName: 'close-circle-outline',
          iconColor: theme.errorRed,
          showButton: true,
         
        });
       
      }
    } catch (error: any) {
      console.error('Error al crear usuario:', error);
     
      showModal({
        title: 'Error de Conexión',
        message: error.message || 'Ocurrió un error inesperado al conectar con el servidor.',
        iconName: 'warning-outline',
        iconColor: theme.errorRed,
        showButton: true,
        
      });
 
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader
        leftImageSource={ConectaTechLogo}
        onLeftPress={() => drawerNavigation.openDrawer()}
        leftIcon="menu"
      />
      <StatusBar barStyle="dark-content" backgroundColor={theme.backgroundWhite} />
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
            <SectionTitle title="Crear Nuevo Usuario" />
            <Text style={styles.sectionTitle}>Información Principal</Text>
            <View style={[styles.inputWrapper, formErrors.nombre && styles.inputErrorBorder]}>
              <Icon name="person-outline" size={22} color={theme.primaryDarkBlue} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="words"
                value={nombre}
                onChangeText={setNombre}
              />
            </View>
            {formErrors.nombre && <Text style={styles.errorText}>{formErrors.nombre}</Text>}

            <View style={[styles.inputWrapper, formErrors.apellido && styles.inputErrorBorder]}>
              <Icon name="person-outline" size={22} color={theme.primaryDarkBlue} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Apellido"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="words"
                value={apellido}
                onChangeText={setApellido}
              />
            </View>
            {formErrors.apellido && <Text style={styles.errorText}>{formErrors.apellido}</Text>}

            <View style={[styles.inputWrapper, formErrors.email && styles.inputErrorBorder]}>
              <Icon name="mail-outline" size={22} color={theme.primaryDarkBlue} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor={theme.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            {formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>}

            <View style={[styles.inputWrapper, formErrors.password && styles.inputErrorBorder]}>
              <Icon name="lock-closed-outline" size={22} color={theme.primaryDarkBlue} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña inicial"
                placeholderTextColor={theme.textMuted}
                secureTextEntry={securePassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setSecurePassword(!securePassword)} style={styles.passwordToggle}>
                <Icon name={securePassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={theme.textMuted} />
              </TouchableOpacity>
            </View>
            {formErrors.password && <Text style={styles.errorText}>{formErrors.password}</Text>}

            <Text style={styles.sectionTitle}>Seleccionar tipo de usuario</Text>
            <View style={[styles.pickerWrapper, formErrors.role && styles.inputErrorBorder]}>
              <Icon name="people-outline" size={22} color={theme.primaryDarkBlue} style={styles.inputIcon} />
              <Picker
                selectedValue={selectedRole}
                onValueChange={(itemValue: User['role']) => setSelectedRole(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                dropdownIconColor={theme.primaryDarkBlue}
              >
                {availableRoles.map((role) => (
                  <Picker.Item key={role} label={role.charAt(0).toUpperCase() + role.slice(1)} value={role} />
                ))}
              </Picker>
            </View>
            {formErrors.role && <Text style={styles.errorText}>{formErrors.role}</Text>}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              activeOpacity={0.8}
              disabled={loading}
            >
              {
                loading ? (
                  <ActivityIndicator color={theme.backgroundWhite} />
                ) : (
                  <Text style={styles.registerButtonText}>Crear Usuario</Text>
                )
              }
            </TouchableOpacity>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

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
    paddingVertical: Platform.OS === 'ios' ? 15 : 0,
  },
  passwordToggle: {
    padding: 8,
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
  registerButton: {
    backgroundColor: theme.accentLightBlue,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: theme.accentLightBlue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  registerButtonText: {
    color: theme.backgroundWhite,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.8,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgroundWhite,
    borderRadius: 12,
    marginBottom: 16,
    paddingLeft: 16,
    height: 52,
    borderWidth: 1,
    borderColor: theme.inputBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  picker: {
    flex: 1,
    height: 52,
    color: theme.textDark,
  },
  pickerItem: {
    fontSize: 16,
    color: theme.textDark,
  },
  pickerLabel: {
    fontSize: 16,
    color: theme.textMuted,
    marginBottom: 8,
    marginLeft: 5,
    marginTop: 10,
  },
});

export default RegisterScreen;
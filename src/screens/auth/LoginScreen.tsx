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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { StackScreenProps } from '@react-navigation/stack';
import { theme } from '../../config/theme';
import { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../context';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = ({ navigation }: StackScreenProps<AuthStackParamList, 'Login'>) => {
  const { login } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [secure, setSecure] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string; api?: string }>({});

  const handleLogin = async () => {
    setFormErrors({});
    setLoading(true);

    const errors: { email?: string; password?: string; api?: string } = {};

    if (!email.trim()) {
      errors.email = 'El correo electrónico es requerido.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Ingresa un correo electrónico válido.';
    }

    if (!password.trim()) {
      errors.password = 'La contraseña es requerida.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const success = await login({ email, password });
      if (!success) {
        setFormErrors(prev => ({ ...prev, api: 'Credenciales inválidas. Por favor, intenta de nuevo.' }));
      }
    } catch (apiError: any) {
      console.error('Error al iniciar sesión:', apiError);
      setFormErrors(prev => ({ ...prev, api: apiError.message || 'Ocurrió un error inesperado al iniciar sesión.' }));
    } finally {
      setLoading(false);
    }
  };

  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.backgroundWhite} />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.container}>
            <Icon name="person-circle-outline" size={100} color={theme.primaryDarkBlue} style={styles.avatarIcon} />
            <Text style={styles.title}>ConectaTech</Text>
            <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
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
                placeholder="Contraseña"
                placeholderTextColor={theme.textMuted}
                secureTextEntry={secure}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.passwordToggle}>
                <Icon name={secure ? 'eye-off-outline' : 'eye-outline'} size={22} color={theme.textMuted} />
              </TouchableOpacity>
            </View>
            {formErrors.password && <Text style={styles.errorText}>{formErrors.password}</Text>}
            {formErrors.api && <Text style={styles.errorText}>{formErrors.api}</Text>}            
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.backgroundWhite} />
              ) : (
                <Text style={styles.loginButtonText}>Iniciar sesión</Text>
              )}
            </TouchableOpacity>

          </View>
        </KeyboardAvoidingView>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  avatarIcon: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.primaryDarkBlue,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.textMuted,
    textAlign: 'center',
    marginBottom: 40,
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
  passwordToggle: {
    padding: 8,
  },
  loginButton: {
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
  loginButtonText: {
    color: theme.backgroundWhite,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.8,
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
});

export default LoginScreen;
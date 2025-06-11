// src/components/CustomTextInput.tsx
import React from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TextInputProps,
} from 'react-native';

// Define las props que aceptará tu CustomTextInput
interface CustomTextInputProps extends TextInputProps {
  label?: string; // Opcional: una etiqueta para el input
  error?: string; // Opcional: mensaje de error para mostrar debajo del input
  // Puedes añadir más props personalizadas aquí si las necesitas
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  style,
  onFocus, // Captura la función onFocus
  onBlur,  // Captura la función onBlur
  ...rest
}) => {
  const [isFocused, setIsFocused] = React.useState(false); // Nuevo estado para el foco

  const handleFocus = (event: any) => {
    setIsFocused(true);
    onFocus && onFocus(event); // Llama a la función onFocus original si existe
  };

  const handleBlur = (event: any) => {
    setIsFocused(false);
    onBlur && onBlur(event); // Llama a la función onBlur original si existe
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          isFocused ? styles.inputFocused : null, // Aplica estilo al estar enfocado
          style,
        ]}
        placeholderTextColor="#a0a0a0" // Un color por defecto para el placeholder
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20, // Espacio inferior para cada input
  },
  label: {
    fontSize: 15,
    color: '#555',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    paddingVertical: 14, // Más padding vertical
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#d0d0d0', // Borde más sutil
    borderRadius: 10, // Bordes un poco más redondeados
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Sombra más pronunciada pero...
    shadowOpacity: 0.08, // ...más sutil
    shadowRadius: 3,
    elevation: 3, // Sombra para Android
  },
  inputError: {
    borderColor: '#e74c3c', // Borde rojo si hay un error
    borderWidth: 2, // Borde más grueso para el error
  },
  inputFocused: {
    borderColor: '#007AFF', // Color de borde al estar enfocado
    shadowColor: '#007AFF', // Sombra de color al enfocar
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 5,
  },
});

export default CustomTextInput;
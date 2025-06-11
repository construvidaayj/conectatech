// src/components/commons/CustomSearchBar.tsx
import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '../../config/theme';

interface CustomSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

const CustomSearchBar: React.FC<CustomSearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Buscar...',
  onClear,
  containerStyle,
  inputStyle,
}) => {
  const handleClear = () => {
    onChangeText('');
    if (onClear) {
      onClear();
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Icon name="search-outline" size={22} color={theme.textMuted} style={styles.icon} />
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        value={value}
        onChangeText={onChangeText}
        clearButtonMode={Platform.OS === 'ios' ? 'while-editing' : 'never'}
      />
      {value.length > 0 && Platform.OS === 'android' && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Icon name="close-circle-outline" size={22} color={theme.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgroundWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.inputBorder,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginVertical: 6,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.textDark,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 5,
    marginLeft: 10,
  },
});

export default CustomSearchBar;
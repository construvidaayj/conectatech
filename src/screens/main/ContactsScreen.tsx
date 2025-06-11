// src/screens/ContactsScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { MainDrawerParamList } from '../../navigation/types';
import { useGetFetchData } from '../../hooks/useGetFetchData';
import { Contact } from '../../types';
import ContactCard from '../../components/commons/ContactCard';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '../../config/theme';
import CustomHeader from '../../components/commons/CustomHeader';
import CustomSearchBar from '../../components/commons/CustomSearchBar';

const ConectaTechLogo = require('../../assets/images/ConectaTech2.png');

type ContactsScreenProps = DrawerScreenProps<MainDrawerParamList, 'Contacts'>;

const ContactsScreen: React.FC<ContactsScreenProps> = ({ navigation }) => {
  const { data, isLoading, isError, refetch } = useGetFetchData<Contact[]>('/contacts', 'contacts');
  const contacts: Contact[] = data ?? [];

  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddContact = () => {
    navigation.navigate('ContactForm');
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const filteredContacts = useMemo(() => {
    if (!searchTerm.trim()) {
      return contacts;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return contacts.filter(contact =>
      contact.full_name.toLowerCase().includes(lowercasedSearchTerm) ||
      (contact.vehicle?.plate && contact.vehicle?.plate.toLowerCase().includes(lowercasedSearchTerm))
    );
  }, [contacts, searchTerm]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader        
        leftImageSource={ConectaTechLogo}
        onLeftPress={() => navigation.openDrawer()}
        leftIcon="menu"
        onRightPress={handleAddContact}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <CustomSearchBar
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Buscar por nombre o placa..."
          onClear={() => setSearchTerm('')}
        />

        {isLoading && contacts.length === 0 && (
          <View style={styles.centeredMessage}>
            <ActivityIndicator size="large" color={theme.accentLightBlue} />
            <Text style={styles.loadingText}>Cargando contactos...</Text>
          </View>
        )}

        {isError && (
          <View style={styles.centeredMessage}>
            <Icon name="alert-circle-outline" size={50} color={theme.errorRed} />
            <Text style={styles.errorText}>Error al cargar los contactos.</Text>
            <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}

        {(!isLoading || (isLoading && contacts.length > 0)) && (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.accentLightBlue}
              />
            }
          >
            {filteredContacts.length === 0 && !isLoading && !isError ? (
              <View style={styles.centeredMessage}>
                {searchTerm.trim() ? (
                  <>
                    <Icon name="document-text-outline" size={60} color={theme.textMuted} />
                    <Text style={styles.noResultsText}>No se encontraron contactos para "{searchTerm}".</Text>
                    <TouchableOpacity onPress={() => setSearchTerm('')} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Limpiar búsqueda</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Icon name="people-outline" size={60} color={theme.textMuted} />
                    <Text style={styles.noContactsText}>No hay contactos aún.</Text>
                    <Text style={styles.noContactsText}>¡Añade uno nuevo!</Text>
                    <TouchableOpacity onPress={handleAddContact} style={styles.addContactButton}>
                      <Text style={styles.addContactButtonText}>Crear Contacto</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ) : (
              filteredContacts.map((contact, index) => (
                <ContactCard key={contact.id || index} contact={contact} />
              ))
            )}
          </ScrollView>
        )}
      </KeyboardAvoidingView>

      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddContact}
        activeOpacity={0.8}
      >
        <Icon name="add" size={30} color={theme.backgroundWhite} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ContactsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.backgroundWhite,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexGrow: 1,
    gap: 10,
  },
  centeredMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.textMuted,
  },
  errorText: {
    color: theme.errorRed,
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: theme.accentLightBlue,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    shadowColor: theme.accentLightBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  retryButtonText: {
    color: theme.backgroundWhite,
    fontSize: 16,
    fontWeight: '600',
  },
  noContactsText: {
    fontSize: 18,
    color: theme.textMuted,
    textAlign: 'center',
    marginTop: 15,
  },
  noResultsText: {
    fontSize: 18,
    color: theme.textMuted,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  addContactButton: {
    marginTop: 20,
    backgroundColor: theme.primaryDarkBlue,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    shadowColor: theme.primaryDarkBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  addContactButtonText: {
    color: theme.backgroundWhite,
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.accentLightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 30,
    right: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});
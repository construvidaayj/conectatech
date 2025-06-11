// src/screens/ResourcesScreen.tsx
import React, { useState, useMemo } from 'react'; // Importamos useState y useMemo
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView, // Importar KeyboardAvoidingView
  Platform, // Importar Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { MainDrawerParamList } from '../../navigation/types';
import { useGetFetchData } from '../../hooks/useGetFetchData'; // Cambiado de useFetchData a useGetFetchData para consistencia
import { Resource } from '../../types';
import ResourceCard from '../../components/commons/ResourceCard';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '../../config/theme';
import CustomHeader from '../../components/commons/CustomHeader';
import CustomSearchBar from '../../components/commons/CustomSearchBar'; // <--- Importamos CustomSearchBar

const ConectaTechLogo = require('../../assets/images/ConectaTech2.png');
type ResourcesScreenProps = DrawerScreenProps<MainDrawerParamList, 'Resources'>;

const ResourcesScreen: React.FC<ResourcesScreenProps> = ({ navigation }) => {
  const { data, isLoading, isError, refetch } = useGetFetchData<Resource[]>('/resources', 'resources');
  const resources: Resource[] = data ?? [];

  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // <--- Nuevo estado para el término de búsqueda

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleResourcePress = (resource: Resource) => {
    // Si tienes una pantalla de detalle para recursos, navegarías aquí:
    // navigation.navigate('ResourceDetail', { resourceId: resource.id });
  };

  const handleAddResource = () => {
    navigation.navigate('ResourceForm');
  };

  // Lógica de filtrado usando useMemo para optimizar el rendimiento
  const filteredResources = useMemo(() => {
    if (!searchTerm.trim()) {
      return resources; // Si no hay término de búsqueda, devuelve todos los recursos
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return resources.filter(resource =>
      resource.title.toLowerCase().includes(lowercasedSearchTerm) ||
      (resource.detail && resource.detail.toLowerCase().includes(lowercasedSearchTerm)) ||
      resource.type_resource.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [resources, searchTerm]); // Se recalcula solo cuando resources o searchTerm cambian

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader        
        leftImageSource={ConectaTechLogo}
        onLeftPress={() => navigation.openDrawer()}
        leftIcon="menu"
        onRightPress={handleAddResource}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        
        <CustomSearchBar
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Buscar por título, detalle o tipo..."
          onClear={() => setSearchTerm('')}
        />

        {isLoading && resources.length === 0 && (
          <View style={styles.centeredMessage}>
            <ActivityIndicator size="large" color={theme.accentLightBlue} />
            <Text style={styles.loadingText}>Cargando recursos...</Text>
          </View>
        )}

        {isError && (
          <View style={styles.centeredMessage}>
            <Icon name="alert-circle-outline" size={50} color={theme.errorRed} />
            <Text style={styles.errorText}>Error al cargar los recursos.</Text>
            <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}

        {(!isLoading || (isLoading && resources.length > 0)) && (
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
            
            {filteredResources.length === 0 && !isLoading && !isError ? (
              <View style={styles.centeredMessage}>
                {searchTerm.trim() ? (
            
                  <>
                    <Icon name="document-text-outline" size={60} color={theme.textMuted} />
                    <Text style={styles.noResultsText}>No se encontraron recursos para "{searchTerm}".</Text>
                    <TouchableOpacity onPress={() => setSearchTerm('')} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Limpiar búsqueda</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Icon name="folder-open-outline" size={60} color={theme.textMuted} />
                    <Text style={styles.noResourcesText}>No hay recursos disponibles aún.</Text>
                    <TouchableOpacity onPress={handleAddResource} style={styles.addResourceButton}>
                      <Text style={styles.addResourceButtonText}>Añadir Recurso</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ) : (              
              filteredResources.map((resource, index) => (
                <ResourceCard key={resource.id || index} resource={resource} onPress={handleResourcePress} />
              ))
            )}
          </ScrollView>
        )}
      </KeyboardAvoidingView>

      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddResource}
        activeOpacity={0.8}
      >
        <Icon name="add" size={30} color={theme.backgroundWhite} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ResourcesScreen;

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
    gap: 10, // Añadir un poco de espacio entre los ResourceCard
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
  noResourcesText: {
    fontSize: 18,
    color: theme.textMuted,
    textAlign: 'center',
    marginTop: 15,
  },
  // Nuevo estilo para cuando no hay resultados de búsqueda
  noResultsText: {
    fontSize: 18,
    color: theme.textMuted,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  addResourceButton: {
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
  addResourceButtonText: {
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
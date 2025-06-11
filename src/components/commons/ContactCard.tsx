// src/components/commons/ContactCard.tsx
import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Contact } from '../../types';
import ActionSheet from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../config/theme';

interface ContactCardProps {
    contact: Contact;
    onPress?: (contact: Contact) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onPress }) => {

    const actionSheetRef = useRef<any>(null);
    const [currentActionType, setCurrentActionType] = React.useState<'call' | 'whatsapp' | null>(null);
    const insets = useSafeAreaInsets();

    const handlePress = () => {
        if (onPress) {
            onPress(contact);
        }
    };

    const openCall = (phoneNumber: string) => {
        Linking.openURL(`tel:${phoneNumber}`)
            .catch(err => {
                console.error('Failed to open dialer:', err);
                Alert.alert('Error', 'No se pudo abrir el marcador telefónico.');
            });
    };

    const openWhatsApp = (phoneNumber: string) => {
        const url = `whatsapp://send?phone=+57${phoneNumber}`;
        Linking.canOpenURL(url)
            .then(supported => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Alert.alert('Error', 'WhatsApp no está instalado en tu dispositivo o el número no es válido.');
                }
            })
            .catch(err => {
                Alert.alert('Error', 'No se pudo abrir WhatsApp.');
            });
    };

    const handleAction = (actionType: 'call' | 'whatsapp') => {
        if (!contact.contact_numbers || contact.contact_numbers.length === 0) {
            Alert.alert('Información', 'No hay números de contacto disponibles.');
            return;
        }

        if (contact.contact_numbers.length === 1) {
            const phoneNumber = contact.contact_numbers[0].numero;
            actionType === 'call' ? openCall(phoneNumber) : openWhatsApp(phoneNumber);
            return;
        }

        setCurrentActionType(actionType);
        actionSheetRef.current?.show();
    };

    return (
        
            <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.8}>
                <View style={styles.header}>
                    <Icon name="person-circle-outline" size={38} color={theme.primaryDarkBlue} style={styles.avatarIcon} />
                    <View style={styles.headerText}>
                        <Text style={styles.fullName}>{contact.full_name}</Text>
                        <Text style={styles.position}>{contact.position}</Text>
                    </View>
                </View>

                <View style={styles.detailSection}>
                    <View style={styles.detailRow}>
                        <Icon name="briefcase-outline" size={18} color={theme.primaryDarkBlue} style={styles.detailIcon} />
                        <Text style={styles.detailText}>Jefe: {contact.boss_name}</Text>
                    </View>

                    {contact.contact_numbers && contact.contact_numbers.length > 0 && (
                        <View>
                            {contact.contact_numbers.map((num, index) => (
                                <View key={num.id || index} style={styles.detailRow}>
                                    <Icon name="call-outline" size={18} color={theme.primaryDarkBlue} style={styles.detailIcon} />
                                    <Text style={styles.detailText}>{num.numero}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {contact.vehicle && (
                        <View style={styles.detailRow}>
                            <Icon name="car-outline" size={18} color={theme.primaryDarkBlue} style={styles.detailIcon} />
                            <Text style={styles.detailText}>Vehículo: {contact.vehicle.plate} ({contact.vehicle.type})</Text>
                        </View>
                    )}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.createdAt}>Creado: {new Date(contact.created_at).toLocaleDateString()}</Text>
                    <View style={styles.actionButtonsContainer}>
                        {contact.contact_numbers && contact.contact_numbers.length > 0 && (
                            <>
                                <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('call')}>
                                    <Icon name="call" size={24} color={theme.primaryDarkBlue} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('whatsapp')}>
                                    <Icon name="logo-whatsapp" size={24} color="#25D366" />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>

                <ActionSheet ref={actionSheetRef} gestureEnabled={true}>
                    <View style={[styles.actionSheetContent, { paddingBottom: insets.bottom + 16 }]}>
                        <Text style={styles.actionSheetTitle}>
                            Selecciona un número para {currentActionType === 'call' ? 'llamar' : 'WhatsApp'}
                        </Text>
                        {contact.contact_numbers?.map((num) => (
                            <TouchableOpacity
                                key={num.id}
                                style={styles.actionSheetButton}
                                onPress={() => {
                                    actionSheetRef.current?.hide();
                                    currentActionType === 'call' ? openCall(num.numero) : openWhatsApp(num.numero);
                                }}
                            >
                                <Text style={styles.actionSheetButtonText}>{num.numero}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={[styles.actionSheetButton, styles.actionSheetCancelButton]}
                            onPress={() => actionSheetRef.current?.hide()}
                        >
                            <Text style={styles.actionSheetCancelText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </ActionSheet>
            </TouchableOpacity>
        

    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.backgroundWhite,
        borderRadius: 12,
        padding: 20,
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
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.inputBorder,
    },
    avatarIcon: {
        marginRight: 15,
    },
    headerText: {
        flex: 1,
    },
    fullName: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.textDark,
        marginBottom: 4,
    },
    position: {
        fontSize: 15,
        color: theme.textMuted,
        fontWeight: '500',
    },
    detailSection: {
        marginBottom: 10,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailIcon: {
        marginRight: 10,
        width: 20,
        textAlign: 'center',
    },
    detailText: {
        fontSize: 15,
        color: theme.textDark,
        flexShrink: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: theme.inputBorder,
    },
    createdAt: {
        fontSize: 13,
        color: theme.textMuted,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        marginLeft: 15,
        padding: 5,
    },
    // Estilos para el ActionSheet
    actionSheetContent: {
        paddingHorizontal: 20,
        paddingTop: 24,
        backgroundColor: theme.backgroundWhite,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    actionSheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.textDark,
        marginBottom: 20,
        textAlign: 'center',
    },
    actionSheetButton: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.inputBorder,
        alignItems: 'center',
    },
    actionSheetButtonText: {
        fontSize: 17,
        color: theme.primaryDarkBlue,
    },
    actionSheetCancelButton: {
        marginTop: 10,
        borderBottomWidth: 0,
    },
    actionSheetCancelText: {
        fontSize: 17,
        color: theme.errorRed,
        fontWeight: '600',
    },
});

export default ContactCard;
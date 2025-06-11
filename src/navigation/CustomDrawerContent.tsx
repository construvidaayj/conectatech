// src/navigation/CustomDrawerContent.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Button,
} from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { theme } from '../config/theme';
import { useAuth } from '../context';
import CustomButton from '../components/ui/CustomButton';

const ConectaTechLogo = require('../assets/images/ConectaTech2.png');

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
    const { user, logout } = useAuth();

    const handleLogout = () => {        
        props.navigation.closeDrawer();
        logout();
    };

    return (
        <View style={styles.container}>
            <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.header}>
                    <Image
                        source={ConectaTechLogo}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    {user && (
                        <Text style={styles.userName}>{user.email}</Text>
                    )}
                </View>

                <DrawerItemList {...props} />
            </DrawerContentScrollView>

            <View style={styles.footer}>
                <CustomButton
                    text="Cerrar Sesión"
                    onPress={handleLogout}
                    backgroundColor="#ff5252"
                    textColor="#fff"
                    style={{ marginTop: 10 }}
                />
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.backgroundWhite,
    },
    scrollViewContent: {
        paddingTop: 0,
    },
    header: {
        paddingTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme.inputBorder,
    },
    logo: {
        width: '80%',
        height: 80,

    },
    userName: {
        paddingBottom: 15,
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.textMuted,
    },
    footer: {

        paddingHorizontal: 30,
        paddingBottom: 50,
        borderTopWidth: 1,
        borderTopColor: theme.inputBorder,
        backgroundColor: theme.backgroundWhite,
    },
});

export default CustomDrawerContent;
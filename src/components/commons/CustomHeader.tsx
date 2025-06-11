// src/components/commons/CustomHeader.tsx
import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Image,
    ImageSourcePropType,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '../../config/theme';

interface CustomHeaderProps {
    title?: string;
    onLeftPress?: () => void;
    leftIcon?: string;
    leftImageSource?: ImageSourcePropType;
    leftImageStyle?: object;
    rightIcon?: string;
    onRightPress?: () => void;
    customRightComponent?: React.ReactNode;
    statusBarStyle?: 'dark-content' | 'light-content';
    statusBarBackgroundColor?: string;
}

const CustomHeaderDos: React.FC<CustomHeaderProps> = ({
    onLeftPress,
    leftIcon,
    leftImageSource,
    leftImageStyle,
    statusBarStyle = 'dark-content',
    statusBarBackgroundColor = theme.backgroundWhite,
}) => {
    return (
        <View style={styles.headerContainer}>
            <StatusBar barStyle={statusBarStyle} backgroundColor={statusBarBackgroundColor} />
            <TouchableOpacity
                onPress={onLeftPress}
                style={styles.leftContent}
                disabled={!onLeftPress}
            >
                {leftImageSource ? (
                    <Image
                        source={leftImageSource}
                        style={[styles.leftImage, leftImageStyle]}
                        resizeMode="contain"
                    />
                ) : (
                    <View style={styles.placeholder} />
                )}
            </TouchableOpacity>

            <View style={styles.centerContent} />

            <View style={styles.leftContent}>
                {leftIcon && onLeftPress && (
                    <TouchableOpacity onPress={onLeftPress} style={styles.button}>
                        <Icon name={leftIcon} size={28} color={theme.primaryDarkBlue} />
                    </TouchableOpacity>
                )}               
                {!leftIcon && <View style={styles.placeholder} />}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
    },
    leftContent: {
        minWidth: 40,
        alignItems: 'flex-start',
        paddingLeft: 5,
    },
    rightContent: {
        minWidth: 40,
        alignItems: 'flex-end',
    },
    centerContent: {
        flex: 1,
    },
    button: {
        padding: 5,
    },
    leftImage: {
        width: 140,
        height: 60,        
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.primaryDarkBlue,
        textAlign: 'center',
    },
    placeholder: {
        width: 28 + 10, // Ancho del ícono (28) + padding (5 a cada lado = 10) = 38
    },
});

export default CustomHeaderDos;
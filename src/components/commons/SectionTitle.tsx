// src/components/commons/SectionTitle.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { theme } from '../../config/theme';

interface TitleProps {
    title: string;
}

const SectionTitle: React.FC<TitleProps> = ({title}) => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 5,

    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: theme.primaryDarkBlue,
    },
});

export default SectionTitle;
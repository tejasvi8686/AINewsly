import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

interface SettingsSectionProps {
    title: string;
    children: React.ReactNode;
}

export default function SettingsSection({ title, children }: SettingsSectionProps) {
    return (
        <View style={styles.section}>
            {title ? <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text> : null}
            <View style={styles.sectionContent}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1.2,
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    sectionContent: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        overflow: 'hidden',
    },
});

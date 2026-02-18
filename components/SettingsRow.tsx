import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface SettingsRowProps {
    icon?: string;
    label: string;
    subtitle?: string;
    onPress?: () => void;
    showChevron?: boolean;
    rightElement?: React.ReactNode;
    destructive?: boolean;
}

interface SettingsRowSwitchProps extends Omit<SettingsRowProps, 'rightElement' | 'showChevron'> {
    value: boolean;
    onValueChange: (value: boolean) => void;
}

export function SettingsRow({
    icon,
    label,
    subtitle,
    onPress,
    showChevron = true,
    rightElement,
    destructive = false,
}: SettingsRowProps) {
    const content = (
        <View style={styles.content}>
            {icon && (
                <View style={[styles.iconWrap, destructive && styles.iconDestructive]}>
                    <Ionicons
                        name={icon as any}
                        size={20}
                        color={destructive ? '#ef4444' : 'rgba(255,255,255,0.9)'}
                    />
                </View>
            )}
            <View style={styles.textWrap}>
                <Text style={[styles.label, destructive && styles.labelDestructive]}>{label}</Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
            {rightElement ?? (showChevron && onPress ? (
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.4)" />
            ) : null)}
        </View>
    );

    if (onPress && !rightElement) {
        return (
            <Pressable
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }}
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
                {content}
            </Pressable>
        );
    }

    return <View style={styles.row}>{content}</View>;
}

export function SettingsRowSwitch({
    icon,
    label,
    subtitle,
    value,
    onValueChange,
}: SettingsRowSwitchProps) {
    return (
        <View style={styles.row}>
            <View style={styles.content}>
                {icon && (
                    <View style={styles.iconWrap}>
                        <Ionicons name={icon as any} size={20} color="rgba(255,255,255,0.9)" />
                    </View>
                )}
                <View style={styles.textWrap}>
                    <Text style={styles.label}>{label}</Text>
                    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
                </View>
                <Switch
                    value={value}
                    onValueChange={(v) => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onValueChange(v); }}
                    trackColor={{ false: 'rgba(255,255,255,0.2)', true: 'rgba(255,255,255,0.4)' }}
                    thumbColor={value ? '#fff' : 'rgba(255,255,255,0.5)'}
                    ios_backgroundColor="rgba(255,255,255,0.2)"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
    },
    rowPressed: {
        opacity: 0.7,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrap: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    iconDestructive: {
        backgroundColor: 'rgba(239,68,68,0.15)',
    },
    textWrap: {
        flex: 1,
    },
    label: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    labelDestructive: {
        color: '#ef4444',
    },
    subtitle: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
        marginTop: 2,
    },
});

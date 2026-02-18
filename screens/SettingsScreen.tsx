import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    StatusBar,
    ScrollView,
    Linking,
    Alert,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SettingsSection from '../components/SettingsSection';
import { SettingsRow, SettingsRowSwitch } from '../components/SettingsRow';
import { useSettings } from '../hooks/useSettings';
import SavedLikedTabScreen from './SavedLikedTabScreen';
import { NewsItem } from '../types';

interface SettingsScreenProps {
    saved?: NewsItem[];
    liked?: NewsItem[];
    onRemoveSaved?: (item: NewsItem) => void;
    onRemoveLiked?: (item: NewsItem) => void;
    onLogout?: () => void;
    isGuest?: boolean;
    isAuthenticated?: boolean;
}

const APP_VERSION = '1.0.0';

type ViewMode = 'main' | 'liked' | 'saved';

export default function SettingsScreen({
    saved = [],
    liked = [],
    onRemoveSaved,
    onRemoveLiked,
    onLogout,
    isGuest = true,
    isAuthenticated = false,
}: SettingsScreenProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('main');
    const { notificationsEnabled, setNotificationsEnabled } = useSettings();

    const handleLogout = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', style: 'destructive', onPress: onLogout },
            ]
        );
    };

    const handleRateApp = () => {
        // Placeholder - replace with actual store URL when published
        Linking.openURL('https://apps.apple.com').catch(() => {});
    };

    const handleContactSupport = () => {
        Linking.openURL('mailto:support@ainewsly.com').catch(() => {});
    };

    const handlePrivacyPolicy = () => {
        Linking.openURL('https://ainewsly.com/privacy').catch(() => {});
    };

    const handleTermsOfService = () => {
        Linking.openURL('https://ainewsly.com/terms').catch(() => {});
    };

    if (viewMode === 'liked' || viewMode === 'saved') {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SafeAreaView edges={['top']} style={styles.headerWrapper}>
                    <View style={styles.header}>
                        <Pressable onPress={() => setViewMode('main')} style={styles.backButton} hitSlop={12}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                            <Text style={styles.backText}>Settings</Text>
                        </Pressable>
                        <Text style={styles.headerTitle}>
                            {viewMode === 'liked' ? 'Liked' : 'Saved'}
                        </Text>
                    </View>
                </SafeAreaView>
                <SavedLikedTabScreen
                    initialTab={viewMode === 'liked' ? 0 : 1}
                    saved={saved}
                    liked={liked}
                    onRemoveSaved={onRemoveSaved}
                    onRemoveLiked={onRemoveLiked}
                    hideHeader
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView edges={['top']} style={styles.headerWrapper}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Settings</Text>
                </View>
            </SafeAreaView>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <SettingsSection title="Library">
                    <SettingsRow
                        icon="heart-outline"
                        label="Liked"
                        subtitle={`${liked.length} article${liked.length !== 1 ? 's' : ''}`}
                        onPress={() => setViewMode('liked')}
                    />
                    <SettingsRow
                        icon="bookmark-outline"
                        label="Saved"
                        subtitle={`${saved.length} article${saved.length !== 1 ? 's' : ''}`}
                        onPress={() => setViewMode('saved')}
                    />
                </SettingsSection>

                <SettingsSection title="Account">
                    <SettingsRow
                        icon="person-outline"
                        label={isAuthenticated ? 'Signed in' : isGuest ? 'Guest' : 'Account'}
                        subtitle={isGuest ? 'You are browsing as a guest' : undefined}
                        showChevron={false}
                    />
                </SettingsSection>

                <SettingsSection title="Preferences">
                    <SettingsRowSwitch
                        icon="notifications-outline"
                        label="Push Notifications"
                        subtitle="Get notified about breaking news"
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                    />
                </SettingsSection>

                <SettingsSection title="About">
                    <SettingsRow
                        icon="information-circle-outline"
                        label="Version"
                        subtitle={APP_VERSION}
                        showChevron={false}
                    />
                    <SettingsRow
                        icon="star-outline"
                        label="Rate App"
                        onPress={handleRateApp}
                    />
                    <SettingsRow
                        icon="mail-outline"
                        label="Contact Support"
                        onPress={handleContactSupport}
                    />
                    <SettingsRow
                        icon="shield-checkmark-outline"
                        label="Privacy Policy"
                        onPress={handlePrivacyPolicy}
                    />
                    <SettingsRow
                        icon="document-text-outline"
                        label="Terms of Service"
                        onPress={handleTermsOfService}
                    />
                </SettingsSection>

                {(isAuthenticated || isGuest) && onLogout && (
                    <SettingsSection title="Session">
                        <SettingsRow
                            icon="log-out-outline"
                            label="Sign Out"
                            onPress={handleLogout}
                            destructive
                        />
                    </SettingsSection>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    headerWrapper: {
        backgroundColor: '#000',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.12)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        position: 'absolute',
        left: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    backText: {
        fontSize: 17,
        color: '#fff',
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingVertical: 24,
        paddingHorizontal: 16,
    },
});

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@ainewsly/settings';

export interface AppSettings {
    notificationsEnabled: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
    notificationsEnabled: true,
};

export function useSettings() {
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(SETTINGS_KEY)
            .then((raw) => {
                if (raw) {
                    try {
                        const parsed = JSON.parse(raw) as Partial<AppSettings>;
                        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
                    } catch {
                        setSettings(DEFAULT_SETTINGS);
                    }
                }
            })
            .catch(() => setSettings(DEFAULT_SETTINGS))
            .finally(() => setLoaded(true));
    }, []);

    const updateSettings = useCallback((updates: Partial<AppSettings>) => {
        setSettings((prev) => {
            const next = { ...prev, ...updates };
            AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next)).catch(() => {});
            return next;
        });
    }, []);

    const setNotificationsEnabled = useCallback(
        (enabled: boolean) => updateSettings({ notificationsEnabled: enabled }),
        [updateSettings]
    );

    return {
        settings,
        loaded,
        notificationsEnabled: settings.notificationsEnabled,
        setNotificationsEnabled,
    };
}

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewsItem } from '../types';

const SAVED_NEWS_KEY = '@ainewsly/saved_news';

export function useSavedNews() {
    const [saved, setSaved] = useState<NewsItem[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(SAVED_NEWS_KEY)
            .then((raw) => {
                if (raw) {
                    try {
                        const parsed = JSON.parse(raw) as NewsItem[];
                        setSaved(Array.isArray(parsed) ? parsed : []);
                    } catch {
                        setSaved([]);
                    }
                } else {
                    setSaved([]);
                }
            })
            .catch(() => setSaved([]))
            .finally(() => setLoaded(true));
    }, []);

    const persist = useCallback((items: NewsItem[]) => {
        setSaved(items);
        AsyncStorage.setItem(SAVED_NEWS_KEY, JSON.stringify(items));
    }, []);

    const isSaved = useCallback(
        (id: string) => saved.some((item) => item.id === id),
        [saved]
    );

    const toggleSave = useCallback(
        (item: NewsItem) => {
            const exists = saved.some((s) => s.id === item.id);
            const next = exists
                ? saved.filter((s) => s.id !== item.id)
                : [...saved, item];
            persist(next);
        },
        [saved, persist]
    );

    return { saved, loaded, isSaved, toggleSave };
}

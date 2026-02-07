import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewsItem } from '../types';

const LIKED_NEWS_KEY = '@ainewsly/liked_news';

export function useLikedNews() {
    const [liked, setLiked] = useState<NewsItem[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(LIKED_NEWS_KEY)
            .then((raw) => {
                if (raw) {
                    try {
                        const parsed = JSON.parse(raw) as NewsItem[];
                        setLiked(Array.isArray(parsed) ? parsed : []);
                    } catch {
                        setLiked([]);
                    }
                } else {
                    setLiked([]);
                }
            })
            .catch(() => setLiked([]))
            .finally(() => setLoaded(true));
    }, []);

    const persist = useCallback((items: NewsItem[]) => {
        setLiked(items);
        AsyncStorage.setItem(LIKED_NEWS_KEY, JSON.stringify(items));
    }, []);

    const isLiked = useCallback(
        (id: string) => liked.some((item) => item.id === id),
        [liked]
    );

    const toggleLike = useCallback(
        (item: NewsItem) => {
            const exists = liked.some((s) => s.id === item.id);
            const next = exists
                ? liked.filter((s) => s.id !== item.id)
                : [...liked, item];
            persist(next);
        },
        [liked, persist]
    );

    return { liked, loaded, isLiked, toggleLike };
}

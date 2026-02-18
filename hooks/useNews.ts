import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchNews } from '../services/newsService';
import { NewsItem } from '../types';

const CACHE_KEY = '@ainewsly/cached_news';

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const loadNews = useCallback(async (pageNum: number, shouldRefresh = false) => {
    if (pageNum === 1) {
      if (!shouldRefresh) setLoading(true);
      setError(false);
    } else {
      setLoadingMore(true);
    }

    try {
      const data = await fetchNews(pageNum);
      setIsOffline(false);
      setError(false);

      if (data.length === 0) {
        setHasMore(false);
        if (pageNum === 1) {
          const cached = await AsyncStorage.getItem(CACHE_KEY);
          if (cached) {
            try {
              const parsed = JSON.parse(cached) as NewsItem[];
              setNews(Array.isArray(parsed) ? parsed : []);
              setIsOffline(true);
            } catch {
              setError(true);
            }
          } else {
            setError(true);
          }
        }
      } else {
        setNews((prev) => (shouldRefresh ? data : [...prev, ...data]));
        if (pageNum === 1) {
          AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data)).catch(() => {});
        }
      }
    } catch {
      if (pageNum === 1) {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached) as NewsItem[];
            setNews(Array.isArray(parsed) ? parsed : []);
            setIsOffline(true);
            setError(false);
          } catch {
            setError(true);
          }
        } else {
          setError(true);
        }
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setHasMore(true);
    setPage(1);
    loadNews(1, true);
  }, [loadNews]);

  const onLoadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadNews(nextPage);
    }
  }, [loading, loadingMore, hasMore, page, loadNews]);

  useEffect(() => {
    AsyncStorage.getItem(CACHE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as NewsItem[];
            if (Array.isArray(parsed) && parsed.length > 0) {
              setNews(parsed);
            }
          } catch { /* ignore */ }
        }
      })
      .finally(() => loadNews(1));
  }, [loadNews]);

  const retry = useCallback(() => {
    setError(false);
    setPage(1);
    loadNews(1, true);
  }, [loadNews]);

  return { news, loading, refreshing, onRefresh, onLoadMore, hasMore, loadingMore, error, retry, isOffline };
};

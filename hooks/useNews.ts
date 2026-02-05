import { useState, useEffect, useCallback } from 'react';
import { fetchNews } from '../services/newsService';
import { NewsItem } from '../types';

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNews = useCallback(async () => {
    try {
      // Don't set loading true on refresh to keep list visible
      if (!refreshing) setLoading(true);
      const data = await fetchNews();
      setNews(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // We intentionally don't await here to let the state update trigger the effect or logic if needed, 
    // but actually calling loadNews directly is better.
    // However, since loadNews uses `refreshing` state in its logic (above), 
    // we need to be careful. usage of startTransition or just calling fetchNews directly is simpler.
    // Let's fix the circular dependency/logic.
    fetchNews().then((data) => {
        setNews(data);
        setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    loadNews();
  }, []);

  return { news, loading, refreshing, onRefresh };
};

import { useState, useEffect, useCallback } from 'react';
import { fetchNews } from '../services/newsService';
import { NewsItem } from '../types';

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadNews = useCallback(async (pageNum: number, shouldRefresh = false) => {
    if (pageNum === 1) {
      if (!shouldRefresh) setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const data = await fetchNews(pageNum);

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setNews((prev) => (shouldRefresh ? data : [...prev, ...data]));
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
    loadNews(1);
  }, [loadNews]);

  return { news, loading, refreshing, onRefresh, onLoadMore, hasMore, loadingMore };
};

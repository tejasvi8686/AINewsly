import { NewsItem } from '../types';

const API_URL = 'https://task-habit-tracker-lyart.vercel.app/api/news';

interface ApiNewsItem {
  _id?: string | { $oid?: string };
  title?: string;
  content?: string;
  summary?: string;
  whyItMatters?: string;
  imageUrl?: string;
  sourceUrl?: string;
  createdAt?: string | { $date?: string };
}

export const fetchNews = async (page: number = 1): Promise<NewsItem[]> => {
  try {
    const response = await fetch(`${API_URL}?page=${page}`);
    const data = await response.json();

    if (!response.ok) return [];

    const items: ApiNewsItem[] = Array.isArray(data) ? data : (data.news || []);

    return items
      .filter((item) => item.sourceUrl)
      .map((item): NewsItem => {
        const id = typeof item._id === 'object' && item._id?.$oid ? item._id.$oid : String(item._id ?? Math.random());
        const rawCreated = item.createdAt;
        const publishedAt: string = typeof rawCreated === 'object' && rawCreated?.$date ? rawCreated.$date : (typeof rawCreated === 'string' ? rawCreated : new Date().toISOString());
        return {
          id,
          title: item.title ?? '',
          description: item.content ?? '',
          summary: item.summary,
          whyItMatters: item.whyItMatters,
          image: item.imageUrl,
          source: item.sourceUrl ? getHostname(item.sourceUrl) : 'Unknown',
          publishedAt,
          url: item.sourceUrl!,
        };
      });
  } catch {
    return [];
  }
};

const getHostname = (url: string): string => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'Source';
  }
};

export const summarizeNews = async (text: string): Promise<string> => {
  // If text is already a summary (short), just return it
  if (text.length < 500) return text;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`AI Summary:\n\n${text.substring(0, 150)}...`);
    }, 1000);
  });
};

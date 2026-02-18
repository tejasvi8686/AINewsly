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

const getFallbackSummary = (text: string) =>
  text.length < 500 ? text : `AI Summary:\n\n${text.substring(0, 150)}...`;

export const summarizeNews = async (text: string): Promise<string> => {
  if (text.length < 500) return text;

  const apiKey = process.env.EXPO_PUBLIC_OPENAI_KEY;
  if (apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: `Summarize this news article in 2-3 concise sentences. Keep it factual and neutral:\n\n${text.substring(0, 3000)}`,
            },
          ],
          max_tokens: 150,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const summary = data.choices?.[0]?.message?.content?.trim();
        if (summary) return summary;
      }
    } catch {
      // Fall through to fallback
    }
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve(getFallbackSummary(text)), 800);
  });
};

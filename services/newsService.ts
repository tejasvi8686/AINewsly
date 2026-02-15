import { NewsItem } from '../types';

const API_URL = 'https://task-habit-tracker-lyart.vercel.app/api/news';

export const fetchNews = async (page: number = 1): Promise<NewsItem[]> => {
  try {
    const response = await fetch(`${API_URL}?page=${page}`);
    const data = await response.json();

    console.log('data', data);
    // Ensure we have an array
    const items = Array.isArray(data) ? data : (data.news || []);

    return items.map((item: any) => ({
      id: item._id?.$oid || item._id || Math.random().toString(),
      title: item.title,
      description: item.content, // Using content as full text
      summary: item.summary,
      whyItMatters: item.whyItMatters,
      image: item.imageUrl,
      source: item.sourceUrl ? getHostname(item.sourceUrl) : 'Unknown',
      publishedAt: item.createdAt?.$date || new Date().toISOString(),
      url: item.sourceUrl
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

const getHostname = (url: string) => {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch (e) {
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

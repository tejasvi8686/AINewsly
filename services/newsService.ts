import { XMLParser } from 'fast-xml-parser';
import { NewsItem } from '../types';

const RSS_URL = 'https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en';

export const fetchNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await fetch(RSS_URL);
    const xml = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    });
    const jsonObj = parser.parse(xml);
    
    const channelItems = jsonObj?.rss?.channel?.item;
    let items: any[] = [];
    
    if (Array.isArray(channelItems)) {
      items = channelItems;
    } else if (channelItems) {
      items = [channelItems];
    }
    
    const newsItems: NewsItem[] = items.map((item: any) => {
      // Extraction Logic
      let imageUrl = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000&auto=format&fit=crop'; // Default News Generic
      
      // Try to find image in description
      const imgMatch = item.description?.match(/src="([^"]+)"/);
      if (imgMatch && imgMatch[1]) {
         imageUrl = imgMatch[1];
      }

      // If title contains specific keywords, maybe use specific placeholders? 
      // (Optional, just sticking to extracted or default for now to keep it clean)

      // Clean description
      // Google News description is usually HTML with links. We want plain text for the summary.
      // Remove HTML tags
      let cleanDesc = item.description?.replace(/<[^>]+>/g, '').trim() || '';
      // Remove "View Full coverage" etc which Google adds
      cleanDesc = cleanDesc.replace(/View Full coverage on Google News/g, '');

      return {
        id: item.guid?.['#text'] || item.link || Math.random().toString(),
        title: item.title,
        description: cleanDesc,
        image: imageUrl,
        source: item.source?.['#text'] || 'Google News',
        publishedAt: item.pubDate,
        url: item.link
      };
    }).filter((i: NewsItem) => i.title); // Filter empty

    return newsItems;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

export const summarizeNews = async (text: string): Promise<string> => {
  // SIMULATED AI SUMMARIZER
  // In a real production app, this would call an endpoint like OpenAI API.
  // Example:
  // const res = await fetch('https://api.openai.com/v1/...', { body: JSON.stringify({ prompt: `Summarize: ${text}` }) ... });
  
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // formatting the summary
      const dummySummary = text.length > 100 
        ? text.substring(0, 100) + '... (Read more)' 
        : text;
        
      resolve(`🤖 AI Summary:\n\nThis article covers the latest updates regarding "${text.substring(0, 20)}...". \n\nKey points:\n• Update 1: Significant event occurred.\n• Update 2: Impact on the sector.\n\n(Simulated for Demo)`);
    }, 1200);
  });
};

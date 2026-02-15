export interface NewsItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  source: string;
  publishedAt: string;
  url: string;
  // New fields from API
  summary?: string;
  whyItMatters?: string;
  content?: string;
}

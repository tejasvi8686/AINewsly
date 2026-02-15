import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    Pressable,
    Linking,
    Share,
    ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NewsItem } from '../types';
import { summarizeNews } from '../services/newsService';
import { formatDistanceToNow } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface NewsCardProps {
    item: NewsItem;
    isActive: boolean; // to trigger summary only when active
    isSaved?: boolean;
    onSave?: (item: NewsItem) => void;
    isLiked?: boolean;
    onLike?: (item: NewsItem) => void;
    onOpenLink?: (url: string) => void;
}

export default function NewsCard({ item, isActive, isSaved = false, onSave, isLiked = false, onLike, onOpenLink }: NewsCardProps) {
    const [summary, setSummary] = useState<string | null>(null);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (isActive && !summary) {
            setLoadingSummary(true);
            summarizeNews(item.description || item.title)
                .then(res => setSummary(res))
                .catch(err => console.error(err))
                .finally(() => setLoadingSummary(false));
        }
    }, [isActive, item, summary]);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this news: ${item.title} - ${item.url}`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const openLink = () => {
        if (!item.url) return;
        if (onOpenLink) onOpenLink(item.url);
        else Linking.openURL(item.url);
    };

    return (
        <View style={styles.container}>
            {/* Background Image */}
            <Image
                source={{ uri: item.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1000&auto=format&fit=crop' }}
                style={styles.image}
                resizeMode="cover"
            />

            {/* Gradient Overlay */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.95)']}
                style={styles.gradient}
            />

            {/* Top Right Share Button */}
            <Pressable 
                onPress={handleShare} 
                style={[styles.shareButton, { top: insets.top + 16 }]}
            >
                <Ionicons name="share-outline" size={24} color="#fff" />
            </Pressable>

            {/* Content */}
            <View style={styles.content}>

                <View style={styles.headerRow}>
                    <View style={styles.sourceTag}>
                        <Text style={styles.sourceText}>{item.source}</Text>
                    </View>
                    <Text style={styles.timeText}>
                        {item.publishedAt ? formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true }) : ''}
                    </Text>
                </View>

                <Pressable onPress={openLink}>
                    <Text style={styles.title} numberOfLines={3}>{item.title}</Text>
                </Pressable>

                <View style={styles.summaryContainer}>
                    <View style={styles.summaryLabelRow}>
                        <Ionicons name="sparkles" size={14} color="rgba(255,255,255,0.7)" />
                        <Text style={styles.summaryLabel}>AI Summary</Text>
                    </View>
                    {loadingSummary ? (
                        <ActivityIndicator size="small" color="rgba(255,255,255,0.6)" style={{ alignSelf: 'flex-start', marginTop: 6 }} />
                    ) : (
                        <Text style={styles.description} numberOfLines={6}>
                            {summary || item.description}
                        </Text>
                    )}
                </View>

                <Text style={styles.swipeHint}>Swipe for next news</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        backgroundColor: '#000',
        justifyContent: 'flex-end',
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        width: width,
        height: height,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        top: '30%',
    },
    shareButton: {
        position: 'absolute',
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        zIndex: 20,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 130, // Increased to clear floating tab bar
        justifyContent: 'flex-end',
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sourceTag: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        marginRight: 10,
    },
    sourceText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    timeText: {
        color: '#ddd',
        fontSize: 12,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 12,
        lineHeight: 32,
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 10,
    },
    summaryContainer: {
        minHeight: 80,
        marginBottom: 16,
    },
    summaryLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    summaryLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.4,
    },
    description: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '400',
    },
    swipeHint: {
        textAlign: 'center',
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        marginTop: 10,
    }
});

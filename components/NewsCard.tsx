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
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence
} from 'react-native-reanimated';

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

    // Animation values
    const scale = useSharedValue(1);

    useEffect(() => {
        if (isActive && !summary) {
            setLoadingSummary(true);
            summarizeNews(item.description || item.title) // RSS description can be short, so fallback to title
                .then(res => setSummary(res))
                .catch(err => console.error(err))
                .finally(() => setLoadingSummary(false));
        }
    }, [isActive, item, summary]);

    const handleLike = () => {
        onLike?.(item);
        scale.value = withSequence(
            withSpring(1.2),
            withSpring(1)
        );
    };

    const liked = isLiked;

    const likeStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

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
            {/* Background Image - dynamic per article from RSS */}
            <Image
                source={{ uri: item.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1000&auto=format&fit=crop' }}
                style={styles.image}
                resizeMode="cover"
            />

            {/* Gradient Overlay */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.95)']}
                style={styles.gradient}
            />

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
                        <ActivityIndicator size="small" color="#aaa" style={{ alignSelf: 'flex-start', marginTop: 6 }} />
                    ) : (
                        <Text style={styles.description} numberOfLines={6}>
                            {summary || item.description}
                        </Text>
                    )}
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <Pressable onPress={handleLike} style={styles.actionButton}>
                        <Animated.View style={likeStyle}>
                            <Ionicons name={liked ? "heart" : "heart-outline"} size={32} color={liked ? "#ff4040" : "white"} />
                        </Animated.View>
                        <Text style={styles.actionText}>{liked ? "Liked" : "Like"}</Text>
                    </Pressable>

                    <Pressable onPress={handleShare} style={styles.actionButton}>
                        <Ionicons name="share-social-outline" size={30} color="white" />
                        <Text style={styles.actionText}>Share</Text>
                    </Pressable>

                    <Pressable onPress={() => onSave?.(item)} style={styles.actionButton}>
                        <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={30} color={isSaved ? "#007AFF" : "white"} />
                        <Text style={[styles.actionText, isSaved && styles.actionTextSaved]}>{isSaved ? "Saved" : "Save"}</Text>
                    </Pressable>
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
        top: '30%', // start gradient lower
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40, // Space for bottom safe area/nav
        justifyContent: 'flex-end',
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sourceTag: {
        backgroundColor: '#007AFF', // Blue accent
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
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
        fontWeight: '800', // Heavy bold
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
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 26,
        paddingHorizontal: 10,
    },
    actionButton: {
        alignItems: 'center',
        gap: 4
    },
    actionText: {
        color: '#fff',
        fontSize: 10,
        marginTop: 4,
    },
    actionTextSaved: {
        color: '#007AFF',
    },
    swipeHint: {
        textAlign: 'center',
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        marginTop: 10,
    }
});

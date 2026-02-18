import React, { useEffect, useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    Pressable,
    Linking,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    Easing,
    runOnJS,
} from 'react-native-reanimated';
import SkeletonLine from './SkeletonLine';
import { LinearGradient } from 'expo-linear-gradient';
import { NewsItem } from '../types';
import { summarizeNews } from '../services/newsService';
import { formatDistanceToNow } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
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
    const bounceY = useSharedValue(0);

    useEffect(() => {
        bounceY.value = withRepeat(
            withSequence(
                withTiming(6, { duration: 600, easing: Easing.out(Easing.ease) }),
                withTiming(0, { duration: 600, easing: Easing.in(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const swipeHintAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: bounceY.value }],
    }));

    useEffect(() => {
        if (isActive && !item.summary && !summary) {
            setLoadingSummary(true);
            summarizeNews(item.description || item.title)
                .then(setSummary)
                .catch(() => {})
                .finally(() => setLoadingSummary(false));
        }
    }, [isActive, item.id, item.summary, item.description, item.title, summary]);

    const getReadTime = (text: string) => Math.max(1, Math.ceil((text?.length ?? 0) / 200));

    const openLink = () => {
        if (!item.url) return;
        if (onOpenLink) onOpenLink(item.url);
        else Linking.openURL(item.url);
    };

    const handleSave = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSave?.(item);
    };
    const handleLike = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onLike?.(item);
    };

    const composedGesture = useMemo(() => {
        const panGesture = Gesture.Pan()
            .activeOffsetX([25, 25])
            .failOffsetY([15, 15])
            .onEnd((e) => {
                'worklet';
                if (e.translationX < -70) {
                    runOnJS(handleSave)();
                } else if (e.translationX > 70) {
                    runOnJS(handleLike)();
                }
            });
        const doubleTap = Gesture.Tap()
            .numberOfTaps(2)
            .onEnd(() => {
                'worklet';
                runOnJS(handleLike)();
            });
        const singleTap = Gesture.Tap()
            .numberOfTaps(1)
            .onEnd(() => {
                'worklet';
                runOnJS(openLink)();
            });
        return Gesture.Race(
            panGesture,
            Gesture.Exclusive(doubleTap, singleTap)
        );
    }, [item]);

    const imageHeight = height * 0.45;
    const textHeight = height * 0.55;

    return (
        <View style={styles.container}>
            {/* Save | Like - top right of text section, outside gesture so taps work */}
            <View style={[styles.actionRowTop, { top: imageHeight + 12 }]}>
                <Pressable
                    onPress={handleSave}
                    style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
                    hitSlop={10}
                >
                    <Ionicons
                        name={isSaved ? 'bookmark' : 'bookmark-outline'}
                        size={20}
                        color="#fff"
                    />
                </Pressable>
                <Pressable
                    onPress={handleLike}
                    style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
                    hitSlop={10}
                >
                    <Ionicons
                        name={isLiked ? 'heart' : 'heart-outline'}
                        size={20}
                        color={isLiked ? '#f87171' : '#fff'}
                    />
                </Pressable>
            </View>
            <GestureDetector gesture={composedGesture}>
            <View style={styles.gestureArea}>
            {/* Image Section - 45% */}
            <View style={[styles.imageSection, { height: imageHeight }]}>
                <Image
                    source={{ uri: item.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1000&auto=format&fit=crop' }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.5)']}
                    style={styles.imageGradient}
                />
            </View>

            {/* Text Section - 55% */}
            <View style={[styles.textSection, { height: textHeight }]}>
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <View style={styles.headerLeft}>
                    <View style={styles.sourceTag}>
                        <Text style={styles.sourceText} numberOfLines={1}>{item.source}</Text>
                    </View>
                    <Text style={styles.timeText} numberOfLines={1}>
                        {[
                            item.publishedAt ? formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true }) : null,
                            item.description || item.title ? `${getReadTime(item.description || item.title)} min read` : null,
                        ].filter(Boolean).join(' · ')}
                    </Text>
                    </View>
                </View>

                <Text style={styles.title} numberOfLines={3}>{item.title}</Text>

                <View style={styles.summaryContainer}>
                    {/* AI Summary */}
                    <View style={[styles.summaryBlock, styles.summaryBlockPurple]}>
                    <View style={styles.summaryLabelRow}>
                        <Ionicons name="sparkles" size={13} color="#c084fc" />
                        <Text style={[styles.summaryLabel, { color: '#c084fc' }]}>AI Summary</Text>
                    </View>
                    {loadingSummary ? (
                        <View style={styles.skeletonSummary}>
                            <SkeletonLine width="100%" height={14} />
                            <SkeletonLine width="95%" height={14} style={{ marginTop: 8 }} />
                            <SkeletonLine width="70%" height={14} style={{ marginTop: 8 }} />
                        </View>
                    ) : (
                        <Text style={styles.description} numberOfLines={item.whyItMatters ? 4 : 6}>
                            {item.summary || summary || item.description}
                        </Text>
                    )}
                    </View>

                    {/* Why It Matters (New Section) */}
                    {item.whyItMatters && (
                        <View style={[styles.summaryBlock, styles.summaryBlockYellow]}>
                            <View style={styles.summaryLabelRow}>
                                <Ionicons name="bulb" size={14} color="#fbbf24" />
                                <Text style={[styles.summaryLabel, { color: '#fbbf24' }]}>Why It Matters</Text>
                            </View>
                            <Text style={styles.description} numberOfLines={3}>
                                {item.whyItMatters}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            <Animated.View style={[styles.swipeHintRow, swipeHintAnimatedStyle]}>
                <Ionicons name="chevron-down" size={14} color="rgba(255,255,255,0.35)" />
                <Text style={styles.swipeHint}>Swipe for next</Text>
            </Animated.View>
            </View>
            </View>
            </GestureDetector>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        backgroundColor: '#000',
    },
    gestureArea: {
        flex: 1,
    },
    imageSection: {
        width: width,
        overflow: 'hidden',
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        width: width,
    },
    imageGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    textSection: {
        backgroundColor: '#000',
        paddingHorizontal: 20,
    },
    content: {
        flex: 1,
        paddingTop: 20,
        paddingBottom: 8,
    },
    actionRowTop: {
        position: 'absolute',
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        zIndex: 10,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
    },
    actionButtonPressed: {
        opacity: 0.7,
    },
    headerLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingRight: 100,
    },
    sourceTag: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginRight: 8,
    },
    sourceText: {
        color: 'rgba(255,255,255,0.95)',
        fontWeight: '600',
        fontSize: 11,
        letterSpacing: 0.3,
    },
    timeText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 11,
        flexShrink: 1,
    },
    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 14,
        lineHeight: 28,
        letterSpacing: -0.3,
    },
    summaryContainer: {
        minHeight: 80,
        marginBottom: 16,
    },
    summaryBlock: {
        paddingLeft: 10,
        borderLeftWidth: 3,
        marginBottom: 12,
    },
    summaryBlockPurple: {
        borderLeftColor: 'rgba(192,132,252,0.5)',
    },
    summaryBlockYellow: {
        borderLeftColor: 'rgba(251,191,36,0.5)',
        marginTop: 4,
    },
    skeletonSummary: {
        marginTop: 6,
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
    swipeHintRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 4,
        marginBottom: 130,
    },
    swipeHint: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
        letterSpacing: 0.5,
    },
});

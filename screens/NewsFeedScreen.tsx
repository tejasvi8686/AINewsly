import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Dimensions,
    RefreshControl,
    ActivityIndicator,
    Text,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNews } from '../hooks/useNews';
import { useSavedNews } from '../hooks/useSavedNews';
import { useLikedNews } from '../hooks/useLikedNews';
import NewsCard from '../components/NewsCard';
import ArticleWebViewScreen from './ArticleWebViewScreen';

const { height } = Dimensions.get('window');

const GUIDE_DURATION_MS = 5000;       // show guides for 5 seconds
const GUIDE_INTERVAL_MS = 30000;      // show again every 30 seconds

interface NewsFeedScreenProps {
    isLiked?: (id: string) => boolean;
    onLike?: (item: import('../types').NewsItem) => void;
    isSaved?: (id: string) => boolean;
    onSave?: (item: import('../types').NewsItem) => void;
}

export default function NewsFeedScreen({ isLiked: isLikedProp, onLike: onLikeProp, isSaved: isSavedProp, onSave: onSaveProp }: NewsFeedScreenProps = {}) {
    const { news, loading, refreshing, onRefresh } = useNews();
    const savedHook = useSavedNews();
    const likedHook = useLikedNews();
    const isSaved = isSavedProp ?? savedHook.isSaved;
    const toggleSave = onSaveProp ?? savedHook.toggleSave;
    const isLiked = isLikedProp ?? likedHook.isLiked;
    const onLike = onLikeProp ?? likedHook.toggleLike;
    const [activeIndex, setActiveIndex] = useState(0);
    const [articleUrl, setArticleUrl] = useState<string | null>(null);
    const [showGuides, setShowGuides] = useState(true);

    // Show guides at start, then again every 20–40s (using 30s)
    useEffect(() => {
        const interval = setInterval(() => setShowGuides(true), GUIDE_INTERVAL_MS);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!showGuides) return;
        const hideTimer = setTimeout(() => setShowGuides(false), GUIDE_DURATION_MS);
        return () => clearTimeout(hideTimer);
    }, [showGuides]);

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index || 0);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    if (loading && news.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <StatusBar style="light" />
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Fetching Latest News...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" translucent />

            <ArticleWebViewScreen
                url={articleUrl}
                onClose={() => setArticleUrl(null)}
            />

            {showGuides && (
                <>
                    {/* Left edge: finger right = swipe right → Liked */}
                    <View style={[styles.edgeGuide, styles.edgeGuideLeft]} pointerEvents="none">
                        <Ionicons name="hand-right-outline" size={28} color="rgba(255,255,255,0.85)" />
                        <Text style={styles.edgeGuideLabel}>Liked</Text>
                    </View>
                    {/* Right edge: finger left = swipe left → Saved */}
                    <View style={[styles.edgeGuide, styles.edgeGuideRight]} pointerEvents="none">
                        <Ionicons name="hand-left-outline" size={28} color="rgba(255,255,255,0.85)" />
                        <Text style={styles.edgeGuideLabel}>Saved</Text>
                    </View>
                </>
            )}

            <FlatList
                data={news}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <NewsCard
                        item={item}
                        isActive={index === activeIndex}
                        isSaved={isSaved(item.id)}
                        onSave={toggleSave}
                        isLiked={isLiked(item.id)}
                        onLike={onLike}
                        onOpenLink={setArticleUrl}
                    />
                )}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                snapToAlignment="start" // Snap to the start of the item
                decelerationRate="fast" // Faster deceleration for a snappy feel
                snapToInterval={height} // Snap strictly to the screen height
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#fff"
                        title="Pull to refresh"
                        titleColor="#fff"
                    />
                }
                initialNumToRender={2}
                maxToRenderPerBatch={2}
                windowSize={3}
                removeClippedSubviews={true} // Performance optimization
                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.centerEmpty}>
                            <Text style={styles.errorText}>No news found.</Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    edgeGuide: {
        position: 'absolute',
        top: height * 0.35,
        width: 52,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 6,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 12,
        zIndex: 10,
    },
    edgeGuideLeft: {
        left: 8,
    },
    edgeGuideRight: {
        right: 8,
    },
    edgeGuideLabel: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 11,
        fontWeight: '700',
        marginTop: 6,
    },
    centerContainer: { // Full screen loading
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerEmpty: {
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 16,
        fontWeight: '500'
    },
    errorText: {
        color: '#aaa',
        fontSize: 18
    }
});

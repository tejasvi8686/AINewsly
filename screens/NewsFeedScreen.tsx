import React, { useRef, useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Dimensions,
    RefreshControl,
    Text,
    Platform,
    Pressable,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { useNews } from '../hooks/useNews';
import { useSavedNews } from '../hooks/useSavedNews';
import { useLikedNews } from '../hooks/useLikedNews';
import NewsCard from '../components/NewsCard';
import SkeletonCard from '../components/SkeletonCard';
import ArticleWebViewScreen from './ArticleWebViewScreen';
import Toast from 'react-native-toast-message';

const { height } = Dimensions.get('window');

interface NewsFeedScreenProps {
    isLiked?: (id: string) => boolean;
    onLike?: (item: import('../types').NewsItem) => void;
    isSaved?: (id: string) => boolean;
    onSave?: (item: import('../types').NewsItem) => void;
}

export default function NewsFeedScreen({ isLiked: isLikedProp, onLike: onLikeProp, isSaved: isSavedProp, onSave: onSaveProp }: NewsFeedScreenProps = {}) {
    const { news, loading, refreshing, onRefresh, onLoadMore, error, retry, isOffline } = useNews();
    const savedHook = useSavedNews();
    const likedHook = useLikedNews();
    const isSaved = isSavedProp ?? savedHook.isSaved;
    const baseToggleSave = onSaveProp ?? savedHook.toggleSave;
    const isLiked = isLikedProp ?? likedHook.isLiked;
    const baseOnLike = onLikeProp ?? likedHook.toggleLike;

    const toggleSave = (item: import('../types').NewsItem) => {
        const wasSaved = isSaved(item.id);
        baseToggleSave(item);
        Toast.show({ type: 'success', text1: wasSaved ? 'Removed from saved' : 'Article saved' });
    };
    const onLike = (item: import('../types').NewsItem) => {
        baseOnLike(item);
    };
    const [activeIndex, setActiveIndex] = useState(0);
    const [articleUrl, setArticleUrl] = useState<string | null>(null);

    const currentArticle = articleUrl ? news.find((n) => n.url === articleUrl) : null;
    const relatedArticles = currentArticle
        ? news
            .filter((n) => n.id !== currentArticle.id && n.source === currentArticle.source)
            .slice(0, 3)
        : [];

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index || 0);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    if (loading && news.length === 0 && !error) {
        return (
            <View style={styles.centerContainer}>
                <StatusBar style="light" />
                <SkeletonCard />
            </View>
        );
    }

    if (error && news.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <StatusBar style="light" />
                <Text style={styles.errorText}>Couldn&apos;t load news</Text>
                <Text style={styles.errorSubtext}>Pull to try again or check your connection</Text>
                <Pressable onPress={retry} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" translucent />
            <ArticleWebViewScreen
                url={articleUrl}
                onClose={() => setArticleUrl(null)}
                relatedArticles={relatedArticles}
                onOpenRelated={setArticleUrl}
                articleTitle={currentArticle?.title}
            />

            {isOffline && (
                <View style={styles.offlineBanner}>
                    <Text style={styles.offlineText}>Showing cached content</Text>
                </View>
            )}

            <FlatList
                data={news}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <Animated.View entering={FadeInDown.duration(400)} style={styles.page}>
                        <NewsCard
                            item={item}
                            isActive={index === activeIndex}
                            isSaved={isSaved(item.id)}
                            onSave={toggleSave}
                            isLiked={isLiked(item.id)}
                            onLike={onLike}
                            onOpenLink={setArticleUrl}
                        />
                    </Animated.View>
                )}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                snapToAlignment="start"
                decelerationRate="fast"
                snapToInterval={height}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#fff"
                        title="Pull to refresh"
                        titleColor="#fff"
                        progressViewOffset={Platform.OS === 'android' ? 40 : undefined}
                    />
                }
                initialNumToRender={2}
                maxToRenderPerBatch={2}
                windowSize={3}
                removeClippedSubviews={true}
                onEndReached={onLoadMore}
                onEndReachedThreshold={2}
                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.centerEmpty}>
                            <Text style={styles.emptyTitle}>No news found.</Text>
                            <Pressable onPress={retry} style={styles.retryButton}>
                                <Text style={styles.retryButtonText}>Retry</Text>
                            </Pressable>
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
    page: {
        height,
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
        color: 'rgba(255,255,255,0.9)',
        fontSize: 18,
        fontWeight: '600',
    },
    errorSubtext: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        marginTop: 8,
    },
    emptyTitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 18,
    },
    retryButton: {
        marginTop: 16,
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    retryButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    offlineBanner: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255,193,7,0.2)',
        paddingVertical: 6,
        paddingHorizontal: 16,
        zIndex: 11,
    },
    offlineText: {
        color: '#fbbf24',
        fontSize: 13,
        textAlign: 'center',
    },
});

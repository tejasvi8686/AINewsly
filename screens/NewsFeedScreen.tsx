import React, { useRef, useState } from 'react';
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
import { useNews } from '../hooks/useNews';
import { useSavedNews } from '../hooks/useSavedNews';
import { useLikedNews } from '../hooks/useLikedNews';
import NewsCard from '../components/NewsCard';
import ArticleWebViewScreen from './ArticleWebViewScreen';

const { height } = Dimensions.get('window');

interface NewsFeedScreenProps {
    isLiked?: (id: string) => boolean;
    onLike?: (item: import('../types').NewsItem) => void;
    isSaved?: (id: string) => boolean;
    onSave?: (item: import('../types').NewsItem) => void;
}

export default function NewsFeedScreen({ isLiked: isLikedProp, onLike: onLikeProp, isSaved: isSavedProp, onSave: onSaveProp }: NewsFeedScreenProps = {}) {
    const { news, loading, refreshing, onRefresh, onLoadMore } = useNews();
    const savedHook = useSavedNews();
    const likedHook = useLikedNews();
    const isSaved = isSavedProp ?? savedHook.isSaved;
    const toggleSave = onSaveProp ?? savedHook.toggleSave;
    const isLiked = isLikedProp ?? likedHook.isLiked;
    const onLike = onLikeProp ?? likedHook.toggleLike;
    const [activeIndex, setActiveIndex] = useState(0);
    const [articleUrl, setArticleUrl] = useState<string | null>(null);

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
                <ActivityIndicator size="large" color="#fff" />
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
        color: 'rgba(255,255,255,0.7)',
        fontSize: 18
    }
});

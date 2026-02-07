import React, { useRef } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import NewsFeedScreen from './NewsFeedScreen';
import SavedLikedTabScreen from './SavedLikedTabScreen';
import { useSavedNews } from '../hooks/useSavedNews';
import { useLikedNews } from '../hooks/useLikedNews';

const { width } = Dimensions.get('window');

// Order: Liked tab (left, index 0) | Feed (center, index 1) | Saved tab (right, index 2)
// Swipe right from Feed → Liked screen (Liked selected). Swipe left from Feed → Saved screen (Saved selected).
const PAGES = [
    { key: 'liked', initialTab: 0 as const },
    { key: 'feed' },
    { key: 'saved', initialTab: 1 as const },
];

const INITIAL_INDEX = 1; // Feed

export default function MainTabScreen() {
    const listRef = useRef<FlatList>(null);
    const { saved, isSaved, toggleSave } = useSavedNews();
    const { liked, isLiked, toggleLike } = useLikedNews();

    const renderPage = ({ item, index }: { item: typeof PAGES[number]; index: number }) => {
        if (item.key === 'feed') {
            return (
                <View style={styles.page}>
                    <NewsFeedScreen
                        isSaved={isSaved}
                        onSave={toggleSave}
                        isLiked={isLiked}
                        onLike={toggleLike}
                    />
                </View>
            );
        }
        const initialTab = item.key === 'saved' ? 1 : 0;
        return (
            <View style={styles.page}>
                <SavedLikedTabScreen
                    initialTab={initialTab}
                    saved={saved}
                    liked={liked}
                    onRemoveSaved={toggleSave}
                    onRemoveLiked={toggleLike}
                />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <FlatList
                ref={listRef}
                data={PAGES}
                keyExtractor={(item) => item.key}
                renderItem={renderPage}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                scrollEventThrottle={16}
                initialScrollIndex={INITIAL_INDEX}
                getItemLayout={(_, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
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
        width,
        flex: 1,
    },
});

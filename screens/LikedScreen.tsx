import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLikedNews } from '../hooks/useLikedNews';
import { NewsItem } from '../types';
import SavedLikedCard from '../components/SavedLikedCard';
import ArticleWebViewScreen from './ArticleWebViewScreen';

const { height } = Dimensions.get('window');

interface LikedScreenProps {
    liked?: NewsItem[];
    onRemove?: (item: NewsItem) => void;
}

export default function LikedScreen({ liked: likedProp, onRemove }: LikedScreenProps = {} as LikedScreenProps) {
    const hook = useLikedNews();
    const liked = likedProp ?? hook.liked;
    const toggleLike = onRemove ?? hook.toggleLike;
    const [articleUrl, setArticleUrl] = useState<string | null>(null);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ArticleWebViewScreen url={articleUrl} onClose={() => setArticleUrl(null)} />
            <FlatList
                data={liked}
                keyExtractor={(item) => item.id}
                contentContainerStyle={liked.length === 0 ? styles.emptyContainer : styles.list}
                ListHeaderComponent={
                    liked.length > 0 ? (
                        <Text style={styles.sectionTitle}>Liked articles</Text>
                    ) : null
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyTitle}>No liked articles</Text>
                        <Text style={styles.emptySub}>Like articles from the feed to see them here.</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <SavedLikedCard
                        item={item}
                        variant="liked"
                        onPress={() => setArticleUrl(item.url)}
                        onRemove={() => toggleLike(item)}
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    list: {
        paddingVertical: 16,
        paddingBottom: height * 0.15,
    },
    sectionTitle: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: 12,
        marginHorizontal: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    empty: {
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    emptySub: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
    },
});

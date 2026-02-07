import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSavedNews } from '../hooks/useSavedNews';
import { NewsItem } from '../types';
import SavedLikedCard from '../components/SavedLikedCard';
import ArticleWebViewScreen from './ArticleWebViewScreen';

const { height } = Dimensions.get('window');

interface SavedScreenProps {
    saved?: NewsItem[];
    onRemove?: (item: NewsItem) => void;
}

export default function SavedScreen({ saved: savedProp, onRemove }: SavedScreenProps = {} as SavedScreenProps) {
    const hook = useSavedNews();
    const saved = savedProp ?? hook.saved;
    const toggleSave = onRemove ?? hook.toggleSave;
    const [articleUrl, setArticleUrl] = useState<string | null>(null);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ArticleWebViewScreen url={articleUrl} onClose={() => setArticleUrl(null)} />
            <FlatList
                data={saved}
                keyExtractor={(item) => item.id}
                contentContainerStyle={saved.length === 0 ? styles.emptyContainer : styles.list}
                ListHeaderComponent={
                    saved.length > 0 ? (
                        <Text style={styles.sectionTitle}>Saved articles</Text>
                    ) : null
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyTitle}>No saved articles</Text>
                        <Text style={styles.emptySub}>Save articles from the feed to see them here.</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <SavedLikedCard
                        item={item}
                        variant="saved"
                        onPress={() => setArticleUrl(item.url)}
                        onRemove={() => toggleSave(item)}
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

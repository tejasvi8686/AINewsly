import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Text,
    Dimensions,
    Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSavedNews } from '../hooks/useSavedNews';
import { useLikedNews } from '../hooks/useLikedNews';
import { NewsItem } from '../types';
import SavedLikedCard from '../components/SavedLikedCard';
import ArticleWebViewScreen from './ArticleWebViewScreen';

const { height } = Dimensions.get('window');

type TabIndex = 0 | 1; // 0 = Liked, 1 = Saved

interface SavedLikedTabScreenProps {
    initialTab: TabIndex;
    saved?: NewsItem[];
    liked?: NewsItem[];
    onRemoveSaved?: (item: NewsItem) => void;
    onRemoveLiked?: (item: NewsItem) => void;
}

export default function SavedLikedTabScreen({
    initialTab,
    saved: savedProp,
    liked: likedProp,
    onRemoveSaved,
    onRemoveLiked,
}: SavedLikedTabScreenProps) {
    const [tabIndex, setTabIndex] = useState<TabIndex>(initialTab);
    const [articleUrl, setArticleUrl] = useState<string | null>(null);

    const savedHook = useSavedNews();
    const likedHook = useLikedNews();
    const saved = savedProp ?? savedHook.saved;
    const liked = likedProp ?? likedHook.liked;
    const toggleSave = onRemoveSaved ?? savedHook.toggleSave;
    const toggleLike = onRemoveLiked ?? likedHook.toggleLike;

    useEffect(() => {
        setTabIndex(initialTab);
    }, [initialTab]);

    const renderLikedList = () => (
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
    );

    const renderSavedList = () => (
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
    );

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ArticleWebViewScreen url={articleUrl} onClose={() => setArticleUrl(null)} />
            <SafeAreaView edges={['top']} style={styles.tabWrapper}>
                <View style={styles.tabBar}>
                    <Pressable
                        style={[styles.tab, tabIndex === 0 && styles.tabActive]}
                        onPress={() => setTabIndex(0)}
                    >
                        <Ionicons
                            name={tabIndex === 0 ? 'heart' : 'heart-outline'}
                            size={20}
                            color={tabIndex === 0 ? '#ff4040' : 'rgba(255,255,255,0.5)'}
                        />
                        <Text style={[styles.tabLabel, tabIndex === 0 && styles.tabLabelActive]}>
                            Liked
                        </Text>
                    </Pressable>
                    <Pressable
                        style={[styles.tab, tabIndex === 1 && styles.tabActive]}
                        onPress={() => setTabIndex(1)}
                    >
                        <Ionicons
                            name={tabIndex === 1 ? 'bookmark' : 'bookmark-outline'}
                            size={20}
                            color={tabIndex === 1 ? '#fff' : 'rgba(255,255,255,0.5)'}
                        />
                        <Text style={[styles.tabLabel, tabIndex === 1 && styles.tabLabelActive]}>
                            Saved
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
            <View style={styles.content}>
                {tabIndex === 0 ? renderLikedList() : renderSavedList()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    tabWrapper: {
        backgroundColor: '#000',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.12)',
    },
    tabBar: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 8,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 12,
    },
    tabActive: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    tabLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 15,
        fontWeight: '600',
    },
    tabLabelActive: {
        color: '#fff',
    },
    content: {
        flex: 1,
    },
    list: {
        paddingVertical: 16,
        paddingBottom: height * 0.1,
    },
    sectionTitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
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

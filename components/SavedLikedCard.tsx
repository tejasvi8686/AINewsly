import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { NewsItem } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

interface SavedLikedCardProps {
    item: NewsItem;
    onPress: () => void;
    onRemove?: () => void;
    variant: 'saved' | 'liked';
}

export default function SavedLikedCard({ item, onPress, onRemove, variant }: SavedLikedCardProps) {
    return (
        <Pressable style={styles.card} onPress={onPress} android_ripple={{ color: 'rgba(255,255,255,0.1)' }}>
            <Image
                source={{ uri: item.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&auto=format&fit=crop' }}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.content}>
                <View style={styles.row}>
                    <View style={styles.sourceTag}>
                        <Text style={styles.sourceText}>{item.source}</Text>
                    </View>
                    <Text style={styles.timeText}>
                        {item.publishedAt ? formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true }) : ''}
                    </Text>
                </View>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                {onRemove && (
                    <Pressable style={styles.removeBtn} onPress={onRemove} hitSlop={8}>
                        <Ionicons
                            name={variant === 'saved' ? 'bookmark' : 'heart'}
                            size={20}
                            color={variant === 'saved' ? '#fff' : '#ff4040'}
                        />
                        <Text style={styles.removeText}>Remove</Text>
                    </Pressable>
                )}
            </View>
            <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.5)" />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 12,
        marginHorizontal: 16,
        marginVertical: 6,
        overflow: 'hidden',
        paddingRight: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
    },
    image: {
        width: 84,
        height: 84,
        borderRadius: 10,
        margin: 10,
    },
    content: {
        flex: 1,
        paddingVertical: 10,
        paddingRight: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    sourceTag: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        marginRight: 8,
    },
    sourceText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 11,
    },
    timeText: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 11,
    },
    title: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 21,
    },
    removeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 4,
    },
    removeText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
    },
});

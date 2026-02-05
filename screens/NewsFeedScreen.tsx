import React, { useRef, useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Dimensions,
    RefreshControl,
    ActivityIndicator,
    Text
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNews } from '../hooks/useNews';
import NewsCard from '../components/NewsCard';

const { height } = Dimensions.get('window');

export default function NewsFeedScreen() {
    const { news, loading, refreshing, onRefresh } = useNews();
    const [activeIndex, setActiveIndex] = useState(0);

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

            <FlatList
                data={news}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <NewsCard item={item} isActive={index === activeIndex} />
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

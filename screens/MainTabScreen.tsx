import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Pressable,
    Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    interpolateColor,
    withTiming,
    runOnJS,
    SharedValue,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';

import NewsFeedScreen from './NewsFeedScreen';
import SavedLikedTabScreen from './SavedLikedTabScreen';
import { useSavedNews } from '../hooks/useSavedNews';
import { useLikedNews } from '../hooks/useLikedNews';

const { width } = Dimensions.get('window');

// Order: Liked tab (left, index 0) | Feed (center, index 1) | Saved tab (right, index 2)
const PAGES = [
    { key: 'liked', icon: 'heart' as const, label: 'Liked', initialTab: 0 as const },
    { key: 'feed', icon: 'flash' as const, label: 'Feed' },
    { key: 'saved', icon: 'bookmark' as const, label: 'Saved', initialTab: 1 as const },
];

const INITIAL_INDEX = 1; // Feed

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

export default function MainTabScreen() {
    const listRef = useRef<Animated.FlatList<any>>(null);
    const scrollX = useSharedValue(INITIAL_INDEX * width);
    const [activeIndex, setActiveIndex] = useState(INITIAL_INDEX);
    
    const { saved, isSaved, toggleSave } = useSavedNews();
    const { liked, isLiked, toggleLike } = useLikedNews();

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
            const index = Math.round(event.contentOffset.x / width);
            if (index !== activeIndex) {
                runOnJS(setActiveIndex)(index);
            }
        },
    });

    const handleTabPress = (index: number) => {
        listRef.current?.scrollToIndex({ index, animated: true });
    };

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
            
            <Animated.FlatList
                ref={listRef}
                data={PAGES}
                keyExtractor={(item) => item.key}
                renderItem={renderPage}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                scrollEventThrottle={16}
                onScroll={scrollHandler}
                initialScrollIndex={INITIAL_INDEX}
                getItemLayout={(_, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
            />

            {/* Floating Glass Tab Bar */}
            <View style={styles.floatingTabBarContainer}>
                <View style={styles.glassBackground}>
                    {PAGES.map((page, index) => (
                        <TabItem 
                            key={page.key}
                            icon={page.icon}
                            index={index}
                            scrollX={scrollX}
                            onPress={() => handleTabPress(index)}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
}

function TabItem({ 
    icon, 
    index, 
    scrollX, 
    onPress 
}: { 
    icon: string, 
    index: number, 
    scrollX: SharedValue<number>, 
    onPress: () => void 
}) {
    const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
        ];

        const color = interpolateColor(
            scrollX.value,
            inputRange,
            ['rgba(255,255,255,0.4)', '#ffffff', 'rgba(255,255,255,0.4)']
        );

        const scale = interpolate(
            scrollX.value,
            inputRange,
            [0.9, 1.2, 0.9],
            Extrapolation.CLAMP
        );

        // Add glow effect using shadow
        // Reanimated doesn't support animating shadowColor easily on Android, 
        // but textShadowColor works on Text (Icon).
        
        return {
            color,
            transform: [{ scale }],
            textShadowColor: 'rgba(255, 255, 255, 0.5)',
            textShadowRadius: interpolate(
                scrollX.value, 
                inputRange, 
                [0, 10, 0], 
                Extrapolation.CLAMP
            ),
            textShadowOffset: { width: 0, height: 0 }
        };
    });

    return (
        <Pressable onPress={onPress} style={styles.tab}>
            <AnimatedIcon 
                name={icon as any} 
                size={22} 
                style={animatedStyle}
            />
        </Pressable>
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
    floatingTabBarContainer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 100,
    },
    glassBackground: {
        flexDirection: 'row',
        backgroundColor: 'rgba(20, 20, 20, 0.85)', // Semi-transparent dark
        borderRadius: 40,
        height: 64,
        width: 220,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    tab: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

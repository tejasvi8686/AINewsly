import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Dimensions,
    Platform,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    interpolate,
    Extrapolation,
    withTiming,
    FadeInDown,
    SharedValue,
    withRepeat,
    Easing,
    ZoomIn,
    FadeIn,
    interpolateColor,
    withSequence,
    withDelay,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const CARD_WIDTH = width * 0.8;
const SPACING = 12;
const ITEM_SIZE = CARD_WIDTH + SPACING;
const SPACER = (width - ITEM_SIZE) / 2;

const SLIDES = [
    {
        id: '1',
        title: 'CLARIFY THE CHAOS',
        subtitle: 'Instant intelligence',
        icon: 'flash' as const,
        description: 'Cut through the noise. AI-powered summaries that deliver the essence of every story in seconds.',
        color: '#1E3A8A', // Deep Blue
    },
    {
        id: '2',
        title: 'YOUR FEED, YOUR RULES',
        subtitle: 'Curated for you',
        icon: 'options' as const,
        description: 'A news feed that learns your taste. The more you read, the smarter it gets.',
        color: '#581C87', // Deep Purple
    },
    {
        id: '3',
        title: 'PURE FOCUS',
        subtitle: 'Read without distraction',
        icon: 'reader' as const,
        description: 'Immersive reading mode designed for deep work. No ads, no clutter, just the story.',
        color: '#111827', // Deep Gray/Black
    },
    {
        id: '4',
        title: 'MASTER THE FEED',
        subtitle: 'Gestures',
        icon: 'finger-print' as const, // Placeholder
        description: 'Swipe Right to Save. Swipe Left to Like. It’s that simple.',
        color: '#000000', // Deep Black
    },
];

interface OnboardingScreenProps {
    onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
    const scrollX = useSharedValue(0);
    const flatListRef = useRef<Animated.FlatList<any>>(null);
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
            setCurrentIndex(currentIndex + 1);
        } else {
            onComplete();
        }
    };

    const handleSkip = () => {
        onComplete();
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index || 0);
        }
    }).current;

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            
            {/* Dynamic Background */}
            <Background scrollX={scrollX} />

            {/* Ticker Layer */}
            <View style={styles.tickerLayer} pointerEvents="none">
                <NewsTicker speed={25000} fontSize={60} opacity={0.1} />
                <NewsTicker speed={30000} reverse fontSize={40} opacity={0.08} style={{ marginTop: -20 }} />
                <NewsTicker speed={20000} fontSize={80} opacity={0.05} style={{ marginTop: -10 }} />
            </View>

            <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
                <Animated.View entering={FadeIn.duration(600).delay(200)} style={styles.header}>
                    <Pressable onPress={handleSkip} style={styles.skipButton}>
                        <Text style={styles.skipText}>Skip</Text>
                    </Pressable>
                </Animated.View>

                <Animated.View 
                    style={{ flex: 1 }} 
                    entering={ZoomIn.duration(1200).easing(Easing.out(Easing.exp))}
                >
                    <Animated.FlatList
                        ref={flatListRef}
                        data={SLIDES}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => (
                            <Card item={item} index={index} scrollX={scrollX} />
                        )}
                        horizontal
                        pagingEnabled={false}
                        snapToInterval={ITEM_SIZE}
                        decelerationRate="fast"
                        showsHorizontalScrollIndicator={false}
                        onScroll={scrollHandler}
                        scrollEventThrottle={16}
                        contentContainerStyle={{
                            paddingHorizontal: SPACER,
                            alignItems: 'center', 
                        }}
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                        bounces={false}
                        getItemLayout={(data, index) => ({
                            length: ITEM_SIZE,
                            offset: ITEM_SIZE * index,
                            index,
                        })}
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(500).duration(800)} style={styles.footer}>
                    <Paginator data={SLIDES} scrollX={scrollX} />
                    
                    <Pressable
                        onPress={handleNext}
                        style={({ pressed }) => [
                            styles.button,
                            pressed && styles.buttonPressed,
                        ]}
                    >
                        <Text style={styles.buttonText}>
                            {currentIndex === SLIDES.length - 1 ? 'GET STARTED' : 'NEXT'}
                        </Text>
                        <Ionicons 
                            name={currentIndex === SLIDES.length - 1 ? "arrow-forward-circle" : "arrow-forward"} 
                            size={20} 
                            color="#000" 
                        />
                    </Pressable>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}

function Background({ scrollX }: { scrollX: SharedValue<number> }) {
    return (
        <View style={StyleSheet.absoluteFillObject}>
            {SLIDES.map((slide, index) => {
                const animatedStyle = useAnimatedStyle(() => {
                    const inputRange = [
                        (index - 1) * ITEM_SIZE,
                        index * ITEM_SIZE,
                        (index + 1) * ITEM_SIZE,
                    ];
                    
                    const opacity = interpolate(
                        scrollX.value,
                        inputRange,
                        [0, 1, 0],
                        Extrapolation.CLAMP
                    );

                    return { opacity };
                });

                return (
                    <Animated.View
                        key={index}
                        style={[
                            StyleSheet.absoluteFillObject,
                            { backgroundColor: slide.color },
                            animatedStyle
                        ]}
                    >
                        <LinearGradient
                            colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.85)']}
                            style={StyleSheet.absoluteFillObject}
                        />
                    </Animated.View>
                );
            })}
        </View>
    );
}

function Card({ item, index, scrollX }: { item: typeof SLIDES[0], index: number, scrollX: SharedValue<number> }) {
    const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
            (index + 1) * ITEM_SIZE,
        ];

        const scale = interpolate(
            scrollX.value,
            inputRange,
            [0.9, 1, 0.9],
            Extrapolation.CLAMP
        );

        const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.6, 1, 0.6],
            Extrapolation.CLAMP
        );
        
        const rotateY = interpolate(
            scrollX.value,
            inputRange,
            [15, 0, -15],
            Extrapolation.CLAMP
        );

        const borderColor = interpolateColor(
            scrollX.value,
            inputRange,
            ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0.1)']
        );
        
        return {
            transform: [
                { perspective: 1000 },
                { scale },
                { rotateY: `${rotateY}deg` },
            ],
            opacity,
            borderColor,
        };
    });

    // Parallax for inner content
    const parallaxStyle = useAnimatedStyle(() => {
        const inputRange = [
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
            (index + 1) * ITEM_SIZE,
        ];
        
        const translateX = interpolate(
            scrollX.value,
            inputRange,
            [50, 0, -50],
            Extrapolation.CLAMP
        );
        
        return {
            transform: [{ translateX }],
        };
    });

    const textRevealStyle = useAnimatedStyle(() => {
        const inputRange = [
            (index - 0.5) * ITEM_SIZE,
            index * ITEM_SIZE,
            (index + 0.5) * ITEM_SIZE,
        ];

        const translateY = interpolate(
            scrollX.value,
            inputRange,
            [20, 0, 20],
            Extrapolation.CLAMP
        );

        const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0, 1, 0],
            Extrapolation.CLAMP
        );

        return {
            transform: [{ translateY }],
            opacity,
        };
    });

    return (
        <View style={{ width: ITEM_SIZE }}>
            <Animated.View style={[styles.cardContainer, animatedStyle]}>
                <Animated.View style={[styles.innerContent, parallaxStyle]}>
                    <View style={styles.iconContainer}>
                        {item.id === '4' ? (
                            <GestureDemo />
                        ) : (
                            <Ionicons name={item.icon} size={64} color="#fff" />
                        )}
                    </View>
                    <Animated.View style={[styles.textContainer, textRevealStyle]}>
                        <Text style={styles.subtitle}>{item.subtitle}</Text>
                        <View style={styles.separator} />
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </Animated.View>
                </Animated.View>
            </Animated.View>
        </View>
    );
}

function GestureDemo() {
    const handX = useSharedValue(0);
    const likeScale = useSharedValue(1);
    const saveScale = useSharedValue(1);

    useEffect(() => {
        const duration = 1500;
        handX.value = withRepeat(
            withSequence(
                withTiming(40, { duration, easing: Easing.inOut(Easing.quad) }), // Right (Like)
                withTiming(0, { duration: duration / 2, easing: Easing.inOut(Easing.quad) }),
                withTiming(-40, { duration, easing: Easing.inOut(Easing.quad) }), // Left (Save)
                withTiming(0, { duration: duration / 2, easing: Easing.inOut(Easing.quad) })
            ),
            -1,
            false
        );
        
        // Pulse icons when hand reaches them
        likeScale.value = withRepeat(withSequence(withDelay(duration * 0.8, withTiming(1.5, { duration: 300 })), withTiming(1)), -1);
        saveScale.value = withRepeat(withSequence(withDelay(duration * 2.3, withTiming(1.5, { duration: 300 })), withTiming(1)), -1);
    }, []);

    const handStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: handX.value }, { rotate: '-15deg' }]
    }));

    const likeIconStyle = useAnimatedStyle(() => {
        const opacity = interpolate(handX.value, [10, 40], [0.3, 1], Extrapolation.CLAMP);
        const scale = interpolate(handX.value, [10, 40], [0.8, 1.2], Extrapolation.CLAMP);
        return { opacity, transform: [{ scale }] };
    });

    const saveIconStyle = useAnimatedStyle(() => {
        const opacity = interpolate(handX.value, [-40, -10], [1, 0.3], Extrapolation.CLAMP);
        const scale = interpolate(handX.value, [-40, -10], [1.2, 0.8], Extrapolation.CLAMP);
        return { opacity, transform: [{ scale }] };
    });

    return (
        <View style={styles.gestureContainer}>
            <Animated.View style={[styles.gestureIcon, styles.gestureRight, likeIconStyle]}>
                <Ionicons name="bookmark" size={24} color="#fff" />
            </Animated.View>
            
            <Animated.View style={[styles.gestureIcon, styles.gestureLeft, saveIconStyle]}>
                <Ionicons name="heart" size={24} color="#ff4040" />
            </Animated.View>

            <Animated.View style={handStyle}>
                <Ionicons name="hand-right" size={48} color="#fff" />
            </Animated.View>
        </View>
    );
}

function Paginator({ data, scrollX }: { data: typeof SLIDES, scrollX: SharedValue<number> }) {
    return (
        <View style={styles.paginatorContainer}>
            {data.map((_, i) => {
                const animatedDotStyle = useAnimatedStyle(() => {
                    const inputRange = [(i - 1) * ITEM_SIZE, i * ITEM_SIZE, (i + 1) * ITEM_SIZE];
                    
                    const widthAnim = interpolate(
                        scrollX.value,
                        inputRange,
                        [8, 32, 8],
                        Extrapolation.CLAMP
                    );
                    
                    const opacity = interpolate(
                        scrollX.value,
                        inputRange,
                        [0.3, 1, 0.3],
                        Extrapolation.CLAMP
                    );

                    return {
                        width: widthAnim,
                        opacity,
                    };
                });

                return (
                    <Animated.View
                        key={i.toString()}
                        style={[styles.dot, animatedDotStyle]}
                    />
                );
            })}
        </View>
    );
}

function NewsTicker({ 
    reverse = false, 
    speed = 10000, 
    fontSize = 42, 
    opacity = 1,
    style 
}: { 
    reverse?: boolean, 
    speed?: number, 
    fontSize?: number, 
    opacity?: number,
    style?: any
}) {
    const initialOffset = reverse ? -width * 5 : 0;
    const translateX = useSharedValue(initialOffset);

    useEffect(() => {
        const targetOffset = reverse ? initialOffset + width : initialOffset - width;

        translateX.value = withRepeat(
            withTiming(targetOffset, {
                duration: speed,
                easing: Easing.linear,
            }),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const TEXT = "BREAKING • AI ANALYSIS • GLOBAL • MARKETS • TECH • ";

    return (
        <View style={[styles.tickerRow, style, { opacity }]}>
            <Animated.View style={[styles.tickerContent, animatedStyle]}>
                <Text style={[styles.tickerText, { fontSize }]}>
                    {TEXT.repeat(20)}
                </Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    safe: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 20,
    },
    skipButton: {
        padding: 8,
    },
    skipText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    tickerLayer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        transform: [{ rotate: '-10deg' }, { scale: 1.2 }],
    },
    tickerRow: {
        marginBottom: 0,
        overflow: 'hidden',
    },
    tickerContent: {
        flexDirection: 'row',
        width: width * 20, 
    },
    tickerText: {
        color: '#fff',
        fontWeight: '900',
        textTransform: 'uppercase',
        includeFontPadding: false,
    },
    cardContainer: {
        width: CARD_WIDTH,
        height: height * 0.58,
        backgroundColor: 'rgba(20, 20, 20, 0.9)',
        borderRadius: 0,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.5,
        shadowRadius: 24,
        elevation: 12,
        marginRight: SPACING,
        overflow: 'hidden',
    },
    innerContent: {
        width: '100%',
        alignItems: 'center',
    },
    iconContainer: {
        width: 110,
        height: 110,
        borderRadius: 0,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 36,
    },
    textContainer: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 16,
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
        letterSpacing: -0.5,
        textTransform: 'uppercase',
    },
    separator: {
        width: 40,
        height: 2,
        backgroundColor: '#fff',
        opacity: 0.5,
        marginBottom: 16,
    },
    subtitle: {
        color: '#fff',
        fontSize: 12,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 14,
        letterSpacing: 3,
        textTransform: 'uppercase',
        opacity: 0.8,
    },
    description: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 24,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontStyle: 'italic',
        marginTop: 8,
    },
    footer: {
        paddingHorizontal: 32,
        paddingBottom: 48,
        alignItems: 'center',
        gap: 32,
        marginTop: 20,
    },
    paginatorContainer: {
        flexDirection: 'row',
        height: 8,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    dot: {
        height: 6,
        borderRadius: 0,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 48,
        borderRadius: 0,
        gap: 12,
        width: '100%',
        maxWidth: 280,
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    buttonPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    buttonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    gestureContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gestureIcon: {
        position: 'absolute',
    },
    gestureRight: {
        right: 10,
    },
    gestureLeft: {
        left: 10,
    },
});

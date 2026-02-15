import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Dimensions,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
    FadeInDown, 
    useSharedValue, 
    useAnimatedStyle, 
    withRepeat, 
    withTiming, 
    Easing,
    ZoomIn
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface GetStartedScreenProps {
    onGetStarted: () => void;
}

export default function GetStartedScreen({ onGetStarted }: GetStartedScreenProps) {
    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            
            {/* Background Ticker Layer */}
            <View style={styles.tickerLayer}>
                <NewsTicker speed={20000} fontSize={60} opacity={0.15} />
                <NewsTicker speed={25000} reverse fontSize={40} opacity={0.12} style={{ marginTop: -20 }} />
                <NewsTicker speed={18000} fontSize={80} opacity={0.08} style={{ marginTop: -10 }} />
            </View>

            {/* Gradient Overlay to ensure readability */}
            <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)', '#000000']}
                locations={[0, 0.5, 0.9]}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
                <View style={styles.header}>
                    <Text style={styles.dateText}>ISSUE NO. 1  •  {new Date().toLocaleDateString().toUpperCase()}</Text>
                </View>

                <View style={styles.content}>
                    <Animated.View entering={ZoomIn.duration(1200).easing(Easing.out(Easing.exp))} style={styles.heroContainer}>
                        {/* App Logo */}
                        <View style={styles.logoContainer}>
                            <AppLogo />
                        </View>
                        
                        <View style={styles.titleContainer}>
                            <Text style={styles.titlePrefix}>AI</Text>
                            <Text 
                                style={styles.titleMain} 
                                adjustsFontSizeToFit 
                                numberOfLines={1}
                            >
                                NEWSLY
                            </Text>
                        </View>
                        
                        <View style={styles.separator} />
                        
                        <Text style={styles.subtitle}>The World, Summarized.</Text>
                    </Animated.View>
                </View>

                <View style={styles.footer}>
                    <Animated.View entering={FadeInDown.delay(500).duration(800)} style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={styles.valueProp}>
                            Clarity in a noisy world.
                        </Text>
                        <Pressable
                            onPress={onGetStarted}
                            style={({ pressed }) => [
                                styles.button,
                                pressed && styles.buttonPressed,
                            ]}
                        >
                            <Text style={styles.buttonText}>READ NOW</Text>
                            <Ionicons name="arrow-forward" size={18} color="#000" />
                        </Pressable>
                    </Animated.View>
                </View>
            </SafeAreaView>
        </View>
    );
}

function AppLogo() {
    return (
        <View style={styles.appLogo}>
            <LinearGradient
                colors={['#ffffff', '#e5e5e5']}
                style={styles.logoGradient}
            >
                <Ionicons name="newspaper" size={44} color="#000" />
                <View style={styles.logoSparkle}>
                    <Ionicons name="sparkles" size={18} color="#000" />
                </View>
            </LinearGradient>
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
    safe: {
        flex: 1,
        justifyContent: 'space-between',
        zIndex: 10,
    },
    header: {
        paddingTop: 12,
        alignItems: 'center',
    },
    dateText: {
        color: '#fff',
        opacity: 0.7,
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 3,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    heroContainer: {
        alignItems: 'center',
        width: '100%',
    },
    logoContainer: {
        marginBottom: 32,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
    },
    appLogo: {
        width: 80,
        height: 80,
        borderRadius: 20,
        overflow: 'hidden',
    },
    logoGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoSparkle: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 24,
        width: '100%',
    },
    titlePrefix: {
        color: '#fff',
        fontSize: 24,
        fontFamily: Platform.OS === 'ios' ? 'Georgia-Italic' : 'serif',
        fontStyle: 'italic',
        marginBottom: 8,
        opacity: 0.9,
    },
    titleMain: {
        color: '#fff',
        fontSize: 64,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: -2,
        width: '100%',
    },
    separator: {
        width: 40,
        height: 2,
        backgroundColor: '#fff',
        opacity: 0.3,
        marginBottom: 24,
    },
    subtitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '400',
        letterSpacing: 3,
        opacity: 0.8,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    footer: {
        paddingHorizontal: 32,
        paddingBottom: 48,
        alignItems: 'center',
    },
    valueProp: {
        color: '#fff',
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 24,
        opacity: 0.6,
        letterSpacing: 1,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
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
        minWidth: 200,
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    buttonText: {
        color: '#000',
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
});

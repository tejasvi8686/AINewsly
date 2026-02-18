import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';

interface SkeletonLineProps {
    width?: number | string;
    height?: number;
    style?: object;
}

export default function SkeletonLine({ width = '100%', height = 14, style }: SkeletonLineProps) {
    const shimmer = useSharedValue(0);

    useEffect(() => {
        shimmer.value = withRepeat(
            withTiming(1, { duration: 1200 }),
            -1,
            true
        );
    }, [shimmer]);

    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            shimmer.value,
            [0, 1],
            [0.3, 0.6],
            Extrapolation.CLAMP
        );
        return { opacity };
    });

    return (
        <View style={[styles.line, { width, height }, style]}>
            <Animated.View style={[styles.shimmer, animatedStyle]} />
        </View>
    );
}

const styles = StyleSheet.create({
    line: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    shimmer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: 4,
    },
});

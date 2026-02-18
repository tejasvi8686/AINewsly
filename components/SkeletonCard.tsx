import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SkeletonLine from './SkeletonLine';

const { width, height } = Dimensions.get('window');

export default function SkeletonCard() {
    return (
        <View style={styles.container}>
            <View style={styles.imagePlaceholder} />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.95)']}
                style={styles.gradient}
            />
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <SkeletonLine width={80} height={24} />
                    <SkeletonLine width={100} height={12} />
                </View>
                <SkeletonLine width="90%" height={28} style={{ marginBottom: 8 }} />
                <SkeletonLine width="100%" height={20} style={{ marginBottom: 8 }} />
                <SkeletonLine width="95%" height={20} style={{ marginBottom: 8 }} />
                <SkeletonLine width="70%" height={20} style={{ marginBottom: 8 }} />
                <View style={styles.summaryBlock}>
                    <SkeletonLine width={100} height={14} style={{ marginBottom: 8 }} />
                    <SkeletonLine width="100%" height={14} style={{ marginBottom: 6 }} />
                    <SkeletonLine width="85%" height={14} style={{ marginBottom: 6 }} />
                    <SkeletonLine width="60%" height={14} />
                </View>
                <SkeletonLine width={120} height={12} style={{ marginTop: 16, alignSelf: 'center' }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width,
        height,
        backgroundColor: '#000',
        justifyContent: 'flex-end',
    },
    imagePlaceholder: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        top: '30%',
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 130,
        justifyContent: 'flex-end',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    summaryBlock: {
        marginTop: 12,
    },
});

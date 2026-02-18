import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Modal,
    Pressable,
    Text,
    StatusBar,
    Dimensions,
    ActivityIndicator,
    Linking,
    Platform,
    ScrollView,
    Share,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { NewsItem } from '../types';
import SavedLikedCard from '../components/SavedLikedCard';

const { height } = Dimensions.get('window');
const WEBVIEW_HEIGHT = height - 100;

interface ArticleWebViewScreenProps {
    url: string | null;
    onClose: () => void;
    relatedArticles?: NewsItem[];
    onOpenRelated?: (url: string) => void;
    articleTitle?: string;
}

export default function ArticleWebViewScreen({ url, onClose, relatedArticles = [], onOpenRelated, articleTitle }: ArticleWebViewScreenProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    // On iOS, WKWebView inside Modal often stays white until mounted after modal is shown
    const [iosReadyForWebView, setIosReadyForWebView] = useState(false);

    useEffect(() => {
        if (!url && Platform.OS === 'ios') setIosReadyForWebView(false);
    }, [url]);

    if (!url) return null;

    const openInBrowser = () => {
        Linking.openURL(url);
        onClose();
    };

    const openInBrowserLabel = Platform.OS === 'ios' ? 'Open in Safari' : 'Open in Chrome';

    const showWebView = Platform.OS !== 'ios' || iosReadyForWebView;

    const handleModalShow = () => {
        if (Platform.OS === 'ios') {
            // Delay so the modal's view hierarchy is fully laid out before WKWebView is created
            setTimeout(() => setIosReadyForWebView(true), 100);
        }
    };

    const handleShare = async () => {
        if (!url) return;
        try {
            await Share.share({
                message: `Check out this news: ${articleTitle || 'Article'} - ${url}`,
            });
        } catch {
            // Share cancelled or failed
        }
    };

    return (
        <Modal
            visible={!!url}
            animationType="slide"
            onRequestClose={onClose}
            onShow={handleModalShow}
            statusBarTranslucent
            presentationStyle={Platform.OS === 'ios' ? 'fullScreen' : undefined}
        >
            <SafeAreaProvider>
                <View style={styles.container}>
                    <StatusBar barStyle="light-content" />
                    <SafeAreaView edges={['top']} style={styles.headerWrapper}>
                        <View style={styles.header}>
                            <Pressable onPress={onClose} style={styles.closeButton} hitSlop={12}>
                                <Ionicons name="close" size={28} color="#fff" />
                                <Text style={styles.closeText}>Close</Text>
                            </Pressable>
                            <Pressable onPress={handleShare} style={styles.shareButton} hitSlop={12}>
                                <Ionicons name="share-outline" size={22} color="#fff" />
                            </Pressable>
                        </View>
                    </SafeAreaView>

                    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <View style={[styles.webviewContainer, { height: WEBVIEW_HEIGHT }]} collapsable={false}>
                        {error ? (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>Could not load the page.</Text>
                                <Pressable style={styles.browserButton} onPress={openInBrowser}>
                                    <Text style={styles.browserButtonText}>{openInBrowserLabel}</Text>
                                </Pressable>
                            </View>
                        ) : !showWebView ? (
                            <View style={styles.loadingOverlay}>
                                <ActivityIndicator size="large" color="#fff" />
                                <Text style={styles.loadingText}>Loading…</Text>
                            </View>
                        ) : (
                            <>
                                {loading && (
                                    <View style={styles.loadingOverlay} pointerEvents="none">
                                        <ActivityIndicator size="large" color="#fff" />
                                        <Text style={styles.loadingText}>Loading…</Text>
                                    </View>
                                )}
                                <WebView
                                    key={url}
                                    source={{
                                        uri: url,
                                        headers: { 'Accept-Language': 'en-US,en;q=0.9' },
                                    }}
                                    style={[styles.webview, { height: WEBVIEW_HEIGHT }]}
                                    javaScriptEnabled
                                    domStorageEnabled
                                    sharedCookiesEnabled
                                    allowsBackForwardNavigationGestures={false}
                                    originWhitelist={['https://*', 'http://*']}
                                    userAgent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
                                    // Android: allow mixed content and single window
                                    {...(Platform.OS === 'android' && {
                                        mixedContentMode: 'compatibility' as const,
                                        setSupportMultipleWindows: false,
                                    })}
                                    onLoadStart={() => { setLoading(true); setError(false); }}
                                    onLoadEnd={() => setLoading(false)}
                                    onError={() => { setLoading(false); setError(true); }}
                                    onHttpError={(e) => {
                                        if (e.nativeEvent.statusCode >= 400) {
                                            setLoading(false);
                                            setError(true);
                                        }
                                    }}
                                />
                            </>
                        )}
                    </View>

                    {relatedArticles.length > 0 && onOpenRelated && (
                        <View style={styles.relatedSection}>
                            <Text style={styles.relatedTitle}>Related</Text>
                            {relatedArticles.slice(0, 3).map((item) => (
                                <SavedLikedCard
                                    key={item.id}
                                    item={item}
                                    variant="saved"
                                    onPress={() => onOpenRelated(item.url)}
                                    onRemove={undefined}
                                />
                            ))}
                        </View>
                    )}
                    </ScrollView>
                </View>
            </SafeAreaProvider>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    headerWrapper: {
        backgroundColor: '#000',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.12)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 12,
    },
    closeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    closeText: {
        fontSize: 17,
        color: '#fff',
        fontWeight: '500',
    },
    shareButton: {
        padding: 8,
    },
    openBrowserButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    openBrowserText: {
        fontSize: 15,
        color: '#fff',
        fontWeight: '500',
    },
    webviewContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    webview: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#000',
    },
    errorText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 16,
        textAlign: 'center',
    },
    browserButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 0,
    },
    browserButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    relatedSection: {
        paddingVertical: 16,
        paddingHorizontal: 0,
        backgroundColor: '#000',
    },
    relatedTitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
        marginHorizontal: 16,
        marginBottom: 12,
    },
});

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
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');
const WEBVIEW_HEIGHT = height - 100;

interface ArticleWebViewScreenProps {
    url: string | null;
    onClose: () => void;
}

export default function ArticleWebViewScreen({ url, onClose }: ArticleWebViewScreenProps) {
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
                    <StatusBar barStyle="dark-content" />
                    <SafeAreaView edges={['top']} style={styles.headerWrapper}>
                        <View style={styles.header}>
                            <Pressable onPress={onClose} style={styles.closeButton} hitSlop={12}>
                                <Ionicons name="close" size={28} color="#000" />
                                <Text style={styles.closeText}>Close</Text>
                            </Pressable>
                            <Pressable onPress={openInBrowser} style={styles.openBrowserButton} hitSlop={12}>
                                <Ionicons name="open-outline" size={22} color="#007AFF" />
                                <Text style={styles.openBrowserText}>{openInBrowserLabel}</Text>
                            </Pressable>
                        </View>
                    </SafeAreaView>

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
                                <ActivityIndicator size="large" color="#007AFF" />
                                <Text style={styles.loadingText}>Loading…</Text>
                            </View>
                        ) : (
                            <>
                                {loading && (
                                    <View style={styles.loadingOverlay} pointerEvents="none">
                                        <ActivityIndicator size="large" color="#007AFF" />
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
                </View>
            </SafeAreaProvider>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerWrapper: {
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
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
        color: '#007AFF',
        fontWeight: '500',
    },
    openBrowserButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    openBrowserText: {
        fontSize: 15,
        color: '#007AFF',
        fontWeight: '500',
    },
    webviewContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    webview: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#f5f5f5',
    },
    errorText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    browserButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
    },
    browserButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

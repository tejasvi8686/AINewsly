import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn, Easing } from 'react-native-reanimated';

interface AuthScreenProps {
    onSuccess: () => void;
    onSkip: () => void;
}

export default function AuthScreen({ onSuccess, onSkip }: AuthScreenProps) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [showOtpStep, setShowOtpStep] = useState(false);

    const handleSendCode = () => {
        if (!phoneNumber.trim()) return;
        setShowOtpStep(true);
    };

    const handleVerifyCode = () => {
        if (!verificationCode.trim()) return;
        onSuccess();
    };

    const handleChangePhone = () => {
        setShowOtpStep(false);
        setVerificationCode('');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="light" />

            <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
                        <Pressable
                            onPress={onSkip}
                            style={({ pressed }) => [styles.skipButton, pressed && styles.buttonPressed]}
                        >
                            <Text style={styles.skipText}>Skip for now</Text>
                        </Pressable>
                    </Animated.View>

                    {/* Title */}
                    <Animated.View
                        entering={FadeInDown.duration(700).easing(Easing.out(Easing.cubic))}
                        style={styles.titleContainer}
                    >
                        <Text style={styles.titlePrefix}>AI Newsly</Text>
                        <Text style={styles.titleMain}>ACCOUNT</Text>
                        <View style={styles.separator} />
                    </Animated.View>

                    {/* Form */}
                    <View style={styles.form}>
                        {!showOtpStep ? (
                            <Animated.View
                                key="phone"
                                entering={FadeInDown.delay(200).duration(600).easing(Easing.out(Easing.cubic))}
                                style={styles.formBlock}
                            >
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>PHONE NUMBER</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="+1 234 567 8900"
                                        placeholderTextColor="rgba(255,255,255,0.3)"
                                        value={phoneNumber}
                                        onChangeText={setPhoneNumber}
                                        keyboardType="phone-pad"
                                        autoComplete="tel"
                                    />
                                    <Text style={styles.helperText}>Include country code (e.g. +1)</Text>
                                </View>

                                <Pressable
                                    onPress={handleSendCode}
                                    style={({ pressed }) => [
                                        styles.submitButton,
                                        pressed && styles.submitButtonPressed,
                                    ]}
                                    disabled={!phoneNumber.trim()}
                                >
                                    <Text style={styles.submitText}>SEND CODE</Text>
                                </Pressable>
                            </Animated.View>
                        ) : (
                            <Animated.View
                                key="otp"
                                entering={FadeInDown.duration(500).easing(Easing.out(Easing.cubic))}
                                style={styles.formBlock}
                            >
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>VERIFICATION CODE</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="123456"
                                        placeholderTextColor="rgba(255,255,255,0.3)"
                                        value={verificationCode}
                                        onChangeText={setVerificationCode}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                    />
                                </View>

                                <Pressable
                                    onPress={handleVerifyCode}
                                    style={({ pressed }) => [
                                        styles.submitButton,
                                        pressed && styles.submitButtonPressed,
                                    ]}
                                    disabled={!verificationCode.trim()}
                                >
                                    <Text style={styles.submitText}>VERIFY & SIGN IN</Text>
                                </Pressable>

                                <Pressable
                                    onPress={handleChangePhone}
                                    style={({ pressed }) => [
                                        styles.changePhoneButton,
                                        pressed && styles.buttonPressed,
                                    ]}
                                >
                                    <Text style={styles.changePhoneText}>Change Phone Number</Text>
                                </Pressable>
                            </Animated.View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
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
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 32,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'flex-end',
        marginTop: 16,
        marginBottom: 40,
    },
    skipButton: {
        padding: 8,
    },
    skipText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    buttonPressed: {
        opacity: 0.85,
    },
    titleContainer: {
        marginBottom: 48,
    },
    titlePrefix: {
        color: '#fff',
        fontSize: 24,
        fontFamily: Platform.OS === 'ios' ? 'Georgia-Italic' : 'serif',
        fontStyle: 'italic',
        marginBottom: 4,
        opacity: 0.9,
    },
    titleMain: {
        color: '#fff',
        fontSize: 48,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: 'bold',
        letterSpacing: -1,
    },
    separator: {
        width: 40,
        height: 2,
        backgroundColor: '#fff',
        opacity: 0.3,
        marginTop: 16,
    },
    form: {
        gap: 24,
    },
    formBlock: {
        gap: 24,
    },
    inputGroup: {
        gap: 10,
    },
    label: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.5,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: 0, 
        paddingHorizontal: 16,
        color: '#fff',
        fontSize: 16,
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    helperText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
    },
    submitButton: {
        height: 56,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        borderRadius: 0,
    },
    submitButtonPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    submitText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 1.5,
    },
    changePhoneButton: {
        alignItems: 'center',
        padding: 12,
    },
    changePhoneText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});

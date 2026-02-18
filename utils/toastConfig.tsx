import React from "react";
import { StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    BaseToast,
    BaseToastProps,
    ErrorToast,
    ToastConfig,
    ToastProps,
} from "react-native-toast-message";

// Placeholder for fonts since the file doesn't exist
const FONTS = { 
    medium: Platform.OS === 'ios' ? 'System' : 'Roboto' 
};

const SuccessToast = (props: BaseToastProps) => {
  const { top } = useSafeAreaInsets();
  return (
    <BaseToast
      {...props}
      style={[styles.toastCard, { top: -top, backgroundColor: "#16C47F" }]}
      contentContainerStyle={[styles.toastContent, { paddingTop: top + 40 }]}
      text1Style={styles.toastText}
      text2Style={styles.toastText}
    />
  );
};

const ErrorToastComponent = (props: ToastProps) => {
  const { top } = useSafeAreaInsets();
  return (
    <ErrorToast
      {...props}
      style={[styles.toastCard, { top: -top, backgroundColor: "#FF4F4F" }]}
      contentContainerStyle={[styles.toastContent, { paddingTop: top + 40 }]}
      text1Style={styles.toastText2}
      text2Style={styles.toastText2}
    />
  );
};

export const toastConfig: ToastConfig = {
  success: SuccessToast,
  error: ErrorToastComponent,
};

const styles = StyleSheet.create({
  toastCard: {
    borderLeftColor: "transparent",
    width: "100%",
    height: undefined,
    position: "absolute",
    justifyContent: "center",
    zIndex: 9999,
  },
  toastContent: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    width: "100%",
    alignItems: 'center',
  },
  toastText: {
    alignSelf: "center",
    fontSize: 16,
    fontFamily: FONTS.medium,
    fontWeight: '600',
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  toastText2: {
    alignSelf: "center",
    fontSize: 16,
    fontFamily: FONTS.medium,
    fontWeight: '600',
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
});

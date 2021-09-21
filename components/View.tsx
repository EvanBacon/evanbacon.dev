import NativeView from '@expo/html-elements/build/primitives/View';
import React, { ClassAttributes, ComponentProps, ComponentType } from 'react';
import { StyleProp, StyleSheet, ViewStyle as NativeViewStyle } from 'react-native';




declare type NativeViewProps = ComponentProps<typeof NativeView> & ClassAttributes<typeof NativeView>;

export declare type ViewStyle = NativeViewStyle;
export declare type WebViewProps = {
    style?: StyleProp<ViewStyle>;
    accessibilityRole?: 'list' | 'listitem' | 'complementary' | 'contentinfo' | 'region' | 'navigation' | 'main' | 'article' | 'banner' | AccessibilityRole;
};
export declare type ViewProps = WebViewProps & Omit<NativeViewProps, 'style' | 'accessibilityRole'>;

export const View: ComponentType<ViewProps> = ({ style, ...props }) => <NativeView style={[styles.hackFixReset, style]} {...props} />


const styles = StyleSheet.create({

    hackFixReset: {
        minHeight: 'unset',
        minWidth: 'unset',
    }
});
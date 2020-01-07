import React from 'react';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { AppearanceProvider } from 'react-native-appearance';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomAppearanceProvider from '../context/CustomAppearanceProvider';

import EStyleSheet from 'react-native-extended-stylesheet';
EStyleSheet.build({}); // always call EStyleSheet.build() even if you don't use global variables!

export default ({ Component, pageProps }) => {
    return (
        <SafeAreaProvider>
            <AppearanceProvider>
                <CustomAppearanceProvider>
                    <ActionSheetProvider>
                        <Component {...pageProps} />
                    </ActionSheetProvider>
                </CustomAppearanceProvider>
            </AppearanceProvider>
        </SafeAreaProvider>
    )
}

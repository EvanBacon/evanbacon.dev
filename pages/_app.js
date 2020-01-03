import React from 'react';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { AppearanceProvider } from 'react-native-appearance';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default ({ Component, pageProps }) => {
    return (  
        <SafeAreaProvider>
            <AppearanceProvider>
                <ActionSheetProvider>
                    <Component {...pageProps} />
                </ActionSheetProvider>
            </AppearanceProvider>
        </SafeAreaProvider>
    )
}

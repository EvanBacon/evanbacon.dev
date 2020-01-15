import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import React from 'react';
import { AppearanceProvider } from 'react-native-appearance';
import EStyleSheet from 'react-native-extended-stylesheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Layout from '../components/Layout';
import CustomAppearanceProvider from '../context/CustomAppearanceProvider';

EStyleSheet.build({}); // always call EStyleSheet.build() even if you don't use global variables!

export default ({ Component, pageProps }) => {
    return (
        <SafeAreaProvider>
            <AppearanceProvider>
                <CustomAppearanceProvider>
                    <ActionSheetProvider>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </ActionSheetProvider>
                </CustomAppearanceProvider>
            </AppearanceProvider>
        </SafeAreaProvider>
    )
}

import { useTabScrollToTop } from '@/components/top-nav/tab-slot';
import { EventArg, StackActions } from '@react-navigation/core';
import { Navigator, Slot } from 'expo-router';
import React from 'react';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function BlogLayout() {
  return (
    <Navigator>
      <InnerSlot />
    </Navigator>
  );
}

function InnerSlot() {
  useTabToTop();
  useTabScrollToTop();
  return <Slot />;
}

function useTabToTop() {
  const { navigation, state } = Navigator.useContext();
  React.useEffect(
    () =>
      // @ts-expect-error: there may not be a tab navigator in parent
      navigation?.addListener?.('tabPress', (e: any) => {
        const isFocused = navigation.isFocused();

        // Run the operation in the next frame so we're sure all listeners have been run
        // This is necessary to know if preventDefault() has been called
        requestAnimationFrame(() => {
          if (
            isFocused &&
            !(e as EventArg<'tabPress', true>).defaultPrevented
          ) {
            if (state.index > 0) {
              // When user taps on already focused tab and we're inside the tab,
              // reset the stack to replicate native behaviour
              navigation.dispatch({
                ...StackActions.popToTop(),
                target: state.key,
              });
            }
          }
        });
      }),
    [navigation, state.index, state.key]
  );
}

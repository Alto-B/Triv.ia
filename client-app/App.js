import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { SocketProvider } from './src/SocketProvider';
import { Provider as PaperProvider } from 'react-native-paper';
import NavStack from './src/stacks/NavStack';

export default function App() {
  return (
    <SocketProvider>
      <PaperProvider>
        <NavStack/>
      </PaperProvider>
    </SocketProvider>
  );
}
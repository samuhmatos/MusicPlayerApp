import React from 'react';
import {
  StatusBar,
} from 'react-native';
import { ThemeProvider } from '@shopify/restyle';
import { Provider } from 'react-redux';
import {store} from './src/redux/store';
import { MusicPlayer } from './src/screens/MusicPlayerScreen/MusicPlayerScreen';
import { Box } from './src/components/Box/Box';
import { theme } from './src/theme';


function App(): JSX.Element {
  // TODO: PRETTIER, ESLINT
  //TODO: HOMESCREEN
  return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
            <StatusBar barStyle='light-content' />

            <Box flex={1}>
              <MusicPlayer />
            </Box>
        </ThemeProvider>  
      </Provider>

  );
}


export default App;

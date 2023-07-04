import {createSlice} from '@reduxjs/toolkit';
import {RepeatMode} from 'react-native-track-player';
import {RootStore} from './store';

export interface MusicState {
  index: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  repeatMode: RepeatMode;
}

export const musicSlice = createSlice({
  name: 'music',
  initialState: <MusicState>{
    index: 0,
    title: '',
    artist: '',
    album: '',
    repeatMode: RepeatMode.Off,
  },
  reducers: {
    setMusic(state, {payload}) {
      return {
        ...state,
        index: payload.index,
        title: payload.title,
        artist: payload.artist,
        album: payload.album,
      };
    },
    setRepeatMode(state, {payload}) {
      return {
        ...state,
        repeatMode: payload.repeatMode,
      };
    },
  },
});

export const {setMusic, setRepeatMode} = musicSlice.actions;

export const selectMusic = (state: RootStore) => state.music;

export default musicSlice.reducer;

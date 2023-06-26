import { Reducer, configureStore } from '@reduxjs/toolkit'
import musicSlice, { MusicState } from './musicSlice'

export interface RootStore{
    music: MusicState
}

export const store =  configureStore<RootStore>({
  reducer:{
    music: musicSlice
  }

})
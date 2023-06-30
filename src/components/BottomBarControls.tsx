import React,{useState} from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import TrackPlayer, { RepeatMode } from 'react-native-track-player';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { Box } from './Box/Box';
import { useMusicRedux } from '../hooks/useMusicRedux';
import { useDispatch } from 'react-redux';
import { setRepeatMode } from '../redux/musicSlice';

const {width, height} = Dimensions.get('window')
export function BottomBarControls(){
  //TODO: LIKE, SHARE, MORE, REPEAT MODE MORE COMPLETED

    const dispatch = useDispatch()
    const music = useMusicRedux()

    const PlayRepeatMode = () =>{
    
        if(music.repeatMode == RepeatMode.Off){
            TrackPlayer.setRepeatMode(RepeatMode.Track)
            dispatch(setRepeatMode({
                repeatMode: RepeatMode.Track
            }))
        }
    
        if(music.repeatMode == RepeatMode.Track){
            TrackPlayer.setRepeatMode(RepeatMode.Queue)
            dispatch(setRepeatMode({
                repeatMode: RepeatMode.Queue
            }))
        }

        if(music.repeatMode == RepeatMode.Queue){
            TrackPlayer.setRepeatMode(RepeatMode.Off)
            dispatch(setRepeatMode({
                repeatMode: RepeatMode.Off
            }))
        }
    }

    const setRepeatIcon = ():string => {
        switch (music.repeatMode) {
            case RepeatMode.Track:
                return "repeat-once"
            case RepeatMode.Queue:
                return "repeat"
            default:
                return "repeat-off";
        }
    }
    

    return (
        <Box
        borderTopColor='primary'
        borderTopWidth={1}
        alignItems='center'
        paddingVertical="s14"
        style={{width}}
    >
        <Box
            flexDirection="row"
            justifyContent="space-between"
            style={{width:'80%'}}
        >
            <TouchableOpacity onPress={() => {}}>
                <Ionicons name="heart-outline" size={30} color={'#f5f5f5'}/>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>PlayRepeatMode()}>
                <MaterialCommunityIcons name={setRepeatIcon()} size={30} color={music.repeatMode == RepeatMode.Off ? '#f5f5f5' : '#2B7CB5'}/>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {}}>
                <Ionicons name="share-outline" size={30} color={'#f5f5f5'}/>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {}}>
                <Ionicons name="ellipsis-horizontal" size={30} color={'#f5f5f5'}/>
            </TouchableOpacity>
        </Box>

    </Box>
    )
}
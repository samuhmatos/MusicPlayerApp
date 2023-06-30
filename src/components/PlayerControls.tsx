import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";

import TrackPlayer, { RepeatMode, State, Track, usePlaybackState, useProgress } from "react-native-track-player";
import { Box } from "./Box/Box";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch } from "react-redux";
import { useMusicRedux } from "../hooks/useMusicRedux";

interface PlayerControlsProps {
    scrollToMusic: (trackedId:number)=> void;
    queue: Track[]
}

export function PlayerControls({scrollToMusic, queue}:PlayerControlsProps){
    const playbackState = usePlaybackState()
    const progress = useProgress()
    const [leftTime, setLeftTime] = useState<string>('')
    const dispatch = useDispatch()
    const music = useMusicRedux()

    useEffect(() => {
        defineLeftTime()
    }, [progress.position])
    
    function defineLeftTime() {
        let rest = (progress.duration - progress.position) * 1000;

        let time;
        if(rest >= 0)
            time = new Date(rest).toISOString().substr(14,5);
        else
            time = '00:00';

        setLeftTime(time)
    }

    const togglePlayback = async(playbackState:  any) => {
        //se chegou no n final da fila, se clicar em play, tocar a ultima musica da fila
        const currentTrack = await TrackPlayer.getCurrentTrack()
        
        if(currentTrack !== null){
            if(playbackState == State.Paused || playbackState == State.Ready){
                await TrackPlayer.play()
            }else{
                await TrackPlayer.pause()
            }
        }else{
            //await TrackPlayer.
        }
    }

    const NextMusic = async() => {
        var index = music.index + 1;

        if(index <= (queue.length - 1)){
            scrollToMusic(index)
            await TrackPlayer.skipToNext()
        }else{
            if(music.repeatMode === RepeatMode.Queue){
                scrollToMusic(0)
                await TrackPlayer.skipToNext()
            }else{
                await TrackPlayer.seekTo(0).then(async () => await TrackPlayer.play())
            }
        }
    }

    const PreviousMusic = async() => {
        var index = music.index - 1;

        if(index < 0){
            await TrackPlayer.seekTo(0)
            await TrackPlayer.play()
        }else{
            scrollToMusic(index)
            await TrackPlayer.skipToPrevious()
        }
    }

    return (
        <>
            <Box
                width={360}
                height={40}
                justifyContent="center"
                alignItems="center"
                mt="s10"
            >
                <Slider 
                 style={styles.progressBar}
                 value={progress.position}
                    minimumValue={0}
                    maximumValue={progress.duration}
                    thumbTintColor="#2B7CB5"
                    minimumTrackTintColor="#2B7CB5"
                    maximumTrackTintColor="#fff"
                    onSlidingComplete={async(value)=>{
                        await TrackPlayer.seekTo(value)
                    }}
                />

                <Box
                    width={330}
                    flexDirection="row"
                    justifyContent="space-between"
                >
                    <Text style={styles.progressTxt}>
                        {new Date(progress.position * 1000).toISOString().substr(14, 5)}
                    </Text>
                    <Text style={styles.progressTxt}>
                        {leftTime}
                    </Text>
                </Box>
            </Box>

            <Box
                flexDirection='row'
                justifyContent='space-between'
                alignItems='center'
                marginTop="s14"
                style={{width: '60%'}}
            >
                <TouchableOpacity onPress={PreviousMusic}>
                    <Ionicons name="play-skip-back-outline" size={35} color="#2B7CB5" style={styles.buttonControllsChangeMusic}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> togglePlayback(playbackState)}>
                    <Ionicons name={playbackState == State.Playing ? "ios-pause-circle" : "ios-play-circle"} size={75} color="#2B7CB5"/>
                </TouchableOpacity>
                <TouchableOpacity onPress={NextMusic}>
                    <Ionicons name="play-skip-forward-outline" size={35} color="#2B7CB5" style={styles.buttonControllsChangeMusic}/>
                </TouchableOpacity>
            </Box>
        </>
    )
}

const styles = StyleSheet.create({
    progressContainer:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    progressBar:{
        width:360,
        height:40,
        marginTop:25,
        flexDirection:'row'
    },
    progressTxtContainer:{
        width: 330,
        flexDirection:'row',
        justifyContent:'space-between'

    },
    progressTxt:{
        color:'#fff'
    },
    buttonControllsChangeMusic:{
        //marginTop:22
    },
    
})
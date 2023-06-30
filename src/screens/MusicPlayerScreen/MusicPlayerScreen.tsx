import React,{useRef, useEffect, useState} from "react";
import { StyleSheet, Text, View, SafeAreaView, Dimensions, Animated, FlatList} from "react-native";

import TrackPlayer,{ Event,State,usePlaybackState,useTrackPlayerEvents, useProgress, Track } from "react-native-track-player";
import { useDispatch } from "react-redux";
import { setMusic } from "../../redux/musicSlice";

import { musics } from "../../examples/data";
import { useMusicRedux } from "../../hooks/useMusicRedux";

import { Box } from "../../components/Box/Box";
import { MusicsRender } from "./../../components/MusicsRender";
import { BottomBarControls } from "../../components/BottomBarControls";
import {PlayerControls } from "../../components/PlayerControls" 


const {width, height} = Dimensions.get('window')

export function MusicPlayerScreen(){
    const playbackState = usePlaybackState()
    const progress = useProgress()

    const scrollX  = useRef(new Animated.Value(0)).current
    const musicSlider = useRef<FlatList<any>>(null)

    const dispatch = useDispatch()
    const music = useMusicRedux()

    const [queue, setQueue] = useState<Track[]>([]);
    const [isUserScroll, setIsUserScroll] = useState<boolean>(false);
    const [lastProgrammaticScrollTime, setLastProgrammaticScrollTime] = useState(0);

    const setUpPlayer = async() => {
        await TrackPlayer.setupPlayer()
        await TrackPlayer.add(musics)
        
        const track = await TrackPlayer.getTrack(music.index)
        if(track){
            dispatch(setMusic({
                index: music.index,
                title: track.title,
                album: track.album,
                artist: track.artist,
            }))
        }

        setQueue(await TrackPlayer.getQueue())
    }

    const skipMusic = async(trackId : number) => {
        await TrackPlayer.skip(trackId).then(async() => {
            const actualState = await TrackPlayer.getState()
            const track = await TrackPlayer.getTrack(trackId)
    
            if(track) {
                dispatch(setMusic({
                    index: trackId,
                    title: track.title,
                    album: track.album,
                    artist: track.artist,
                }))
                
                if(actualState == State.Ready){
                    await TrackPlayer.play()
                }
            }
        })
    }

    const skipMusicDetails = async(trackId: number) => {
        const track = await TrackPlayer.getTrack(trackId)
        if(track) {
            dispatch(setMusic({
                index: trackId,
                title: track.title,
                album: track.album,
                artist: track.artist,
            }))
        }
    }

    useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackQueueEnded], async (event) => {
        const currentTrackId = await TrackPlayer.getCurrentTrack();

        if(event.type === Event.PlaybackQueueEnded){
            return;
        }

        if(event.type === Event.PlaybackTrackChanged && event.nextTrack && event.nextTrack !== null) {
            if(isUserScroll){
                skipMusic(event.nextTrack)
            }else{
                scrollToMusic(event.nextTrack)
                skipMusicDetails(event.nextTrack)
            }
        }
        return;
    })

    useEffect(()=>{
        setUpPlayer()
    },[])

    useEffect(() => {
        scrollX.addListener(({value})=>{
            const index = Math.round(value / width);
            if(isUserScroll){
                skipMusic(index)
            }else{
                skipMusicDetails(index)
            }
        })
        
        return () => {
            scrollX.removeAllListeners()
        }
    },[isUserScroll])

    const scrollToMusic = (trackId: number) => {
        setLastProgrammaticScrollTime(Date.now());
        setIsUserScroll(false);

        const positionToScroll = trackId * width;
        
        if(musicSlider.current){
            musicSlider.current.scrollToOffset({
                offset: positionToScroll
            })
        }
    }

    const handleScroll = () =>{
        const currentTime = Date.now();
        if (currentTime - lastProgrammaticScrollTime > 100) {
            setIsUserScroll(true);
        } else {
            setIsUserScroll(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Box
                flex={1}
                alignItems='center'
                justifyContent="center"
            >

                <Box style={{width: width}}>
                    <Animated.FlatList 
                        ref={musicSlider}
                        data={musics}
                        renderItem={({item}) => <MusicsRender album={/*music.album  ? music.album :*/ item.album } />}
                        keyExtractor={({id}) => id.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={16}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false, listener: handleScroll }
                        )}
                    /> 
                </Box>

                <View>
                    <Text style={styles.title}>{music.title}</Text>
                    <Text style={styles.artist}>{music.artist}</Text>
                </View>

                <PlayerControls scrollToMusic={scrollToMusic} queue={queue}/>
            </Box>

            <BottomBarControls />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#0D2536'
    },
    title:{
        fontSize:18,
        fontWeight:'bold',
        textAlign:'center',
        color:'#f5f5f5'
    },
    artist:{
        fontSize:16,
        fontWeight:'200',
        textAlign:'center',
        color:'#EEEEEE'
    },
})
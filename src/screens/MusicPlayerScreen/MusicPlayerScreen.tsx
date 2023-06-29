import React,{useRef, useEffect} from "react";
import { StyleSheet, Text, View, SafeAreaView, Dimensions, Animated} from "react-native";

import TrackPlayer,{ Event,State,useTrackPlayerEvents } from "react-native-track-player";
import { useDispatch } from "react-redux";
import { setMusic } from "../../redux/musicSlice";

import { musics } from "../../examples/data";
import { useMusicRedux } from "../../hooks/useMusicRedux";

import { Box } from "../../components/Box/Box";
import { MusicsRender } from "./../../components/MusicsRender";
import { BottomBarControls } from "../../components/BottomBarControls";
import {PlayerControls } from "../../components/PlayerControls" 


const {width, height} = Dimensions.get('window')

  
export function MusicPlayer(){
    const scrollX  = useRef(new Animated.Value(0)).current
    const musicSlider = useRef(null)

    const dispatch = useDispatch()
    const music = useMusicRedux()


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

    useEffect(()=>{
        setUpPlayer()

        scrollX.addListener(({value})=>{
            const index = Math.round(value / width);
            skipMusic(index)
        })

        return () => {
            scrollX.removeAllListeners()
        }
    },[])

    const NextMusic = () => {
        if(musicSlider.current){
            musicSlider.current.scrollToOffset({
                offset: (music.index + 1) * width,
            })
        }
    }

    const PreviousMusic = () => {
        if(musicSlider.current){
            musicSlider.current.scrollToOffset({
                offset: (music.index - 1) * width,
            })
        }
    }

    useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    
        if(event.type === Event.PlaybackTrackChanged && event.nextTrack !== null && event.nextTrack !== undefined) {
            const track = await TrackPlayer.getTrack(event.nextTrack)
            if(track) {
                console.log(track)
                const {title, album, artist} = track
                dispatch(setMusic({
                    index: event.nextTrack,
                    title: title,
                    album: album,
                    artist: artist,
                }))
                
            }
        }
    })

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
    );

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
                        renderItem={({item}) => <MusicsRender album={music.album  ? music.album : item.album } />}
                        keyExtractor={({id}) => id.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={16}
                        onScroll={handleScroll}
                    /> 
                </Box>

                <View>
                    <Text style={styles.title}>{music.title}</Text>
                    <Text style={styles.artist}>{music.artist}</Text>
                </View>

                <PlayerControls PreviousMusic={PreviousMusic} NextMusic={NextMusic}/>
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
import Slider from "@react-native-community/slider";
import React,{useRef, useState, useEffect} from "react";
import { StyleSheet, Text, View, SafeAreaView, Dimensions, TouchableOpacity, Animated, FlatList} from "react-native";

import Ionicons from 'react-native-vector-icons/Ionicons';
import { musics } from "../examples/data";
import { MusicsRender } from "./MusicsRender";
import TrackPlayer,{
    Capability,
    Event,
    RepeatMode,
    State,
    Track,
    usePlaybackState,
    useProgress,
    useTrackPlayerEvents
} from "react-native-track-player";


const {width, height} = Dimensions.get('window')

  
export function MusicPlayer(){
    const playbackState = usePlaybackState()
    const progress = useProgress()
    const scrollX  = useRef(new Animated.Value(0)).current
    const musicSlider = useRef(null)
    const [MusicIndex, setMusicIndex] = useState(0)
    const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.Off)

    const [trackAlbum, setTrackAlbum] = useState<any>(undefined)
    const [trackArtist, setTrackArtist] = useState<any>(undefined)
    const [trackTitle, setTrackTitle] = useState<any>(undefined)
    
   //console.log("playbakc state", playbackState)
    const nextMusic = async(trackId : number) => {
        await TrackPlayer.skip(trackId).then(async() => {
            const actualState = await TrackPlayer.getState()
            if(actualState == State.Ready){
                await TrackPlayer.play()
            }
        })
    }

    const setUpPlayer = async() => {
        await TrackPlayer.setupPlayer()
        await TrackPlayer.add(musics)
        
        const track = await TrackPlayer.getTrack(MusicIndex)
        console.log(track)
        if(track){
            setTrackArtist(track.artist)
            setTrackAlbum(track.album)
            setTrackTitle(track.title)
        }
    }
    
    const togglePlayback = async(playbackState:  any) => {
        const currentTrack = await TrackPlayer.getCurrentTrack()
    
        if(currentTrack !== null){
            if(playbackState == State.Paused || playbackState == State.Ready){
                await TrackPlayer.play()
            }else{
                await TrackPlayer.pause()
            }
        }
    }

    useEffect(()=>{
        setUpPlayer()

        scrollX.addListener(({value})=>{
            const index = Math.round(value / width);
            setMusicIndex(index)
            nextMusic(index)
        })

        return () => {
            scrollX.removeAllListeners()
        }
    },[])

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
    );

    const NextMusic = () => {
        musicSlider.current.scrollToOffset({
            offset: (MusicIndex + 1) * width,
        })
    }

    const PreviousMusic = () => {
        musicSlider.current.scrollToOffset({
            offset: (MusicIndex - 1) * width,
        })
    }

    const PlayRepeatMode = () =>{
        if(repeatMode == RepeatMode.Off){
            TrackPlayer.setRepeatMode(RepeatMode.Track)
            setRepeatMode(RepeatMode.Track)
        }

        if(repeatMode == RepeatMode.Track){
            TrackPlayer.setRepeatMode(RepeatMode.Off)
            setRepeatMode(RepeatMode.Off)
        }
    }

    useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
        if(event.type === Event.PlaybackTrackChanged && event.nextTrack !== null && event.nextTrack !== undefined) {
            const track = await TrackPlayer.getTrack(event.nextTrack)
            if(track) {
                const {title, album, artist} = track
                setTrackArtist(artist)
                setTrackAlbum(album)
                setTrackTitle(title)
            }
        }
    })

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerPrincipal}>
                <View style={{width: width}}>
                    <Animated.FlatList 
                        ref={musicSlider}
                        data={musics}
                        renderItem={({item}) => <MusicsRender album={trackAlbum ? trackAlbum : item.album} />}
                        keyExtractor={({id}) => id.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={16}
                        onScroll={handleScroll}
                    /> 
                </View>

                <View>
                    <Text style={styles.title}>{trackTitle}</Text>
                    <Text style={styles.artist}>{trackArtist}</Text>
                </View>

                <View style={styles.progressContainer}>
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
                    <View style={styles.progressTxtContainer}>
                        <Text style={styles.progressTxt}>
                            {new Date(progress.position * 1000).toISOString().substr(14, 5)}
                            </Text>
                        <Text style={styles.progressTxt}>
                            {new Date((progress.duration - progress.position) * 1000).toISOString().substr(14,5)}
                        </Text>
                    </View>
                </View>

                <View style={styles.Controlls}>
                    <TouchableOpacity onPress={PreviousMusic}>
                        <Ionicons name="play-skip-back-outline" size={35} color="#2B7CB5" style={styles.buttonControllsChangeMusic}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> togglePlayback(playbackState)}>
                        <Ionicons name={playbackState == State.Playing ? "ios-pause-circle" : "ios-play-circle"} size={75} color="#2B7CB5"/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={NextMusic}>
                        <Ionicons name="play-skip-forward-outline" size={35} color="#2B7CB5" style={styles.buttonControllsChangeMusic}/>
                    </TouchableOpacity>
                </View>
            </View>

            

            <View style={styles.bottomContainer}>
                <View style={styles.bottomControls}>
                    <TouchableOpacity onPress={() => {}}>
                        <Ionicons name="heart-outline" size={30} color={'#f5f5f5'}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={PlayRepeatMode}>
                        <Ionicons name="repeat" size={30} color={repeatMode == RepeatMode.Off ? '#f5f5f5' : '#2B7CB5'}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {}}>
                        <Ionicons name="share-outline" size={30} color={'#f5f5f5'}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {}}>
                        <Ionicons name="ellipsis-horizontal" size={30} color={'#f5f5f5'}/>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#0D2536'
    },
    containerPrincipal: {
        flex: 1,
        alignItems:'center',
        justifyContent: 'center',
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
    Controlls:{
        flexDirection:'row',
        width: '60%',
        justifyContent:'space-between',
        alignItems:'center',
        marginTop:15
    },
    buttonControllsChangeMusic:{
        //marginTop:22
    },
    bottomContainer:{
        borderTopColor:'#1C5075',
        borderTopWidth:1,
        width: width,
        alignItems:'center',
        paddingVertical:15
    },
    bottomControls:{
        flexDirection:'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    
})
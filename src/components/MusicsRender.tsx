import React from "react";
import { View, Image, StyleSheet, Animated } from "react-native";
import { Dimensions } from "react-native";
import {
    TrackMetadataBase, Track
} from "react-native-track-player";


const {width, height} = Dimensions.get('window')

export function MusicsRender({album}: any){
    return (
        <Animated.View style={styles.container}>
            <View style={styles.ImageWrapper}>
                <Image
                    source={album}
                    style={styles.imgEdit}
                />
            </View>
        </Animated.View>
    )
}


const styles = StyleSheet.create({
    container:{
        width: width,
        justifyContent:"center",
        alignItems: "center",
    },
    ImageWrapper:{
        width:300,
        height:300,
        marginBottom:25,
        elevation: 5,
    },
    imgEdit:{
        width:'100%',
        height:'100%',
        borderRadius:15,

        shadowColor:'#000',
        shadowOffset:{
            width: 0.5,
            height: 0.5
        },
        shadowOpacity:0.5,
        shadowRadius:3.9,
    },
})
import {
    Track
} from "react-native-track-player";

export const musics: Track[] = [
    {
        id:1,
        title: 'The Spectre',
        artist: 'Alan Walker',
        album: require('./../assets/images/1.jpg'),
        url: require('./../assets/musics/theSpectre.mp3'),
        duration: 195.6,
    },
    {
        id:2,
        title: 'Say So',
        artist: 'Dojacat',
        album: require('./../assets/images/2.jpg'),
        url: require('./../assets/musics/BestDayOfMyLife.mp3'),
        duration: 204
    },
]

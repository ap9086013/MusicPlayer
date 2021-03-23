import React, { Component } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    Image,
    FlatList,
    Dimensions,
    Animated,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    PermissionsAndroid,
    DeviceEventEmitter,
    Alert,
  } from "react-native";
  import Controller from "./Controller";
  import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
  import TrackPlayer, {
    Capability,
    useTrackPlayerEvents,
    usePlaybackState,
    TrackPlayerEvents,
    STATE_PLAYING,
    Event,
    CAPABILITY_PAUSE,
    CAPABILITY_PLAY,
    CAPABILITY_SKIP_TO_NEXT,
    CAPABILITY_SKIP_TO_PREVIOUS,
  } from 'react-native-track-player';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import SliderComp from './SliderComp';

  const { width, height } = Dimensions.get("window");
  const scrollX = (new Animated.Value(0)).current;
  var songPosition=0;
 
 // const slider = (null);
  // for tranlating the album art
 // const position = (Animated.divide(scrollX, width)).current;
var isPlayerReady=false;
  const songs = [
    {
      title: "death bed",
      artist: "Powfu",
      url: "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_2MG.mp3",
      image: require("../assets/death-bed.jpg"),
      id: "1",
    },
    {
      title: "bad liar",
      artist: "Imagine Dragons",
      url: "https://github.com/ShivamJoker/sample-songs/raw/master/Bad%20Liar.mp3",
      image: require("../assets/bad-liar.jpg"),
      id: "2",
    },
    {
      title: "faded",
      artist: "Alan Walker",
      url: "https://github.com/ShivamJoker/sample-songs/raw/master/Faded.mp3",
      image: require("../assets/faded.jpg"),
      id: "3",
    },
    {
      title: "hate me",
      artist: "Ellie Goulding",
      url: "https://github.com/ShivamJoker/sample-songs/raw/master/Hate%20Me.mp3",
      image: require("../assets/hate-me.jpg"),
      id: "4",
    },
    {
      title: "Solo",
      artist: "Clean Bandit",
      url: "https://github.com/ShivamJoker/sample-songs/raw/master/Solo.mp3",
      image: require("../assets/solo.jpg"),
      id: "5",
    },
    {
        title: "death bed",
        artist: "Powfu",
        url: "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_2MG.mp3",
        image: require("../assets/death-bed.jpg"),
        id: "1",
      },
      {
        title: "bad liar",
        artist: "Imagine Dragons",
        url: "https://github.com/ShivamJoker/sample-songs/raw/master/Bad%20Liar.mp3",
        image: require("../assets/bad-liar.jpg"),
        id: "2",
      },
      {
        title: "faded",
        artist: "Alan Walker",
        url: "https://github.com/ShivamJoker/sample-songs/raw/master/Faded.mp3",
        image: require("../assets/faded.jpg"),
        id: "3",
      },
      {
        title: "hate me",
        artist: "Ellie Goulding",
        url: "https://github.com/ShivamJoker/sample-songs/raw/master/Hate%20Me.mp3",
        image: require("../assets/hate-me.jpg"),
        id: "4",
      },
      {
        title: "Solo",
        artist: "Clean Bandit",
        url: "https://github.com/ShivamJoker/sample-songs/raw/master/Solo.mp3",
        image: require("../assets/solo.jpg"),
        id: "5",
      },

  ];
  import { RNAndroidAudioStore } from "react-native-get-music-files";


import MusicFiles from 'react-native-get-music-files';
import TrackInfo from './TrackInfo';
export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
        songIndex:0,
        isPlaying :'paused',
      songDuration: 0,
      storagePermission: '',
      songs:[]
        
    };
  }
  componentDidMount() {
    this.permissionCheck();  
    DeviceEventEmitter.addListener(
      'onBatchReceived',
      (params) => {
        console.log("--para,s-->",params)
          this.setState({songs : [
              ...this.state.songs,
              ...params.batch
          ]});
      }
    )
  
// RNReactNativeGetMusicFiles.getAll(options,(tracks) => {
//   resolve(tracks);
// },(error) => {
//   resolve(error);
// });
   
   
  }
  
 
_getSongs =() =>{
 
  MusicFiles.getAll((success) => {
    console.log(success)
    //this.saveSongData(success)
 },
 (error) => {
      console.log(error)
 }).then(tracks => {
         console.log(tracks)
       }).catch(error => {
       console.log(error)
  })
}
  permissionCheck = async () => {
    const phoneStateGranted=await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
         title: 'Access Required',
        message: 'This App needs to Access your Read EXTERNAL STORAGE ',
      })
    
    console.log("-------------",phoneStateGranted)
  }

  componentDidUpdate(){
   
this.getSongDurationAndPosition();
      
  }
  getSongDurationAndPosition=async()=>{
    songPosition=await TrackPlayer.getPosition();
  let Duration=await TrackPlayer.getDuration();
  this.setState({
      songDuration:Duration
  })
  }
   playSongs=()=>{
    TrackPlayer.setupPlayer().then(async () => {
        // The player is ready to be used
        console.log('Player ready');
        // add the array of songs in the playlist
        await TrackPlayer.reset();
        await TrackPlayer.add(songs[this.state.songIndex]);
        songPosition=await TrackPlayer.getPosition();
        let Duration=await TrackPlayer.getDuration();
        this.setState({
            songDuration:Duration
        })
      

        isPlayerReady.current = true;
        await TrackPlayer.updateOptions({
            stopWithApp: false,
            alwaysPauseOnInterruption: true,
            capabilities: [
              CAPABILITY_PLAY,
              CAPABILITY_PAUSE,
              CAPABILITY_SKIP_TO_NEXT,
              CAPABILITY_SKIP_TO_PREVIOUS,
            ],
          });
          TrackPlayer.play(); 
          this.getSongDurationAndPosition();

   });
}
    goNext =async () => {
     
            console.log("----",this.state.songIndex)
        
        
        this.setState({songIndex: this.state.songIndex + 1})
        //this.state.songIndex + 1
        console.log("--+1--",this.state.songIndex)
        this.playSongs()
    // slider.current.scrollToOffset({
    //   offset: (this.state.songIndex + 1) * width,
    // });
   // await TrackPlayer.play();
     
  };
    goPrv =async () => {
        console.log("---++++-",this.state.songIndex)
        this.setState({songIndex: this.state.songIndex - 1})
        console.log("----1-",this.state.songIndex)
        this.playSongs()
    // slider.current.scrollToOffset({ 
    //   offset: (this.state.songIndex  - 1) * width,
    // });
  //  await TrackPlayer.play();
  };
//   renderItem = ({ index, item }) => {
   
//     return (
//         <Animated.View
//         style={{alignItems:'center',width:width,}}>
//            <Animated.Image
//           source={item.image}
//     style={{ width: 320, height: 320, borderRadius: 5 }}
//          />
       
//         </Animated.View>
//     );
//   };

  returnPlayBtn = () => {
    if (this.state.isPlaying==="playing") {
     //   console.log("---------pause")
     
        return   <MaterialIcons name="pause" size={45} />
    }
     else if(this.state.isPlaying==="paused"){
      //  console.log("---------play-arrow")
        return  <MaterialIcons name="play-arrow" size={45} />
     }
     else{
      
        return <ActivityIndicator size={45} color="#fff"/>
     }
    
  };
  onPauseSong=async()=>{
    
TrackPlayer.pause()      
  }
  onPlayPause = () => {
    if (this.state.isPlaying=== 'playing') {
    //    console.log("----pause")
        this.setState({
            isPlaying:"paused"
        })
    this.onPauseSong();
    } else if (this.state.isPlaying === 'paused') {
        this.setState({
            isPlaying:"playing"
        })
    //    console.log("----play")
        this.playSongs()
     // TrackPlayer.play();
    }
    //this.returnPlayBtn();
  };

  formatTime = (secs) => {
    let minutes = Math.floor(secs / 60);
    let seconds = Math.ceil(secs - minutes * 60);

    if (seconds < 10) seconds = `0${seconds}`;

    return `${minutes}:${seconds}`;
  };
  handleChange = (val) => {
    console.log(val)
    TrackPlayer.seekTo(val);
  };
  render() {
    return (
        <SafeAreaView style={styles.container}>
    
        
        <View>
        <Animated.Image
          source={songs[this.state.songIndex].image}
    style={{ width: 320, height: 320, borderRadius: 5,margin:33 }}
         />
          <Text style={styles.title}>{songs[this.state.songIndex].title}</Text>
          <Text style={styles.artist}>{songs[this.state.songIndex].artist}</Text>
        </View>
          
    <View style={styles.sliderContainer}>
    <Slider
    style={{width: "100%", height: 40}}
    minimumValue={0}
    value={songPosition}
    onSlidingComplete={(e)=>this.handleChange(e)}
    maximumValue={this.state.songDuration}
    minimumTrackTintColor="blue"
    maximumTrackTintColor="#000000"
  
        thumbTintColor="blue"
  />
      <View style={styles.sliderTimeContainer}>
        <Text style={styles.sliderTimers}>{this.formatTime(songPosition)}</Text>
        <Text style={styles.sliderTimers}>{this.formatTime(this.state.songDuration)}</Text>
      </View>
    </View>
  
        <View style={styles.containerController}>
        <TouchableOpacity onPress={()=>this.goPrv()} >
          <MaterialIcons name="skip-previous" size={45} />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>this.onPlayPause()}>
        {this.returnPlayBtn()}
      </TouchableOpacity>
        {/* <TouchableOpacity onPress={()=>this.playSongs()}>
          <MaterialIcons name="pause" size={45} />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={()=>this.goNext()}>
          <MaterialIcons name="skip-next" size={45} />
        </TouchableOpacity>
        </View>
        <View style={{justifyContent:'center',alignItems:'center',marginTop:'10%'}}>
        <Text style={{fontSize:18}} onPress={()=>this._getSongs()}>
          here
        </Text>
        </View>
        
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
    title: {
      fontSize: 28,
      textAlign: "center",
      textTransform: "capitalize",
    },
    artist: {
      fontSize: 18,
      textAlign: "center",
      textTransform: "capitalize",
    },
    container: {
      justifyContent: "space-evenly",
      height: height,
      
    },
    containerController: {
        flexDirection: "row",
        justifyContent: "space-around",
      },
      sliderContainer: {
        height: 70,
      },
      sliderTimers: {
        color: 'black',
        fontSize: 16,
      },
      sliderTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
  });
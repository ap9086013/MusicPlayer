import TrackPlayer from 'react-native-track-player';


module.exports=async function(){
    //TrackPlayer.addEventListener(TrackPlayer.play)
    TrackPlayer.addEventListener('remote-play', () => {
        TrackPlayer.play();
      });
      
  TrackPlayer.addEventListener('remote-pause', () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener('remote-jump-forward', () => {
    jumpPlayback(15, true); // seek forward 15 seconds
  });

  TrackPlayer.addEventListener('remote-jump-backward', () => {
    jumpPlayback(15); // seek backward 15 seconds
  });
}
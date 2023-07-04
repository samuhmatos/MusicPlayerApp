import {useSelector} from 'react-redux';
import {RootStore} from '../redux/store';
import {MusicState} from '../redux/musicSlice';

export function useMusicRedux(): MusicState {
  const music = useSelector((state: RootStore) => state.music);

  return music;
}

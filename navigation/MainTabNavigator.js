import { Platform } from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import JadwalScreen from '../screens/JadwalScreen';
import JadwalDetailScreen from '../screens/JadwalDetailScreen';
import LaporanPresensiScreen from '../screens/LaporanPresensiScreen';
import PertemuanScreen from '../screens/PertemuanScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {}
});

const PublicStack = createStackNavigator(
  {
    Login: LoginScreen
  },
  config
);

PublicStack.path = '';

const PrivateStack = createStackNavigator(
  {
    Home: HomeScreen,
    Jadwal: JadwalScreen,
    JadwalDetail: JadwalDetailScreen,
    LaporanPresensi: LaporanPresensiScreen,
    Pertemuan: PertemuanScreen
  },
  config
);

PrivateStack.path = '';

const tabNavigator = createSwitchNavigator({
  PublicStack,
  PrivateStack
});

tabNavigator.path = '';

export default tabNavigator;

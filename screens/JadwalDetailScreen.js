import React from 'react';
import { object } from 'prop-types';

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import headerStyle from '../components/headerStyle';
import Layout from '../components/layout';
import {
  usePrevious,
  SnackbarContext,
  useDataContext,
  useStateDefault,
  AuthContext
} from '../Context';
import { list } from '../Context/presensi-dosen/action';
import {
  ambilPresensi,
  viewByParam
} from '../Context/presensi-mahasiswa/action';

export default function JadwalDetailScreen({ navigation }) {
  const { params } = navigation.state;

  const [location, setLocation] = React.useState(null);
  const [kunciKelas, setKunciKelas] = React.useState('');
  const [statusPresensiMahasiswa, setStatusPresensiMahasiswa] = React.useState(
    'Belum Ada'
  );

  const [, loadingPresensiDosen] = useStateDefault('LIST_PRESENSI_DOSEN');
  const [, loadingListPresensiMahasiswa] = useStateDefault(
    'LIST_PRESENSI_MAHASISWA'
  );
  const [, loadingPresensiMahasiswa] = useStateDefault('PRESENSI_MAHASISWA');

  const [, setSnackbar] = React.useContext(SnackbarContext);
  const { user } = React.useContext(AuthContext);
  const [presensiDosen, dispatch] = useDataContext('listPresensiDosen');
  const [presensiMahasiswa] = useDataContext('presensiMahasiswa');

  // eslint-disable-next-line
  const getLocation = async () => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      setLocation('unaivailable');
      setSnackbar(
        'Oops, this will not work on Sketch in an Android emulator.' +
          ' Try it on your device!'
      );
    } else {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        setLocation('unaivailable');
        setSnackbar('Permission to access location was denied');
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    }
  };

  const prevParams = usePrevious(params);
  const prevPresensiDosen = usePrevious(presensiDosen);
  const prevPresensiMahasiswa = usePrevious(presensiMahasiswa);

  React.useEffect(() => {
    const loadStatusPresensiDosen = jadwal => {
      console.log('TCL: JadwalDetailScreen -> jadwal', jadwal);
      list(dispatch, { jadwal, select: 'isActive' })(setSnackbar);
    };

    const loadStatusPresensiMahasiswa = jadwal => {
      console.log('TCL: JadwalDetailScreen -> jadwal', jadwal);
      viewByParam(dispatch, { jadwal, mahasiswa: user._id })(setSnackbar);
    };

    if (params && params._id && prevParams !== params) {
      loadStatusPresensiDosen(params._id);
      loadStatusPresensiMahasiswa(params._id);
    }
    if (
      params._id &&
      presensiDosen &&
      prevPresensiDosen !== presensiDosen &&
      !presensiMahasiswa
    ) {
      loadStatusPresensiMahasiswa(params._id);
    }

    if (!location) {
      getLocation();
    }

    if (presensiMahasiswa && prevPresensiMahasiswa !== presensiMahasiswa) {
      let statuses = 'Belum Ada';
      if (presensiMahasiswa.data !== null) {
        if (presensiMahasiswa.data.statusPresensi) {
          statuses = presensiMahasiswa.data.statusPresensi;
          if (presensiMahasiswa.message) {
            setSnackbar(presensiMahasiswa.message);
          }
        }
      }
      setStatusPresensiMahasiswa(statuses);
    }
  }, [
    dispatch,
    getLocation,
    location,
    params,
    presensiDosen,
    presensiMahasiswa,
    prevParams,
    prevPresensiDosen,
    prevPresensiMahasiswa,
    setSnackbar,
    user._id
  ]);

  const handleAmbilPresensi = () => {
    if (kunciKelas) {
      if (kunciKelas.length !== 4) {
        setSnackbar('Kunci kelas tidak valid!');
        return false;
      }
      const payload = {
        jadwal: params._id,
        lokasi: location,
        statusPresensi: 'hadir',
        kunciKelas
      };
      ambilPresensi(dispatch, payload)(setSnackbar);
    } else {
      setSnackbar('Kunci kelas belum di input');
    }
  };

  const statusPertemuan = () => {
    const dosen =
      presensiDosen && presensiDosen.data[0] ? presensiDosen.data[0] : {};
    if (dosen.isActive === true) {
      return 'Sedang Berlangsung';
    }
    if (dosen.isActive === false) {
      return 'Sudah Selesai';
    }
    return 'Belum Dimulai';
  };
  const status = statusPertemuan();

  const title = params
    ? `${params.mataKuliah.namaMataKuliah} Pertemuan: ${params.pertemuan}`
    : '';
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <Layout>
        <ScrollView>
          {title && (
            <>
              <Title>{title}</Title>
              {status === 'Sedang Berlangsung' &&
              statusPresensiMahasiswa === 'Belum Ada' ? (
                <View style={{ padding: 6 }}>
                  <TextInput
                    placeholder="Kunci Kelas"
                    keyboardType="number-pad"
                    onChangeText={setKunciKelas}
                  />
                  <Button
                    onPress={handleAmbilPresensi}
                    loading={
                      loadingPresensiMahasiswa || loadingListPresensiMahasiswa
                    }
                    disabled={
                      loadingPresensiMahasiswa || loadingListPresensiMahasiswa
                    }
                    style={{ marginBottom: 14, marginTop: 14 }}
                    mode="contained"
                  >
                    Ambil Presensi
                  </Button>
                </View>
              ) : null}
              <View style={styles.viewField}>
                <Text style={styles.textField}>Tanggal Pertemuan</Text>
                <Text>{new Date(params.tanggal).toLocaleDateString()}</Text>
              </View>

              <View style={styles.viewField}>
                <Text style={styles.textField}>Waktu Mulai</Text>
                <Text>{params.waktuMulai}</Text>
              </View>

              <View style={styles.viewField}>
                <Text style={styles.textField}>Waktu Selesai</Text>
                <Text>{params.waktuSelesai}</Text>
              </View>

              <View style={styles.viewField}>
                <Text style={styles.textField}>Dosen</Text>
                <Text>{params.dosen.fullName}</Text>
              </View>

              <View style={styles.viewField}>
                <Text style={styles.textField}>Kelas</Text>
                <Text>{params.kelas.namaKelas}</Text>
              </View>

              <View style={styles.viewField}>
                <Text style={styles.textField}>Gedung</Text>
                <Text>{params.kelas.gedung.namaGedung}</Text>
              </View>

              <View style={styles.viewField}>
                <Text style={styles.textField}>Koordinat Lokasi</Text>
                <Text>
                  {location && typeof ocation !== 'string'
                    ? `${location.latitude},${location.longitude}`
                    : location}
                </Text>
              </View>

              <View style={styles.viewField}>
                <Text style={styles.textField}>Status Presensi</Text>
                <Text>{statusPresensiMahasiswa}</Text>
              </View>

              <View style={styles.viewField}>
                <Text style={styles.textField}>Status Pertemuan</Text>
                <Text>{loadingPresensiDosen ? 'Loading..' : status}</Text>
              </View>
            </>
          )}
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}

JadwalDetailScreen.navigationOptions = headerStyle('Rincian Jadwal');

JadwalDetailScreen.propTypes = {
  navigation: object
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    paddingLeft: 2,
    paddingRight: 2,
    backgroundColor: '#fff'
  },
  contentContainer: {
    paddingTop: 30,
    marginLeft: 10,
    marginRight: 10
  },
  card: {
    margin: 4,
    backgroundColor: '#efefef',
    minHeight: 120
  },

  cardContet: {
    display: 'flex',
    justifyContent: 'center',
    height: 120,
    width: '100%',
    alignItems: 'center'
  },

  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    position: 'absolute',
    width: '100%',
    height: '100%'
  },

  pastItem: {
    color: '#999'
  },

  textField: {
    fontSize: 10,
    fontWeight: 'bold'
  },

  viewField: {
    padding: 4,
    marginBottom: 4
  }
});

import React from 'react';
import { object } from 'prop-types';

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView
} from 'react-native';
import {
  Button,
  TextInput,
  Title,
  List,
  Dialog,
  Portal,
  RadioButton
} from 'react-native-paper';
import headerStyle from '../components/headerStyle';
import Layout from '../components/layout';
import {
  usePrevious,
  SnackbarContext,
  useDataContext,
  useStateDefault,
  AuthContext
} from '../Context';
import {
  list,
  mulaiKelas,
  tutupKelas,
  check
} from '../Context/presensi-dosen/action';
import {
  update,
  list as listMahasiswa
} from '../Context/presensi-mahasiswa/action';

export default function JadwalDetailScreen({ navigation }) {
  const { params } = navigation.state;
  const statusKehadiran = [
    'hadir',
    'tidak hadir',
    'izin',
    'sakit',
    'non-aktif'
  ];
  const [openDialog, setOpenDialog] = React.useState(false);
  const [radioValue, setRadioValue] = React.useState(null);
  const [selectedMahasiswa, setSelectedMahasiswa] = React.useState(null);

  const [, loadingPresensiDosen] = useStateDefault('LIST_PRESENSI_DOSEN');
  const [errPresensiMahasiswa, loadingPresensiMahasiswa] = useStateDefault(
    'PRESENSI_MAHASISWA'
  );

  const [, loadingPresensiDosenActive] = useStateDefault('PRESENSI_DOSEN');

  const [, setSnackbar] = React.useContext(SnackbarContext);
  const { user } = React.useContext(AuthContext);
  const [presensiDosen, dispatch] = useDataContext('listPresensiDosen');
  const [listPresensiMahasiswa] = useDataContext('listPresensiMahasiswa');

  const [presensiDosenActive] = useDataContext('presensiDosen');

  // eslint-disable-next-line

  const prevParams = usePrevious(params);
  const prevPresensiDosen = usePrevious(presensiDosen);
  const prevLoadingPresensiMahasiswa = usePrevious(loadingPresensiMahasiswa);
  const prevPresensiDosenActive = usePrevious(presensiDosenActive);

  React.useEffect(() => {
    const loadStatusPresensiDosen = jadwal => {
      list(dispatch, { jadwal, select: 'isActive' })(setSnackbar);
    };

    const checkStatusPertemuanExist = params => {
      check(dispatch, params)(setSnackbar);
    };

    if (
      !loadingPresensiMahasiswa &&
      prevLoadingPresensiMahasiswa &&
      !errPresensiMahasiswa
    ) {
      openCloseDialog();
      loadStatusPresensiMahasiswa(params._id);
    }

    if (params && params._id && prevParams !== params) {
      const paramsPresensiDosen = {
        jadwal: params._id,
        dosen: params.dosen._id
      };
      loadStatusPresensiDosen(params._id);
      loadStatusPresensiMahasiswa(params._id);
      checkStatusPertemuanExist(paramsPresensiDosen);
    }
    if (
      presensiDosenActive &&
      presensiDosenActive !== prevPresensiDosenActive &&
      presensiDosenActive.status === 1
    ) {
      const paramsPresensiDosen = {
        jadwal: params._id,
        dosen: params.dosen._id
      };
      checkStatusPertemuanExist(paramsPresensiDosen);
    }
    if (
      presensiDosenActive &&
      presensiDosenActive !== prevPresensiDosenActive &&
      presensiDosenActive.status !== 1
    ) {
      loadStatusPresensiMahasiswa(params._id);
      loadStatusPresensiDosen(params._id);
    }
  }, [
    dispatch,
    errPresensiMahasiswa,
    loadStatusPresensiMahasiswa,
    loadingPresensiMahasiswa,
    openCloseDialog,
    params,
    presensiDosen,
    presensiDosenActive,
    prevLoadingPresensiMahasiswa,
    prevParams,
    prevPresensiDosen,
    prevPresensiDosenActive,
    setSnackbar,
    user._id
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadStatusPresensiMahasiswa = jadwal => {
    listMahasiswa(dispatch, { jadwal })(setSnackbar);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const openCloseDialog = (currentStatus, dataMahasiswa) => {
    // eslint-disable-line
    setRadioValue(currentStatus);
    setOpenDialog(!openDialog);
    setSelectedMahasiswa(dataMahasiswa);
  };

  const handleUpdateStatusKehadiran = () => {
    update(
      dispatch,
      { statusPresensi: radioValue },
      { id: selectedMahasiswa._id }
    )(setSnackbar);
  };

  const handleMulaiKelas = () => {
    const payload = {
      jadwal: params._id
    };
    mulaiKelas(dispatch, payload)(setSnackbar);
  };

  const handleTutupKelas = () => {
    const payload = {
      id: presensiDosenActive.data._id
    };
    tutupKelas(dispatch, payload)(setSnackbar);
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
  const isSedangBerlangsung = status === 'Sedang Berlangsung';

  const keyClass =
    presensiDosenActive && presensiDosenActive.data
      ? presensiDosenActive.data.kunciKelas
      : '';

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
              {/* {status !== 'Sedang Berlangsung' ||
              statusPresensiMahasiswa === 'Belum Ada' ? ( */}
              <View style={{ padding: 4 }}>
                <Text style={styles.textField}>Kunci Kelas</Text>
                <TextInput
                  placeholder="Kunci Kelas"
                  keyboardType="number-pad"
                  disabled={true}
                  value={keyClass}
                />
                {presensiDosenActive && !presensiDosenActive.data && (
                  <Button
                    onPress={handleMulaiKelas}
                    loading={loadingPresensiDosenActive}
                    disabled={loadingPresensiDosenActive}
                    style={{ marginBottom: 14, marginTop: 14 }}
                    mode="contained"
                  >
                    Mulai Kelas
                  </Button>
                )}
                {presensiDosenActive &&
                  presensiDosenActive.data &&
                  presensiDosenActive.data.isActive && (
                    <Button
                      onPress={handleTutupKelas}
                      loading={loadingPresensiDosenActive}
                      disabled={loadingPresensiDosenActive}
                      style={{ marginBottom: 14, marginTop: 14 }}
                      mode="contained"
                    >
                      Tutup Kelas
                    </Button>
                  )}
              </View>
              {/* ) : null} */}
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

              {typeof params.kelas === 'object' && (
                <View style={styles.viewField}>
                  <Text style={styles.textField}>Dosen</Text>
                  <Text>{params.dosen.fullName}</Text>
                </View>
              )}

              {typeof params.kelas === 'object' && (
                <View style={styles.viewField}>
                  <Text style={styles.textField}>Kelas</Text>
                  <Text>{params.kelas.namaKelas}</Text>
                </View>
              )}

              {typeof params.kelas === 'object' && (
                <View style={styles.viewField}>
                  <Text style={styles.textField}>Gedung</Text>
                  <Text>{params.kelas.gedung.namaGedung}</Text>
                </View>
              )}

              <View style={styles.viewField}>
                <Text style={styles.textField}>Status Pertemuan</Text>
                <Text>{loadingPresensiDosen ? 'Loading..' : status}</Text>
              </View>

              {listPresensiMahasiswa &&
                listPresensiMahasiswa.data &&
                presensiDosenActive &&
                presensiDosenActive.data && (
                  <List.Accordion
                    titleStyle={{ fontWeight: 'bold', fontSize: 14 }}
                    style={{ marginLeft: -12 }}
                    title="Daftar Mahasiswa"
                    description={
                      <Text>
                        {`Total hadir: ${
                          listPresensiMahasiswa.data.filter(
                            data => data.statusPresensi === 'hadir'
                          ).length
                        }`}
                      </Text>
                    }
                  >
                    {listPresensiMahasiswa &&
                      listPresensiMahasiswa.data.map((data, key) => (
                        <List.Item
                          key={key}
                          onPress={() =>
                            isSedangBerlangsung
                              ? openCloseDialog(data.statusPresensi, data)
                              : ''
                          }
                          title={`${data.mahasiswa.fullName} ${
                            data.statusPresensi
                              ? `(${
                                  data.statusPresensi
                                }) ${data.invalidLokasi && '*'}`
                              : '(tidak hadir)'
                          }`}
                          titleStyle={{ color: '#666', fontSize: 14 }}
                        />
                      ))}
                    {listPresensiMahasiswa.data.filter(
                      data => data.invalidLokasi
                    )[0] && (
                      <List.Item
                        titleStyle={{ color: 'purple', fontSize: 12 }}
                        // eslint-disable-next-line max-len
                        title={`Cek manual dibutuhkan untuk mahasiswa bertanda *`}
                      />
                    )}
                  </List.Accordion>
                )}
            </>
          )}
          <Portal>
            <Dialog visible={openDialog} onDismiss={openCloseDialog}>
              <Dialog.Title>Ubah status kehadiran</Dialog.Title>
              <Dialog.Content>
                {statusKehadiran.map((status, key) => (
                  <View
                    key={key}
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      flexDirection: 'row'
                    }}
                  >
                    <RadioButton.Android
                      value={status}
                      status={radioValue === status ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setRadioValue(status);
                      }}
                    />
                    <Text
                      style={{ textTransform: 'capitalize', marginTop: 8 }}
                      onPress={() => {
                        setRadioValue(status);
                      }}
                    >
                      {status}
                    </Text>
                  </View>
                ))}
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  disabled={loadingPresensiMahasiswa}
                  onPress={openCloseDialog}
                >
                  Cancel
                </Button>
                <Button
                  loading={loadingPresensiMahasiswa}
                  disabled={loadingPresensiMahasiswa}
                  onPress={handleUpdateStatusKehadiran}
                >
                  Update
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}

JadwalDetailScreen.navigationOptions = headerStyle('Pertemuan');

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

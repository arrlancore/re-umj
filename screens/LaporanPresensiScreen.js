import React from 'react';
import { object } from 'prop-types';
import { List } from 'react-native-paper';
import { ScrollView, StyleSheet, KeyboardAvoidingView } from 'react-native';
import headerStyle from '../components/headerStyle';
import Layout from '../components/layout';
import Loader from '../components/spinLoader';
import {
  usePrevious,
  useDataContext,
  AuthContext,
  SnackbarContext
} from '../Context';
import { getReport } from '../Context/presensi-mahasiswa/action';
import { getReport as getReportDosen } from '../Context/presensi-dosen/action';

export default function JadwalDetailScreen({ navigation }) {
  const [summary, setSummary] = React.useState([]);
  const [expanded, setExpanded] = React.useState('');

  const [reports, dispatch] = useDataContext('reportPresensiMahasiswa');
  const [reportPresensiDosen] = useDataContext('reportPresensiDosen');
  const { user } = React.useContext(AuthContext);
  const [, setSnackbar] = React.useContext(SnackbarContext);

  const isDosen = () => user.role === 'dosen'; // eslint-disable-line

  const prevReports = usePrevious(reports);
  const prevReportsDosen = usePrevious(reportPresensiDosen);
  React.useEffect(() => {
    if (!reports && reports !== prevReports) {
      isDosen()
        ? getReportDosen(dispatch, { id: user._id })(setSnackbar)
        : getReport(dispatch, { id: user._id })(setSnackbar);
    }
    if (reports && reports.data && reports !== prevReports) {
      getSummary(reports.data);
    }
    if (
      reportPresensiDosen &&
      reportPresensiDosen.data &&
      reportPresensiDosen !== prevReportsDosen
    ) {
      getSummaryDosen(reportPresensiDosen.data);
    }
  }, [
    dispatch,
    isDosen,
    prevReports,
    prevReportsDosen,
    reportPresensiDosen,
    reports,
    setSnackbar,
    user._id
  ]);

  const getSummary = data => {
    let sum = [];
    for (let i = 0; i < data.length; i++) {
      let matkulMahasiswa = data[i];
      const pertemuan = matkulMahasiswa.presensi
        ? matkulMahasiswa.presensi.length
        : 0;
      const pertemuanHadir = matkulMahasiswa.presensi.filter(
        state => state.statusPresensi === 'hadir'
      ).length;
      const namaMatKul = matkulMahasiswa.namaMataKuliah;
      const totalPertemuan = 16;
      const persentase = (pertemuanHadir / totalPertemuan) * 100;
      sum.push({
        pertemuan,
        presensi: matkulMahasiswa.presensi,
        pertemuanHadir,
        namaMataKuliah: namaMatKul,
        persentase
      });
    }
    setSummary(sum);
  };

  const getSummaryDosen = data => {
    const totalPertemuan = 16;
    const pertemuan = data.map(datas => {
      const persentase = (datas.length / totalPertemuan) * 100;
      return {
        pertemuan: datas.length,
        totalPertemuan,
        presensi: datas,
        persentase
      };
    });
    setSummary([...pertemuan]);
  };

  const ListDataMahasiswa = () => (
    <List.Section title="Mata Kuliah">
      {summary[0] ? (
        summary.map((data, key) => (
          <List.Accordion
            key={key}
            title={
              `${data.namaMataKuliah} - ` + `${data.persentase}% kehadiran`
            }
            expanded={expanded === key}
            onPress={() =>
              key === expanded ? setExpanded('') : setExpanded(key)
            }
          >
            <List.Item
              titleStyle={{
                fontSize: 14,
                paddingLeft: 14
              }}
              title={
                `Hadir pada ${data.pertemuanHadir} ` +
                `dari ${data.pertemuan} pertemuan`
              }
            />
            {data.presensi.map((jadwalData, keyJadwal) => {
              return (
                <List.Item
                  key={keyJadwal}
                  titleStyle={{
                    color: '#888',
                    fontSize: 14,
                    paddingLeft: 14
                  }}
                  title={
                    `Pertemuan ${jadwalData.jadwal.pertemuan}: ` +
                    `${jadwalData.statusPresensi}`
                  }
                />
              );
            })}
          </List.Accordion>
        ))
      ) : (
        <Loader />
      )}
    </List.Section>
  );

  const ListDataDosen = () => (
    <List.Section title="Mata Kuliah">
      {summary[0] ? (
        summary.map((data, key) => (
          <List.Accordion
            key={key}
            title={
              `${data.presensi[0] &&
                data.presensi[0].jadwal.mataKuliah.namaMataKuliah} - ` +
              `${data.persentase}% kehadiran`
            }
            expanded={expanded === key}
            onPress={() =>
              key === expanded ? setExpanded('') : setExpanded(key)
            }
          >
            <List.Item
              titleStyle={{
                fontSize: 14,
                paddingLeft: 14
              }}
              title={
                `Hadir pada ${data.pertemuan} ` +
                `dari ${data.totalPertemuan} pertemuan`
              }
            />
            {data &&
              data.presensi &&
              data.presensi.map((jadwalData, keyJadwal) => {
                return (
                  <List.Item
                    key={keyJadwal}
                    titleStyle={{
                      color: '#888',
                      fontSize: 14,
                      paddingLeft: 14
                    }}
                    onPress={() => {
                      navigation.navigate({
                        routeName: 'Pertemuan',
                        params: jadwalData.jadwal
                      });
                    }}
                    title={`Pertemuan ${jadwalData.jadwal.pertemuan}`}
                  />
                );
              })}
          </List.Accordion>
        ))
      ) : (
        <Loader />
      )}
    </List.Section>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <Layout>
        <ScrollView>
          {isDosen() ? <ListDataDosen /> : <ListDataMahasiswa />}
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}

JadwalDetailScreen.navigationOptions = headerStyle('Laporan Presensi');

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

import * as React from 'react';
import { Image, TouchableOpacity, Text, View } from 'react-native';
import { Header, Body, Title, Right, Button } from 'native-base';
import { DummyDataModal } from '../../DummyDataModal/DummyDataModal';
import { useState } from 'react';
import Modal from 'react-native-modal';
import { useDispatch } from 'react-redux';
import { NativeModules, TouchableWithoutFeedback, Alert } from 'react-native';
const Network = NativeModules.Network;

import Ionicons from 'react-native-vector-icons/Ionicons';
import { Table, Rows } from 'react-native-table-component';
// import { CellinfoPage } from '../../CellinfoPage/CellinfoPage';


const Comparator = (a, b) => {
  if (a[0] < b[0]) { return -1; }
  if (a[0] > b[0]) { return 1; }
  return 0;
};

const CellinfoPage = () => {
  const [result, setResult] = useState([]);

  React.useEffect(() => {
    try {
      Network.getSimInfo((cellInfos) => {
        // console.log(cellInfos)
        let tempresult = [];
        cellInfos.map((info) => {
          var res = Object.entries(info.cellSubInfo);
          res.sort(Comparator);
          // console.log(res)
          tempresult.push(res);
        });
        setResult(tempresult);
        // console.log(this.state.result)
      });

    } catch (err) {
      console.log(err);
    }
  }, []);
  var i = 0;
  return (
    <View style={{ justifyContent: 'center' }}>
      {
        result.map(info => {
          i++;
          return (
            <View key={i} style={{ margin: 5, backgroundColor: '#fff' }}>
              <Text style={{ paddingLeft: 10, fontWeight: 'bold', fontSize: 20, color: 'rgb(135, 95, 191)' }}>SIM {i} : {info[0][1]}{/*{info[0][1]}*/}</Text>
              <Table key={i} borderStyle={{ borderWidth: 1, borderColor: 'grey' }}>
                <Rows key={i} data={info} />
              </Table>
            </View>
          );
        })
      }
    </View>
  );
};

export const HeaderComponent = ({ title }) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [showDummyDataModal, setShowDummyDataModalVisibility] = React.useState(false);

  return (
    <Header style={{ backgroundColor: 'rgb(135, 95, 191)' }}>
      <Body>
        <View style={{ flexDirection: 'row' }}>
          <Title style={{ fontSize: 27, fontWeight: 'bold' }}>{title}</Title>
        </View>
      </Body>
      <DummyDataModal isVisible={showDummyDataModal} hide={() => setShowDummyDataModalVisibility(false)} />
      <Right />

      <TouchableWithoutFeedback onPress={() => { Alert.alert("Success", "Data is pushed to DataBase") }}>
        <Ionicons name="refresh-circle-outline"
          size={30}
          color="white"
          style={{ paddingHorizontal: 5, paddingTop: 12 }}
          onPress={() => {
            dispatch({ type: 'uploadOnAppLaunchSaga' });
          }}
        />
      </TouchableWithoutFeedback>
      <Ionicons name="information-circle-outline" size={30} color="white" style={{ paddingHorizontal: 10, paddingTop: 12 }} onPress={() => { setVisible(true); }} />
      <TouchableOpacity onPress={() => setShowDummyDataModalVisibility(true)}>
        <Image source={require('./sih2020.png')} style={{ height: 45, width: 45, paddingTop: 50, marginTop: 5 }} />
      </TouchableOpacity>
      <Modal isVisible={visible}
        onBackdropPress={() => {
          setVisible(false);
        }}
        style={{ flex: 1 }}>
        <View style={{ padding: 10, backgroundColor: 'white', borderRadius: 20 }}>
          <CellinfoPage />
          <Button style={{ borderRadius: 10, backgroundColor: 'rgb(135, 95, 191)' }} onPress={() => { setVisible(false); }}><Text style={{ color: 'white' }}>CLOSE</Text></Button>
        </View>
      </Modal>
    </Header>
  );
};

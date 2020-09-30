import * as React from 'react';
import Modal from 'react-native-modal';
import moment from 'moment';
import { DatePicker, View, Text, Button,Input } from 'native-base';
import { RadioButton } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { saveDummyData } from '../HomePage/actions';
import { useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import PushNotification from 'react-native-push-notification';

export const generateBetween = (minimum, maximum) => {
    return parseInt(Math.floor(Math.random() * (maximum - minimum + 1)) + minimum, 10);
};

export const generateRandomTime = () => {
    return `${generateBetween(1, 24)}:${generateBetween(10, 60)}`;
};

export const generateRandomLat = (lat) => {

    return lat + Math.random() / 100;
};

export const generateRandomLng = (lng) => {
    return lng + Math.random() / 100;
};


export const generateRamdomDBM = (connectionType)=>{
    switch (connectionType) {
        case 'LTE':
            return generateBetween(-50, -90);

        case 'GSM':
            return generateBetween(-90, -110);

        case 'CDMA':
            return generateBetween(-120, -120);

        case 'WCDMA':
            return generateBetween(-120, -140);
    }
};

export const DummyDataModal = ({ isVisible, hide }) => {
    const dispatch = useDispatch();

    const [numberOfSimulations, setNumberOfSimulations] = React.useState(1);
    const [selectedDate, setSelectedDate] = React.useState(moment().format('MM/DD/YYYY'));
    const [connectionType, setConnectionType] = React.useState('LTE');
    const [lattext ,setlattext] = React.useState('19.147251');
    const [lngtext ,setlngtext] = React.useState('77.2458145');


    React.useEffect(()=>{
        if(isVisible){
            setNumberOfSimulations(1)   
        }
    },[isVisible])
    return (<Modal
        style={{
            alignItems: 'center',
        }}
        isVisible={isVisible}
        // isVisible={true}
        onBackdropPress={() => {
            hide();
        }}
        useNativeDriver
        hideModalContentWhileAnimating >

        <View style={{ backgroundColor: 'white', height: 500, width: '90%' }}>
            <Text style={{ fontSize: 22, alignSelf: 'center', paddingTop: 10 }}> Data Simulator </Text>
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 ,paddingTop:5 }} >
                <View style={{ margin:10, flexDirection: 'row' }}>
                    <Text style={{ fontSize: 16 }}> Select Date: </Text>
                    <DatePicker
                        style={{ alignSelf: 'flex-end' }}
                        defaultDate={moment(selectedDate,'MM/DD/YYYY').toDate()}
                        locale={'en'}
                        modalTransparent={false}
                        animationType={'fade'}
                        androidMode={'default'}
                        placeHolderText={selectedDate}
                        textStyle={{
                            color: 'black',
                            backgroundColor: 'white',
                            paddingHorizontal: 20,
                            padding: 0,
                            margin: 0,
                        }}
                        placeHolderTextStyle={{
                            color: 'black',
                            padding: 0,
                            margin: 0,
                            paddingHorizontal: 20,
                            borderWidth: 1,
                            borderColor: 'white',
                            backgroundColor: 'white',
                        }}
                        onDateChange={(newDate) => {
                            setSelectedDate( moment(newDate).format('MM/DD/YYYY'));
                            // this.setState({ selectedDate: moment(newDate, 'dd/mm/yyyy').format('MM/DD/YYYY') });
                        }}
                        disabled={false} />
                </View>

                <View style={{ paddingHorizontal: 5, paddingTop:4}}>
                    <RadioButton.Group onValueChange={value => {
                        setConnectionType(value);
                    }} value={connectionType}>
                        <View style={{ flexDirection: 'row' }}>
                            <RadioButton value="WCDMA" />
                            <Text style={{ fontSize: 20, fontWeight: 'bold', width: 50 }}>Poor</Text>
                            <RadioButton value="GSM" />
                            <Text style={{ fontSize: 20, fontWeight: 'bold', width: 50 }}>2G</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <RadioButton value="CDMA" />
                            <Text style={{ fontSize: 20, fontWeight: 'bold', width: 50 }}>3G</Text>
                            <RadioButton value="LTE" />
                            <Text style={{ fontSize: 20, fontWeight: 'bold', width: 50 }}>4G</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }} />
                    </RadioButton.Group >
                </View>

               <View style={{ flexDirection: 'row' ,width:'75%'}}>
               <Input value={lattext} placeholder="Enter latitude" style={{borderBottomWidth:2}} onChangeText={lattext => setlattext(lattext)} />
               </View>

               <View style={{ flexDirection: 'row',width:'75%' }}>
               <Input value={lngtext} placeholder="Enter longitude" style={{borderBottomWidth:2}} onChangeText={lngtext => setlngtext(lngtext)} />
               </View>

                <Text> Number of simulations: </Text>

                <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', height:50}}>
                    <Text> {numberOfSimulations} </Text>

                    <Slider
                        style={{ width: 200, height: 40 }}
                        value={1}
                        onValueChange={setNumberOfSimulations}
                        minimumValue={5}
                        maximumValue={100}
                        thumbTintColor="red"
                        step={1}
                        minimumTrackTintColor="#000000"
                        maximumTrackTintColor="#000000"
                    />

                    <Text> 100 </Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Button style={{ marginHorizontal:10}} onPress={() => {

                        let  infoList = [];

                       new Array(numberOfSimulations).fill('').forEach(()=>{
                        infoList.push({
                            connectionType,
                            dBm: generateRamdomDBM(connectionType),
                            time: generateRandomTime(),
                            lat:parseFloat((generateRandomLat(parseFloat(lattext))).toFixed(7)),
                            lng:parseFloat((generateRandomLat(parseFloat(lngtext))).toFixed(7)),
                        });
                       });

                       console.log('infoList',infoList);
                        dispatch(saveDummyData({ date: selectedDate, data: infoList }));

                        Alert.alert('Successsfully', `${numberOfSimulations} records simulated`);
                        hide();
                    }}>
                        <Text> Generate </Text>
                    </Button>
                    <Button style={{ marginHorizontal:10}} onPress={() => {
                    dispatch(saveDummyData({ date: selectedDate, data: [
                        {
                            connectionType:'LTE',
                            dBm: generateRamdomDBM(connectionType),
                            time: generateRandomTime(),
                            Latitude:generateRandomLat(parseFloat(lattext)),
                            Longitude:generateRandomLng(parseFloat(lngtext)),
                        },
                    ] }));

                    Alert.alert('Successsfully', `Reseted data on date ${selectedDate}`);
                    hide();
                     }}>
                        <Text> Reset </Text>
                    </Button>
                </View>
                <Button style={{ margin:10, alignSelf:"center"}} onPress={() => {
                        PushNotification.localNotification({
                            id: 0,
                            message: 'We have detected low network in your phone',
                            soundName: 'siren.mp3',
                        });
                     }}>
                        <Text> Low Network </Text>
                    </Button>
            </View>
        </View>
    </Modal>
    );
};

import React,{useState,useEffect} from 'react';
import { Dimensions, Alert,ScrollView} from 'react-native';
import { Card, View, Input, Item, Right, Button, Text } from 'native-base';
import { HeaderComponent } from '../common/components/Header';
import { Rating } from 'react-native-ratings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import moment from 'moment';
import { NativeModules} from 'react-native';

const Network = NativeModules.Network;

import GooglePlacesInput from './PlacesSearch';

const { width, height } = Dimensions.get('window');

const SearchView = () => {
    const [cardVisibility,setCardVisibility] = useState(false);
    const [buttonVisibility,setButtonVisibility] = useState(true);
    const [servprov,setServprov]=useState('');
    const [temp,setTemp]=useState('');
    const [myserv,setMyserv]=useState('');
    const [bestserv,setBestserv]=useState('');
    const [myrat,setMyrat]=useState(0);
    const [bestrat,setBestrat]=useState(0);

    useEffect(()=>{
        Network.getSimInfo((siminfos)=>{
            siminfos.map((siminfo=>{
                setServprov(siminfo.cellSubInfo["Carrier Name"])
            }))
        })
    },[temp])
    const getIccid = (lat,lng,area) =>{

        console.log(lat, lng, area, servprov)
        fetch('http://192.168.43.44:3000/api/v1/remotenetwork', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                lat: lat,
                lng: lng,
                serviceProvider: servprov,
                area: area
            }),
        }).then((data) => {
            console.log(data)
            // setMyserv(data.myServiceProvider)
            // setBestserv(data.bestServiceprovider)
            // setMyrat(data.myRating)
            // setBestrat(data.bestRating)
        }).catch(() => {

        });
        setCardVisibility(true)

  }
    return (
        // <View style={{}}>
        <Card style={{ height: 280, padding: 10, alignSelf: 'center' }}>
            <Text style={{ fontSize: 17, fontWeight: 'bold', width: width * 0.85, paddingTop: 10 }}>Going somewhere and want to check the network connectivity</Text>
            <Item style={{ width: width * 0.90 }}>
                <Ionicons name={'search'} size={25} color={'#6b41a4'} />
                <GooglePlacesInput onPress={(data, details = null) => {
                        getIccid(details.geometry.location.lat,details.geometry.location.lng,data.description);
                    // 'details' is provided when fetchDetails = true
                    // console.log(data, details);
                    // Alert.alert("sam")
                }} />
            </Item>

            {cardVisibility &&
                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                    <Card style={{ width: width * 0.44, height: height / 4.37 }}>
                        <View style={{ borderBottomWidth: 0.2, borderBottomColor: 'grey', padding: 3, margin: 5 }}>
                            <Text style={{ color: '#6b41a4', fontWeight: 'bold' }}>{myserv}</Text>
                            <Text style={{ fontSize: 14 }}>(Your service provider)</Text>
                        </View>
                        <View style={{ height: height / 6.7 }}>
                            <Rating
                                type="heart"
                                minValue={0}
                                ratingCount={5}
                                imageSize={23}
                                startingValue={myrat}
                                ratingTextColor={'#6b41a4'}
                                ratingColor={'#6b41a4'}
                                defaultRating={2}
                                fractions={1}
                                showRating
                                style={{ alignSelf: 'center' }}
                            />
                            <View style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: 'transparent' }} />
                        </View>
                    </Card>
                    <Card style={{ width: width * 0.44, height: height / 4.37 }}>
                        <View style={{ borderBottomWidth: 0.2, borderBottomColor: 'grey', padding: 3, margin: 5 }}>
            <Text style={{ color: '#6b41a4', fontWeight: 'bold' }}>{bestserv}</Text>
                            <Text style={{ fontSize: 14 }}>(Best service provider)</Text>
                        </View>
                        <View style={{ height: height / 7 }}>
                            <Rating
                                type="heart"
                                minValue={0}
                                ratingCount={5}
                                imageSize={23}
                                startingValue={bestrat}
                                ratingTextColor={'#6b41a4'}
                                ratingColor={'#6b41a4'}
                                defaultRating={2}
                                fractions={1}
                                showRating
                                style={{ alignSelf: 'center' }}
                            />
                            <View style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: 'transparent' }} />

                        </View>
                    </Card>
                </View>
            }
            {/* <View style={{ flexDirection: 'row-reverse', paddingHorizontal: 15, paddingVertical: 15 }}>
                {buttonVisibility &&

                    <Button style={{ justifyContent: 'center', backgroundColor: 'rgb(135, 95, 191)' }} onPress={() => { setButtonVisibility(false) }}><Text style={{ alignItems: 'center' }}>Submit</Text></Button>
                }
            </View> */}
        </Card>
    )
}
class MapsPageComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            flag: 0,
            x: height / 2.4,
        };
    }

    getColor(info) {
        switch (info.connectionType) {
            case 'LTE':
                if (info.dBm < -50 && info.dBm > -80) {
                    return '#91e9b7';
                } else if (info.dBm < -80 && info.dBm > -90) {
                    return 'blue';
                } else if (info.dBm < -90 && info.dBm > -120) {
                    return 'yellow';
                } else {
                    return 'red';
                }
                break;
            case 'WCDMA':
                if (info.dBm < -50 && info.dBm > -80) {
                    return '#91e9b7';
                } else if (info.dBm < -80 && info.dBm > -90) {
                    return 'blue';
                } else if (info.dBm < -90 && info.dBm > -120) {
                    return 'yellow';
                } else {
                    return 'red';
                }
                break;
            case 'CDMA':
                if (info.dBm < -50 && info.dBm > -80) {
                    return '#91e9b7';
                } else if (info.dBm < -80 && info.dBm > -90) {
                    return 'blue';
                } else if (info.dBm < -90 && info.dBm > -120) {
                    return 'yellow';
                } else {
                    return 'red';
                }
                break;
            case 'GSM':
                if (info.dBm < -50 && info.dBm > -80) {
                    return '#91e9b7';
                } else if (info.dBm < -80 && info.dBm > -90) {
                    return 'blue';
                } else if (info.dBm < -90 && info.dBm > -120) {
                    return 'yellow';
                } else {
                    return 'red';
                }
                break;
        }

    }

    render(props) {
        let i = 0;
        return (
            <View>
                <HeaderComponent title={'Network'} />
                <View style={{ padding: 10 }}>
                    <SearchView />
                    <View style={{ width: width * 0.95, borderWidth: 1, borderColor: '#6b41a4', alignSelf: 'center' }}>

                        <MapView style={{ height: this.state.x, width: '100%' }}
                            initialRegion={{
                                latitude: 19.23,
                                longitude: 77.33,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                        >
                            {
                                this.props.data.map((info) => {
                                    if (info.lat !== 0 && info.lng !== 0) {
                                        i = i + 1;
                                        return <Marker
                                            key={i}
                                            pinColor={this.getColor(info)}
                                            coordinate={{
                                                latitude: info.lat,
                                                longitude: info.lng,
                                            }}
                                            title={String(info.dBm) + info.connectionType}
                                            description={'Your signal quality at this position'}
                                            onPress={e => console.log(e.nativeEvent)}

                                        />;
                                    }
                                })
                            }
                        </MapView>
                    </View>

                    {/* <Button style={{ alignSelf: 'center' }} onPress={() => { this.setState({ x: height / 2.7 }); }}><Text style={{ alignItems: 'center' }} >Submit</Text></Button> */}

                    {/* {

                        this.state.x === height * 0.75 &&
                        <Button style={{ alignSelf: 'center', justifyContent: 'center', backgroundColor: 'rgb(135, 95, 191)', width: width * 0.95 }} onPress={() => { this.setState({ x: height / 3 }); }}><Text style={{ alignItems: 'center' }}>Minimize</Text></Button>
                    }
                    {
                        this.state.x === (height / 3) &&
                        <Button style={{ alignSelf: 'center', justifyContent: 'center', backgroundColor: 'rgb(135, 95, 191)', width: width * 0.95 }} onPress={() => { this.setState({ x: height * 0.75 }); }}><Text style={{ alignSelf: 'center' }} >Maximize</Text></Button>
                    } */}
                </View>

            </View>

        );
    }
}

const mapStateToProps = (store) => {
    const todaysDate = moment().format('MM/DD/YYYY');
    const objects = store.home.userData[todaysDate] || [];
    let mymap = new Map();

    const unique = objects.filter(el => {
        const val = mymap.get(el.lat);
        if (val) {
            if (el.lng < val) {
                mymap.delete(el.lat);
                mymap.set(el.lat, el.lng, el.dBm, el.connectionType);
                return true;
            } else {
                return false;
            }
        }
        mymap.set(el.lat, el.lng, el.dBm, el.connectionType);
        return true;
    });

    return {
        data: unique,
    };
};

const mapDispatchToProps = {};


export const MapsPage = connect(mapStateToProps, mapDispatchToProps)(MapsPageComponent);

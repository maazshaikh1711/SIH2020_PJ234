
// import { call, put, takeLatest } from 'redux-saga/effects';
import { all, delay, takeLatest, select, put, call } from 'redux-saga/effects';
import { PermissionsAndroid, NativeModules } from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
const Network = NativeModules.Network;
import Geolocation from '@react-native-community/geolocation';
import { updateSingalStregthBatch } from './HomePage/actions';
import {BASE_URL} from '../constants';

export function* uploadOnAppLaunchSaga() {
    try {
        // console.log('sam');
        // alert('Sam');
        const store = yield select();
        console.log('store in saga', store.home.userData);
        const AllDatesData = Object.keys(store.home.userData);

        const datesWhichAreNotUploaded = {

        };

        AllDatesData.map((date) => {
            store.home.userData[date].filter((info) => {
                if (!info.uploaded) {
                    if (!datesWhichAreNotUploaded[date]) {
                        datesWhichAreNotUploaded[date] = [];
                    }
                    datesWhichAreNotUploaded[date].push(info);
                }
            });
        });
        // at this line we should get list of data which is not uploaded .

        console.log("san", JSON.stringify(datesWhichAreNotUploaded));
        yield call(fetch, `${BASE_URL}/api/v1/mobileusers`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(datesWhichAreNotUploaded),
        });
        console.log("api success");


        // if code flow comes here means api call is successfull

        // This action should mark all records in reducer as uploaded

        yield put({ type: 'MarkAllDataAsUploaded' });

        // yield fetch('http://192.168.43.83:4000/todos', {
        //     method: 'POST',
        //     headers: { 'content-type': 'application/json' },
        //     body: JSON.stringify(store.home.userData),
        // });

        // yield call(user.logout);
        // yield put(resetReducersAction());
    } catch (error) {

        // if api fails then no need to do anything.
        console.log('error', error);
        // logger.error('error in logoutSaga', error);
        // Utility.showMessage('Alert', error.message);
    }
}

export function* fetchSaga() {

    let currentLongitude;
    let currentLatitude;
    let iccid;
    let number;


    try {
        yield call(PermissionsAndroid.request, PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
        });

        const grantedLocation = yield call(PermissionsAndroid.request, PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        Geolocation.watchPosition((position) => {
            currentLongitude = position.coords.longitude;
             currentLatitude = position.coords.latitude;
          });

        const grantedCall = yield call(PermissionsAndroid.request, PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE);
        if (grantedLocation === PermissionsAndroid.RESULTS.GRANTED && grantedCall === PermissionsAndroid.RESULTS.GRANTED) {

            Network.getSimInfo((infos) => {
                infos.map((info) => {
                    iccid = info.cellSubInfo.ICCID;
                    number = info.cellSubInfo["Phone Number"]
                });
            });

            while (true) {
                try {



                    yield call(RNAndroidLocationEnabler.promptForEnableLocationIfNeeded, {
                        interval: 10000,
                        fastInterval: 5000,
                    });

                    Network.getCellInfo((cellInfos) => {
                        const mappedInfo = cellInfos.filter((info) => info.cellSignalStrength.dBm !== 2147483647
                                && info.cellSignalStrength.asuLevel !== 99
                                && currentLatitude
                                && currentLongitude
                        ).map((info) => {
                            // this.setState({ serviceProvider: info.ServiceProvider })
                            if (info.cellSignalStrength.dBm !== 2147483647
                                && info.cellSignalStrength.asuLevel !== 99
                                && currentLatitude
                                && currentLongitude
                            ) {
                                return {
                                    connectionType: info.connectionType,
                                    dBm: info.cellSignalStrength.dBm,
                                    lat: currentLatitude,
                                    lng: currentLongitude,
                                    serviceProvider: info.ServiceProvider,
                                    iccid: iccid,
                                    mobileNo:number,
                                    uploaded: false,
                                };

                            }
                        });

                        if (mappedInfo.length > 0) {
                            const unique = [...new Set(mappedInfo.map(info => JSON.stringify(info)))].map((info) => JSON.parse(info)); // [ 'A', 'B']
                            global.store.dispatch(updateSingalStregthBatch(unique.slice(-5)));
                            global.store.dispatch({ type: 'CURRENT_SINAL_STRENGTH', payload: unique.slice(-1)[0].dBm });
                         }

                    });

                } catch (error) {
                    alert('in location enablere');
                    break;
                }
                yield delay(2000);
            }
        }

    } catch {
        alert('Permission Denied');
    }

}


export function* sagas() {
    yield all([
        takeLatest('uploadOnAppLaunchSaga', uploadOnAppLaunchSaga),
        takeLatest('startDetectingNetworkSignal', fetchSaga),
    ]);
}

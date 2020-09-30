import React from 'react';
import {View,Text, Alert} from 'react-native';
import { TextInput } from 'react-native-paper';

import { HomePage } from './src/HomePage/HomePage';
import { AnalysisPage } from './src/AnalysisPage/AnalysisPage';
import RecommendationPage from './src/RecommendationPage/RecommendationPage';
import { MapsPage } from './src/MapsPage/MapsPage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { store, persistor } from './src/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider, useDispatch } from 'react-redux';
import MapView, { Polyline,Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Button } from 'native-base';
import {generateBetween} from './src/DummyDataModal/DummyDataModal';

const Tab = createBottomTabNavigator();

export const getColor = (dBm) => {
  if (dBm < -50 && dBm > -80) {
    return '#91e9b7';
  } else if (dBm < -80 && dBm > -90) {
    return 'blue';
  } else if (dBm < -90 && dBm > -120) {
    return 'yellow';
  } else {
    return 'red';
  }
}

const decode = (t, e) => {
  for (var n, o, u = 0, l = 0, r = 0, d = [], h = 0, i = 0, a = null, c = Math.pow(10, e || 5); u < t.length;) {
    a = null, h = 0, i = 0; do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5;
    while (a >= 32);
    n = 1 & i ? ~(i >> 1) : i >> 1, h = i = 0; do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5;
    while (a >= 32);
    o = 1 & i ? ~(i >> 1) : i >> 1, l += n, r += o, d.push([l / c, r / c])
  } return d = d.map(function (t) { return { latitude: t[0], longitude: t[1] } })
}


const Search = () => {

  const [source, setSource] = React.useState("");
  const [destination, setDestination] = React.useState("");
  const [coords, setCoords] = React.useState([]);

  const getCords = React.useCallback((origin,destination, mode) => {


      const APIKEY = '<googleMapsKey>';

      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${APIKEY}&mode=${mode}`;

      // return; 
      fetch(url)
        .then(response => response.json())
        .then(data => {
          console.log("data", data)
          if (data.routes.length) {
            // this.setState({
            let coords = decode(data.routes[0].overview_polyline.points) // definition below
            // const coords =  this.decode(responseJson.routes[0].overview_polyline.points) // definition below
            // });
            coords = coords.map((c)=>{
              c.dBm = generateBetween(-50, -140);
              return c
            }).filter((c, index)=>{
              return index % 5 === 0
            })
            console.log("coords")
            if (coords.length > 0) {
              Alert.alert("Yeah !", "Zoom In/Out Map to see details...");
            }
            else {
              Aler.alert("Ohh!", "Looks like you have not entered correct locations");

            }
            setCoords(coords);
          }
          else {
            console.log("responseJson", responseJson);
          }
        }).catch(e => { console.warn(e) });

  },[]);

  return (

    <View style={{ flex: 1, }}>
      <View style={{ height:200, justifyContent: "center", backgroundColor:"lightblue" }}>
        <TextInput
          label="Source"
          value={source}
          onChangeText={text => setSource(text)}
        />
        <TextInput
          label="Destination"
          value={destination}
          onChangeText={text => setDestination(text)}
        />
      <View style={{flexDirection:'row', alignItems:"center", justifyContent:"center"}}>
        <Button style={{ alignSelf: "center",margin:10, paddingHorizontal:5, backgroundColor:"white" }} onPress={() => {
          getCords(source, destination, "driving");
        }}>
          <Text style={{ color:"blue", textAlign: "center" }}> Driving </Text>
        </Button>

        <Button style={{ alignSelf: "center",margin:10, backgroundColor:"white" }} onPress={() => {
          getCords(source, destination, "walking");
        }}>
          <Text style={{ color:"blue", textAlign: "center" , paddingHorizontal:5,}}> Walking</Text>
        </Button>
      </View>
      </View>
      <View style={{ flex: 1, }}>
        <MapView style={{ flex: 1 }}
          initialRegion={{
            latitude: 19.23,
            longitude: 77.33,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          {
            coords.map((c, i) => {
              // console.log("sanm v", c);
              const { latitude, longitude, dBm } = c;
              return (
                <Marker
                  key={i}
                  pinColor={getColor(dBm)}
                  coordinate={{
                    latitude: latitude,
                    longitude: longitude,
                  }}
                  title={dBm+""}
                  description={'this is the signal strength you are getting at this location'}
                  onPress={e => console.log(e.nativeEvent)}
                />
              )
            })
          }

        </MapView>
      </View >
    </View >
  )
    }
    
export const Tabbars = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch({ type: 'uploadOnAppLaunchSaga' });
    dispatch({ type: 'startDetectingNetworkSignal' });
  }, [dispatch]); // on MOunt

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HOME') {
            iconName = focused ? 'md-home-sharp' : 'md-home-outline';
          } else if (route.name === 'ANALYSIS') {
            iconName = focused
              ? 'stats-chart'
              : 'stats-chart-outline';
          } else if (route.name === 'HERE') {
            iconName = focused
              ? 'bulb'
              : 'bulb-outline';
          } else if (route.name === 'MAPS') {
            iconName = focused ? 'map' : 'map-outline';
          }
          else if (route.name === 'ROUTE') {
            iconName = focused ? 'navigate-sharp' : 'navigate-outline';
          }
          
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'white',
        inactiveTintColor: 'white',
        activeBackgroundColor: 'rgb(135, 32, 191)',
        inactiveBackgroundColor: 'rgb(135, 95, 191)',
      }}>
      <Tab.Screen name="HOME" component={HomePage} />
      <Tab.Screen name="ANALYSIS" component={AnalysisPage} />
      <Tab.Screen name="HERE" component={RecommendationPage} />
      <Tab.Screen name="MAPS" component={MapsPage} />
      <Tab.Screen name="ROUTE" component={Search} />

    </Tab.Navigator>
  );
};

export const App = () => {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Tabbars />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};


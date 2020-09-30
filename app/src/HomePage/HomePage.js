import React from 'react';
import { Dimensions } from 'react-native';
import { Container, Card } from 'native-base';
import RNSpeedometer from 'react-native-speedometer';
import { LineChart } from 'react-native-chart-kit';
import {  useSelector } from 'react-redux';
import { HeaderComponent } from '../common/components/Header';
import moment from 'moment';

const { height, width } = Dimensions.get('window');

// data for line chart
const data = {
  datasets: [
    {
      data: [-79],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
      strokeWidth: 2, // optional
    },
  ],
  legend: ['Signal Strength in dBm'], // optional
};

//config file for graph
const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

//labels for speedometer
const SpeedometerLabels = [
  {
    name: 'Signal Strength : WORST',
    labelColor: '#ff2900',
    activeBarColor: '#ff2900',
  },
  {
    name: 'Signal Strength : POOR',
    labelColor: '#ff5400',
    activeBarColor: '#ff5400',
  },
  {
    name: 'Signal Strength : BAD',
    labelColor: '#f4ab44',
    activeBarColor: '#f4ab44',
  },
  {
    name: 'Signal Strength : GOOD',
    labelColor: '#f2cf1f',
    activeBarColor: '#f2cf1f',
  },
  {
    name: 'Signal Strength : BETTER',
    labelColor: '#14eb6e',
    activeBarColor: '#14eb6e',
  },
  {
    name: 'Signal Strength : BEST',
    labelColor: '#00ff6b',
    activeBarColor: '#00ff6b',
  },
];


const LiveSignal = () => {
  const currentSignalStrength = useSelector((store) => {
    return store.home.currentSignalStrength;
  });

  return (
    <Card style={{ width: width * 0.95, alignSelf: 'center' }}>
      <RNSpeedometer
        useNativeDriver={true}
        value={currentSignalStrength + 140}
        defaultValue={0}
        size={width * 0.95}
        minValue={0}
        maxValue={100}
        wrapperStyle={{ height: height * 0.39, paddingTop: height * 0.04 }}
        labels={SpeedometerLabels}
      />
    </Card>
  );
};


const LineChartView = () => {

  const todaysDate = moment().format('MM/DD/YYYY');
  const todaysAllData = useSelector((store) => {
    return store.home.userData[todaysDate] || [{ dBm: -79 }];
  });

  const lastNRecords = todaysAllData.slice(-10).map((info) => {
    return info.dBm;
  });

  data.datasets[0].data = lastNRecords;
  return (<Card style={{ width: width * 0.95, alignSelf: 'center' }}>
    <LineChart
      data={data}
      width={width}
      height={height * 0.35}
      chartConfig={chartConfig}
    />
  </Card>);
};


export const HomePage = () => {
  return (
    <Container>
      <HeaderComponent title={'Network'} />
      <LiveSignal />
      {/* <Button onPress={()=>{
        PushNotification.localNotification({
          id: 0,
          message: 'Low network mode detected',
          soundName:  'siren.mp3',
        });
      }}>
      <Text> sam </Text>
      </Button> */}
      <LineChartView />
    </Container>
  );
};

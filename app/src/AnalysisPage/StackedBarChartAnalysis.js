import React from 'react';
import {   Dimensions } from 'react-native';
import {  Card } from 'native-base';
import { StackedBarChart} from 'react-native-chart-kit';

const {width, height} = Dimensions.get('window');

const chartConfig = {
  backgroundGradientFrom: 'white',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#FFF',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(0, 0, 0,  ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.6,
  useShadowColorFromDataset: false, // optional
};


export const StackedBarChartAnalysis = ({ data }) => {

    return (
        <Card
          style={{
            width: width * 0.95,
            height: height * 0.36,
            alignSelf: 'center',
          }}>
          <StackedBarChart
            // style={graphStyle}
            data={data}
            width={width * 0.95}
            height={height * 0.36}
            chartConfig={chartConfig}
            style={{alignSelf: 'center'}}
            // withHorizontalLabels={true}
            withVerticalLabels={true}
            xLabelsOffset={2}
            xAxisLabel={'       '}
            yLabelsOffset={3}
            showLegend={false}
          />
        </Card>
      );
};

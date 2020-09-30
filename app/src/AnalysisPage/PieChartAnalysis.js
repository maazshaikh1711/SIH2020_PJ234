
import * as React from 'react';
import { Dimensions } from 'react-native';
import {  Card } from 'native-base';
import { PieChart } from 'react-native-chart-kit';

const { width, height } = Dimensions.get('window');

const chartConfig = {
    backgroundGradientFrom: '#E0FFFF',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#00FFFF',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 0, 0,  ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.6,
    useShadowColorFromDataset: false, // optional
};

export const PieChartAnalysis = ({ data }) => {
    return (
        <Card style={{ width: '95%', alignSelf: 'center' }}>
            <PieChart
                data={data}
                width={width * 0.95}
                height={height * 0.37}
                chartConfig={chartConfig}
                accessor="population"
                //   backgroundColor="white"
                paddingLeft="20"
                // absolute
                style={{ alignSelf: 'center', marginVertical: 0 }}
            />
        </Card>
    );
};

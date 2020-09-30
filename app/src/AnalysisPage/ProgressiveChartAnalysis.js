import React from 'react';

import { Text, View, Dimensions, StyleSheet } from 'react-native';
import { List, Card, Icon } from 'native-base';
import { ProgressCircle } from 'react-native-svg-charts';

const { width,height } = Dimensions.get('window');

const connectionStyles = StyleSheet.create({
    icon4g: {
        color: 'rgb(79, 195, 247)',
        fontSize: width / 16,
    },
    label4g: {
        paddingLeft: '2%',
        fontSize: width / 22,
        color: 'rgb(79, 195, 247)',
    },

    icon3g: {
        color: 'rgb(0,172,193)',
        fontSize: width / 16,
    },
    label3g: {
        paddingLeft: '2%',
        alignSelf: 'center',
        fontSize: width / 22,
        color: 'rgb(0,172,193)',
    },
    icon2g: {
        fontSize: width / 16,
        color: 'rgb(0,131,143)',
    },
    label2g: {
        paddingLeft: '2%',
        alignSelf: 'center',
        fontSize: width / 22,
        color: 'rgb(0,131,143)',
    },
});

const ConnectionType = ({ type,percentage}) => {
    let iconStyle = {};
    let labelStyle = {};

    switch (type) {
        case '4G':
            iconStyle = connectionStyles.icon4g;
            labelStyle = connectionStyles.label4g;
            break;
        case '3G':
            iconStyle = connectionStyles.icon3g;
            labelStyle = connectionStyles.label3g;
            break;
        case '2G':
            iconStyle = connectionStyles.icon2g;
            labelStyle = connectionStyles.label2g;
            break;
    }
    return (
        <View style={{ flexDirection: 'row', paddingTop: '4%' }}>
            <Icon name="md-cellular" style={iconStyle} />
            <Text style={labelStyle}> {type} ({percentage}%)  </Text>
        </View>
    );
};

export const ProgressiveChartAnalysis = ({ data }) => {
    let LTEcount = 0;
    let GSMcount = 0;
    let CDMAcount = 0;
    let Totalcount = 1;
    if (data.length > 0){
        LTEcount = data.filter(value => value === 'LTE').length;
        GSMcount = data.filter(value => value === 'GSM').length;
        CDMAcount = data.filter(value => value === 'CDMA' || value === 'WCDMA').length;
        Totalcount = LTEcount + GSMcount + CDMAcount;
    }

    return (
        <Card style={{ flex: 0, flexDirection: 'row', width: '95%', alignSelf: 'center',height:height * 0.32}}>
            <View style={{ width: '70%', paddingTop: 5 }}>
                <ProgressCircle style={{ width: (width / 1.8), height: (width / 1.8), marginVertical: '4%', marginBottom: '4.5%', alignSelf: 'flex-start',paddingLeft:10 }} progress={LTEcount / Totalcount} progressColor={'rgb(79, 195, 247)'}>
                    <ProgressCircle style={{ height: (width / 2.12), marginVertical: '8%' }} progress={CDMAcount / Totalcount} progressColor={'rgb(0,172,193)'}>
                        <ProgressCircle style={{ height: (width / 2.6), marginVertical: '8%' }} progress={GSMcount / Totalcount} progressColor={'rgb(0,131,143)'} />
                    </ProgressCircle>
                </ProgressCircle>
            </View>
            <View style={{ flex: 1, paddingTop: '5%' }}>
                <List>
                    <ConnectionType type={'4G'} percentage={(LTEcount / Totalcount * 100).toFixed(2)} />
                    <ConnectionType type={'3G'} percentage={(CDMAcount / Totalcount * 100).toFixed(2)} />
                    <ConnectionType type={'2G'} percentage={(GSMcount / Totalcount * 100).toFixed(2)} />
                </List>
            </View>
        </Card>
    );
};

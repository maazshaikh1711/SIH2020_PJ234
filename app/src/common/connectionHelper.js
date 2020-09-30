// 0 is very very poor
// 4 is very good
export const checkConnectionStatus = (info) => {
    if (info.dBm < -50 && info.dBm > -90) {
        return 3;
    } else if (info.dBm < -90 && info.dBm > -110) {
        return 2;
    } else if (info.dBm < -110 && info.dBm > -120) {
        return 1;
    } else {
        return 0;
    }
};

export const getOverAllConnectionStaus = (networkdata) => {
    let veryGood = 0;
    let good = 0;
    let poor = 0;
    let veryPoor = 0;

    networkdata.forEach((info) => {
        switch (checkConnectionStatus(info)) {
            case 0:
                veryPoor++;
                break;


            case 1:
                poor++;
                break;

            case 2:
                good++;
                break;


            case 3:
                veryGood++;
                break;
        }
    });

    return [
        {
            name: 'BEST',
            population: veryGood,
            color: '#91e9b7',
            legendFontColor: '#91e9b7',
            legendFontSize: 15,
        },
        {
            name: 'GOOD',
            population: good,
            color: '#8ea6f0',
            legendFontColor: '#8ea6f0',
            legendFontSize: 15,
        },
        {
            name: 'POOR',
            population: poor,
            color: '#f4da70',
            legendFontColor: '#f4da70',
            legendFontSize: 15,
        },
        {
            name: 'WORST',
            population: veryPoor,
            color: '#f59688',
            legendFontColor: '#f59688',
            legendFontSize: 15,
        },
    ];

};

export const getWeekConnectionStatus = (WeekData) => {
    let veryGood = 0;
    let good = 0;
    let poor = 0;
    let veryPoor = 0;
    WeekData.forEach((dayData) => {
        dayData.forEach((info) => {
            switch (checkConnectionStatus(info)) {
                case 0:
                    veryPoor++;
                    break;


                case 1:
                    poor++;
                    break;

                case 2:
                    good++;
                    break;


                case 3:
                    veryGood++;
                    break;
            }
        });
    });
    return [
        {
            name: 'BEST',
            population: veryGood,
            color: '#91e9b7',
            legendFontColor: '#91e9b7',
            legendFontSize: 15,
        },
        {
            name: 'GOOD',
            population: good,
            color: '#8ea6f0',
            legendFontColor: '#8ea6f0',
            legendFontSize: 15,
        },
        {
            name: 'POOR',
            population: poor,
            color: '#f4da70',
            legendFontColor: '#f4da70',
            legendFontSize: 15,
        },
        {
            name: 'WORST',
            population: veryPoor,
            color: '#f59688',
            legendFontColor: '#f59688',
            legendFontSize: 15,
        },
    ];

};

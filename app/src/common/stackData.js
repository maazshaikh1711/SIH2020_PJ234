import moment from 'moment';

export const getStackData = (WeekData, dateArray) => {

    const dataBar = WeekData.map(dayData => {
        const data = dayData.map(info => info.connectionType);
        let LTEcount = data.filter(value => value === 'LTE').length;
        let GSMcount = data.filter(value => value === 'GSM').length;
        let CDMAcount = data.filter(value => value === 'CDMA' || value === 'WCDMA').length;
        let Totalcount = LTEcount + GSMcount + CDMAcount;
        let day = [Math.floor(GSMcount / Totalcount * 100), Math.ceil(CDMAcount / Totalcount * 100), Math.floor(LTEcount / Totalcount * 100)];
        return day;
    });
    const labelArray = dateArray.map(date => moment(date).format('DD'));
    return {
        labels: labelArray,
        legend: ['2G', '3G', '4G'],
        data: dataBar,
        barColors: ['rgb(0,131,143)', 'rgb(0,172,193)', 'rgb(79, 195, 247)'],

    };
};

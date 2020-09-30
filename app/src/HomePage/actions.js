
import moment from 'moment';

// info looks like
// info = { dBm: string, connectionType: string }
export const updateSingalStregth = (info) => {
    const todaysDate = moment().format('MM/DD/YYYY');
    return {
        type: 'UPDATE_SIGNAL',
        payload: {
            date: [todaysDate],
            info: {
                ...info,
                time: moment().format('HH:MM'),
                date:todaysDate,
            },
        },
    };
};

export const updateSingalStregthBatch = (infoList) => {
    const todaysDate = moment().format('MM/DD/YYYY');
    return {
        type: 'UPDATE_SIGNAL_BATCH',
        payload: {
            date: [todaysDate],
            infoList: infoList.map((info) => {
                return {
                    ...info,
                    time: moment().format('HH:MM'),
                    date: todaysDate,
                };
            }),
        },
    };
};


export const saveDummyData = ({date, data}) => {
    return {
        type: 'SAVE_DUMMY_DATA',
        payload: {date, data},
    };
};

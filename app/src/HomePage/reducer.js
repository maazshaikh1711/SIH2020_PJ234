import produce from 'immer';

const homeReducerInitialState = {
    userData: {

    },
};

export const homeReducer = produce((draftState = homeReducerInitialState, action) => {
    switch (action.type) {
        case 'UPDATE_SIGNAL':
            if (!draftState.userData[action.payload.date]) {
                draftState.userData[action.payload.date] = [];
            }
            draftState.userData[action.payload.date].push(action.payload.info);
            break;

        case 'UPDATE_SIGNAL_BATCH':
            if (!draftState.userData[action.payload.date]) {
                draftState.userData[action.payload.date] = [];
            }
            action.payload.infoList.map((info) => {
                draftState.userData[action.payload.date].push(info);
            });
                break;
        case 'SAVE_DUMMY_DATA':
            const { date, data } = action.payload;
            if (!draftState.userData[date]) {
                draftState.userData[date] = [];
            }
            draftState.userData[date] = [...draftState.userData[date],...data];
            break;
        case 'CURRENT_SINAL_STRENGTH':
            console.log(' action.payload', action.payload);
            draftState.currentSignalStrength = action.payload;
            break;
        case 'MarkAllDataAsUploaded':
            const dates = Object.keys(draftState.userData);
            dates.map(date=>{
                draftState.userData[date].map((info)=>{
                    if (!info.uploaded){
                        info.uploaded = true;
                    }
                });
            });
            break;
    }
}, homeReducerInitialState);

import {  createStore,applyMiddleware,  combineReducers} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { homeReducer } from './HomePage/reducer';
import {sagas} from './sagas';

const reducers =   combineReducers(
  {
  home: homeReducer,
});

// { type: UPDATE_SIGNAL, payload:{signalStrength:10}}

const persistConfig = {
  key: 'root',
  // whitelist: ['app', 'home', 'login'], // Only these reducers will be persisted.
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer(persistConfig, reducers);
const initState = {};
let sagaMiddleware;
sagaMiddleware = createSagaMiddleware();
export const store = createStore(persistedReducer, initState, applyMiddleware(sagaMiddleware));
export const persistor = persistStore(store);
sagaMiddleware.run(sagas);

global.store = store;
store.subscribe(() => {
  if (__DEV__) {
    console.log('Store Changed ', store.getState());
  }
});

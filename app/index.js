/**
 * @format
 */

import {AppRegistry,YellowBox} from 'react-native';
import {App} from './App';
// import Setintervaltask from "./setIntervalTask";
import {name as appName} from './app.json';
YellowBox.ignoreWarnings(['Animated: `useNativeDriver` was not specified.']);
YellowBox.ignoreWarnings(['Remote debugger is ']);
YellowBox.ignoreWarnings(['DatePickerIOS has been ']);
YellowBox.ignoreWarnings(['DatePickerAndroid has been ']);
YellowBox.ignoreWarnings(['Deprecation warning: value ']);
YellowBox.ignoreWarnings(['componentWillUpdate has been']);

AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerHeadlessTask('setIntervalTask', () => Setintervaltask);

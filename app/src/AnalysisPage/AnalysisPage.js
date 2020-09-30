//
import React from 'react';
import { Dimensions, View } from 'react-native';
import { Form, Picker, DatePicker, Text } from 'native-base';
import moment from 'moment';
import { connect } from 'react-redux';
import { PieChartAnalysis } from './PieChartAnalysis';
import { ProgressiveChartAnalysis } from './ProgressiveChartAnalysis';
import { StackedBarChartAnalysis } from './StackedBarChartAnalysis';
import { HeaderComponent } from '../common/components/Header';
import { ScrollView } from 'react-native-gesture-handler';

import DateRangePicker from 'react-native-daterange-picker';
import { getOverAllConnectionStaus, getWeekConnectionStatus } from '../common/connectionHelper';
import { getStackData } from '../common/stackData';
import Ionicons from 'react-native-vector-icons/Ionicons';


const { height, width } = Dimensions.get('window');
class AnalysisPageComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: moment().format('MM/DD/YYYY'),
      branches: [
        { address_line: 'Daily Analysis', id: 1 },
        { address_line: 'Weekly Analysis', id: 2 },
      ],
      filteredLabels: [],
      filteredData: [],
      selected1: 1,
      selectedBranch: 1,

      //////////////////////////////////////////
      startDate: moment(),
      endDate: null,
      displayedDate: moment(),
      verticalScroll: true,
      dropdownEnabled: true,

    };

  }

  /////////////////////////////////////
  setDates = dates => {
    this.setState({
      ...dates,
    });
  };

  onBranchSelected(value) {
    this.setState({
      selectedBranch: value,
    });
  }

  componentDidMount = () => {
    this.updateDaysForStackChart();
  }

  componentWillUpdate = (prevProps) => {
    // we shoud not compare like this, but this is a quick fix
    if (JSON.stringify(this.props.userData) !== JSON.stringify(prevProps.userData)) {
      this.updateDaysForStackChart();
    }
  }

  updateDaysForStackChart = () => {
    // console.log('sam state', startDate,endDate);
    const { startDate, endDate } = this.state;
    let days = [];

    if (startDate && endDate) {
      const dateStart = moment(startDate);
      const dateEnd = moment(endDate);
      // if (dateEnd.diff(dateStart, 'days') > 6) {
      //   return [];
      // } else {
      while (dateEnd.diff(dateStart, 'days') >= 0) {
        days.push(dateStart.format('MM/DD/YYYY'));
        dateStart.add(1, 'days');
      }
      // }
    } else if (startDate) {
      days = [moment(startDate).format('MM/DD/YYYY')];
    } else {
      days = [];
    }

    let filteredLabels = [];
    const filteredData = days.filter(day => this.props.userData[day] !== undefined).map((day) => {
      filteredLabels.push(day);
      return this.props.userData[day];
    });
    this.setState({
      filteredLabels,
      filteredData,
    });
    // console.log('filteredLabels', filteredLabels);
    // console.log('filteredData', filteredData);

  }

  render(props) {
    const selectedDateUserData = this.props.userData[this.state.selectedDate] || [];
    const connectionData = selectedDateUserData.map((info) => info.connectionType);

    const minDateAvailable = new Date(moment(Object.keys(this.props.userData).sort((a, b) => new Date(a) - new Date(b))[0]));
    const maxDateAvailable = new Date(moment(Object.keys(this.props.userData).sort((a, b) => new Date(a) - new Date(b)).slice(-1)[0]));

    ///////////////////////////////////
    const { startDate, endDate, displayedDate } = this.state;
    // console.log('this.state.',this.state);
    return (
      <ScrollView contentContainerStyle={{ flex: 1 }} scrollEnabled={true} showsVerticalScrollIndicator={false}>
        <HeaderComponent title={'Network'} />
        <Form style={{ padding: 5 }}>
          <View style={{ borderColor: 'black', borderWidth: 1, width: width * 0.95, alignSelf: 'center' }}>
            <Picker
              enabled={this.state.dropdownEnabled}
              style={{ width: width * 0.95, height: 40 }}
              mode="dropdown"
              textStyle={{ color: 'grey', textAlign: 'center' }}
              // placeholder='Select branch'
              headerBackButtonText="Geri"
              selectedValue={this.state.selectedBranch}
              onValueChange={(value) => this.onBranchSelected(value)}>
              {this.state.branches.map((branches, i) => {
                return (
                  <Picker.Item
                    label={branches.address_line}
                    value={branches.id}
                    key={i}
                  />
                );
              })}
            </Picker>
          </View>


        </Form>
        {

          this.state.selectedBranch === 1 &&
          <View>
            <View style={{ flexDirection: 'row', width: width * 0.95, padding: 5, alignSelf: 'center', justifyContent: 'center', backgroundColor: 'rgb(135, 95, 191)' }}>
              <Text style={{ fontSize: 18, color: 'white', textAlignVertical: 'center' }}> Select Date  :  </Text>
              <View style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 2, padding: 3, borderRadius: 5 }}>
                <DatePicker
                  style={{ alignSelf: 'flex-end' }}
                  defaultDate={moment(this.state.selectedDate, 'h:mm A').toDate()}
                  locale={'en'}
                  modalTransparent={false}
                  animationType={'fade'}
                  androidMode={'default'}
                  placeHolderText={this.state.selectedDate}
                  textStyle={{
                    color: 'black',
                    backgroundColor: 'white',
                    paddingHorizontal: 20,
                    padding: 0,
                    margin: 0,
                  }}
                  placeHolderTextStyle={{
                    color: 'black',
                    padding: 0,
                    margin: 0,
                    paddingHorizontal: 20,
                    borderWidth: 1,
                    borderColor: 'white',
                    backgroundColor: 'white',
                  }}
                  onDateChange={(newDate) => {
                    this.setState({ selectedDate: moment(newDate, 'dd/mm/yyyy').format('MM/DD/YYYY') });
                  }}
                  disabled={false} />
                <Ionicons name={'calendar-outline'} size={21} color={'white'} style={{ paddingHorizontal: 5 }} />
              </View>
            </View>
            <ProgressiveChartAnalysis data={connectionData} />
            <PieChartAnalysis data={getOverAllConnectionStaus(selectedDateUserData)} />
          </View>
        }
        {
          this.state.selectedBranch === 2 &&
          <View style={{ flex: 1 }}>
            <DateRangePicker
              containerStyle={{
                marginBottom: 200,
              }}
              onChange={({ startDate, endDate }) => {
                if (startDate) {
                  // When user selectes new start date, then reset end date.
                  this.setState({ startDate, endDate: undefined });
                } else if (endDate) {
                  this.setState({ endDate }, () => {
                    this.updateDaysForStackChart();
                  });
                }
                // `console.log('startDate, endDate',startDate, endDate);
              }}
              endDate={endDate}
              startDate={startDate}
              displayedDate={displayedDate}
              minDate={minDateAvailable}
              maxDate={maxDateAvailable}
              range
            >
              <View onResponderStart={() => {
                this.setState({ startDate: undefined, endDate: undefined });
              }} style={{ backgroundColor: 'rgb(135, 95, 191)', height: 30, width: '95%', alignSelf: 'center', borderRadius: 5 }}>
                <Text style={{ alignSelf: 'center', paddingVertical: 5, fontWeight: 'bold' }}>SELECT DATES RANGE</Text>
              </View>
            </DateRangePicker>

            {
              this.state.startDate && !this.state.endDate &&
              <Text style={{ alignSelf: 'center', paddingVertical: 5, fontWeight: 'bold' }}>{`${startDate.format('MM/DD/YYYY')}`}</Text>
            }
            {
              this.state.startDate && this.state.endDate &&
              <Text style={{ alignSelf: 'center', paddingVertical: 5, fontWeight: 'bold' }}>{`${startDate.format('MM/DD/YYYY')} - ${endDate.format('MM/DD/YYYY')}`}</Text>
            }

            {this.state.filteredData.length > 0 &&
              <View style={{ zIndex: 10, flex: 1 }}>
                <StackedBarChartAnalysis data={getStackData(this.state.filteredData, this.state.filteredLabels)} />
                <PieChartAnalysis data={getWeekConnectionStatus(this.state.filteredData)} />
              </View>
            }

          </View>
        }
      </ScrollView >
    );
  }
}
const mapStateToProps = (store) => {

  return {
    userData: store.home.userData,

  };
};

// const mapDispatchToProps = {
//   updateSingalStregth,
// };

export const AnalysisPage = connect(mapStateToProps, {})(AnalysisPageComponent);

import React from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableHighlight } from 'react-native';
import { Card, View, Text, Input, Item, Right, Button } from 'native-base';
import { HeaderComponent } from '../common/components/Header';
import { Rating } from 'react-native-ratings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RadioButton } from 'react-native-paper';
import GooglePlacesInput from './ComplaintAddress';
import { NativeModules } from 'react-native';
import { BASE_URL } from '../../constants';
const Network = NativeModules.Network;

const { width, height } = Dimensions.get('window');
class RecommendationPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      myserv:'',
      bestserv:'',
      myrat:0,
      bestrat:0,
      iccid:"",
      number:''
    };
  }

  UNSAFE_componentWillMount(){
    

      Network.getSimInfo((siminfos)=>{
        siminfos.map((siminfo=>{
            // console.log(siminfo.cellSubInfo["ICCID"])
            this.setState({iccid:siminfo.cellSubInfo["ICCID"]})
            this.setState({number:siminfo.cellSubInfo["Phone Number"]})
        }))
    })

      console.log("for recommendation on applaunch", this.state.iccid, this.state.number)
      fetch(`${BASE_URL}/api/v1/recommendation`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          iccid: this.state.iccid,
          mobileNo: this.state.number
        }),
      })
      .then((res)=>res.json())
      .then((res) => {
        console.log("data res",res);
        const data = res.data;
        this.setState({ myserv: data.myServiceProvider })
        this.setState({ bestserv: data.bestServiceProvider })
        this.setState({ myrat: data.myRating })
        this.setState({ bestrat: data.bestRating })
        
      }).catch((e)=>{
        console.log("e", e)

      });

     
  }

  render(props) {
    console.log("sam", this.state);
    return (
      <View>
        <HeaderComponent title={'Network'} />
        <KeyboardAvoidingView keyboardVerticalOffset={Platform.select({ ios: 100, android: 0 })}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
        >

          <Card style={{ width: width * 0.95, height: height * 0.45, alignSelf: 'center' }}>
            <Text style={{ padding: 10, fontWeight: 'bold' }}>Not Satisfied with your Provider still?        You can complaint here manually.</Text>
            <View style={{ paddingRight: 10 }}>
              <Text style={{ paddingHorizontal: 10 }} >How do you want to complaint?</Text>
              <View style={{ flexDirection: 'column', paddingHorizontal: 20, paddingTop: 10 }}>
                <RadioButton.Group onValueChange={value => { this.setState({ value }); }} value={this.state.value}>
                  <View style={{ flexDirection: 'row' }}>
                    <RadioButton value="Weak Call Quality" />
                    <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: '900' }}>Weak Call Quality</Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>

                    <RadioButton value="Low Data Speed" />
                    <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: '900' }}>Low Data Speed</Text>
                  </View>
                </RadioButton.Group >
              </View>
            </View>


            {
              (this.state.value === 'Weak Call Quality' || this.state.value === 'Low Data Speed') &&
              < View style={{ paddingTop: 10 }}>
                <Item style={{ width: width * 0.90, alignSelf: 'center' }}>
                  <Ionicons name={'search'} size={25} color={'#6b41a4'} />
                  <GooglePlacesInput type={this.state.value} onPress={(data, details = null) => { }} />
                </Item>
              </View>
            }


            <Right />
            <View style={{ flexDirection: 'row-reverse', paddingHorizontal: 15, paddingVertical: 15 }}>
              {this.state.value !== "" &&
                <Button style={{ alignSelf: 'center' }} onPress={() => {
                  Alert.alert("Success", "Thanks for complaining. \nWe will let the provider know about your complaint");
                  this.setState({ value: "" })
                }}>
                  <Text style={{ alignItems: 'center' }} >Submit</Text>
                </Button>
              }
            </View>
          </Card>

          <Card style={{ alignSelf: 'center', padding: 10, width: width * 0.95 }}>
            <View style={{ paddingBottom: 15 }} >
              <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Compare your service provider with best service provider in your locality</Text>
            </View>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
              <Card style={{ width: width * 0.44, height: height / 4.37 }}>
                <View style={{ borderBottomWidth: 0.2, borderBottomColor: 'grey', padding: 3, margin: 5 }}>
                  <Text style={{ color: '#6b41a4', fontWeight: 'bold' }}>{this.state.myserv}</Text>
                  <Text style={{ fontSize: 14 }}>(Your service provider)</Text>
                </View>
                <View style={{ height: height / 7 }}>
                  <Rating
                    type="heart"
                    minValue={0}
                    ratingCount={5}
                    imageSize={23}
                    // readonly={true}
                    startingValue={this.state.myrat}
                    ratingTextColor={'#6b41a4'}
                    ratingColor={'#6b41a4'}
                    defaultRating={2}
                    fractions={1}
                    showRating
                    style={{ alignSelf: 'center' }}
                  />
                  <View style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: 'transparent' }} />
                </View>
              </Card>
              <Card style={{ width: width * 0.44, height: height / 4.37 }}>
                <View style={{ borderBottomWidth: 0.2, borderBottomColor: 'grey', padding: 3, margin: 5 }}>
                  <Text style={{ color: '#6b41a4', fontWeight: 'bold' }}>{this.state.bestserv}</Text>
                  <Text style={{ fontSize: 14 }}>(Best service provider)</Text>
                </View>
                <View style={{ height: height / 7 }}>
                  <Rating
                    type="heart"
                    minValue={0}
                    ratingCount={5}
                    imageSize={23}
                    startingValue={this.state.bestrat}
                    ratingTextColor={'#6b41a4'}
                    ratingColor={'#6b41a4'}
                    defaultRating={2}
                    fractions={1}
                    showRating
                    style={{ alignSelf: 'center' }}
                  />
                  <View style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: 'transparent' }} />

                </View>
              </Card>
            </View>
          </Card>
        </KeyboardAvoidingView>

      </View >
    );
  }
}

export default RecommendationPage;

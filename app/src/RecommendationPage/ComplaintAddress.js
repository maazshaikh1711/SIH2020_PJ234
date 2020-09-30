import React,{ useState,useEffect } from 'react';
import { NativeModules} from 'react-native';
const Network = NativeModules.Network;

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { BASE_URL } from '../../constants';

const GooglePlacesInput = (props) => {
    const [iccid,setIccid]=useState('');
    const [servprov,setServprov]=useState('');
    const [number,setNumber]=useState('');
    const [temp,setTemp]=useState('');

    useEffect(()=>{
      Network.getSimInfo((siminfos)=>{
        siminfos.map((siminfo=>{
            setIccid(siminfo.cellSubInfo["ICCID"]);
            setServprov(siminfo.cellSubInfo["Carrier Name"])
            setNumber(siminfo.cellSubInfo["Phone Number"])
        }))
    })
    },[temp])

    const getIccid = (lat,lng,area) =>{
        
          console.log(lat,lng,area,props.type,iccid,servprov,number)
         fetch(`${BASE_URL}/api/v1/complaints`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
             serviceProvider:servprov,
             iccid:iccid,
             complaintArea:area,
             complaintType:props.type,
             mobileNo:number,
            }),
        }).then((data)=>{

          console.log("data",data)
        }).catch((e)=>{
          console.log("error",e)
        });
        
    }

  return (
    <GooglePlacesAutocomplete
          placeholder="Search"
          onPress={(data, details = null) => {
              getIccid(details.geometry.location.lat,details.geometry.location.lng,data.description);
            // console.log(data, details);
          }}
          fetchDetails = {true}
          styles={{
            textInputContainer: {
              height:40,
              backgroundColor: 'rgba(0,0,0,0)',
              borderTopWidth: 0.5,
              borderWidth:0.5,
              borderBottomWidth: 0.5,
            },
            textInput: {
              marginLeft: 0,
              marginRight: 0,
              padding:0,
              height: 30,
              color: '#5d5d5d',
              fontSize: 16,
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
          query={{
            key:'<googlePlacesKey>',
            language: 'en',
            types: 'establishment',

      }}
    />
  );
};

export default GooglePlacesInput;

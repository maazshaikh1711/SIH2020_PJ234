import React,{ useState,useEffect } from 'react';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GooglePlacesInput = (props) => {

  return (
    <GooglePlacesAutocomplete
          placeholder="Search"
          onPress={props.onPress}
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

import streamlit as st 
import pandas as pd
import numpy as np
import math
import plotly.express as px
from streamlit_pandas_profiling import st_profile_report
from pandas_profiling import ProfileReport
import pymongo
import json
import datetime


def load_data():
            DATABASE = "mongodb+srv://amaan:PwxIIvIMb2tTow3z@cluster0-myavd.mongodb.net/natours?retryWrites=true&w=majority"
            client = pymongo.MongoClient(DATABASE)
        
            db = client["natours"]
            mobileusers= db["mobileusers"].find()

            data = [userRecord for userRecord in mobileusers  ] 
            df1= pd.DataFrame(data)
            st.write(df1)
            df1.drop(['_id', '__v'], axis=1,inplace=True)
            df1.rename(columns={'serviceProvider':'Service_provider','lng':'lon','dBm':'signal_strength'},inplace=True)
            st.write(df1)
            return df1

data=load_data()






dashboard_selectbox = st.sidebar.selectbox(
    "Select an option",
    ("Home", "Exploratory Data Analysis Report","Data Visualization by filtering state and city","Data Visualization by filtering Mobile Number","Plotting Data of all users","Data Visualization by filtering Service Provider"),key="Dashboard")

if dashboard_selectbox=="Home":
    st.header("DATA ANALYTICS AND DATA VISUALIZATION")
  


if dashboard_selectbox=="Exploratory Data Analysis Report":
    
    def load_data():
            DATABASE = "mongodb+srv://amaan:PwxIIvIMb2tTow3z@cluster0-myavd.mongodb.net/natours?retryWrites=true&w=majority"
            client = pymongo.MongoClient(DATABASE)

            db = client["natours"]
            mobileusers= db["mobileusers"].find()

            data = [userRecord for userRecord in mobileusers  ] 
            df1= pd.DataFrame(data)
            df1.drop(['_id', '__v'], axis=1,inplace=True)
            df1.dropna(how='any')
            df1.rename(columns={'serviceProvider':'Service_provider','lng':'lon','dBm':'signal_strength'},inplace=True)
       
            df1['lat']=df1['lat'].astype(float)
            df1['lon']=df1['lon'].astype(float)
            df1.dropna(inplace=True)
            return df1
            
    data=load_data()
    profile=ProfileReport(data)
    st_profile_report(profile)

if dashboard_selectbox=="Data Visualization by filtering state and city":
    st.title("Visualization of data by filtering ")
    def load_data():
        df1 = pd.read_csv("./308.csv")
        df1['mobile_no']=df1['mobile_no'].astype(str) 
        df1['lat']=df1['lat'].astype(float)
        df1['lon']=df1['lon'].astype(float)
        df1.dropna(inplace=True)
        return df1
    static_data=load_data()


    state_arr=static_data.State.unique()
    emp_arr=['']
    state_menu=np.append(emp_arr,state_arr)
        
    state_selected = st.selectbox('Select one State:',state_menu, format_func=lambda u: 'Select an option' if u == '' else u,key="State list")
    if state_selected:
        x1=state_selected
        st.success("You selected a state")
        state_data=static_data[static_data.State==x1]

        city_arr=state_data.City.unique()
        emp_arr=['']
        city_menu=np.append(emp_arr,city_arr)

        city_selected = st.selectbox('Select one City:',city_menu, format_func=lambda u: 'Select an option' if u == '' else u,key="city list")
        if city_selected:
            x2=city_selected
            st.success("you selected a city")
            city_data=static_data[static_data.City==x2]

            fig1 = px.pie(city_data, names='Service_provider', title='  Visualize on basis of Service Provider (Total data for a city)')
            fig1.update_traces(textposition='inside', textinfo='percent+label')
            st.plotly_chart(fig1)

            st.header("Visualization   on the basis of service provider")
            service_providers_list=list(city_data['Service_provider'].unique())
            service_provider_menu=np.append(emp_arr,service_providers_list)

            service_provider_selected = st.selectbox('Select one TSP:',service_provider_menu, format_func=lambda u: 'Select an option' if u == '' else u,key="TSP list")
            if service_provider_selected:
                spl=service_provider_selected
                dt1=city_data[city_data.Service_provider==spl]
                dt11=dt1.groupby('signal_strength').count()
                fig2=px.bar(dt11,y='Service_provider',text='Service_provider',labels={'Service_provider':'No of observations'},opacity=1)
                fig2.update_traces(texttemplate='%{text:.1s}',textposition='outside')
                fig2.update_layout(uniformtext_minsize=5, uniformtext_mode='show')
                st.write("Signal strength analysis of",spl)
                st.plotly_chart(fig2)


                st.header("Visualization on the basis of technology")
                technology_list=list(dt1['technology'].unique())
                for tl in technology_list:
                    dt2=dt1[dt1.technology==tl]
                    dt12=dt2.groupby('signal_strength').count()
                    fig2=px.bar(dt12,y='Service_provider',text='Service_provider',labels={'Service_provider':'No of observations'},opacity=1)
                    fig2.update_traces(texttemplate='%{text:.1s}',textposition='outside')
                    fig2.update_layout(uniformtext_minsize=5, uniformtext_mode='show')
                    st.write("Signal strength analysis of",tl)
                    st.plotly_chart(fig2) 
            else:
                st.warning("No TSP selected")
            
        else:
            st.warning("No city selected")
    else:
        st.warning("No state selected")


if  dashboard_selectbox=="Data Visualization by filtering Mobile Number":
    st.title("Users Complaint Data")
    def load_data():
        DATABASE = "mongodb+srv://amaan:PwxIIvIMb2tTow3z@cluster0-myavd.mongodb.net/natours?retryWrites=true&w=majority"
        client = pymongo.MongoClient(DATABASE)
        db = client["natours"]
        complains= db["complaints"].find()

        data = [userRecord for userRecord in complains ] 
        df1 = pd.DataFrame(data)
        df1.rename(columns={'mobileNo':'mobile_no','serviceProvider':'Service_provider','lng':'lon'},inplace=True)
        df1.dropna(how='any',inplace=True)
        st.write(df1)
        return df1
    data=load_data()



    mobile_arr=data.mobile_no.unique()
    emp_arr=['']
    mobile_menu=np.append(emp_arr,mobile_arr)
    mobile_no_selected = st.selectbox('Select one Mobile Number:',mobile_menu,format_func=lambda u: 'Select an option' if u == '' else u,key="Mobile list")
    if mobile_no_selected:
        x9= mobile_no_selected
        st.success("You selected a mobile_no")

        st.write("User Data of",x9)
        mobile_data=data[data.mobile_no==x9]
        st.write(mobile_data)

        data2 = pd.DataFrame({
   
        'lat' :mobile_data['lat'] ,
        'lon' :mobile_data['lon'] })

        # Adding code so we can have map default to the center of the data
        midpoint = (np.average(data2['lat']), np.average(data2['lon']))

        st.deck_gl_chart(
                    viewport={
                        'latitude': midpoint[0],
                        'longitude':  midpoint[1],
                        'zoom': 4
                    },
                    layers=[{
                        'type': 'ScatterplotLayer',
                        'data': data2,
                        'radiusScale': 0.1,
                        'radiusMinPixels': 1,
                        'getFillColor': [248, 24, 148],
                    }]
                )

    else:
        st.warning("No mobile number selected")


if dashboard_selectbox=="Plotting Data of all users":
        st.write(data)

        data2 = pd.DataFrame({'lat' :data['lat'] ,'lon' :data['lon'] })

        midpoint = (np.average(data2['lat']), np.average(data2['lon']))

        st.deck_gl_chart(
                    viewport={
                        'latitude': midpoint[0],
                        'longitude':  midpoint[1],
                        'zoom': 4
                    },
                    layers=[{
                        'type': 'ScatterplotLayer',
                        'data': data2,
                        'radiusScale': 0.1,
                        'radiusMinPixels': 1,
                        'getFillColor': [248, 24, 148],
                    }]
                )
            
if dashboard_selectbox=="Data Visualization by filtering Service Provider":
    st.title("Data visulization on basis of service provider")
    st.write(data)
    #st.write(data['iccid']==89916270171126240541)

    service_provider_arr=data.Service_provider.unique()
    emp_arr=['']
    service_provider_menu=np.append(emp_arr,service_provider_arr)
    service_providers_list=list(data['Service_provider'].unique())
    service_provider_menu=np.append(emp_arr,service_providers_list)

    service_provider_selected = st.selectbox('Select one TSP:',service_provider_menu, format_func=lambda u: 'Select an option' if u == '' else u,key="TSP overall list")
    if service_provider_selected:
        spl=service_provider_selected
        dt1=data[data.Service_provider==spl]
        st.write("data after filtering by service provider")
        st.write(dt1)

        dt11=dt1.groupby('signal_strength').count()
        fig2=px.bar(dt11,y='Service_provider',text='Service_provider',labels={'Service_provider':'No of observations'},opacity=1)
        fig2.update_traces(texttemplate='%{text:.1s}',textposition='outside')
        fig2.update_layout(uniformtext_minsize=5, uniformtext_mode='show')
        st.write("Signal strength analysis of",spl)
        st.plotly_chart(fig2)

        data2 = pd.DataFrame({
   
        'lat' :dt1['lat'] ,
        'lon' :dt1['lon'] })


        # Adding code so we can have map default to the center of the data
        midpoint = (np.average(data2['lat']), np.average(data2['lon']))

        st.deck_gl_chart(
                    viewport={
                        'latitude': midpoint[0],
                        'longitude':  midpoint[1],
                        'zoom': 4
                    },
                    layers=[{
                        'type': 'ScatterplotLayer',
                        'data': data2,
                        'radiusScale': 0.1,
                        'radiusMinPixels': 1,
                        'getFillColor': [248, 24, 148],
                    }]
                )

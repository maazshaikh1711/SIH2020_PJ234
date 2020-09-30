import streamlit as st 
import pandas as pd
import numpy as np
import math
from pandas_profiling import ProfileReport
from streamlit_pandas_profiling import st_profile_report
import plotly.express as px
#import matplotlib.pyplot as plt

@st.cache
def load_data():
        df1 = pd.read_csv("/db1.csv")     
        return df1
data=load_data()

dashboard_selectbox = st.sidebar.selectbox(
    "Select an option",
    ("Home", "Exploratory Data Analysis Report","Data Visualization at State Level"),key="State_visualisation_1"
)

if dashboard_selectbox=="Home":
    st.write("Hello Team Game of Codes")

if dashboard_selectbox=="Exploratory Data Analysis Report":
    profile=ProfileReport(data)
    st_profile_report(profile)

if dashboard_selectbox=="Data Visualization at State Level":
    st.title("Visualization of data ")

    state_arr=data.State.unique()
    emp_arr=['']
    state_menu=np.append(emp_arr,state_arr)
        
    state_selected = st.selectbox('Select one State:',state_menu, format_func=lambda u: 'Select an option' if u == '' else u,key="State list")
    if state_selected:
        x1=state_selected
        st.success("You selected a state")
        state_data=data[data.State==x1]

        city_arr=state_data.City.unique()
        emp_arr=['']
        city_menu=np.append(emp_arr,city_arr)

        city_selected = st.selectbox('Select one City:',city_menu, format_func=lambda u: 'Select an option' if u == '' else u,key="city list")
        if city_selected:
            x2=city_selected
            city_data=data[data.City==x2]

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


                st.subheader("Visualization on the basis of technology")
                technology_list=list(dt1['technology'].unique())
                for tl in technology_list:
                    dt2=dt1[dt1.technology==tl]
                    dt12=dt2.groupby('signal_strength').count()
                    fig2=px.bar(dt12,y='Service_provider',text='Service_provider',labels={'Service_provider':'No of observations'},opacity=1)
                    fig2.update_traces(texttemplate='%{text:.1s}',textposition='outside')
                    fig2.update_layout(uniformtext_minsize=5, uniformtext_mode='show')
                    st.write("Signal strength analysis of",tl)
                    st.plotly_chart(fig2) 
        

                












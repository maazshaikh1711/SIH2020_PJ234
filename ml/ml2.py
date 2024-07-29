import streamlit as st 
import pandas as pd
import numpy as np
import plotly.express as px
# from streamlit_pandas_profiling import st_profile_report
# from pandas_profiling import ProfileReport
import pymongo
import pydeck as pdk
import os

#IMP_NOTE:
#Please modify this accordingly before running (DEPLOYMENT OR DEVELOPMENT)
environment = "DEVELOPMENT"

def get_mongo_uri():
    # Check if running in Streamlit Cloud environment
    if environment=="DEPLOYMENT":
        return st.secrets["MONGO_URI"]
    elif environment=="DEVELOPMENT":
        # Fallback to environment variable for local development
        return os.getenv("MONGO_URI")

# Get the MongoDB URI
mongo_uri = get_mongo_uri()

if mongo_uri is None:
    print("MONGO_URI is not set")
else:
    print("MONGO_URI is set")

@st.cache_resource
def load_data():
    client = pymongo.MongoClient(mongo_uri)

    db = client["natours"]
    mobileusers= db["mobileusers"].find()

    data = [userRecord for userRecord in mobileusers] 
    df1= pd.DataFrame(data)
    # st.write(df1)
    df1.drop(['_id', '__v'], axis=1,inplace=True)
    df1.rename(columns={'serviceProvider':'Service_provider','lng':'lon','dBm':'signal_strength'},inplace=True)
    return df1

data=load_data()


dashboard_selectbox = st.sidebar.selectbox(
    "Select Page",
    ("Home", 
    #  "Exploratory Data Analysis Report",
     "Data Visualization by State and City",
     "Data Visualization by Mobile Number",
     "Plotting Data of all users",
     "Data Visualization by Service Provider"
    ),key="Dashboard")

if dashboard_selectbox=="Home":

    st.header("DATA ANALYTICS AND DATA VISUALIZATION")
    st.write("Kindly select a page from the dropdown menu on the left side of the screen.")

if dashboard_selectbox=="Exploratory Data Analysis Report":

    
    # def load_data():
    #         client = pymongo.MongoClient(mongo_uri)

    #         db = client["natours"]
    #         mobileusers= db["mobileusers"].find()

    #         data = [userRecord for userRecord in mobileusers  ] 
    #         df1= pd.DataFrame(data)
    #         df1.drop(['_id', '__v'], axis=1,inplace=True)
    #         df1.dropna(how='any')
    #         df1.rename(columns={'serviceProvider':'Service_provider','lng':'lon','dBm':'signal_strength'},inplace=True)
       
    #         df1['lat']=df1['lat'].astype(float)
    #         df1['lon']=df1['lon'].astype(float)
    #         df1.dropna(inplace=True)
    #         return df1
            
    # data=load_data()
    # profile=ProfileReport(data)
    # st_profile_report(profile)
    pass


if dashboard_selectbox=="Data Visualization by State and City":



    st.title("Visualization of data by ")
    def load_data():
        current_dir = os.path.dirname(__file__)
        file_path = os.path.join(current_dir, "308.csv")
        df1 = pd.read_csv(file_path)
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


if  dashboard_selectbox=="Data Visualization by Mobile Number":


    st.title("Users Complaint Data")
    @st.cache_resource
    def load_data():

        client = pymongo.MongoClient(mongo_uri)
        db = client["natours"]
        complaints_list= db["complaints"].find()

        # Filtering out None records and fixing data type issue for mobileNo
        new_data = [ {**complaint, 'mobileNo': int(complaint['mobileNo'])} for complaint in complaints_list if 'mobileNo' in complaint and complaint['mobileNo'] is not None]
        
        df1 = pd.DataFrame(new_data)
        df1.rename(columns={'mobileNo':'mobile_no','serviceProvider':'Service_provider','lng':'lon'},inplace=True)
        df1.dropna(how='any',inplace=True)
        # st.write(df1)
        return df1
    data=load_data()

    mobile_arr=data.mobile_no.unique()
    emp_arr=['']
    mobile_menu=np.append(emp_arr,mobile_arr)
    mobile_no_selected = st.selectbox('Select one Mobile Number:',mobile_menu,format_func=lambda u: 'Select an option' if u == '' else u,key="Mobile list")
    
    if mobile_no_selected:
        x9= mobile_no_selected
        st.success("You selected a Mobile No: ")

        if x9 != '':
            x9 = int(x9)

            # Filter the data based on the selected mobile number
            st.write("User Data of", x9)
            mobile_data = data[data.mobile_no == float(x9)]
            st.write(mobile_data)
            
            data2 = pd.DataFrame({
    
            'lat' :mobile_data['lat'] ,
            'lon' :mobile_data['lon'] })

            # Adding code so we can have map default to the center of the data (will give error if data2 is empty)
            midpoint = (np.average(data2['lat']), np.average(data2['lon']))

            # Define the view state
            view_state = pdk.ViewState(
                latitude=midpoint[0],
                longitude=midpoint[1],
                zoom=4
            )

            # Define the layer
            layer = pdk.Layer(
                'ScatterplotLayer',
                data=data2,
                get_position='[lon, lat]',  # Adjust according to your data's column names
                get_radius=1,  # radius in meters
                radius_scale=0.1,
                radius_min_pixels=1,
                get_fill_color=[248, 24, 148]
            )

            # Create the deck
            deck = pdk.Deck(
                layers=[layer],
                initial_view_state=view_state
            )

            # Display the deck in Streamlit
            st.pydeck_chart(deck)

            # st.deck_gl_chart(
            #             viewport={
            #                 'latitude': midpoint[0],
            #                 'longitude':  midpoint[1],
            #                 'zoom': 4
            #             },
            #             layers=[{
            #                 'type': 'ScatterplotLayer',
            #                 'data': data2,
            #                 'radiusScale': 0.1,
            #                 'radiusMinPixels': 1,
            #                 'getFillColor': [248, 24, 148],
            #             }]
            #         )

    else:
        st.warning("No mobile number selected")


if dashboard_selectbox=="Plotting Data of all users":



        data2 = pd.DataFrame({'lat' :data['lat'] ,'lon' :data['lon'] })
        print("###", data2)

        data2.dropna(subset=['lat', 'lon'], inplace=True)
        print("### DataFrame after dropping NaNs ###")
        print(data2)

        midpoint = (np.average(data2['lat']), np.average(data2['lon']))
        print("...",midpoint)

        # Define the view state
        view_state = pdk.ViewState(
            latitude=midpoint[0],
            longitude=midpoint[1],
            zoom=4
        )

        # Define the layer
        layer = pdk.Layer(
            'ScatterplotLayer',
            data=data2,
            get_position='[lon, lat]',  # Adjust according to your data's column names
            radius_scale=0.1,
            radius_min_pixels=1,
            get_fill_color=[248, 24, 148]
        )

        # Create the deck
        deck = pdk.Deck(
            layers=[layer],
            initial_view_state=view_state
        )

        # Display the deck in Streamlit
        st.pydeck_chart(deck)

        st.write(data)

        # st.deck_gl_chart(
        #             viewport={
        #                 'latitude': midpoint[0],
        #                 'longitude':  midpoint[1],
        #                 'zoom': 4
        #             },
        #             layers=[{
        #                 'type': 'ScatterplotLayer',
        #                 'data': data2,
        #                 'radiusScale': 0.1,
        #                 'radiusMinPixels': 1,
        #                 'getFillColor': [248, 24, 148],
        #             }]
        #         )

           
if dashboard_selectbox=="Data Visualization by Service Provider":


    st.title("Data visulization on basis of service provider")
    # st.write(data)
    #st.write(data['iccid']==89916270171126240541)

    service_provider_arr=data.Service_provider.unique()
    print(":::", service_provider_arr)

    # Convert to pandas Series to handle NaN values and then to a NumPy array
    service_provider_series = pd.Series(service_provider_arr)

    # Drop NaN values and convert back to a NumPy array
    clean_service_provider_arr = service_provider_series.dropna().to_numpy()
    
    emp_arr=['']
    service_provider_menu=np.append(emp_arr,clean_service_provider_arr)
    print("Service Provider Menu:", service_provider_menu)

    service_provider_selected = st.selectbox('Select Service Provider:',service_provider_menu, format_func=lambda u: 'Select an option' if u == '' else u,key="TSP overall list")
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


        data2.dropna(subset=['lat', 'lon'], inplace=True)
        print("### DataFrame after dropping NaNs ###")
        print(data2)

        # Adding code so we can have map default to the center of the data
        midpoint = (np.average(data2['lat']), np.average(data2['lon']))
        print("...",midpoint)

        # Define the view state
        view_state = pdk.ViewState(
            latitude=midpoint[0],
            longitude=midpoint[1],
            zoom=4
        )

        # Define the layer
        layer = pdk.Layer(
            'ScatterplotLayer',
            data=data2,
            get_position='[lon, lat]',  # Adjust according to your data's column names
            radius_scale=0.1,
            radius_min_pixels=1,
            get_fill_color=[248, 24, 148]
        )

        # Create the deck
        deck = pdk.Deck(
            layers=[layer],
            initial_view_state=view_state
        )

        # Display the deck in Streamlit
        st.pydeck_chart(deck)

        # st.write(data)

        # st.deck_gl_chart(
        #             viewport={
        #                 'latitude': midpoint[0],
        #                 'longitude':  midpoint[1],
        #                 'zoom': 4
        #             },
        #             layers=[{
        #                 'type': 'ScatterplotLayer',
        #                 'data': data2,
        #                 'radiusScale': 0.1,
        #                 'radiusMinPixels': 1,
        #                 'getFillColor': [248, 24, 148],
        #             }]
        #         )

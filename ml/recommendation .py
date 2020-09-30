import streamlit as st 
import pandas as pd
import math
from sklearn.preprocessing import MinMaxScaler


def load_data():
    df1 = pd.read_csv("./g6.csv")
    def calculate_rating(signal_strength):
        rating=0.0
        if signal_strength>=-70 :
            rating=5.0
        elif ((signal_strength <-70) and (signal_strength>= -85)) :
            rating=4.0
        elif ((signal_strength<-85) and (signal_strength>= -100)) :
            rating=3.0
        elif ((signal_strength<-100) and (signal_strength >= -110)) :
            rating=2.0
        elif(signal_strength <-110):
            rating=1.0
        return rating
    df1['Rating']=df1['signal_strength'].apply(calculate_rating)
    df1['lat']=df1['lat'].astype(float)
    df1['lon']=df1['lon'].astype(float)
    df1.rename(columns = {'area':'Area'}, inplace = True)
    return df1
data=load_data()
st.header("This is how our dataset of all users look like ")
st.write(data)



#users past data analysis 
#need users data 

user_data=data[(data.id==1)]
st.header("Users data looks like this for id =1")
st.write(user_data)
data11=user_data.groupby(['Area']).size().reset_index(name='No_of_observation').sort_values(['No_of_observation'],ascending=False).head(2)
data11.reset_index(drop=True,inplace=True)
totall=data11['No_of_observation'].sum()
data11['Percentage1']=data11['No_of_observation']/totall
new_dataframe=pd.DataFrame(columns=['plat','plon','Area_Label','point_label','Point_percentage'])
area_percentage_list=list(data11['Percentage1'])
st.write(area_percentage_list)
for x in range(2):
    #area_percentage[x]=data11['Percentage1'][x]
    area=data11['Area'][x]
    data22=user_data[data.Area==area]
    data33=data22.groupby(['lat','lon']).size().reset_index(name='count_value').sort_values(['count_value'],ascending=False).head(2)
    label_total=data33['count_value'].sum()
    data33['Percentage2']=data33['count_value']/label_total
    data33_list=list(data33['Percentage2'])
    latt2_list=list(data33['lat'].iloc[:2,])
    lonn2_list=list(data33['lon'].iloc[:2,])
    
    for y in range(0,2):
        latt2=latt2_list[y]
        lonn2=lonn2_list[y]
        #below line is creating a problem
        new_row={'plat':latt2,'plon':lonn2,'Area_Label':x,'point_label':y,'Point_percentage':data33_list[y]}
        new_dataframe=new_dataframe.append(new_row,ignore_index=True)        


new_dataframe['plat']=new_dataframe['plat'].astype(float)
new_dataframe['plon']=new_dataframe['plon'].astype(float)
st.write(new_dataframe)

# user analysis finished


##needs whole data
def calculating_score_function(latt2,lonn2):
    latt2=latt2
    lonn2=lonn2
    def distance(lat1, lon1, lat2, lon2): 
        radius = 6371 
        dlat = math.radians(lat2-lat1)
        dlon = math.radians(lon2-lon1)
        a = math.sin(dlat/2) * math.sin(dlat/2) + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2) * math.sin(dlon/2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        d = radius * c
        return d

    

    data['distance']=data.apply(lambda x:distance(x['lat'],x['lon'],latt2,lonn2),axis=1)

    def score1(dt1):
            data1=dt1
            data5=data1[['Service_provider','Rating','signal_strength']]

            data6=data5.groupby(['Service_provider']).size().reset_index(name='No_of_observation')
            data7=data5.groupby(['Service_provider'])['Rating'].mean().reset_index(name='Average_rating')
            data8=pd.merge(data6,data7,left_on='Service_provider',right_on='Service_provider')
            ssuumm=data8['No_of_observation'].sum()
            data8['Popularity_percentage']=(data8['No_of_observation']/ssuumm)*100

            v=data8['No_of_observation']
            R=data8['Average_rating']
            C=data8['Average_rating'].mean()
            m=data8['No_of_observation']
            data8['weighted_average']=((R*v)+(C*m))/(v+m)

            scaling=MinMaxScaler()
            scaled_data=scaling.fit_transform(data8[['weighted_average','Popularity_percentage']])
            normalized_data=pd.DataFrame(scaled_data,columns=['weighted_average','Popularity_percentage'])

            data8[['weighted_average','Popularity_percentage']]=normalized_data

            data8['Score']=data8['weighted_average']*0.5+data8['Popularity_percentage']*0.5
            
            data9=data8.sort_values(['Score'],ascending=False)
            return data8

    final1=score1(data[data.distance <=0.5])
    final2=score1(data[(data.distance <= 1.0) & (data.distance>0.5)])
    final3=score1(data[(data.distance >1.0) & (data.distance<=1.5)])


    final1.rename(columns = {'Score':'score1'}, inplace = True)
    final2.rename(columns = {'Score':'score2'}, inplace = True)
    final3.rename(columns = {'Score':'score3'}, inplace = True)

    f1=final1[['Service_provider','score1']]
    f2=final2[['Service_provider','score2']]
    f3=final3[['Service_provider','score3']]



    result1=pd.merge(f1,f2,left_on='Service_provider',right_on='Service_provider',how='outer')
    result2=pd.merge(result1,f3,left_on='Service_provider',right_on='Service_provider',how='outer')

    result2.fillna(0,inplace=True)
    result2['final_Score']=result2['score1']*1.0+result2['score2']*0.75+result2['score3']*0.5
    result_final=result2.sort_values(['final_Score'],ascending=False)
    return result_final

x1_lat=list(new_dataframe[(new_dataframe.Area_Label==0) & (new_dataframe.point_label==0)]['plat'])[0]

x1_lon=list(new_dataframe[(new_dataframe.Area_Label==0) & (new_dataframe.point_label==0)]['plon'])[0]
local_score1=calculating_score_function(x1_lat,x1_lon)
local_score1.rename(columns = {'final_Score':'local_score1'}, inplace = True)
st.write(local_score1)


#local score2 
x2_lat=new_dataframe[(new_dataframe.Area_Label==0) & (new_dataframe.point_label==1)]['plat']
x2_lon=new_dataframe[(new_dataframe.Area_Label==0) & (new_dataframe.point_label==1)]['plon']
local_score2=calculating_score_function(x2_lat,x2_lon)
local_score2.rename(columns = {'final_Score':'local_score2'}, inplace = True)
st.write(local_score2)

#area1_score from merging local_score
area1_score=pd.merge(local_score1,local_score2,left_on='Service_provider',right_on='Service_provider',how='outer')
area1_local1=new_dataframe[(new_dataframe.Area_Label==0) &(new_dataframe.point_label==0)]['Point_percentage']
A1P1=list(area1_local1)[0]
area1_local2=new_dataframe[(new_dataframe.Area_Label==0) &(new_dataframe.point_label==1)]['Point_percentage']
A1P2=list(area1_local2)[0]
area1_score['Area1_score_final']=area1_score.apply(lambda x:(x['local_score1']*A1P1*10)+(x['local_score2']*A1P2*10),axis=1)
A1_score=area1_score[['Service_provider','Area1_score_final']]
st.write(A1_score)

#local score3
x3_lat=new_dataframe[(new_dataframe.Area_Label==1) & (new_dataframe.point_label==0)]['plat']
x3_lon=new_dataframe[(new_dataframe.Area_Label==1) & (new_dataframe.point_label==0)]['plon']
local_score3=calculating_score_function(x3_lat,x3_lon)
local_score3.rename(columns = {'final_Score':'local_score3'}, inplace = True)
st.write(local_score3)

#local score 4
x4_lat=new_dataframe[(new_dataframe.Area_Label==1) & (new_dataframe.point_label==1)]['plat']
x4_lon=new_dataframe[(new_dataframe.Area_Label==1) & (new_dataframe.point_label==1)]['plon']
local_score4=calculating_score_function(x4_lat,x4_lon)
local_score4.rename(columns = {'final_Score':'local_score4'}, inplace = True)
st.write(local_score4)


#area2_score
area2_score=pd.merge(local_score3,local_score4,left_on='Service_provider',right_on='Service_provider',how='outer')
area2_local1=new_dataframe[(new_dataframe.Area_Label==1) &(new_dataframe.point_label==0)]['Point_percentage']
A2P1=list(area2_local1)[0]
area2_local2=new_dataframe[(new_dataframe.Area_Label==1) &(new_dataframe.point_label==1)]['Point_percentage']
A2P2=list(area2_local2)[0]


area2_score['Area2_score_final']=area2_score.apply(lambda x:(x['local_score3']*A2P1*10)+(x['local_score4']*A2P2*10),axis=1)
A2_score=area2_score[['Service_provider','Area2_score_final']]
st.write(A2_score)

final_merged=pd.merge(A1_score,A2_score,left_on='Service_provider',right_on='Service_provider',how='outer')
final_merged['final analysis score']=final_merged.apply(lambda x:(x['Area1_score_final']*area_percentage_list[0]*10)+(x['Area2_score_final']*area_percentage_list[1]*10),axis=1)
st.table(final_merged)

st.header("Recommendation of user")
st.write(list(final_merged.Service_provider)[0])


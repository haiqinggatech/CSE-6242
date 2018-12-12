import sys
import requests
import csv
import json
 



api='15c94b8f7989db5fe82e3f648a952e70'
api = sys.argv[1]
movieNum =0
pageNum = 1
simCSV =[]
movieFile = open('movie_ID_name.csv','w',encoding ='utf-8')
similarMovieFile = open ('movie_ID_sim_movie_ID.csv','w',encoding ='utf-8')


while pageNum < 16:
    
    comedyURL='https://api.themoviedb.org/3/discover/movie?api_key={}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page={}&primary_release_date.gte=2000&with_genres=35'.format(api,pageNum)
    request = requests.get(comedyURL)
    comedyData=request.json()
    comedyList=comedyData['results']
    print (pageNum,' page')
    for movie in comedyList:
    
        movieNum += 1 
        movieId=movie['id']
        title=movie['title']
        if ',' in title:
            title= '"' + title + '"'
        comedyCSV=str(movieId) +','+title+ '\n'
        movieFile.write(comedyCSV)
        print('movieID',movieId)
        simURL = 'https://api.themoviedb.org/3/movie/{}/similar?api_key={}&language=en-US&page=1'.format(movieId,api)
        requestSim = requests.get(simURL)
        simData = requestSim.json()
        simList = simData['results'][0:5]
        
        for item in simList:
            print (item['id'])
            simCSV.append((movie['id'],item['id']))
    pageNum +=  1
movieFile.close()


for (originalID,similarID) in simCSV:
    if  (similarID,originalID) in simCSV and (originalID < similarID):
        blackList = (originalID,similarID)
for l in simCSV:
    if l not in blackList:
        similarMovieFile.write(str(l[0])+','+str(l[1])+'\n')


similarMovieFile.close()
        
        
        
    



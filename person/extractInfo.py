from bs4 import BeautifulSoup
import urllib2,urllib
import cookielib
import gzip,cStringIO
import sys
import time
import datetime

names = []
for name in open("names.txt","r"):
    names.append(name.replace("\n",""))

filelist = open("filelist.txt","w")

for name in names:
    OriPerson = Person = name
    Person= Person.replace(" ", "_");
    file_object = open(Person+".txt",'w')
    file_object.write("#Name#\n")
    file_object.write(OriPerson+"\n\n")
    baseUrl = 'http://en.wikipedia.org/wiki/'
    concretUrl = baseUrl + Person
    
    try:
        basePage = urllib2.urlopen(concretUrl,timeout=10).read()
    except urllib2.HTTPError, e:
        print("skipped\n")
        continue
    #print basePage
    if len(Person)>2:
        filelist.write(Person+".txt\n")
    print(OriPerson+"\n")
    soup = BeautifulSoup(basePage)
    content = soup.find_all('p')
    tagstring = '';
    for tag in content:
        tagstring = tagstring + unicode(tag.text)
        tagstring = tagstring + "\n\n"
    
    IntroductionText = tagstring
    
    indexOfOne = []
    
    currIndex = 0
    currIndex = tagstring.find(unicode("1"),currIndex)
    while(currIndex!=-1):
        indexOfOne.append(currIndex)
        currIndex = tagstring.find(unicode("1"),currIndex+1)

    years = []
    for index in indexOfOne:
        subStr = tagstring[index:index+4]
        if subStr.isdigit():
            years.append(subStr)
    
    
    '''
    tagstring = tagstring.replace(unicode("-"), unicode(" "))
    
    texts = tagstring.split(unicode(" "))
    years = []
    for text in texts:
        if unicode("1") in text:
            startIndex = text.find(unicode("1"))
            if(len(text)>=(startIndex+4)):
                subText = text[startIndex:startIndex+4]
                if subText.isdigit():
                    years.append(subText)
    '''
            
        
    file_object.write("#Life Time#\n")
    if len(years)>=2:
        if((int(years[1])-int(years[0]))>20) and ((int(years[1])-int(years[0]))<90):
            file_object.write(years[0]+"-"+years[1]+"\n\n")
        elif((len(years)>=3) and ((int(years[2])-int(years[0]))>20)) and ((int(years[2])-int(years[0]))<90):
            file_object.write(years[0]+"-"+years[2]+"\n\n")
        elif((len(years)>=3) and ((int(years[2])-int(years[1]))>20)) and ((int(years[2])-int(years[1]))<90):
            file_object.write(years[1]+"-"+years[2]+"\n\n")
    
    
    for i in range(3,10):
        targetStr = unicode("")
        for j in range(0,i):
            targetStr = targetStr+unicode("\n")
        IntroductionText = IntroductionText.replace(targetStr,unicode("\n\n"))
    
        
    file_object.write("#Introduction#\n")
    file_object.write(IntroductionText)
    file_object.close()

filelist.close()
print("done!")


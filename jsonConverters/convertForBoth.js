var fs = require("fs"),
    flag=0,
    headers=[],
    objectData = {},
    beginYear=2001,
    endYear=2016,
    arrayOfDataObject1=[],
    arrayOfDataObject2=[];

var jsonConverter = function(beginYear,endYear,csvFile,jsonFile1,jsonFile2) {

  for(var i=beginYear; i<=endYear; i++)
  {
    arrayOfDataObject1[i-beginYear]=
    {
        year:i,
        above:0,
        below:0
    };
    arrayOfDataObject2[i-beginYear]=
    {
        year:i,
        arrested:0,
        notArrested:0
    };
  }

  var readStream=fs.createReadStream(csvFile);
  var writeStream1 = fs.createWriteStream(jsonFile1+".JSON");
  var writeStream2 = fs.createWriteStream(jsonFile2+".JSON");
  var lineByLine=require("readline").createInterface({
    input:readStream
  });

  lineByLine.on("line", function (line) {
     var data = line.toString();
     if(flag==0)
     {
       headers = data.split(",");
       flag=1;
     }
     else
     {
       var rowData=data.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
       for (var i = 0; i < rowData.length; i++)
       {
          objectData[headers[i]] = rowData[i];
       }
       for(var j=beginYear; j<=endYear; j++)
       {
          if(objectData["Year"]==arrayOfDataObject1[j-beginYear].year)
          {
            if (objectData["Description"]=="OVER $500")
            {
              arrayOfDataObject1[j-beginYear].above=arrayOfDataObject1[j-beginYear].above+1;
            }
            else if (objectData["Description"]=="$500 AND UNDER") {
              arrayOfDataObject1[j-beginYear].below=arrayOfDataObject1[j-beginYear].below+1;
            }
            if (objectData["Arrest"]=="true")
            {
              arrayOfDataObject2[j-beginYear].arrested=arrayOfDataObject2[j-beginYear].arrested+1;
            }
            else if(objectData["Arrest"]=="false")
            {
              arrayOfDataObject2[j-beginYear].notArrested=arrayOfDataObject2[j-beginYear].notArrested+1;
            }
          }
        }
      }
  });

  readStream.on("end", function(){
      writeStream1.write(JSON.stringify(arrayOfDataObject1));
      writeStream2.write(JSON.stringify(arrayOfDataObject2));
  });

};
jsonConverter(beginYear,endYear,"crimes2001onwards.csv","dataForStackedBar","dataForMultiLine");

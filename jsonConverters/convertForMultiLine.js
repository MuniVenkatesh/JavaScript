var fs = require("fs"),
    flag=0,
    headers=[],
    objectData = {},
    beginYear=2001,
    endYear=2016,
    arrayOfDataObject=[];

var jsonConverter = function(beginYear,endYear,csvFile,jsonFile) {

  for(var i=beginYear; i<=endYear; i++)
  {
    arrayOfDataObject[i]=
    {
        year:i,
        arrested:0,
        notArrested:0
    };
  }

  var readStream=fs.createReadStream(csvFile);
  var writeStream = fs.createWriteStream(jsonFile+".JSON");
  writeStream.write("[");
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
       for(var i=beginYear; i<=endYear; i++)
       {
          if(objectData["Year"]==arrayOfDataObject[i].year)
          {
            if (objectData["Arrest"]=="true")
            {
              arrayOfDataObject[i].arrested=arrayOfDataObject[i].arrested+1;
            }
            else
            {
              arrayOfDataObject[i].notArrested=arrayOfDataObject[i].notArrested+1;
            }
          }
        }
      }
  });

  readStream.on("end", function(){
    for(var i=beginYear; i<endYear; i++)
    {
      writeStream.write(JSON.stringify(arrayOfDataObject[i]));
      writeStream.write(",");
    }
    writeStream.write(JSON.stringify(arrayOfDataObject[endYear]));
    writeStream.write("]");
  });

};
jsonConverter(beginYear,endYear,"crimes2001onwards.csv","dataForMultiLine");

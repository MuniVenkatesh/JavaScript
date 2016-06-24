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
        above:0,
        below:0
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
       for(var j=beginYear; j<=endYear; j++)
       {
          if(objectData["Year"]==arrayOfDataObject[j].year)
          {
            if (objectData["Description"]=="OVER $500")
            {
              arrayOfDataObject[j].above=arrayOfDataObject[j].above+1;
            }
            else if (objectData["Description"]=="$500 AND UNDER") {
              arrayOfDataObject[j].below=arrayOfDataObject[j].below+1;
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
jsonConverter(beginYear,endYear,"crimes2001onwards.csv","dataForStackedBar");

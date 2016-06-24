var margin={top:50, bottom:50, left:150, right:150},
    width=1100-margin.left-margin.right,
    height=600-margin.top-margin.bottom;

var horizontal=d3.scale.ordinal().rangeRoundBands([0,width],0.25), // x-axis range
    vertical=d3.scale.linear().rangeRound([height,0]);              // y-axis range

var color = d3.scale.category10().range(["magenta","lightgreen"]);  // color scale of category10 with customised range of colors

var xAxis=d3.svg.axis()
    .scale(horizontal)
    .orient("bottom");

var yAxis=d3.svg.axis()
    .scale(vertical)
    .orient("left");

var svg=d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform","translate(" + margin.left + "," + margin.top + ")");

// d3 function to load JSON data from a json file
d3.json("dataForStackedBar.JSON",function(err,data){
  data.forEach(function(d){
    d.year=+d.year;
    d.above=+d.above;
    d.below=+d.below;
  });

  var categories=["above","below"];
  var dataIntermediate = categories.map(function (c) {
      return data.map(function (d) {
          return {x: d.year, y: d[c]};
      });
  });

  // layout for stacked bar chart
  var dataStackLayout = d3.layout.stack()(dataIntermediate);
  horizontal.domain(dataStackLayout[0].map(function (d) { return d.x; }));
  vertical.domain([0,
                   d3.max(dataStackLayout[dataStackLayout.length - 1],
                     function (d) { return d.y0 + d.y;})
                  ])
                  .nice();
  var charts = svg.selectAll(".stack")
          .data(dataStackLayout)
          .enter().append("g")
            .attr("class", "stack")
            .style("fill", function (d, i) {
                return color(i);
                });

  charts.selectAll("rect")
        .data(function (d) {
              return d;
            })
        .enter().append("rect")
        .attr("x", function (d) {
            return horizontal(d.x);
            })
        .attr("y", function (d) {
              return vertical(d.y + d.y0);
            })
        .attr("height", function (d) {
              return vertical(d.y0) - vertical(d.y + d.y0);
            })
        .attr("width", horizontal.rangeBand());

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("dy","-4em")
    .style("text-anchor", "end")
    .style("font-size","20px")
    .style("font-weight","bold")
    .text("No.of Thefts over Years (2001-2016)");

  var legendSize=25,
      legendSpace=8;

// legend
  var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr('transform', function(d, i) {
        var height = legendSize + legendSpace;
        var horz = 820;
        var vert = i*height;
        return 'translate(' + horz + ',' + vert + ')';
      });

 legend.append("rect")
      .attr("width", legendSize)
      .attr("height", legendSize)
      .style("fill", color)
      .style("stroke", color);

 legend.append("text")
      .attr("x", legendSize + legendSpace)
      .attr("y", legendSize - legendSpace)
      .text(function(d,i) { return (categories[i]+" $500").toUpperCase(); })
      .style("fill",color);

});

//http://bl.ocks.org/charlesdguthrie/11356441

var setup = function(targetID){

  //Set size of svg element and chart
  var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    categoryIndent = 4*15 + 5,
    defaultBarWidth = 2000;

  //Set up scales
  var x = d3.scale.linear()
    .domain([0,defaultBarWidth])
    .range([0,width]);
  var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], 0.1, 0);

  //Create SVG element
  d3.select(targetID).selectAll("svg").remove()
  var svg = d3.select(targetID).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Package and export settings
  var settings = {
    margin:margin, width:width, height:height, categoryIndent:categoryIndent,
    svg:svg, x:x, y:y
  }
  return settings;
}

var redrawChart = function(targetID, newdata) {

  //Import settings
  var margin=settings.margin, width=settings.width, height=settings.height, categoryIndent=settings.categoryIndent,
    svg=settings.svg, x=settings.x, y=settings.y;

  //Reset domains
  y.domain(newdata.sort(function(a,b){
    return b.value - a.value;
  })
      .map(function(d) { return d.key; }));
  var barmax = d3.max(newdata, function(e) {
    return e.value;
  });
  x.domain([0,barmax]);

  //Create chart row and move to below the bottom of the chart
  var chartRow = svg.selectAll("g.chartRow")
    .data(newdata, function(d){ return d.key});
  var newRow = chartRow
    .enter()
    .append("g")
    .attr("class", "chartRow")
    .attr("transform", "translate(0," + height + margin.top + margin.bottom + ")");

  //Add rectangles
  newRow.insert("rect")
    .attr("class","bar")
    .attr("x", 0)
    .attr("opacity",0)
    .attr("height", y.rangeBand())
    .attr("width", function(d) { return x(d.value);})

  //Add value labels
  newRow.append("text")
    .attr("class","label")
    .attr("y", y.rangeBand()/2)
    .attr("x",0)
    .attr("opacity",0)
    .attr("dy",".35em")
    .attr("dx","0.5em")
    .text(function(d){return d.value;});

  //Add Headlines
  newRow.append("text")
    .attr("class","category")
    .attr("text-overflow","ellipsis")
    .attr("y", y.rangeBand()/2)
    .attr("x",categoryIndent)
    .attr("opacity",0)
    .attr("dy",".35em")
    .attr("dx","0.5em")
    .text(function(d){return d.key});

  //Update bar widths
  chartRow.select(".bar").transition()
    .attr("width", function(d) { return x(d.value);})
    .attr("opacity",1);
  ;
  //Update data labels
  chartRow.select(".label").transition()
    .attr("opacity",1)
    .tween("text", function(d) {
      var i = d3.interpolate(+this.textContent.replace(/\,/g,''), +d.value);
      return function(t) {
        this.textContent = Math.round(i(t));
      };
    });

  chartRow.select(".category").transition()
    .attr("opacity",1);

  chartRow.exit().transition()
    .style("opacity","0")
    .attr("transform", "translate(0," + (height + margin.top + margin.bottom) + ")")
    .remove();

  chartRow.transition()
    .attr("transform", function(d){ return "translate(0," + y(d.key) + ")"; });
};

//Pull updated data
var pullData = function(settings,updatedData,callback){
  var newData = updatedData;
  newData = formatData(newData);
  callback(settings,newData);
}

//Sort data in descending order
var formatData = function(data){
  return data.sort(function (a, b) {
    return b.value - a.value;
  });
}

var redraw = function(settings, updatedData){
  pullData(settings, updatedData, redrawChart)
}

var settings = setup('#chart');

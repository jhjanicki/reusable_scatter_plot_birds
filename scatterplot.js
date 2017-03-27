d3.custom = {};
 
d3.custom.scatterplot = function module() {
	var margin = {top: 30, right: 40, bottom: 50, left: 30},
    	width = 560,
    	height = 500,
    	xValue ='xparam',
    	yValue='taxDiv',
    	y2Value='phyMean',
    	y3Value='funcDiv',
    	xLabel='',
    	yLabel = 'Taxonomic + Functional Diversity',
    	y2Label='Phylogenetic Mean',
    	_index = 0,
    	xlog='log';
    

    
    
    	var svg;
    
    	function exports(_selection) {
			_selection.each(function(_data) {
		
			var x
		
				if(xlog=='log'){
				
					 x = d3.scale.log()
					.range([0, width]);
				}else{
					 x = d3.scale.linear()
					.range([0, width]);
				}

				var y = d3.scale.linear()
					.range([height, 0]);

				var y2 = d3.scale.linear()
					.range([height, 0]);


				var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom")
					.tickFormat(function (d) {
						return x.tickFormat(4,d3.format(",d"))(d)
					});

				var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left");

				var yAxis2 = d3.svg.axis()
					.scale(y2)
					.orient("right");

		
				if (!svg) {
					 svg = d3.select(this).append('svg');
					 var container = svg.append('g').classed('container-group'+_index, true);

				}
			
				svg.attr("width", width + margin.left + margin.right)
						.attr("height", height + margin.top + margin.bottom);
			
				container
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
					
				  x.domain(d3.extent(_data, function(d) { return d[xValue]; })).nice();
				  // y.domain(d3.extent(_data, function(d) { return d[yValue]; })).nice();
				  y.domain([0,1]);
				 //  y2.domain(d3.extent(_data, function(d) { return d[y2Value]; })).nice();
				  y2.domain([100,170]);

				   //x-axis labels
				  container.append("g")
					  .attr("class", "x axis")
					  .attr("transform", "translate(0," + height + ")")
					  .call(xAxis)
					  .selectAll("text")	
							.style("text-anchor", "end")
							.attr("dx", "-.8em")
							.attr("dy", ".15em")
							.attr("transform", function(d) {
								return "rotate(-65)" 
							});
   
				   //x-axis title label
					container.append("g")
					  .attr("class", "x axis")
					  .attr("transform", "translate(-5," + height + ")")
					  .append("text")
					  .attr("class", "label")
					  .attr("x", width)
					  .attr("y", -6)
					  .style("text-anchor", "end")
					  .text(xLabel);

				 //y-axis title label
				  container.append("g")
					  .attr("class", "y axis")
					  .call(yAxis)
					  .append("text")
					  .attr("class", "label")
					  .attr("transform", "rotate(-90)")
					  .attr("y", 6)
					  .attr("dy", ".71em")
					  .style("text-anchor", "end")
					  .text(yLabel);
				  
					  //y2-axis title label
					  container.append("g")
						  .attr("class", "y axis")
						  .attr("transform", "translate( " + width + ", 0 )")
						  .call(yAxis2)
						  .append("text")
						  .attr("class", "label")
						  .attr("transform", "rotate(-90)")
						  .attr("y", -12)
						  .attr("dy", ".71em")
						  .style("text-anchor", "end")
						  .text(y2Label);
					  
					container.selectAll(".dot"+_index)
					  .data(_data)
					  .enter().append("circle")
					  .attr("class", "dot")
					  .attr("r", 3.5)
					  .attr("cx", function(d) { return x(d[xValue]); })
					  .attr("cy", function(d) { return y(d[yValue]); })
					  .style("fill", '#72A8FF')
					  .style("opacity",0.9);
	  
				  container.selectAll(".dot2"+_index)
					  .data(_data)
					  .enter().append("circle")
					  .attr("class", "dot")
					  .attr("r", 3.5)
					  .attr("cx", function(d) { return x(d[xValue]); })
					  .attr("cy", function(d) { return y2(d[y2Value]); })
					  .style("fill", '#D65734')
					  .style("opacity",0.9);
	  
					container.selectAll(".dot3"+_index)
					  .data(_data)
					  .enter().append("circle")
					  .attr("class", "dot")
					  .attr("r", 3.5)
					  .attr("cx", function(d) { return x(d[xValue]); })
					  .attr("cy", function(d) { return y(d[y3Value]); })
					  .style("fill", '#96BF52')
					  .style("opacity",0.9);
					  
					  
					  
					  
					  
					var taxonomicDiversityArray = _data.map(function(d){return d['taxDiv']});
					
					var functionalDiversityArray = _data.map(function(d){return d['funcDiv']});
		
					var phylogeneticDiversityArray = _data.map(function(d){return d['phyMean']});

					//get the x and y values for least squares
					var xSeries = _data.map(function(d) { return d['xparam'] });
					var ySeriesTax = taxonomicDiversityArray;
					var ySeriesFunc = functionalDiversityArray;
					var ySeriesPhy = phylogeneticDiversityArray;
		
					var dataArrayTax=[];
					var dataArrayFunc=[];
					var dataArrayPhy=[];
		
					for (var i=0;i<xSeries.length;i++){
						var indvArray = [];
						indvArray.push(xSeries[i],ySeriesTax[i]);
						dataArrayTax.push(indvArray);
			
						var indvArrayFunc =[];
						indvArrayFunc.push(xSeries[i],ySeriesFunc[i]);
						dataArrayFunc.push(indvArrayFunc);
			
						var indvArrayPhy =[];
						indvArrayPhy.push(xSeries[i],ySeriesPhy[i]);
						dataArrayPhy.push(indvArrayPhy);
					}
		
		
					var resultTax = regression('linear', dataArrayTax);
					var slopeTax = resultTax.equation[0];
					var yInterceptTax = resultTax.equation[1];
		
					var resultFunc = regression('linear', dataArrayFunc);
					var slopeFunc = resultFunc.equation[0];
					var yInterceptFunc = resultFunc.equation[1];
		
					var resultPhy = regression('linear', dataArrayPhy);
					var slopePhy = resultPhy.equation[0];
					var yInterceptPhy = resultPhy.equation[1];
		
		
					// apply the reults of the least squares regression
		
					var x1Tax = d3.min(xSeries);
					var y1Tax = slopeTax*x1Tax+ yInterceptTax;
					var x2Tax = d3.max(xSeries);
					var y2Tax = slopeTax*x2Tax + yInterceptTax;
					var trendDataTax = [[x1Tax,y1Tax,x2Tax,y2Tax]];
		
					var x1Func = d3.min(xSeries);
					var y1Func  = slopeFunc*x1Func + yInterceptFunc;
					var x2Func  = d3.max(xSeries);
					var y2Func = slopeFunc*x2Func + yInterceptFunc;
					var trendDataFunc = [[x1Func,y1Func,x2Func,y2Func]];
		
					var x1Phy = d3.min(xSeries);
					var y1Phy  = slopePhy*x1Phy + yInterceptPhy;
					var x2Phy  = d3.max(xSeries);
					var y2Phy = slopePhy*x2Phy + yInterceptPhy;
					var trendDataPhy = [[x1Phy,y1Phy,x2Phy,y2Phy]];
		
					console.log(trendDataTax);
		
					var trendlineTax = container.selectAll(".trendline"+_index)
						.data(trendDataTax);
			
					var trendlineFunc= container.selectAll(".trendline2"+_index)
						.data(trendDataFunc);
			
					var trendlinePhy= container.selectAll(".trendline3"+_index)
						.data(trendDataPhy);
			
					trendlineTax.enter()
						.append("line")
						.attr("class", "trendline")
						.attr("x1", function(d) { return x(d[0]); })
						.attr("y1", function(d) { return y(d[1]); })
						.attr("x2", function(d) { return x(d[2]); })
						.attr("y2", function(d) { return y(d[3]); })
						.attr("stroke", "#72A8FF")
						.attr("stroke-width", 1);
		
					trendlineFunc.enter()
						.append("line")
						.attr("class", "trendline")
						.attr("x1", function(d) { return x(d[0]); })
						.attr("y1", function(d) { return y(d[1]); })
						.attr("x2", function(d) { return x(d[2]); })
						.attr("y2", function(d) { return y(d[3]); })
						.attr("stroke", "#96BF52")
						.attr("stroke-width", 1);
			
					trendlinePhy.enter()
						.append("line")
						.attr("class", "trendline")
						.attr("x1", function(d) { return x(d[0]); })
						.attr("y1", function(d) { return y2(d[1]); })
						.attr("x2", function(d) { return x(d[2]); })
						.attr("y2", function(d) { return y2(d[3]); })
						.attr("stroke", "#D65734")
						.attr("stroke-width", 1);
					  
					  
					  
					  

			})
	
		}
		
		exports.xValue = function(value) {
			if (!arguments.length) return xValue;
			xValue = value;
			return this;
		}
		
	
		exports.yValue = function(value) {
			if (!arguments.length) return yValue;
			yValue = value;
			return this;
		}
		
		exports.y2Value = function(value) {
			if (!arguments.length) return y2Value;
			y2Value = value;
			return this;
		}
		
		exports.y3Value = function(value) {
			if (!arguments.length) return y3Value;
			y3Value = value;
			return this;
		}
		
		exports.xLabel = function(value) {
			if (!arguments.length) return xLabel;
			xLabel = value;
			return this;
		}
		
		exports.yLabel = function(value) {
			if (!arguments.length) return yLabel;
			yLabel = value;
			return this;
		}
		
		exports.y2Label = function(value) {
			if (!arguments.length) return y2Label;
			y2Label = value;
			return this;
		}
	
	
		exports._index = function(value) {
			if (!arguments.length) return _index;
			_index = value;
			return this;
		}
		
		exports.xlog = function(value) {
			if (!arguments.length) return xlog;
			xlog = value;
			return this;
		}
	
	
		return exports;

}








  




  

	



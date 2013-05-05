var userAgent = navigator.userAgent.toLowerCase(),
	ios = /iphone|ipod|ipad/.test(userAgent),
	iphone = /iphone/.test(userAgent),
	ipod = /ipod/.test(userAgent),
	ipad = /ipad/.test(userAgent),
	touch_device = window.Touch ? true : false,
	svgSupport = window.SVGSVGElement ? true : false,
	defaultOpacity = 0.7,
	tooltip;

function toArray(l) {
	ll = l.split(',');
	for(var i=0; i<ll.length; i++) { 
		ll[i] = ll[i].trim(); 
	}
	return ll;
}

function parserFor(format) {
	format = format.trim();
 	if(format == "i" || format == "integer") return parseInt;
 	if(format == "f" || format == "float") return parseFloat;
 	if(format == "s" || format == "string") return function(s) { return s; };
 	
  	if(format == "yyyymmdd" || format == "d" || format == "date") return d3.time.format("%Y%m%d").parse;
 	if(format == "yyyy-mm-dd") return d3.time.format("%Y-%m-%d").parse;
 	if(format == "yy-mm-dd") return d3.time.format("%y-%m-%d").parse;
 	if(format == "yyyy/mm/dd") return d3.time.format("%Y/%m/%d").parse;
 	if(format == "yy/mm/dd") return d3.time.format("%y/%m/%d").parse;
 	if(format == "dd.mm.yyyy") return d3.time.format("%d.%m.%Y").parse;
 	if(format == "dd.mm.yy") return d3.time.format("%d.%m.%y").parse;
 	
 	return d3.time.format(format).parse;
}
 
function scaleFor(format) {
	format = format.trim();
 	if(format == "i" || format == "integer") return d3.scale.linear();
 	if(format == "f" || format == "float") return d3.scale.linear();
 	if(format == "s" || format == "string") return d3.scale.ordinal();
 	return d3.time.scale();
}

function parseData(data, category, value, format, debug) {	
	// Parse the datatypes	
	for(var i = 0; i < data.length; i++) {
		for(var j = 0; j < category.length; j++) {
    		data[i][category[j]] = parserFor(format[j])(data[i][category[j]]);
    	}
    	for(var j = 0; j < value.length; j++) {
    		data[i][value[j]] = parserFor(format[category.length + j])(data[i][value[j]]);
    	}
    }
    return data;	
}

function colorScale(color) { 
    if(color[0].toLowerCase().trim() == "auto") {
    	color = d3.scale.category20();
    } else {
		color=d3.scale.ordinal().range(color);
	}
	return color;
}

function renderNoSvgSupport(figure, img) {
	
	figure.select("svg").remove();
	
	if(img && img.trim() != "") {
		image = figure.append("img")
			.attr("src", img)
			.attr("width", parseInt(figure.style("width")))
			.attr("height", parseInt(figure.style("height")) - 40);
	} else {
		figure.append("p")
			.text("Sorry, can't display the chart. Use a newer, SVG enabled browser.")
			.attr("style", "color: red;");
		figure.attr("style", "border: 1px solid lightgray; padding: 1em;");
	}
}

function renderError(figure, error) {
	figure.select("svg").remove();
	figure.append("p")
		.text(error)
		.attr("style", "color: red;");
	figure.attr("style", "border: 1px solid lightgray; padding: 1em;");
	return false;
}

function createFigureElement(id, title, description, style, version) {
	var figure = d3.select('#' + id);	
	figure.attr("style", style);

	var	svg = figure.append("svg");
	
	svg.append("g")
		.attr("class", "meta")
		.append("title").text(title)
		.append("description").text(description);
		
	figure.append("figcaption").text(title);	

    var width = parseInt(figure.style("width")),
    	height = parseInt(figure.style("height")) - parseInt(figure.select("figcaption").style("height")) - 20;
    	    
	svg.attr("viewBox", "0 0 " + width + " " + height)
    	.attr("preserveAspectRatio", "xMidYMid meet")
       	.attr("width", width)
       	.attr("height", height)
       	.append("g")
       		.attr("class", "main");
	
	return figure;
}

function createTooltip() {
	if(tooltip == null) {
		tooltip = d3.select("body").append("div")
    		.attr("class", "iputooltip")
        	.style("opacity", 0.0)
        	.style("width", function() {return screen.width > 320 ? "260px" : "160px"; })
    		.html("<p>tooltip</p>")
    		.on("touchstart", hideTooltip);
	}
	return tooltip;
}

function renderChart(id, csv, tsv, type, category, value, format, color, style, title, description, sort, interpolate, animate, img, debug, version) {
	
	debug = (debug.toLowerCase() == "true");

	if(debug) {
	
		console.log("CLIENT: "
					+ "\n\tuser-agent: " + userAgent
					+ "\n\ttouch device: " + touch_device
					+ "\n\tSVG support: " + svgSupport
					+ "\n\tscreen width/height: " + screen.width + "px/" + screen.height + "px");
					
		console.log("PLUGIN: "
					+ "\n\t" + version);
					
					
		console.log("CALL RENDER CHART: "
					+ "\n\tid: " + id
					+ "\n\tcsv: " + csv
					+ "\n\ttsv: " + tsv
					+ "\n\ttype: " + type
					+ "\n\tcategory: " + category
					+ "\n\tvalue: " + value
					+ "\n\tformat: " + format
					+ "\n\tcolor: " + color
					+ "\n\tstyle: " + style
					+ "\n\ttitle: " + title
					+ "\n\tdescription: " + description
					+ "\n\tsort: " + sort
					+ "\n\tinterpolate: " + interpolate
					+ "\n\tanimate: " + animate
					+ "\n\timg: " + img
					+ "\n\tdebug: " + debug);
	}
	
	var figure = null;
	
	if(type === 'table') {
		figure = d3.select("#" + id);
		figure.append("caption").text(title);
	} else {
		figure = createFigureElement(id, title, description, style, version);
		if(!svgSupport) return renderNoSvgSupport(figure, img);
		createTooltip();
	}
	
	category = toArray(category);
	value = toArray(value);
	format = toArray(format);
	color = toArray(color);
	animate = toArray(animate);
	
	if(animate[0] == "slow") animate = ["5000", "linear"];
	else if(animate[0] == "medium") animate = ["2000", "linear"];
	else if(animate[0] == "fast") animate = ["1000", "linear"];
	
	if(csv.length > 0) {
		if((/^#/).test(csv)) {
			if(d3.select(csv).empty()) {
				return renderError(figure, "The csv '" + csv + "' does not exist in this document.");
			}	
			data = d3.csv.parse(d3.select(csv).text());
			if(debug) { console.log("Loaded data (sync): "); console.log(data) };
		
			render(figure, data, type, category, value, format, color, sort, interpolate, animate, debug);
		
		} else {
			d3.csv(csv, function(error, data) {
				if(error) {
					console.warn("There was an error loading the data: " + error);
					return renderError(figure, "There was an error loading the data: " + csv);
				}
				if(debug) { console.log("Loaded data (async): "); console.log(data) };
				render(figure, data, type, category, value, format, color, sort, interpolate, animate, debug);
  			});  			
		}
	} else if(tsv.length > 0) {
		if((/^#/).test(tsv)) {
			if(d3.select(tsv).empty()) {
				return renderError(figure, "The tsv '" + tsv + "' does not exist in this document.");
			}	
			data = d3.tsv.parse(d3.select(tsv).text());
			if(debug) { console.log("Loaded data (sync): "); console.log(data) };
		
			render(figure, data, type, category, value, format, color, sort, interpolate, animate, debug);
		
		} else {
			d3.tsv(tsv, function(error, data) {
				if(error) {
					console.warn("There was an error loading the data: " + error);
					return renderError(figure, "There was an error loading the data: " + tsv);
				}
				if(debug) { console.log("Loaded data (async): "); console.log(data) };
				render(figure, data, type, category, value, format, color, sort, interpolate, animate, debug);
  			});  			
		}
	} else {
		console.warn("There is no data to display (set a csv or tsv that point to the data)");
		return renderError(figure, "There is no data to display.");
	}
}	

function render(figure, data, type, category, value, format, color, sort, interpolate, animate, debug) {
	
	data = parseData(data, category, value, format, debug);

    if(type.toLowerCase().trim() == "bar") 
    	renderBar(figure, data, category, value, format, color, sort, interpolate, animate, debug);
    	
    else if(type.toLowerCase().trim() == "bar.horizontal") 
    	renderBarHorizontal(figure, data, category, value, format, color, sort, interpolate, animate, debug);
    	 	 
    else if(type.toLowerCase().trim() == "pie") 
    	renderPie(figure, data, category, value, format, color, sort, interpolate, animate, debug);
    	
    else if(type.toLowerCase().trim() == "donut") 
    	renderDonut(figure, data, category, value, format, color, sort, interpolate, animate, debug);
    	
	else if(type.toLowerCase().trim() == "line") 
    	renderLine(figure, data, category, value, format, color, sort, interpolate, animate, debug);
    	
    else if(type.toLowerCase().trim() == "scatter") 
    	renderScatter(figure, data, category, value, format, color, sort, interpolate, animate, debug);
    	
    else if(type.toLowerCase().trim() == "table") 
    	renderTable(figure, data, category, value, debug);
    	
    else if(type.toLowerCase().trim() == "line.multi") 
    	renderLineMulti(figure, data, category, value, format, color, sort, interpolate, animate, debug);
}

function renderScatter(figure, data, category, value, format, color, sort, interpolate, animate, debug) {
	if(debug) { console.log("START RENDER SCATTER"); }
	
	var color = colorScale(color);
	
	var svg = figure.select("svg");

	var margin = {top: 20, right: 20, bottom: 40, left: 80},
    	width = parseInt(svg.attr("width")) - margin.left - margin.right,
    	height = parseInt(svg.attr("height")) - margin.top - margin.bottom;
    	
    var x = scaleFor(format[1])
    	.range([0, width]);

	var y = scaleFor(format[2])
    	.range([height, 0]);
    	
	var xAxis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom")
    	.tickSize(height);

	var yAxis = d3.svg.axis()
    	.scale(y)
    	.orient("left")
    	.tickSize(width);
    	
	x.domain(d3.extent(data, function(d) { return d[value[0]]; })).nice();
  	y.domain(d3.extent(data, function(d) { return d[value[1]]; })).nice();

    var chart = svg.append("g")
    	.attr("class", "chart")
       	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");  	

	chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + 0 + ")")
		.call(xAxis)
			.append("text")
				.attr("class", "x label")
				.attr("x", width)
      			.attr("dx", "-.21em")
      			.attr("dy", "-.21em")
      			.style("text-anchor", "end")
      			.text(value[0]);
		
	chart.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + width + ", 0)")
		.call(yAxis)
			.append("text")
				.attr("class", "y label")
      			.attr("transform", "rotate(-90)")
      			.attr("dx", "-.21em")
      			.attr("dy", ".91em")
      			.style("text-anchor", "end")
      			.text(value[1]);

	chart.selectAll(".scdot")
		.data(data)
			.enter().append("circle")
				.attr("class", "scdot")
				.attr("r", 4.5)
				.attr("cx", function(d) { return x(d[value[0]]); })
				.attr("cy", function(d) { return y(d[value[1]]); })
				.style("fill", function(d) { return color(d[category]); });
				
	var legend = chart.selectAll(".legend")
		.data(color.domain())
			.enter().append("g")
			.attr("class", "legend")
		.attr("transform", function(d, i) { return "translate(-12," + (12 + i * 16) + ")"; });

	legend.append("rect")
		.attr("x", width - 12)
		.attr("width", 12)
		.attr("height", 12)
		.style("stroke", color)
		.style("fill", color);

	legend.append("text")
		.attr("x", width - 18)
		.attr("y", 5)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) { return d; });
		
	if(touch_device) {
       	d3.selectAll(".scdot")
       		.on("touchstart", showTooltip);
	} else {
   		d3.selectAll(".scdot")	
   			.on("mouseover", showTooltip)
   			.on("mousemove", moveTooltip)
   			.on("mouseout", hideTooltip);
   	}
   	if(debug) { console.log("END RENDER SCATTER") }; 
}

function renderLine(figure, data, category, value, format, color, sort, interpolate, animate, debug) {
	if(debug) { console.log("START RENDER LINE"); }
	
	var color = colorScale(color);
	
	var svg = figure.select("svg");

	var margin = {top: 20, right: 20, bottom: 40, left: 80},
    	width = parseInt(svg.attr("width")) - margin.left - margin.right,
    	height = parseInt(svg.attr("height")) - margin.top - margin.bottom;
    	
    var x = scaleFor(format[0])
    	.range([0, width]);

	var y = scaleFor(format[1])
    	.range([height, 0]);
    	
	var xAxis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom")
    	.tickSize(height);

	var yAxis = d3.svg.axis()
    	.scale(y)
    	.orient("left")
    	.tickSize(width);
    	
	var line = d3.svg.line()
		.interpolate(interpolate)
    	.x(function(d) { return x(d[category]); })
    	.y(function(d) { return y(d[value]); });
    	
	x.domain(d3.extent(data, function(d) { return d[category]; }));
  	y.domain(d3.extent(data, function(d) { return d[value]; }));

    var chart = svg.append("g")
    	.attr("class", "chart")
       	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");  	

	chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + 0 + ")")
		.call(xAxis)
			.append("text")
				.attr("class", "x label")
				.attr("x", width)
      			.attr("dx", "-.21em")
      			.attr("dy", "-.21em")
      			.style("text-anchor", "end")
      			.text(category);

	chart.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + width + ", 0)")
		.call(yAxis)
			.append("text")
				.attr("class", "y label")
      			.attr("transform", "rotate(-90)")
      			.attr("dx", "-.21em")
      			.attr("dy", ".91em")
      			.style("text-anchor", "end")
      			.text(value);

  	chart.append("path")
		.datum(data)
		.attr("class", "line")
		.style("stroke", function(d) { return color(d[category]); })
		.attr("d", line);
		
	chart.selectAll(".dot")    
        .data(data)         
    	.enter().append("circle")                               
        	.attr("class", "dot")
        	.attr("r", 5)       
        	.attr("cx", function(d) { return x(d[category]); })       
        	.attr("cy", function(d) { return y(d[value]); })
        	.attr("opacity", 0.0);
		
	if(touch_device) {
       	d3.selectAll(".dot")
       		.on("touchstart", showTooltip);
	} else {
   		d3.selectAll(".dot")	
   			.on("mouseover", showTooltip)
   			.on("mousemove", moveTooltip)
   			.on("mouseout", hideTooltip);
   	}
   	if(debug) { console.log("END RENDER LINE") }; 
}

function renderBar(figure, data, category, value, format, color, sort, interpolate, animate, debug) {
	if(debug) { console.log("START RENDER BAR") };
	
	var color = colorScale(color);
	
	var svg = figure.select("svg");

	var margin = {top: 20, right: 20, bottom: 40, left: 80},
    	width = parseInt(svg.attr("width")) - margin.left - margin.right,
    	height = parseInt(svg.attr("height")) - margin.top - margin.bottom;
    	    	
	var x = scaleFor(format[0])
    	.rangeRoundBands([0, width], .1);

	var y = scaleFor(format[1])
    	.range([height, 0]);

	var xAxis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom");

	var yAxis = d3.svg.axis()
    	.scale(y)
    	.orient("left")
    	.tickSize(width);
    	
    x.domain(data.map(function(d) { return d[category]; }));
  	y.domain([0, d3.max(data, function(d) { return d[value]; })]);
       
    var chart = svg.append("g")
    	.attr("class", "chart")
       	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");  	

	chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
			.append("text")
				.attr("class", "x label")
				.attr("x", width)
      			.attr("dx", "-.21em")
      			.attr("y", -height)
      			.attr("dy", "-.21em")
      			.style("text-anchor", "end")
      			.text(category);

	chart.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + width + ", 0)")
		.call(yAxis)
			.append("text")
				.attr("class", "y label")
      			.attr("transform", "rotate(-90)")
      			.attr("dx", "-.21em")
      			.attr("dy", ".91em")
      			.style("text-anchor", "end")
      			.text(value);
      	
	chart.selectAll(".bar")
		.data(data)
		.enter().append("rect")
      		.attr("class", "bar")
      		.attr("x", function(d) { return x(d[category]); })
      		.attr("width", x.rangeBand())
      		.attr("y", function(d) { return y(d[value]); })
      		.attr("height", function(d) { return height - y(d[value]); })
      		.style("fill", function(d) { return color(d[category]); })
      		.style("opacity", defaultOpacity);
     
    function startAnimation() {
     	if(animate[0] != "none") {
     		duration = +animate[0];
     		ease = animate[1] != null ? animate[1] : "linear";
     		if(debug) console.log("Starting animation, figure: " + figure.attr("id") + ", duration: " + duration + ", ease: " + ease);

     		chart.selectAll(".bar")
     			.attr("y", y(0))
     			.attr("height", 0)
    			.transition()
    				.ease(ease)
    				.delay(function(d, i) { return duration/2 + i * duration; })
    				.duration(duration)
    				.attr("y", function(d) { return y(d[value]); })
     				.attr("height", function(d) { return height - y(d[value]); });
     	}
	}
    
     		
	if(touch_device) {
       	d3.selectAll(".bar")
       		.on("touchstart", showTooltip);
       		
		figure.selectAll("svg")
			.on("touchstart", startAnimation);
			
	} else {
   		d3.selectAll(".bar")	
   			.on("mouseover", showTooltip)
   			.on("mousemove", moveTooltip)
   			.on("mouseout", hideTooltip);	
   			
		figure.selectAll("svg")
			.on("mousedown", startAnimation);      		
   	}
   	
   	if(debug) { console.log("END RENDER BAR") };

} 

function renderBarHorizontal(figure, data, category, value, format, color, sort, interpolate, animate, debug) {
	if(debug) { console.log("START RENDER BAR HORIZONTAL") };
	
	var color = colorScale(color);
	
	data = data.reverse();
	
	var svg = figure.select("svg");

	var margin = {top: 20, right: 20, bottom: 40, left: 80},
    	width = parseInt(svg.attr("width")) - margin.left - margin.right,
    	height = parseInt(svg.attr("height")) - margin.top - margin.bottom;

	var x = scaleFor(format[1])
    	.range([width, 0]);

	var y = scaleFor(format[0])
    	.rangeRoundBands([0, height], .1);
    	
	var xAxis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom")
    	.tickSize(height);

	var yAxis = d3.svg.axis()
    	.scale(y)
    	.orient("left");
    	
    y.domain(data.map(function(d) { return d[category]; }));
  	x.domain([d3.max(data, function(d) { return d[value]; }), 0]);
       
    var chart = svg.append("g")
    	.attr("class", "chart")
       	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");  	

	chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0,0)")
		.call(xAxis)
			.append("text")
				.attr("class", "x label")
				.attr("x", width)
      			.attr("dx", "-.21em")
      			.attr("dy", "-.21em")
      			.style("text-anchor", "end")
      			.text(value);

	chart.append("g")
		.attr("class", "y axis")
		.call(yAxis)
			.append("text")
				.attr("class", "y label")
				.attr("y", width)
      			.attr("transform", "rotate(-90)")
      			.attr("dx", "-.21em")
      			.attr("dy", ".91em")
      			.style("text-anchor", "end")
      			.text(category);
      	
	chart.selectAll(".bar")
		.data(data)
		.enter().append("rect")
      		.attr("class", "bar")
      		.attr("x", 0)
      		.attr("y", function(d) { return y(d[category]); })
      		.attr("height", y.rangeBand())
      		.attr("width", function(d) { return x(d[value]); })
      		.style("fill", function(d) { return color(d[category]); })
      		.style("opacity", defaultOpacity);

    function startAnimation() {
     	if(animate[0] != "none") {
     		duration = +animate[0];
     		ease = animate[1] != null ? animate[1] : "linear";
     		if(debug) console.log("Starting animation, figure: " + figure.attr("id") + ", duration: " + duration + ", ease: " + ease);

			var bars = chart.selectAll(".bar");
			bars
     			.attr("width", 0)
    			.transition()
    				.ease(ease)
    				.delay(function(d, i) { return duration/2 + (bars[0].length-i) * duration; })
    				.duration(duration)
    				.attr("width", function(d) { return x(d[value]); });
     	}
	}
	      		
	if(touch_device) {
       	d3.selectAll(".bar")
       		.on("touchstart", showTooltip);
       		
		figure.selectAll("svg")
			.on("touchstart", startAnimation);
			
	} else {
   		d3.selectAll(".bar")	
   			.on("mouseover", showTooltip)
   			.on("mousemove", moveTooltip)
   			.on("mouseout", hideTooltip);	
   			
		figure.selectAll("svg")
			.on("mousedown", startAnimation);      		
   	}
   	
	if(debug) { console.log("END RENDER BAR HORIZONTAL") };
}

function renderPie(figure, data, category, value, format, color, sort, interpolate, animate, debug) {
	if(debug) { console.log("START RENDER PIE") }; 
	
	var color = colorScale(color);
	
	var svg = figure.select("svg");
		
	var margin = {top: 0, right: 20, bottom: 0, left: 0},
    	width = parseInt(svg.attr("width")) - margin.left - margin.right,
    	height = parseInt(svg.attr("height")) - margin.top - margin.bottom;
    	
	var radius = Math.min(width, height) / 2;
	
	var arc = d3.svg.arc()
    	.outerRadius(radius - 10)
    	.innerRadius(0);
    	
    var pie = d3.layout.pie()
    	.sort(null)
    	.value(function(d) { return d[value]; });
    	
    var chart = svg.append("g")
    	.attr("class", "chart")
		.attr("transform", "translate(" + width/2 + "," + height/2 + ")");
    	
	var g = chart.selectAll(".arc")
		.data(pie(data))
    		.enter().append("g")
      		.attr("class", "arc")
      		.style("opacity", defaultOpacity);

  	g.append("path")
		.attr("d", arc)
		.style("fill", function(d) { return color(d.data[category]); });

	g.append("text")
		.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
		.attr("dy", ".35em")
		.style("text-anchor", "middle")
		.text(function(d) { return d.data[category]; });
		
	if(touch_device) {
       	d3.selectAll(".arc")
       		.on("touchstart", showTooltip);   		  	
	} else {
   		d3.selectAll(".arc")	
   			.on("mouseover", showTooltip)
   			.on("mousemove", moveTooltip)
   			.on("mouseout", hideTooltip);	
   	}
   	
   	if(debug) { console.log("END RENDER PIE") }; 
} 

function renderDonut(figure, data, category, value, format, color, sort, interpolate, animate, debug) {
	if(debug) { console.log("START RENDER DONUT") }; 
	
	var color = colorScale(color);
	
	var svg = figure.select("svg");
		
	var margin = {top: 0, right: 20, bottom: 0, left: 0},
    	width = parseInt(svg.attr("width")) - margin.left - margin.right,
    	height = parseInt(svg.attr("height")) - margin.top - margin.bottom;
    	
	var radius = Math.min(width, height) / 2;
	
	var arc = d3.svg.arc()
    	.outerRadius(radius - 5)
    	.innerRadius((radius-5) * .6);
    	
    var pie = d3.layout.pie()
    	.sort(null)
    	.value(function(d) { return d[value]; });
    	
    var chart = svg.append("g")
    	.attr("class", "chart")
		.attr("transform", "translate(" + width/2 + "," + height/2 + ")");
    	
	var g = chart.selectAll(".arc")
		.data(pie(data))
    		.enter().append("g")
      		.attr("class", "arc")
      		.style("opacity", defaultOpacity);

  	g.append("path")
		.attr("d", arc)
		.style("fill", function(d) { return color(d.data[category]); });

	g.append("text")
		.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
		.attr("dy", ".35em")
		.style("text-anchor", "middle")
		.text(function(d) { return d.data[category]; });
		
	if(touch_device) {
       	d3.selectAll(".arc")
       		.on("touchstart", showTooltip);   		  	
	} else {
   		d3.selectAll(".arc")	
   			.on("mouseover", showTooltip)
   			.on("mousemove", moveTooltip)
   			.on("mouseout", hideTooltip);	
   	}
   	
   	if(debug) { console.log("END RENDER DONUT") }; 
} 

function renderTable(figure, data, category, value, debug) {
	if(debug) { console.log("START RENDER TABLE") };

	var columns = category.concat(value);

    thead = figure.append("thead"),
	tbody = figure.append("tbody");
	
    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
            .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
            .text(function(d) { return d.value; });

	if(debug) { console.log("END RENDER TABLE"); }	
}

function renderTableDeprecated(id, csv, title, debug) {
	var debug = (debug.toLowerCase() == "true");
	if(debug) { console.log("START RENDER TABLE (deprecated)"
								+ "\n\tid: " + id 
								+ "\n\tcsv: " + csv
								+ "\n\ttitle: " + title
								+ "\n\tdebug: " + debug); }
		
	var div = d3.select(csv),
			  data = d3.csv.parse(div.text());
	
	if(debug) { console.log("Loading data async (" + csv + ")"); console.log(data); }
		
	var columns = d3.keys(data[0]);
	
	var table = d3.select('#' + id),
    	caption = table.append("caption"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

	caption.text(title);
	
    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
            .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
            .text(function(d) { return d.value; });
            
    if(debug) { console.log("END RENDER TABLE (deprecated)"); }
}
	
function showTooltip(d) {

	d3.selectAll(".bar").transition()
       	.duration(100)
       	.style("opacity", defaultOpacity);
       	
    d3.selectAll(".arc").transition()
       	.duration(100)
       	.style("opacity", defaultOpacity);
       	
	d3.selectAll(".dot").transition()
       	.duration(100)
       	.style("opacity", 0.0);
       	
    d3.selectAll(".scdot").transition()
       	.duration(100)
       	.style("opacity", defaultOpacity);
       				
	d3.select(this).transition()
		.duration(200)
		.delay(100)
		.style("opacity", 1.0);
  	
  	var dateFormat = d3.time.format("%d-%b-%Y %X");
  			
	tooltip.html(function() {
		var str = "";
		if(d.data != null) {
			for(var e in d.data) {
				var val = d.data[e];
				if(val instanceof Date) {
					val = dateFormat(val);
				}
				str += "<span class='label'>" + e + "</span>" + val + "<br/>";			
			}
		} else {				
			for(var e in d) {
				var val = d[e];
				if(val instanceof Date) {
					val = dateFormat(val);
				}			
				str += "<span class='label'>" + e + "</span>" + val + "<br/>";			
			}
		}
		return str;
	});
		  		
	tooltip
  		.style("left", (d3.event.pageX + 10) + "px")     
        .style("top", (d3.event.pageY) + "px")
        .transition()
  			.duration(750)
            .style("opacity", 0.9);
    
    d3.event.stopPropagation();
    d3.event.preventDefault();
};

function moveTooltip(d) {
	tooltip
		.style("left", (d3.event.pageX + 10) + "px")     
		.style("top", (d3.event.pageY) + "px"); 
		
    d3.event.stopPropagation();
    d3.event.preventDefault();
};

function hideTooltip(d) { 

	d3.selectAll(".bar").transition()
       	.duration(200)
       	.style("opacity", defaultOpacity);
       	
    d3.selectAll(".arc").transition()
       	.duration(200)
       	.style("opacity", defaultOpacity);
       	
    d3.selectAll(".serie").transition()
       	.duration(200)
       	.style("opacity", defaultOpacity);
       	
	d3.selectAll(".dot").transition()
       	.duration(200)
       	.style("opacity", 0.0);
       	
	d3.selectAll(".scdot").transition()
       	.duration(200)
       	.style("opacity", defaultOpacity);
       	
	tooltip.transition()
		.duration(200)
		.style("opacity", 0.0);
    
    d3.event.stopPropagation();
    d3.event.preventDefault();
};

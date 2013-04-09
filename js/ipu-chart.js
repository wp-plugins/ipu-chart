var userAgent = navigator.userAgent.toLowerCase(),
	ios = /iphone|ipod|ipad/.test(userAgent),
	iphone = /iphone/.test(userAgent),
	ipod = /ipod/.test(userAgent),
	ipad = /ipad/.test(userAgent),
	touch_device = window.Touch ? true : false,
	svgSupport = window.SVGSVGElement ? true : false,
	defaultOpacity = 0.7,
	tooltip;

function parserFor(format) {
	format = format.trim();
 	if(format == "i") return parseInt;
 	if(format == "f") return parseFloat;
 	if(format == "s") return function(s) { return s; };
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
 	if(format == "i") return d3.scale.linear();
 	if(format == "f") return d3.scale.linear();
 	if(format == "s") return d3.scale.ordinal();
 	return d3.time.scale();
}
 
function renderChart(id, csv, type, category, value, format, color, style, title, description, sort, img, debug) {
	
	var debug = (debug.toLowerCase() == "true");
	if(debug) { console.log("---------- START RENDERING CHART (" + id + ", " + csv + ", " + type + ") ----------"); };
	if(debug) {
	
		console.log("CLIENT: "
					+ "\n\tuser-agent: " + userAgent
					+ "\n\ttouch device: " + touch_device
					+ "\n\tSVG support: " + svgSupport
					+ "\n\tscreen width/height: " + screen.width + "px/" + screen.height + "px");
					
					
		console.log("CALL RENDER CHART: "
					+ "\n\tid: " + id 
					+ "\n\tcsv: " + csv
					+ "\n\ttype: " + type
					+ "\n\tcategory: " + category
					+ "\n\tvalue: " + value
					+ "\n\tformat: " + format
					+ "\n\tcolor: " + color
					+ "\n\tstyle: " + style
					+ "\n\ttitle: " + title
					+ "\n\tdescription: " + description
					+ "\n\tsort: " + sort
					+ "\n\timg: " + img
					+ "\n\tdebug: " + debug);
	}
	
	if(!svgSupport) {
		
		var figure = d3.select('#' + id);
		figure.attr("style", style);			

		if(img && img.trim() != "") {
		    var width = parseInt(figure.style("width")),
    			height = parseInt(figure.style("height")) - 40;

    		figure.append("figcaption").text(title);		
			image = figure.append("img")
				.attr("src", img)
				.attr("width", width)
				.attr("height", height);
		} else {
			figure.append("p").text("Chart: '" + title + "'");
			figure.append("p")
					.text("Please use a newer, SVG capable browser to view the chart.")
					.attr("style", "color: red; ");
			figure.attr("style", "border: 1px solid lightgray; padding: 1em;");
		}
		
	} else {
		load(id, csv, type, category, value, format, color, style, title, description, sort, img, debug);
	}
}

function load(id, csv, type, category, value, format, color, style, title, description, sort, img, debug) {
    
	if((/^#/).test(csv)) {
		div = d3.select(csv),
		data = d3.csv.parse(div.text());
		if(debug) { console.log("LOADING DATA SYNC (" + csv + ")"); console.log(data); }
		render(id, data, type, category, value, format, color, style, title, description, sort, img, debug);  			
	} else {
		d3.csv(csv, function(error, data) {
			if(debug) { console.log("LOADING DATA ASYNC (" + csv + ")"); console.log(data); }
			if(error) return console.warn(error);
			render(id, data, type, category, value, format, color, style, title, description, sort, img, debug);  			
  		});		
	}
 }
 
function render(id, data, type, category, value, format, color, style, title, description, sort, img, debug) {
    if(debug) { console.log("RENDER (" + id + ")"); };
        
	formats = format.split(',');
	for(var i=0; i<formats.length; i++) { 
		formats[i] = formats[i].trim(); 
	}

    if(debug) { console.log("FORMATS: " + formats); }
    
    if(color.toLowerCase().trim() == "auto") {
    	colors = d3.scale.category20();
    } else {
		colors = color.split(',');
		for(var i=0; i<colors.length; i++) { 
			colors[i] = colors[i].trim();
		}
		colors=d3.scale.ordinal().range(colors);
	}
    
    if(debug) { console.log("COLOR: " + color); }
    
	catParser = parserFor(formats[0]);
	valParser = parserFor(formats[1]);

	/* Not supported by IE 
 	data.forEach(function(d) {
    	d[category] = catParser(d[category]);
    	d[value] = valParser(d[value]);
    });
    */
        
    for(var i=0; i<data.length; i++) {
    	data[i][category] = catParser(data[i][category]);
    	data[i][value] = valParser(data[i][value]);
    }

    if(debug) { console.log("PARSED DATA: "); console.log(data); }
    
	var figure = d3.select('#' + id);
    	
	var	svg = figure.append("svg"),
		meta = svg.append("g").attr("class", "meta");
		//chart = svg.append("g").attr("class", "main");
	
	var figcaption = figure.append("figcaption").text(title);	 
	meta.append("title").text(title);
	meta.append("description").text(description);
	figure.attr("style", style);
		
    var width = parseInt(figure.style("width")),
    	height = parseInt(figure.style("height")) - parseInt(figcaption.style("height")) - 20;

    if(debug) { console.log("SVG \n\twidth: " + width + "\n\theight: " + height); }
    
	svg.attr("viewBox", "0 0 " + width + " " + height)
    	.attr("preserveAspectRatio", "xMidYMid meet")
       	.attr("width", width)
       	.attr("height", height);
    
	if(tooltip == null) {
		tooltip = d3.select("body").append("div")
    		.attr("class", "iputooltip")
        	.style("opacity", 0.0)
        	.style("width", function() {return screen.width > 320 ? "260px" : "160px"; })
    		.html("<p>tooltip</p>")
    		.on("touchstart", hideTooltip);
    }
    
    if(type.toLowerCase().trim() == "bar") 
    	renderBar(svg, width, height, data, category, value, formats, colors, debug);
    	
    else if(type.toLowerCase().trim() == "bar.horizontal") 
    	renderBarHorizontal(svg, width, height, data, category, value, formats, colors, debug);
    	 	 
    else if(type.toLowerCase().trim() == "pie") 
    	renderPie(svg, width, height, data, category, value, formats, colors, debug);
    	
	else if(type.toLowerCase().trim() == "line") 
    	renderLine(svg, width, height, data, category, value, formats, colors, debug);
}

function renderTable(id, csv, title, debug) {
	var debug = (debug.toLowerCase() == "true");
	if(debug) { console.log("---------- START RENDER TABLE ----------"
								+ "\n\tid: " + id 
								+ "\n\tcsv: " + csv
								+ "\n\ttitle: " + title
								+ "\n\tdebug: " + debug); }
		
	var div = d3.select(csv),
			  data = d3.csv.parse(div.text());
	
	if(debug) { console.log("LOADING DATA ASYNC (" + csv + ")"); console.log(data); }
		
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
            
    if(debug) { console.log("END RENDER TABLE"); }
}

function renderBar(svg, width, height, data, category, value, formats, colors, debug) {
	if(debug) { console.log("START RENDER BAR") };
	
	var color = d3.scale.ordinal().range(colors);
	
	var margin = {top: 20, right: 20, bottom: 40, left: 80},
    	width = width - margin.left - margin.right,
    	height = height - margin.top - margin.bottom;
    	
	var x = scaleFor(formats[0])
    	.rangeRoundBands([0, width], .1);

	var y = scaleFor(formats[1])
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

	svg.attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom);
       
    var chart = svg.append("g")
    	.attr("class", "chart")
       	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");  	

	chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	chart.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + width + ", 0)")
		.call(yAxis);
      	
	chart.selectAll(".bar")
		.data(data)
		.enter().append("rect")
      		.attr("class", "bar")
      		.attr("x", function(d) { return x(d[category]); })
      		.attr("width", x.rangeBand())
      		.attr("y", function(d) { return y(d[value]); })
      		.attr("height", function(d) { return height - y(d[value]); })
      		.style("fill", function(d) { return colors(d[category]); })
      		.style("opacity", defaultOpacity);
      		
	if(touch_device) {
       	d3.selectAll(".bar")
       		.on("touchstart", showTooltip);
	} else {
   		d3.selectAll(".bar")	
   			.on("mouseover", showTooltip)
   			.on("mousemove", moveTooltip)
   			.on("mouseout", hideTooltip);	
   	}
   	
   	if(debug) { console.log("END RENDER BAR") };

} 

function renderBarHorizontal(svg, width, height, data, category, value, formats, colors, debug) {
	if(debug) { console.log("START RENDER BAR HORIZONTAL") };
	
	var color = d3.scale.ordinal().range(colors);
	
	var margin = {top: 20, right: 20, bottom: 40, left: 80},
    	width = width - margin.left - margin.right,
    	height = height - margin.top - margin.bottom;

	var x = scaleFor(formats[1])
    	.range([width, 0]);

	var y = scaleFor(formats[0])
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

	svg.attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom);
       
    var chart = svg.append("g")
    	.attr("class", "chart")
       	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");  	

	chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + 0 + ")")
		.call(xAxis);

	chart.append("g")
		.attr("class", "y axis")
		.call(yAxis);
      	
	chart.selectAll(".bar")
		.data(data)
		.enter().append("rect")
      		.attr("class", "bar")
      		.attr("x", 0)
      		.attr("y", function(d) { return y(d[category]); })
      		.attr("height", y.rangeBand())
      		.attr("width", function(d) { return x(d[value]); })
      		.style("fill", function(d) { return colors(d[category]); })
      		.style("opacity", defaultOpacity);
      		
	if(touch_device) {
       	d3.selectAll(".bar")
       		.on("touchstart", showTooltip);
	} else {
   		d3.selectAll(".bar")	
   			.on("mouseover", showTooltip)
   			.on("mousemove", moveTooltip)
   			.on("mouseout", hideTooltip);	
   	}
	if(debug) { console.log("END RENDER BAR HORIZONTAL") };
}    	   	
    	
function renderPie(svg, width, height, data, category, value, formats, colors, debug) {
	if(debug) { console.log("START RENDER PIE") }; 
	
	var radius = Math.min(width, height) / 2;
		
	var color = d3.scale.ordinal().range(colors);
	
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
		.style("fill", function(d) { return colors(d.data[category]); });

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
 
function renderLine(svg, width, height, data, category, value, formats, colors, debug) {
	if(debug) { console.log("START RENDER LINE"); }
	
	var margin = {top: 20, right: 20, bottom: 40, left: 80},
    	width = width - margin.left - margin.right,
    	height = height - margin.top - margin.bottom;
    	
    var x = scaleFor(formats[0])
    	.range([0, width]);

	var y = scaleFor(formats[1])
    	.range([height, 0]);
    	
	var xAxis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom")
    	.tickSize(height);

	var yAxis = d3.svg.axis()
    	.scale(y)
    	.orient("left")
    	.tickSize(width);;
    	
	var line = d3.svg.line()
    	.x(function(d) { return x(d[category]); })
    	.y(function(d) { return y(d[value]); });
    	
	x.domain(d3.extent(data, function(d) { return d[category]; }));
  	y.domain(d3.extent(data, function(d) { return d[value]; }));
  	
	svg.attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom);
       
    var chart = svg.append("g")
    	.attr("class", "chart")
       	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");  	

	chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + 0 + ")")
		.call(xAxis);

	chart.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + width + ", 0)")
		.call(yAxis);

  	chart.append("path")
		.datum(data)
		.attr("class", "line")
		.style("stroke", function(d) { return colors(d[category]); })
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
       	
	d3.selectAll(".dot").transition()
       	.duration(200)
       	.style("opacity", 0.0);
       	
	tooltip.transition()
		.duration(200)
		.style("opacity", 0.0);
    
    d3.event.stopPropagation();
    d3.event.preventDefault();
};
  			
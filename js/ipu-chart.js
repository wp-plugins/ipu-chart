var userAgent = navigator.userAgent.toLowerCase(),
	ios = /iphone|ipod|ipad/.test(userAgent),
	iphone = /iphone/.test(userAgent),
	ipod = /ipod/.test(userAgent),
	ipad = /ipad/.test(userAgent),
	touch_device = window.Touch ? true : false,
	svgSupport = window.SVGSVGElement ? true : false,
	pluginPath = getPluginPath(),
	defaultOpacity = 0.8,
	tooltip;

function getPluginPath() {
    var scripts = document.getElementsByTagName('script');
    var path = '';
    if(scripts && scripts.length>0) {
        for(var i in scripts) {
            if(scripts[i].src && scripts[i].src.indexOf("js/ipu-chart.js") > 0) {
            	file =  scripts[i].src;
                path = file.substring(0, file.indexOf("js/ipu-chart.js"));
                break;
            }
        }
    }
    return path;
};

function toArray(l) {
	ll = l.split(',');
	for(var i=0; i<ll.length; i++) { 
		ll[i] = ll[i].trim(); 
	}
	return ll;
}

var dateFormat = d3.time.format("%d-%b-%Y");
var numberFormat = d3.format("n");
  	
function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function parserFor(format) {
	format = format.trim();
	if(format == "n" || format == "number") return parseFloat;
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
	if(format == "n" || format == "number") return d3.scale.linear();
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

function createFigureElement(id, title, description, style, version, debug) {

	if(debug) console.log("start createFigureElement(id=" + id + ")");
	
	var figure = d3.select('#' + id);
	
	if(debug) { console.log("createFigureElement: selected figure is:"); console.log(figure); }
	
	figure.attr("style", style);

	var	svg = figure.append("svg");
	var meta = svg.append("g")
		.attr("class", "meta");
		
	meta.append("title").text(title);
	meta.append("description").text(description);
	meta.append("a")
		.attr("href", "https://www.ipublia.com/products/ipu-chart-svg-chart-library/")
		.text(version + " (IPUC418032107)");
		
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
					+ "\n\tversion: " + version
					+ "\n\tpath: " + getPluginPath());
					
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
		figure = createFigureElement(id, title, description, style, version, debug);
		if(!svgSupport) return renderNoSvgSupport(figure, img);
		createTooltip();
	}
	
	category = toArray(category);
	value = toArray(value);
	format = toArray(format);
	color = toArray(color);
	animate = toArray(animate);
	sort = (sort.toLowerCase() == "true");
	
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
    	renderBar(figure, data, category[0], value[0], format, color, sort, interpolate, animate, debug);
    	
    else if(type.toLowerCase().trim() == "bar.horizontal") 
    	renderBarHorizontal(figure, data, category[0], value[0], format, color, sort, interpolate, animate, debug);
    	 	 
    else if(type.toLowerCase().trim() == "pie") 
    	renderPie(figure, data, category[0], value[0], format, color, sort, interpolate, animate, debug);
    	
    else if(type.toLowerCase().trim() == "donut") 
    	renderDonut(figure, data, category[0], value[0], format, color, sort, interpolate, animate, debug);
    	
	else if(type.toLowerCase().trim() == "line") 
    	renderLine(figure, data, category, value, format, color, sort, interpolate, animate, debug);
    	
    else if(type.toLowerCase().trim() == "scatter") 
    	renderScatter(figure, data, category, value, format, color, sort, interpolate, animate, debug);
    	
    else if(type.toLowerCase().trim() == "bubble") 
    	renderBubble(figure, data, category, value, format, color, sort, interpolate, animate, debug);
    	
    else if(type.toLowerCase().trim() == "map.world.countries") 
    	renderMapWorldCountries(figure, data, category, value, format, color, sort, interpolate, animate, debug);
    	
    else if(type.toLowerCase().trim() == "table") 
    	renderTable(figure, data, category, value, debug);
    	
    else if(type.toLowerCase().trim() == "line.multi") 
    	renderLineMulti(figure, data, category, value, format, color, sort, interpolate, animate, debug);
}

function renderMapWorldCountries(figure, data, category, value, format, color, sort, interpolate, animate, debug) {
	if(debug) console.log("START RENDER WORLD MAP COUNTRIES");
	
	var color = d3.scale.log()
		.domain(d3.extent(data, function(d) { return d[value[0]] }))
		.range([color[0], color[1]]);
				
	var svg = figure.select("svg");
	var g = svg.select("g.main");

	var margin = {top: 1, right: 1, bottom: 1, left: 1},
    	width = parseInt(svg.attr("width")) - margin.left - margin.right,
    	height = parseInt(svg.attr("height")) - margin.top - margin.bottom,
    	centered;
	
	var projection = d3.geo.kavrayskiy7()
    	.scale(105)
    	.translate([width / 2, height / 2])
    	.precision(.1);

	var path = d3.geo.path()
    	.projection(projection);

	var graticule = d3.geo.graticule();

	g.append("defs").append("path")
		.datum({type: "Sphere"})
		.attr("id", "sphere")
		.attr("d", path);

	g.append("use")
		.attr("class", "stroke")
		.attr("xlink:href", "#sphere");

	g.append("use")
		.attr("class", "fill")
		.attr("xlink:href", "#sphere");

	g.append("path")
		.datum(graticule)
		.attr("class", "graticule")
		.attr("d", path);
 
	queue()
		.defer(d3.json, pluginPath + "raw/world-110m.json")
		.defer(d3.tsv, pluginPath + "raw/world-ISO-3166-1-numeric.tsv")
		.await(ready);
 
	function ready(error, world, names) {
		var globe = {type: "Sphere"},
		countries = topojson.object(world, world.objects.countries).geometries,
		borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a.id !== b.id; });
       	
		countries = countries.filter(function(d) {
			return names.some(function(n) {
				if (d.id == n["ISO-3166-1"]) return d.name = n.name;
			});
		}).sort(function(a, b) {
    		return a.name.localeCompare(b.name);
  		});
  

		data.forEach(function(d, i) {
			countries.forEach(function(c, j) {
				if (c.id == d["ISO-3166-1"]) {
					value.forEach(function(v, k) {
						c[v] = d[v];
					});				
					return;
				}
			});
  		});
    
		g.selectAll(".country")
			.data(countries)
			.enter().insert("path", ".graticule")
			.attr("class", "country")
			.attr("d", path)
			.style("fill", function(d, i) { return d[value[0]] ? color(d[value[0]]) : "gray"; })
			.style("opacity", defaultOpacity);

		g.insert("path", ".graticule")
			.datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
			.attr("class", "boundary")
			.attr("d", path);
						
		if(touch_device) {
       		g.selectAll(".country")
       			.on("touchstart", showTooltip);
		} else {
			g.selectAll(".country")	
				.on("mouseover", showTooltip)
				.on("mousemove", moveTooltip)
				.on("mouseout", hideTooltip)
				.on("click", zoom);	
   		}
   		
		function zoom(d) {
  			var x, y, k;
  
  			if (d && centered !== d) {
				var centroid = path.centroid(d);
				x = centroid[0];
				y = centroid[1];
				k = 4;
				centered = d;
			} else {
				x = width / 2;
				y = height / 2;
				k = 1;
				centered = null;
			}

			g.selectAll(".country")
				.classed("active", centered && function(d) { return d === centered; });

			g.transition()
				.duration(1000)
				.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
				.style("stroke-width", 1.5 / k + "px");
		}
			
		if(debug) { console.log("END RENDER WORLD MAP COUNTRIES") };
	};
}

function renderBubble(figure, data, category, value, format, color, sort, interpolate, animate, debug) {
	if(debug) { console.log("START RENDER BUBBLE"); }
	
	var color = colorScale(color);
	
	var svg = figure.select("svg");
	
	var margin = {top: 8, right: 8, bottom: 8, left: 2},
    	width = parseInt(svg.attr("width")) - margin.left - margin.right,
    	height = parseInt(svg.attr("height")) - margin.top - margin.bottom;

	var g = svg.select("g.main");
		
	var pack = d3.layout.pack()
    	.size([width, height])
    	.padding(1.5)
   	 	.value(function(d) { return d[value[0]]; })
   	 	.sort(function(a, b) { return sort ? d3.descending(a.value, b.value) : a.value });
	
	var data = { name: "root", children: data };
		
	var node = g.data([data]).selectAll(".node")
		.data(pack.nodes)
	.enter().append("g")
		.attr("class", function(d) { return d.children ? "node" : "leaf node"; })
		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
		.style("opacity", function(d) { return d.r != 0 ? defaultOpacity : 0; })
		.attr("d", function(d) { return d.__category = category; })
		.attr("d", function(d) { return d.__value = value; });
			
	node.append("circle")
		.attr("r", function(d) { return d.r; })
		.style("display", function(d) { return d.name != "root" ? "inline" : "none"; })
		.style("fill", function(d) { return color(d[category]); })
		.style("opacity", defaultOpacity);

	node.append("text")
		.attr("dy", ".3em")
		.style("text-anchor", "middle")
		.text(function(d) { return d[category]; });	
		
	var series = g.selectAll(".series")
		.data(value)
			.enter().append("g")
			.attr("class", "series")
		.attr("transform", function(d, i) { return "translate(-12," + (12 + i * 16) + ")"; });

	series.append("rect")
		.attr("x", width - 12)
		.attr("width", 12)
		.attr("height", 12)
		.style("stroke", "lightgray")
		.style("fill", function(d, i) { return i == 0 ? "black" : "lightgray"})
		.on("click", changeSerie);
		
	series.append("text")
		.attr("x", width - 18)
		.attr("y", 5)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.style("opacity", "0.6")
		.text(function(d) { return d; });
		
	function changeSerie(d, i) {
				
		d3.selectAll(".series rect").style("fill", "lightgray");
		d3.select(this).style("fill", "black");
		
		//change pack value
		pack.value(function(d) { return d[value[i]]; });
 
		// rebind data
		g.data([data]).selectAll(".leaf .node")
			.data(pack.nodes);	
		
		node.transition()
			.duration(3000)
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
			.style("opacity", function(d) { return d[value[i]] != 0 ? defaultOpacity : 0; })
			.select("circle")
				.attr("r", function(d) { return d.r; });				
	}
		
	if(touch_device) {
       	d3.selectAll(".leaf circle")
       		.on("touchstart", showTooltip);
	} else {
   		d3.selectAll(".leaf circle")	
   			.on("mouseover", showTooltip)
   			.on("mousemove", moveTooltip)
   			.on("mouseout", hideTooltip);
   	}
   	if(debug) { console.log("END RENDER BUBBLE") }; 
}
	
function renderScatter(figure, data, category, value, format, color, sort, interpolate, animate, debug) {
	if(debug) { console.log("START RENDER SCATTER"); }
	
	var color = colorScale(color);
	
	var svg = figure.select("svg");

	var margin = {top: 20, right: 20, bottom: 40, left: d3.max(data, function(d) { return 8 * d[value[1]].toString().length; })},
    	width = parseInt(svg.attr("width")) - margin.left - margin.right,
    	height = parseInt(svg.attr("height")) - margin.top - margin.bottom;
    	
    var x = scaleFor(format[1])
    	.range([0, width]);

	var y = scaleFor(format[2])
    	.range([height, 0]);
    	
	var xAxis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom")
    	.tickSize(height)
    	.ticks(8);

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
	
	var margin = {top: 20, right: 10, bottom: 40, left: d3.max(data, function(d) { return 8*d[value].toString().length; })},
    	width = parseInt(svg.attr("width")) - margin.left - margin.right,
    	height = parseInt(svg.attr("height")) - margin.top - margin.bottom;
    	
    var x = scaleFor(format[0])
    	.range([0, width]);

	var y = scaleFor(format[1])
    	.range([height, 0]);
    	
	var xAxis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom")
    	.tickSize(height)
    	.ticks(8);

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

    var chart = svg.select(".main").append("g")
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

	var margin = {top: 20, right: 20, bottom: 40, left: d3.max(data, function(d) { return 8*d[value].toString().length; })},
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
	
	var margin = {top: 20, right: 30, bottom: 40, left: d3.max(data, function(d) { return 6*d[category].toString().length; })},
    	width = parseInt(svg.attr("width")) - margin.left - margin.right,
    	height = parseInt(svg.attr("height")) - margin.top - margin.bottom;

	var x = scaleFor(format[1])
    	.range([width, 0]);

	var y = scaleFor(format[0])
    	.rangeRoundBands([0, height], .1);
    	
	var xAxis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom")
    	.tickSize(height)
    	.ticks(6);

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
            .text(function(d) { return isNumber(d.value) ? numberFormat(d.value) : d.value; });

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
            .text(function(d) { return isNumber(d.value) ? numberFormat(d.value) : d.value; });
            
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
       	
    d3.selectAll(".country").transition()
       	.duration(100)
       	.style("opacity", defaultOpacity);

    d3.selectAll(".leaf circle").transition()
       	.duration(100)
       	.style("opacity", defaultOpacity);
     					
	d3.select(this).transition()
		.duration(100)
		.delay(50)
		.style("opacity", 1.0);
 	 
  	if(d.__category) {
  		tooltip.html(function() {
  			var str = "<p style='margin: 0.3em 0 0.3em 0;'><span class='label'>" + d.__category + "</span>" + d[d.__category] + "<p>";
  			for(var e in d.__value) {
				var val = d[d.__value[e]];
				if(val instanceof Date) {
						val = dateFormat(val);
					} else if(isNumber(val)) {
						val = numberFormat(val);
					}
  				str += "<p style='margin: 0.3em 0 0.3em 0;'><span class='label'>" + d.__value[e] + "</span>" + val + "<br/></p>";	
  			}
  			return str;
  		});
  	} else { 	
		tooltip.html(function() {
			var str = "";
			if(d.data != null) {
				for(var e in d.data) {
					var val = d.data[e];
					if(val instanceof Date) {
						val = dateFormat(val);
					} else if(isNumber(val)) {
						val = numberFormat(val);
					}
					str += "<p style='margin: 0.3em 0 0.3em 0;'><span class='label'>" + e + "</span>" + val + "</p>";			
				}
			} else {
				for(var e in d) {
					var val = d[e];
					if(val instanceof Date) {
						val = dateFormat(val);
					} else if(isNumber(val)) {
						val = numberFormat(val);
					}					
					if(d.type == "Polygon" || d.type == "MultiPolygon") {
						if(e == 'id') {
							str += "<p><span class='ISO-3166-1'>" + val + "</span></p>";
						} else if(e != 'type' && e != 'coordinates') {
							str += "<p style='margin: 0.3em 0 0.3em 0;'><span class='label'>" + e + "</span>" + val + "</p>";
						}
					} else {
						str += "<p style='margin: 0.3em 0 0.3em 0;'><span class='label'>" + e + "</span>" + val + "</p>";
					}
				}
			}
			return str;
		});
	}
		  		
	tooltip
  		.style("left", (d3.event.pageX + 10) + "px")     
        .style("top", (d3.event.pageY) + "px")
        .transition()
  			.duration(500)
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
       	.duration(100)
       	.style("opacity", defaultOpacity);
       	
    d3.selectAll(".arc").transition()
       	.duration(100)
       	.style("opacity", defaultOpacity);
       	
    d3.selectAll(".serie").transition()
       	.duration(100)
       	.style("opacity", defaultOpacity);
       	
	d3.selectAll(".dot").transition()
       	.duration(100)
       	.style("opacity", 0.0);
       	
	d3.selectAll(".scdot").transition()
       	.duration(100)
       	.style("opacity", defaultOpacity);
       	
	d3.selectAll(".country").transition()
       	.duration(100)
       	.style("opacity", defaultOpacity);

    d3.selectAll(".leaf circle").transition()
       	.duration(100)
       	.style("opacity", defaultOpacity);
      	
	tooltip.transition()
		.duration(100)
		.style("opacity", 0.0);
    
    d3.event.stopPropagation();
    d3.event.preventDefault();
};

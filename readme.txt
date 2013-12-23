=== Plugin Name ===
Contributors: thmufl
Tags: chart, chart editor, bar chart, pie chart, line chart, donut chart, scatter chart, bubble chart, world map, map, countries, animation, quotes, diagram, csv, tsv, json, excel, numbers, svg, d3, d3js
Requires at least: 3.0.1
Tested up to: 3.8
Stable tag: 1.0.1
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Add beautiful, interactive live charts to your blog!

== Description ==

IPU-Chart is a Wordpress shortcode to create many different chart types inside your blog or page. It works perfectly on large computer screens as well as on tablets and smaller mobile screens. The data to display can reside directly in the document or it can be fetched from a remote service.

IPU-Chart has many options to style a chart. Add your own color palette or use the functions to generate color palettes that come with the plugin.

= Features =

* Creates bar, line, pie, donut, scatter, bubble and world map charts
* Supports data in json, csv or tsv format (Excel, Numbers)
* Lets you enter the data directy in a blog or page
* Loads the data from a remote service (database)
* Updates the data automatically if desired
* Has many options to style a chart with css or built-in color functions 

With the [IPU-Chart Multi Series Extension](https://www.ipublia.com/downloads/ipu-chart-multi-series-charts-for-wordpress/) IPU-Chart supports also multi series charts.

= Usage =

To display a bar or line chart inside a post or page add a div element with an id (that’s where the chart will be rendered) and enter the template configuration inside the [ip4] shortcode.

Data defined inside the document:
<pre><code>
<div id="kcal" style="width:90%; font-size:0.8em"></div>
...

[ip4]{
    "template": ip4.barChart(),
    "parentElement": "#kcal",
    "data": {
        "reader": ip4.dataReader()
            .data([ {"x": "Apple", "y": 55 },
                    {"x": "Avocado", "y": 145 },
                    {"x": "Banana", "y": 95 },
                    {"x": "Grapefruit", "y": 30 },
                    {"x": "Kiwi", "y": 55 } ])
    },
    "d3": {
        "yLabel": "kilo calories (kcal)"
    }
}[/ip4]
</code></pre>

To display a line or pie chart just enter <code>ip4.lineChart()</code> or <code>ip4.pieChart()</code> as template.

Data refresh the data from an url every 20 seconds:
<pre><code>
<div id="kcal" style="width:90%; font-size:0.8em"></div>
...

[ip4]{
    "template": ip4.barChart(),
    "parentElement": "#kcal",
    "data": {
        "reader": ip4.dataReader()
                      .uri("http://example.org/kcal")
                      .interval(20000)
    },
    "d3": {
        "yLabel": "kilo calories (kcal)"
    }
}[/ip4]
</code></pre>

<p><strong>Note for existing users</strong>: The attribute-based, old interface is still included in the plugin.</p>

= Further Information =

1. The [ip4 User Guide](https://www.ipublia.com/support/docs/ip4-user-guide/) for detailed descriptions and examples.
1. The [IPU-Chart User Guide](https://www.ipublia.com/support/docs/ipu-chart-for-wordpress-user-guide/) for the legacy interface.
1. The [Support Forum](https://www.ipublia.com/support/forums/forum/ipu-chart-for-wordpress-basic/).

== Installation ==

1. Upload `ipu-chart` to the `/wp-content/plugins/` directory
1. Activate the plugin through the 'Plugins' menu in WordPress

== Frequently Asked Questions ==

For questions or issues with IPU-Chart please use these support channels:

1. [ip4 User Guide](https://www.ipublia.com/support/docs/ip4-user-guide/)
1. [IPU-Chart User Guide](https://www.ipublia.com/support/docs/ipu-chart-for-wordpress-user-guide/)
1. [Support Forum](https://www.ipublia.com/support/forums/forum/ipu-chart-for-wordpress-basic/)

== Screenshots ==

1. Bar Chart
2. Pie Chart
3. Line Chart
4. Grouped Bar Chart (Extension)
5. Stacked Bar Chart (Extension)
6. Multi Line Chart (Extension)
7. Includes many color palettes

== Changelog ==
= 0.95.1 =
* Bug fix

= 0.95 =
* Pie Charts with ip4 interface added
* Stacked Bar Charts with ip4 interface added (Extension)
* Bug fixes and speed enhancements

= 0.9 =
* Line charts with ip4 interface added
* Changed group/value data attributes for bar charts to x/y
* Minor bug fixes

= 0.8.1 =
* Missing libraries added

= 0.8 =
* ip4 template engine
* json configuration for bar charts
* automatic data updates via definable update interval
* color palettes and color functions

= 0.7.3 =
* Fixed tooltips in Google Chrome.
* Fixed license activation problems with multi series extension.
* Tested with WordPress 3.6

= 0.7.2 =
* Minor bug fixes and name changes.

= 0.7.1 =
* Support for negative values in horizontal bar charts added.
* Second shortcode set with prefix 'ipu-' added.
* Support for multi-series extension added.

= 0.7 =
* Support for json added.
* Support for data adapters added.
* Minor layout changes (tooltip).

= 0.6.2 =
* Better calculation of left margin for bar, scatter and line charts
* Update for bubble charts with 0 values in the data series
* Sor for bubble charts

= 0.6.1 =
* Minor update for interoperability with the editor.

= 0.6 =
* Bubble charts added

= 0.5.1 =
* Patch for number formats

= 0.5 =
* World Map chart type (map.world.countries) added
* number (n) as format added
* Improvements in formatting numbers

= 0.4.1 =
* Support for tab separated (tsv) data added
* [tsv] shortcode added

= 0.4 =
* Scatter charts added
* Shortcodes inside [csv][/csv] are processed now
* Minor bug fixes

= 0.3.3 =
* Bug fixes documentation

= 0.3.1 =
* Labels for x- and y-axis added
* Some bugs fixes

= 0.3 =
* Donut charts added
* Attribute 'interpolate' added
* Attribute 'animate' added
* Enhanced error handling when loading csv data

= 0.2 =
* Pie charts added
* Line charts added
* Vertical bar charts added
* Support for remote cvs loading added
* Attribute 'style' added
* Attribute 'img' added
* Changes in format definitions

= 0.1 =
* Initial version with horizontal bar charts

== Upgrade Notice ==

= 1.0 =
* Added ip4.dataReader
* Redefined data adapters (integrated with data reader)
* Enhanced error handling
* Enhanced template functionality


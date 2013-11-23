=== Plugin Name ===
Contributors: thmufl
Tags: chart, chart editor, bar chart, pie chart, line chart, donut chart, scatter chart, bubble chart, world map, map, countries, animation, quotes, diagram, csv, tsv, json, excel, numbers, svg, d3, d3js
Requires at least: 3.0.1
Tested up to: 3.7.1
Stable tag: 0.8
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Add beautiful, interactive live charts to your blog!

== Description ==

IPU-Chart is a Wordpress shortcode to create many different chart types inside your blog or page. It is based on the <strong>ip4</strong> template engine and works perfectly on large computer screens as well as on tablets and smaller mobile screens. The data to display can reside directly in the document or it can be fetched from a remote service. With version 0.8 a data update interval can be defined.

IPU-Chart has many options to style a chart. Add your own color palette or use the functions to generate color palettes that come with the plugin.

= Features =

* Creates bar, pie, donut, line, scatter, bubble and world map charts
* Supports data in json, csv or tsv format
* Lets you enter the data directy in a blog or page
* Loads the data from a remote service
* Updates the data automatically if desired
* Has many options to style a chart with css or built-in color functions 

With the [IPU-Chart Multi Series Extension](https://www.ipublia.com/products/ipu-chart-multi-series-charts-for-wordpress/) IPU-Chart supports also multi series charts.

= Usage =

To display a bar chart inside a post or page add a div element with an id (that’s where the chart will be rendered) and enter the template configuration inside the [ip4] shortcode.

Data defined inside the document:
<pre><code>
<div id="kcal"></div>
...

[ip4]{
    "template": ip4.barChart(),
    "parentElement": "#kcal",
    "data": {
        "value": [
           {"group": "Apple", "value": 55 },
           {"group": "Avocado", "value": 145 },
           {"group": "Banana", "value": 95 },
           {"group": "Grapefruit", "value": 30 },
           {"group": "Kiwi", "value": 55 },
           {"group": "Mango", "value": 65 },
           {"group": "Orange", "value": 45 }
       ]},
    "d3": {
        "yLabel": "kilo calories (kcal)"
    }
}[/ip4]
</code></pre>

Data loaded from an url:
<pre><code>
<div id="kcal"></div>
...

[ip4]{
    "template": ip4.barChart(),
    "parentElement": "#kcal",
    "data": { "uri": "http://example.org/kcal" },
     "d3": {
        "yLabel": "kilo calories (kcal)"
    }
}[/ip4]
</code></pre>

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

1. Bar chart (with a tooltip)
2. Horizontal bar chart
3. Pie chart
4. Donut chart
5. Line chart
6. Interpolated line chart
7. Scatter chart
8. Line chart with an alternative layout
9. World map chart
10. Bubble chart
11. IPU-Chart Editor

== Changelog ==

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

= 0.8 =
* ip4 template engine added
* json configuration for bar charts

= 0.7.3 =
* Fixed tooltips in Google Chrome.
* Fixed license activation problems with multi series extension.
* Tested with WordPress 3.6

= 0.7.2 =
* Minor bug fixes and name changes.

= 0.7.1 =
This version adds support for negative values for horizontal bar charts. A second shortcode set with the prefix 'ipu-' was added for interoperability with some plugins and themes.

= 0.7 =
* Support for json added.
* Support for data adapters added.
* Minor layout changes (tooltip).

= 0.6.2 =
* Better calculation of left margin for bar, scatter and line charts
* Update for bubble charts with 0 values in the data series
* Sort for bubble charts

= 0.6.1 =
* Minor update for the interoperability with the IPU-Chart Editor

= 0.6 =
* Support for animated, multi-series bubble charts added

= 0.5.1 =
* Patch for number formats

= 0.5 =
* World Map chart type (map.world.countries) added
* number (n) as format added
* Improvements in formatting numbers

= 0.4.1 =
* [tsv] shortcode added for better Excel compability (use it like the [csv] but with tab separated data)
* Tables can now be defined with [chart type="table" ...]. The columns to display can now be choosen with the 'category' and 'value' attributes. 
* The [table] shortcode is still supported but deprecated.

= 0.4 =
Scatter charts added.
Shortcodes inside [csv][/csv] are processed now.
Minor bug fixes.

= 0.3.3 =
This version adds bug fixes in the documentation.

= 0.3.1 =
This version adds labels for x- and y-axis and some bug fixes.

= 0.3 =
This version adds support for donut charts. Line chars can be interpolated. Bar charts can be animated (click or tap the bar charts to start the animation).

= 0.2 =
This version adds support for pie and line charts. Furthermore formats for dates, integers and floats can be specified.

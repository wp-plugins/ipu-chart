=== Plugin Name ===
Contributors: thmufl
Tags: chart, chart editor, bar chart, pie chart, line chart, donut chart, scatter chart, bubble chart, world map, map, countries, animation, quotes, diagram, csv, tsv, excel, numbers, svg, d3, d3js
Requires at least: 3.0.1
Tested up to: 3.5.1
Stable tag: 0.6.2
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Creates SVG based, animated bar, pie, donut, line, scatter, bubble and world map charts out of your spreadsheet data. A powerful, easy to use shortcode. And even easier with the free [IPU-Chart Editor Online](https://www.ipublia.com/support/ipu-chart-editor-online/)!

== Description ==

IPU-Chart is an easy to use shortcode that creates SVG based bar, pie, donut, line, scatter, bubble and world map charts out of your csv (comma separated) or tsv (tab separated) data.

The plugin allows you to load the data to display as a chart from a remote service that delivers csv or tsv formatted data. You can also export you data from favorite spreadsheet application (Excel, Numbers, Open Office) and display it as a chart in your blog or page.

To create complex chart definitions and preview the immedialely use the free [IPU-Chart Editor Online](https://www.ipublia.com/support/ipu-chart-editor-online/) service.

IPU-Chart is based on [SVG](http://www.w3.org/TR/SVG/) and [D3](http://d3js.org/). It works perfectly on large computer screens as well as on tablets and smaller mobile screens. For browsers that do not support SVG an alternative image can be set.

The styling of all chart types can be done precisely and easily with css.

= Features =

* Create bar, pie, donut, line, scatter, bubble and world map charts
* Enter the csv/tsv data directy in you blog or page
* Load the csv/tsv data from a remote location
* [IPU-Chart Editor Online](https://www.ipublia.com/support/ipu-chart-editor-online/) to easily define the shortcodes.
* Create multiple views of the data
* Style the charts with css
* Tooltip for chart details (see screenshots)
* Animated multi series bubble charts
* Animated world map and bar charts
* Define colors and number formats of the chart
* Create an additional table view of the data

= Usage =

First, define your data. You can create it immediately in WordPress, use our [IPU-Chart Editor Online](https://www.ipublia.com/support/ipu-chart-editor-online/) service or copy and paste it from an export of your favourite spreadsheet application. Example:

<pre>
[csv id='data']Country,Population
China,1343.24
India,1205.07
USA,313.85
Indonesia,248.22
Brazil,205.72[/csv]
</pre>

Second, define the chart. Reference the csv (or tsv). Set the chart type and the category and value column. Define the format (string, number, integer, float or date) of the category and value columns. Enter a title and a description for the chart:

<pre>
[chart csv='#data' 
       type='bar' 
       category='Country'
       value='Population' 
       format='string, number'
       title='Top five most populous countries of the world...' 
       description='The top five most populous countries of the world...'
       animate='medium']
</pre>

**Important:** Please enter the attributes in one line without the linefeeds (otherwise WordPress will not understand the shortcode). The linefeeds in the example are for legibility only.

But the data can of course also be requested by url:

<pre>
[chart tsv='https://www.ipublia.com/downloads/sales.txt'
       type='line'
       category='Date'
       value='Sales ($)'
       format='dd.mm.yy, number'
       color='green'
       title='Sales of the week']
</pre>

This allows you to load the data from a remote data service and display it easily as a chart.

Have a look at the [User Guide](https://www.ipublia.com/support/docs/ipu-chart-for-wordpress-user-guide/ "IPU-Chart User Guide") of the plugin. It contains a [Quick Start](https://www.ipublia.com/support/docs/ipu-chart-for-wordpress-user-guide/#quickstart "IPU-Chart Quick Start") section, [code examples](https://www.ipublia.com/support/docs/ipu-chart-for-wordpress-user-guide/#usage "IPU-Chart Code Examples") for every chart type and a detailed description of the attributes and css-styles of the plugin.

Please visit our [Support Forum](https://www.ipublia.com/support/forums/ "IPU-Chart Support Forum") for questions or suggestions.

= Further Reading =

* Our [Blogs](https://www.ipublia.com/category/wordpress/ipu-chart/ "Blogs about IPU-Chart") about IPU-Chart
* The IPU-Chart for WordPress [User Guide](https://www.ipublia.com/support/docs/ipu-chart-for-wordpress-user-guide/ "IPU-Chart User Guide").
* The IPU-Chart [Support Forum](https://www.ipublia.com/support/forums/ "IPU-Chart Support Forum").
* The IPU-Chart [Product Page](https://www.ipublia.com/products/ipu-chart-svg-chart-library/ "IPU-Chart Product Page").

Enjoy!

== Installation ==

1. Upload `ipu-chart` to the `/wp-content/plugins/` directory
1. Activate the plugin through the 'Plugins' menu in WordPress

== Frequently Asked Questions ==

For questions or issues with IPU-Chart please use this support channels:

1. [Documentation](https://www.ipublia.com/ipu-chart/)
1. [FAQ](https://www.ipublia.com/support/faq/)
1. [Support Forum](https://www.ipublia.com/support/forums/)

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

= 0.1 =
* Initial version with horizontal bar charts

= 0.2 =
* Pie charts added
* Line charts added
* Vertical bar charts added
* Support for remote cvs loading added
* Attribute 'style' added
* Attribute 'img' added
* Changes in format definitions

= 0.3 =
* Donut charts added
* Attribute 'interpolate' added
* Attribute 'animate' added
* Enhanced error handling when loading csv data

= 0.3.1 =
* Labels for x- and y-axis added
* Some bugs fixes

= 0.3.3 =
* Bug fixes documentation

= 0.4 =
* Scatter charts added
* Shortcodes inside [csv][/csv] are processed now
* Minor bug fixes

= 0.4.1 =
* Support for tab separated (tsv) data added
* [tsv] shortcode added

= 0.5 =
* World Map chart type (map.world.countries) added
* number (n) as format added
* Improvements in formatting numbers

= 0.5.1 =
* Patch for number formats

= 0.6 =
* Bubble charts added

= 0.6.1 =
* Minor update for interoperability with the editor.

= 0.6.2 =
* Better calculation of left margin for bar, scatter and line charts
* Update for bubble charts with 0 values in the data series
* Sor for bubble charts

== Upgrade Notice ==

= 0.2 =
This version adds support for pie and line charts. Furthermore formats for dates, integers and floats can be specified.

= 0.3 =
This version adds support for donut charts. Line chars can be interpolated. Bar charts can be animated (click or tap the bar charts to start the animation).

= 0.3.1 =
This version adds labels for x- and y-axis and some bug fixes.

= 0.3.3 =
This version adds bug fixes in the documentation.

= 0.4 =
Scatter charts added.
Shortcodes inside [csv][/csv] are processed now.
Minor bug fixes.

= 0.4.1 =
* [tsv] shortcode added for better Excel compability (use it like the [csv] but with tab separated data)
* Tables can now be defined with [chart type="table" ...]. The columns to display can now be choosen with the 'category' and 'value' attributes. 
* The [table] shortcode is still supported but deprecated.

= 0.5 =
* World Map chart type (map.world.countries) added
* number (n) as format added
* Improvements in formatting numbers

= 0.5.1 =
* Patch for number formats

= 0.6 =
* Support for animated, multi-series bubble charts added

= 0.6.1 =
* Minor update for the interoperability with the IPU-Chart Editor

= 0.6.2 =
* Better calculation of left margin for bar, scatter and line charts
* Update for bubble charts with 0 values in the data series
* Sor for bubble charts



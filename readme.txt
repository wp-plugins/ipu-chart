=== Plugin Name ===
Contributors: thmufl
Tags: chart, diagram, svg, csv, excel, numbers, bar chart, pie chart, line chart, animation
Requires at least: 3.0.1
Tested up to: 3.5.1
Stable tag: 0.3
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Creates SVG based, animated bar, pie, donut and line charts out of your CSV data. A powerful, easy to use shortcode.

== Description ==

IPU-Chart is an easy to use shortcode that creates SVG based bar, pie, donut and line charts out of your CSV data.

The plugin takes a csv file (Texteditor, Excel, Numbers etc.) and displays it as a chart. IPU-Chart is based on [SVG](http://www.w3.org/TR/SVG/) and [D3](http://d3js.org/). It works perfectly on large computer screens as well as on tablets and smaller mobile screens. For browsers that do not support SVG an alternative image can be set.

= Features =

* Create bar, pie, donut and line charts
* Enter the csv data directy in you blog or page
* Or load the csv data from a remote location
* Create multiple views of the csv data
* Tooltip for chart details (see screenshots)
* Animated bar charts
* Define colors and number formats of the chart
* Create an additional table view of the csv data

= Usage =

First, define your data. You can create it immediately in WordPress or copy and paste it from an export of your favourite spreadsheet application.

<pre>
[csv id='popdata']Country,Population
China,1343.24
India,1205.07
United States,313.85
Indonesia,248.22
Brazil,205.72[/csv]
</pre>

Second, define the chart. Reference the csv (don't forget the '#'). Set the chart type and the category and value column. Define the format (string, integer, float or date) of the category and value columns.

<pre>
[chart id='chart0' 
       csv='#popdata' 
       type='bar | bar.horizontal | pie | donut | line'
       category='Country'
       value='Population'
       format='sting,float'
       color='DarkOrange, DarkBlue'
       style='height: 350px'
       title='Top five most populous countries of the world...'
       description='The top five most populous countries of the world...'
       sort='Population'
       interpolate='cardinal'
       animate='medium'
       img='http://www.example.com/chart0.png'
       debug='false']
</pre>

To define a table view just reference the csv (don't forget the '#'):

<pre>
[table id='table0' 
       csv='#popdata'
       debug='false']
</pre>

= Further Reading =

* The [IPU-Chart for WordPress User Guide](https://www.ipublia.com/support/docs/ipu-chart-for-wordpress-user-guide/ "IPU-Chart User Guide") describes the plugin in details.
* The product page [IPU-Chart SVG Chart Library](https://www.ipublia.com/products/ipu-chart-svg-chart-library/ "IPU-Chart Product Page") describes and shows the newest features of IPU-Chart.

Enjoy!

== Installation ==

1. Upload `ipu-chart` to the `/wp-content/plugins/` directory
1. Activate the plugin through the 'Plugins' menu in WordPress

== Frequently Asked Questions ==

For questions or issues with IPU-Chart please use this support channels:

1. [Docs](https://www.ipublia.com/ipu-chart/)
1. [FAQ](https://www.ipublia.com/support/faq/)
1. [Support Forum](http://wordpress.org/support/plugin/ipu-chart)

[Support](https://www.ipublia.com/support/)

== Screenshots ==

1. Bar chart example (with a tooltip)
2. Horizontal bar chart example
3. Pie Chart example
4. Donut Chart example
5. Line chart example
6. Interpolated line chart example

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

== Upgrade Notice ==

= 0.2 =
This version adds support for pie and line charts. Furthermore formats for dates, integers and floats can be specified.

= 0.3 =
This version adds support for donut charts. Line chars can be interpolated. Bar charts can be animated (click or tap the bar charts to start the animation).

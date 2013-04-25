=== Plugin Name ===
Contributors: thmufl
Tags: chart, diagram, svg, csv, excel, numbers, bar chart, pie chart, line chart, donut chart, animation, quotes
Requires at least: 3.0.1
Tested up to: 3.5.1
Stable tag: 0.3.1
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

First, define your data. You can create it immediately in WordPress or copy and paste it from an export of your favourite spreadsheet application. Example:

<pre>
[csv id='data']Country,Population
China,1343.24
India,1205.07
USA,313.85
Indonesia,248.22
Brazil,205.72[/csv]
</pre>

Second, define the chart. Reference the csv (don't forget the '#'). Set the chart type and the category and value column. Define the format (string, integer, float or date) of the category and value columns:

<pre>
[chart csv='#data' type='bar' category='Country' value='Population' format='string, float' title='Top five most populous countries of the world...' description='The top five most populous countries of the world...' animate='medium']
</pre>

= Usage Examples =

Horizontal bar chart:

<pre>
[chart csv='#data' type='bar.horizontal' category='Country' value='Population' format='string, float' title='Top five most populous countries of the world...' description='The top five most populous countries of the world...' animate='medium']
</pre>

Pie chart:

<pre>
[chart csv='#data' type='pie' category='Country' value='Population' format='string, float' title='Top five most populous countries of the world...' description='The top five most populous countries of the world...' animate='medium']
</pre>

Donut chart:

<pre>
[chart csv='#data' type='donut' category='Country' value='Population' format='string, float' title='Top five most populous countries of the world...' description='The top five most populous countries of the world...' animate='medium' debug='true']
</pre>

Line chart:

For a line charts you need some data with <code>integer</code>, <code>float</code> or <code>date</code> values as category:

[csv id='aapl']Date,Open,High,Low,Close,Volume,Adj Close
2013-04-01,441.90,443.70,426.40,429.79,16407200,429.79
2013-03-25,464.69,469.95,441.62,442.66,14002700,442.66
2013-03-18,441.45,462.10,441.20,461.91,15840700,461.91
2013-03-11,429.75,444.23,425.14,443.66,16382300,443.66
2013-03-04,427.80,435.43,419.00,431.72,18152800,431.72
2013-02-25,453.85,455.12,429.98,430.47,16688500,430.47
2013-02-19,461.10,462.73,442.82,450.81,15088600,450.81
2013-02-11,476.50,484.94,459.92,460.16,16776900,460.16
2013-02-04,453.91,478.81,442.00,474.98,21299300,474.98[/csv]

To display the close prize as a line chart:

<pre>
[chart csv='#aapl' type='line' category='Date' value='Close' format='yyyy-mm-dd, float' title='Apple close prize...' description='Apple close prize...']
</pre>

You can also load the csv data remotly. Just enter the url of the csv in the 'csv' attribute:

<pre>
[chart csv='https://www.ipublia.com/wp-content/uploads/GOOG.csv' type='line' category='Date' value='Close' format='yyyy-mm-dd, float' title='Google close prize...' description='Google close prize...' color="Crimson"]
</pre>

The same for Apple would be:

<pre>
[chart csv='https://www.ipublia.com/wp-content/uploads/AAPL.csv' type='line' category='Date' value='Close' format='yyyy-mm-dd, float' title='Apple close prize...' description='Apple close prize...' color="SlateBlue"]
</pre>

If you want smooth lines use the <code>interplolate</code> attribute:

<pre>
[chart csv='https://www.ipublia.com/wp-content/uploads/Weather-ZH.csv' type='line' category='Date' value='Temperature' format='yyyy-mm-dd, float' title='Average temperature in Zürich in degree celsius...' description='Average temperature in Zürich in degree celsius...' color="DarkOrange" interpolate="cardinal"]
</pre>

To define a table view just reference the csv with a 'table' shortcode (don't forget the '#'). Example:

<pre>
[table csv='#data']
</pre>

The <code>chart</code> shortcode has more attributes than shown here. Please refer to our [IPU-Chart User Guide](https://www.ipublia.com/support/docs/ipu-chart-for-wordpress-user-guide/ "IPU-Chart User Guide").

Please visit our [IPU-Chart Support Forum](https://www.ipublia.com/support/forums/ "IPU-Chart Support Forum") for questions about the plugin or if you encounter a problem with it.

= Further Reading =

* The [IPU-Chart for WordPress User Guide](https://www.ipublia.com/support/docs/ipu-chart-for-wordpress-user-guide/ "IPU-Chart User Guide").
* The [IPU-Chart Support Forum](https://www.ipublia.com/support/forums/ "IPU-Chart Support Forum").
* The [IPU-Chart Product Page](https://www.ipublia.com/products/ipu-chart-svg-chart-library/ "IPU-Chart Product Page").

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

= 0.3.1 =
* Labels for x- and y-axis added.
* Some bugs fixes.

== Upgrade Notice ==

= 0.2 =
This version adds support for pie and line charts. Furthermore formats for dates, integers and floats can be specified.

= 0.3 =
This version adds support for donut charts. Line chars can be interpolated. Bar charts can be animated (click or tap the bar charts to start the animation).

= 0.3.1 =
This version adds labels for x- and y-axis and some bug fixes.


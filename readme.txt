=== Plugin Name ===
Contributors: thmufl
Tags: chart, diagram, svg, csv, excel, numbers, bar chart, pie chart, line chart
Requires at least: 3.0.1
Tested up to: 3.5.1
Stable tag: 0.2
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Creates SVG based bar charts out of your CSV data. A powerful, easy to use shortcode.

== Description ==

IPU-Chart is an easy to use shortcode that creates SVG based bar, pie and line charts out of your CSV data.

IPU-Chart takes a csv file (Texteditor, Excel, Numbers etc.) and displays it as a chart. IPU Chart is based on SVG and works perfectly on large computer screens as well as on tablets and smaller mobile screens. For browsers that do not support SVG an alternative image can be set.

Features:
* Create bar, pie and line charts
* Enter the csv data directy in you blog or page
* Load csv data from a remote location
* Create multiple views of the csv data.
* Define colors and number formats of the chart
* Create an additional table view of the csv data.

Usage:

First, define your data:

<pre>
[csv id='popdata']Country,Population
China,1343.24
India,1205.07
United States,313.85
Indonesia,248.22
Brazil,205.72[/csv]
</pre>

Second, define the chart:

<pre>
[chart id='chart0' 
       csv='#popdata' 
       type='bar | bar.horizontal | pie | line'
       category='Country'
       value='Population'
       format='s,f'
       color='DarkOrange,DarkBlue,Maroon'
       style='height: 350px'
       title='Top five most populous countries of the world...'
       sort='Population"
       img='http://www.example.com/chart0.png'
       debug='false']
</pre>

== Installation ==

1. Upload `ipu-chart` to the `/wp-content/plugins/` directory
1. Activate the plugin through the 'Plugins' menu in WordPress

== Frequently Asked Questions ==

For questions or issues with IPU-Chart please use this support channels:

1. [Docs](https://www.ipublia.com/support/docs/ipu-chart-for-wordpress-user-guide/)
1. [FAQ](https://www.ipublia.com/support/faq/)
1. [Support Forum](http://wordpress.org/support/plugin/ipu-chart)

[Support](https://www.ipublia.com/support/)

== Screenshots ==

1. Bar chart example
2. Horizontal bar chart example
3. Pie Chart example
4. Line chart example

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

== Upgrade Notice ==

= 0.2 =
This version adds support for pie- and line-charts. Furthermore formats for dates, integers and floats can be specified.

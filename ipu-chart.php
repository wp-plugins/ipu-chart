<?php
/*
	Plugin Name: IPU-Chart
	Plugin URI: https://www.ipublia.com/products/ipu-chart-svg-chart-library/
	Description: Creates SVG based charts out of your CSV data. Currently supports bar, pie and line charts.
	Author: ipublia, Thomas Müller Flury
	Version: 0.2
	Author URI: https://www.ipublia.com/author/thmufl/
	Text Domain: ipuchart
	Domain Path: /lang
 */

function ipu_csv_func($atts, $content = null) {
	extract(shortcode_atts(array(
		'id' => 'csv' . rand(0, 999999),
	), $atts));
	
	if(has_filter("the_content", "wpautop")) {
		$content = str_replace("<br />", "\r", $content);
	}
	$content = trim($content);
	$content = str_replace(";", ",", $content);
	return ipu_render_csv($id, $content);
}

function ipu_chart_func($atts) {
	extract(shortcode_atts(array(
		'id' => 'chart' . rand(0, 999999),
		'csv' => 'csv',
		'type' => 'bar',
		'category' => 'name',
		'value' => 'value',
		'format' => '%s,%f',
		'color' => 'SlateBlue',
		'style' => 'width:100%;height:300px;',
		'title' => 'Set a title',
		'description' => 'Set a description',
		'sort' => 'none',
		'img' => '',
		'debug' => 'false'
	), $atts));
	
	return ipu_render_chart($id, $csv, $type, $category, $value, $format, $color, $style, $title, $description, $sort, $img, $debug);
}

function ipu_table_func($atts) {
	extract(shortcode_atts(array(
		'id' => 'table' . rand(0, 999999),
		'csv' => 'csv',
		'title' => 'Set a title',
		'debug' => 'false'
	), $atts));
	
	return ipu_render_table($id, $csv, $title, $debug);
}

add_shortcode("csv", "ipu_csv_func");
add_shortcode("chart", "ipu_chart_func");
add_shortcode("table", "ipu_table_func");

function ipu_render_csv($id, $content) {

	return "<div id='{$id}' class='csv' style='display:none;white-space:pre;'>{$content}</div>";
}

function ipu_render_chart($id, $csv, $type, $category, $value, $format, $color, $style, $title, $description, $sort, $img, $debug) {
	return "<figure id='{$id}' class='chart'>
				<script type='text/javascript'>
				renderChart('{$id}', '{$csv}', '{$type}', '{$category}', '{$value}', '{$format}', 
							'{$color}', '{$style}', '{$title}', '{$description}', '{$sort}', '{$img}', '{$debug}');
				</script>
			</figure>";
}

function ipu_render_table($id, $csv, $title, $debug) {
	
	return "<table id='{$id}' class='chart-data'>
				<script type='text/javascript'>					
				renderTable('{$id}', '{$csv}', '{$title}', '{$debug}');
				</script>
			</table>";
}

// Add plug-in's scripts to the header of the pages
function ipu_add_custom_scripts() {   
    wp_register_script('custom-script-d3', plugins_url( '/js/d3/d3.v3.min.js', __FILE__ )); 
    wp_register_script('custom-script-ipuc', plugins_url( '/js/ipu-chart.js', __FILE__ ));  
  
    wp_enqueue_script('custom-script-d3'); 
    wp_enqueue_script('custom-script-ipuc');  
} 
add_action('wp_enqueue_scripts', 'ipu_add_custom_scripts' ); 

// Add plug-in's stylesheets to the header of the pages
function ipu_add_custom_styles() {  
    wp_register_style('custom-style', plugins_url( '/css/ipu-chart.css', __FILE__ ), array(), '0.9', 'all' );   
    wp_enqueue_style('custom-style');  
}  
add_action('wp_enqueue_scripts', 'ipu_add_custom_styles' );

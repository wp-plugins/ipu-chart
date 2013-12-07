<?php
/*
	Plugin Name: IPU-Chart
	Plugin URI: https://www.ipublia.com/support/ipu-chart-editor-online/
	Description: D3/SVG based charts out of your csv, tsv or json data. Currently supports bar, pie, donut, line, scatter, bubble and world map charts. 
	Author: Thomas Müller Flury, ipublia
	Version: 0.95.1
	Author URI: https://www.ipublia.com/author/thmufl/
	Text Domain: ipuc
	Domain Path: /lang
 */

// Plugin Folder Path
if (!defined('IPUC_PLUGIN_DIR'))
	define( 'IPUC_PLUGIN_DIR', WP_PLUGIN_DIR . '/' . basename(dirname( __FILE__ ) ) . '/');
	
// Helper to display plugin version in console logs
function plugin_get_version() {
	require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
	$plugin_data = get_plugin_data( __FILE__ );
	$plugin_version = $plugin_data['Name'] . ', Version ' . $plugin_data['Version'];
	return $plugin_version;
}

// This is the csv tag
function ipuc_csv_func($atts, $content = null) {
	extract(shortcode_atts(array(
		'id' => 'd' . rand(0, 999999),
	), $atts));
	
	if(has_filter("the_content", "wpautop")) {
		$content = str_replace("<br />", "\r", $content);
	}
	$content = str_replace(array("&#8216;", "&#8220;", "&#8221;", "&#8242;", "&#8243;"), "\"", $content);
	$content = trim($content);
	return ipuc_render_csv($id, do_shortcode($content));
}

// This is the tsv tag
function ipuc_tsv_func($atts, $content = null) {
	extract(shortcode_atts(array(
		'id' => 'd' . rand(0, 999999),
	), $atts));
	
	if(has_filter("the_content", "wpautop")) {
		$content = str_replace("<br />", "\r", $content);
	}
	$content = str_replace(array("&#8216;", "&#8220;", "&#8221;", "&#8242;", "&#8243;"), "\"", $content);
	$content = trim($content);
	return ipuc_render_tsv($id, do_shortcode($content));
}

// This is the json tag
function ipuc_json_func($atts, $content = null) {
	extract(shortcode_atts(array(
		'id' => 'd' . rand(0, 999999),
	), $atts));
	
	if(has_filter("the_content", "wpautop")) {
		$content = str_replace("<br />", "\r", $content);
	}
	$content = str_replace(array("&#8216;", "&#8220;", "&#8221;", "&#8242;", "&#8243;"), "\"", $content);
	$content = trim($content);
	return ipuc_render_json($id, do_shortcode($content));
}

// This is the chart tag. Will be replaced by the chart-def tag.
function ipuc_chart_func($atts) {
	extract(shortcode_atts(array(
		'id' => 'c' . rand(0, 999999),
		'csv' => '',
		'tsv' => '',
		'json' => '',
		'adapter' => 'return data;',
		'type' => 'bar',
		'category' => 'name',
		'value' => 'value',
		'format' => '%s,%f',
		'color' => 'auto',
		'style' => 'width:100%;height:300px;',
		'title' => 'Set a title',
		'description' => 'Set a description',
		'sort' => 'true',
		'interpolate' => 'linear',
		'animate' => 'none',
		'img' => '',
		'debug' => 'false'
	), $atts));
	
	return ipuc_render_chart($id, $csv, $tsv, $json, $adapter, $type, $category, $value,
							$format, $color, $style, 
							$title, $description, $sort, $interpolate, $animate, 
							$img, $debug, plugin_get_version());
}

// The ip4 tag
function ip4_func($atts, $content = null) {
	extract(shortcode_atts(array(
		'log' => 'ip4.log.level.warn'
	), $atts));
	
	if(has_filter('the_content', 'wpautop')) {
		$content = str_replace("<br />", "", $content);
	}
	$content = trim($content);
	return ip4_render($log, do_shortcode($content));
}

// This is the table tag (deprecated)
function ipuc_table_func($atts) {
	extract(shortcode_atts(array(
		'id' => 'table' . rand(0, 999999),
		'csv' => '',
		'title' => 'Set a title',
		'debug' => 'false'
	), $atts));
	
	return ipuc_render_table($id, $csv, $title, $debug);
}

add_shortcode("csv", "ipuc_csv_func");
add_shortcode("tsv", "ipuc_tsv_func");
add_shortcode("json", "ipuc_json_func");
add_shortcode("chart", "ipuc_chart_func");
add_shortcode("table", "ipuc_table_func");


// Second shortcode set for compability with some themes.
add_shortcode("ipu-csv", "ipuc_csv_func");
add_shortcode("ipu-tsv", "ipuc_tsv_func");
add_shortcode("ipu-json", "ipuc_json_func");
add_shortcode("ipu-chart", "ipuc_chart_func");
add_shortcode("ipu-table", "ipuc_table_func");

// ip4 shortcode since version 0.8
add_shortcode("ip4", "ip4_func");

function ipuc_render_csv($id, $content) {
	return "<div id='{$id}' class='csv' style='display:none;white-space:pre;'>{$content}</div>";
}

function ipuc_render_tsv($id, $content) {
	return "<div id='{$id}' class='tsv' style='display:none;white-space:pre;'>{$content}</div>";
}

function ipuc_render_json($id, $content) {
	return "<div id='{$id}' class='json' style='display:none;white-space:pre;'>{$content}</div>";
}

function ipuc_render_chart($id, $csv, $tsv, $json, $type, $category, $value, $format, $color, $style, $title, $description, $sort, $interpolate, $animate, $img, $debug, $version) {
	if($type === 'table') {
		return "<table id='{$id}' class='chart table'>
					<script type='text/javascript'>					
					renderChart(\"{$id}\", \"{$csv}\", \"{$tsv}\", \"{$json}\", \"{$type}\", \"{$category}\", \"{$value}\", 
								\"{$format}\", \"{$color}\", \"{$style}\", 
								\"{$title}\", \"{$description}\", \"{$sort}\", \"{$interpolate}\", \"{$animate}\",
								\"{$img}\", \"{$debug}\", \"{$version}\");
					</script>
				</table>";
	} else {	
		return "<figure id='{$id}' class='ipuc'>
					<script type='text/javascript'>
					renderChart(\"{$id}\", \"{$csv}\", \"{$tsv}\", \"{$json}\", \"{$type}\", \"{$category}\", \"{$value}\", 
								\"{$format}\", \"{$color}\", \"{$style}\", 
								\"{$title}\", \"{$description}\", \"{$sort}\", \"{$interpolate}\", \"{$animate}\",
								\"{$img}\", \"{$debug}\", \"{$version}\");
					</script>
				</figure>";
	}
}

function ip4_render($log, $content) {

	$content = str_replace(array("&#8220;", "&#8221;", "&#8222;", "&#8242;", "&#8243;"), "\"", $content);
	$content = str_replace(array("&#8216;", "&#8217;"), "'", $content);
	$content = str_replace("&#8211;", "-", $content);
	$content = str_replace("\n", "", $content);	
	$content = preg_replace('/\s+/', ' ', $content);
		
	return "<script type='text/javascript' encoding='utf-8'>
				ip4.draw({$content});
			</script>";
}

function ipuc_render_table($id, $csv, $title, $debug) {
	return "<table id='{$id}' class='chart-data'>
				<script type='text/javascript'>					
				renderTableDeprecated('{$id}', '{$csv}', '{$title}', '{$debug}');
				</script>
			</table>";
}

// Add plug-in's scripts to the header of the pages
function ipuc_add_custom_scripts() {   
    //wp_register_script('custom-script-d3', plugins_url( '/js/d3/d3.v3.min.js', __FILE__ ));
    wp_register_script('custom-script-ip4-v0', plugins_url( '/js/ip4.v0.min.js', __FILE__ ));
    wp_register_script('custom-script-ipuc', plugins_url( '/js/ipu-chart.js', __FILE__ )); 
    wp_register_script('custom-script-queue', plugins_url( '/js/d3/queue.v1.min.js', __FILE__ ));
    wp_register_script('custom-script-d3-geo-projection', plugins_url( '/js/d3/d3.geo.projection.v0.min.js', __FILE__ ));
 	wp_register_script('custom-script-topojson', plugins_url( '/js/d3/topojson.v0.min.js', __FILE__ ));
 	wp_register_script('custom-script-colorbrewer', plugins_url( '/js/colorbrewer/colorbrewer.js', __FILE__ ));
  
    //wp_enqueue_script('custom-script-d3');
    wp_enqueue_script('custom-script-ip4-v0');
    wp_enqueue_script('custom-script-ipuc');
    wp_enqueue_script('custom-script-queue');
    wp_enqueue_script('custom-script-d3-geo-projection');
    wp_enqueue_script('custom-script-topojson'); 
    wp_enqueue_script('custom-script-colorbrewer');  
} 
add_action('wp_enqueue_scripts', 'ipuc_add_custom_scripts' ); 

// Add plug-in's stylesheets to the header of the pages
function ipuc_add_custom_styles() {  
    wp_register_style('custom-style-ipuc', plugins_url( '/css/ipu-chart.css', __FILE__ ), array(), '0.7', 'all' );   
    wp_register_style('custom-style-ip4-v0', plugins_url( '/css/ip4.v0.css', __FILE__ ), array(), '0.8', 'all' ); 
	wp_enqueue_style('custom-style-ipuc');  
    wp_enqueue_style('custom-style-ip4-v0'); 
}  
add_action('wp_enqueue_scripts', 'ipuc_add_custom_styles' );

?>
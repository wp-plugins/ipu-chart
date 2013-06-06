<?php

function ipuc_register_settings() {
	// creates our settings in the options table
	register_setting('ipuc-settings-group', 'ipuce_license_key', 'ipuce_sanitize_license'); 
	register_setting('ipuc-settings-group', 'ipucms_license_key', 'ipucms_sanitize_license');
}
add_action('admin_init', 'ipuc_register_settings');

// this is the URL our updater / license checker pings. This should be the URL of the site with EDD installed
define('EDD_IPU_STORE_URL', 'https://www.ipublia.com');

// the names of your products. This should match the download name in EDD exactly
define('EDD_IPU_CHART_EDITOR', 'IPU-Chart Editor' );
define('EDD_IPU_CHART_MULTI_SERIES', 'IPU-Chart Multi-Series' );


/*
 *	IPU-Chart Editor license
 */
function ipuce_activate_license() {
 
	// listen for our activate button to be clicked
	if(isset($_POST['ipuce_license_activate'])) {
 
		// run a quick security check 
	 	if(!check_admin_referer('ipuce_nonce', 'ipuce_nonce')) 	
			return; // get out if we didn't click the Activate button
 
		// retrieve the license from the database
		$ipuce_license = trim(get_option('ipuce_license_key') );
 
		// data to send in our API request
		$api_params = array( 
			'edd_action'=> 'activate_license', 
			'license' 	=> $ipuce_license, 
			'item_name' => urlencode(EDD_IPU_CHART_EDITOR) // the name of our product in EDD
		);
 
		// Call the custom API.
		$response = wp_remote_get(add_query_arg($api_params, EDD_IPU_STORE_URL), array( 'timeout' => 15, 'sslverify' => false));
 
		// make sure the response came back okay
		if(is_wp_error($response))
			return false;
 
		// decode the license data
		$license_data = json_decode(wp_remote_retrieve_body($response));
 
		// $license_data->license will be either "active" or "inactive" 
		update_option('ipuce_license_status', $license_data->license); 
	}
}
add_action('admin_init', 'ipuce_activate_license');


function ipuce_deactivate_license() {

	// listen for our activate button to be clicked
	if(isset( $_POST['ipuce_license_deactivate'])) {

		// run a quick security check 
	 	if(!check_admin_referer('ipuce_nonce', 'ipuce_nonce') ) 	
			return; // get out if we didn't click the Activate button

		// retrieve the license from the database
		$license = trim(get_option('ipuce_license_key'));			

		// data to send in our API request
		$api_params = array( 
			'edd_action'=> 'deactivate_license', 
			'license' 	=> $license, 
			'item_name' => urlencode(EDD_IPU_CHART_EDITOR) // the name of our product in EDD
		);
		
		// Call the custom API.
		$response = wp_remote_get(add_query_arg( $api_params, EDD_IPU_STORE_URL), array('timeout' => 15, 'sslverify' => false));

		// make sure the response came back okay
		if (is_wp_error($response ))
			return false;

		// decode the license data
		$license_data = json_decode(wp_remote_retrieve_body($response));
		
		// $license_data->license will be either "deactivated" or "failed"
		if($license_data->license == 'deactivated')
			delete_option('ipuce_license_status');

	}
}
add_action('admin_init', 'ipuce_deactivate_license');


function ipuce_check_license() {

	global $wp_version;

	$license = trim(get_option('ipuce_license_key'));
		
	$api_params = array( 
		'edd_action' => 'check_license', 
		'license' => $license, 
		'item_name' => urlencode(EDD_IPU_CHART_EDITOR) 
	);

	// Call the custom API.
	$response = wp_remote_get(add_query_arg($api_params, EDD_IPU_STORE_URL ), array('timeout' => 15, 'sslverify' => false));

	if (is_wp_error($response))
		return false;

	$license_data = json_decode(wp_remote_retrieve_body($response));

	if($license_data->license == 'valid' ) {
		echo 'valid'; exit;
		// this license is still valid
	} else {
		echo 'invalid'; exit;
		// this license is no longer valid
	}
}

function ipuce_sanitize_license($new) {
	$old = get_option('ipuce_license_key');
	if($old && $old != $new) {
		delete_option('ipuce_license_status'); // new license has been entered, so must reactivate
	}
	return $new;
}

/*
 *	IPU-Chart Multi-Series license
 */

function ipucms_activate_license() {

	// listen for our activate button to be clicked
	if(isset($_POST['ipucms_license_activate'])) {
		// run a quick security check 
	 	if(!check_admin_referer('ipucms_nonce', 'ipucms_nonce')) 	
			return; // get out if we didn't click the Activate button
 
		// retrieve the license from the database
		$license = trim(get_option('ipucms_license_key'));
  
		// data to send in our API request
		$api_params = array( 
			'edd_action'=> 'activate_license', 
			'license' 	=> $license, 
			'item_name' => urlencode(EDD_IPU_CHART_MULTI_SERIES) // the name of our product in EDD
		);
 
		// Call the custom API.
		$response = wp_remote_get(add_query_arg($api_params, EDD_IPU_STORE_URL), array('timeout' => 15, 'sslverify' => false));
 
		// make sure the response came back okay
		if(is_wp_error($response))
			return false;
 
		// decode the license data
		$license_data = json_decode(wp_remote_retrieve_body($response));
 
		// $license_data->license will be either "active" or "inactive"
		update_option('ipucms_license_status', $license_data->license); 
	}
}
add_action('admin_init', 'ipucms_activate_license');


function ipucms_deactivate_license() {
	
	// listen for our activate button to be clicked
	if(isset($_POST['ipucms_license_deactivate'])) {
		
		// run a quick security check 
	 	if(!check_admin_referer('ipucms_nonce', 'ipucms_nonce') ) 	
			return; // get out if we didn't click the Activate button
		
		// retrieve the license from the database
		$license = trim(get_option('ipucms_license_key'));
		
		// data to send in our API request
		$api_params = array( 
			'edd_action'=> 'deactivate_license', 
			'license' 	=> $license, 
			'item_name' => urlencode(EDD_IPU_CHART_MULTI_SERIES) // the name of our product in EDD
		);
		
		// Call the custom API.
		$response = wp_remote_get(add_query_arg($api_params, EDD_IPU_STORE_URL), array('timeout' => 15, 'sslverify' => false));
		
		// make sure the response came back okay
		if(is_wp_error($response))
			return false;

		// decode the license data
		$license_data = json_decode(wp_remote_retrieve_body($response));
				
		// $license_data->license will be either "deactivated" or "failed"
		if($license_data->license == 'deactivated')
			delete_option('ipucms_license_status');

	}
}
add_action('admin_init', 'ipucms_deactivate_license');

function ipucms_check_license() {

	global $wp_version;

	$license = trim(get_option('ipucms_license_key'));
		
	$api_params = array( 
		'edd_action' => 'check_license', 
		'license' => $license, 
		'item_name' => urlencode(EDD_IPU_CHART_MULTI_SERIES) 
	);

	// Call the custom API.
	$response = wp_remote_get(add_query_arg($api_params, EDD_IPU_STORE_URL ), array('timeout' => 15, 'sslverify' => false));

	if (is_wp_error($response))
		return false;

	$license_data = json_decode(wp_remote_retrieve_body($response));

	if($license_data->license == 'valid' ) {
		echo 'valid'; exit;
		// this license is still valid
	} else {
		echo 'invalid'; exit;
		// this license is no longer valid
	}
}

function ipucms_sanitize_license($new) {
	$old = get_option('ipucms_license_key');
	if($old && $old != $new) {
		delete_option('ipucms_license_status'); // new license has been entered, so must reactivate
	}
	return $new;
}


function ipuc_settings_page() {
	
	//delete_option('ipucms_license_status');
	
	// Editor options
	$ipuce_license = get_option('ipuce_license_key');
	$ipuce_status = get_option('ipuce_license_status');
	
	// Multi-serie options
	$ipucms_license = get_option('ipucms_license_key');
	$ipucms_status = get_option('ipucms_license_status');

	?>
	<div class="wrap">
				
		<h2><?php _e('IPU-Chart Settings'); ?></h2>
		
		<h3><?php _e('About'); ?></h3>

		<div style='line-height: 1.75; width: 50%; padding: 0.25em 1em 0.25em 1em; border: 1px solid gray;'>
			<p>With the <strong>IPU-Chart Multi-Series Extension</strong> we offer now support for animated, multi-series charts. And the <strong>IPU-Chart Editor</strong> can now be downloaded and installed at your own site.</p>
			<p>Check our website for the <a href='https://www.ipublia.com' target='_blank'>new tools</a> and the <a href='https://www.ipublia.com/support/docs/ipu-chart-for-wordpress-user-guide/' target='_blank'>plugin's documentation</a>.</p>
		</div>

 		<form method="post" action="options.php">
 		
 			<?php settings_fields('ipuc-settings-group'); ?>
 			 
 			<h3><?php _e('IPU-Chart Editor'); ?></h3>			
 
			<table class="form-table">
				<tbody>
					<tr valign="top">	
						<th scope="row" valign="top">
							<?php _e('License Key'); ?>
						</th>
						<td>
							<input id="ipuce_license_key" name="ipuce_license_key" type="text" class="regular-text" value="<?php esc_attr_e($ipuce_license); ?>" />
							<label class="description" for="ipuce_license_key"><?php _e('Enter your license key'); ?></label>
						</td>
					</tr>
					<?php if(false !== $ipuce_license) { ?>
						<tr valign="top">	
							<th scope="row" valign="top">
								<?php _e('Activate License'); ?>
							</th>
							<td>
								<?php if($ipuce_status !== false && $ipuce_status == 'valid') { ?>
									<span style="color:green;"><?php _e('active'); ?></span>
									<?php wp_nonce_field('ipuce_nonce', 'ipuce_nonce'); ?>
									<input type="submit" class="button-secondary" name="ipuce_license_deactivate" value="<?php _e('Deactivate License'); ?>"/>
								<?php } else {
									if($ipuce_status !== false && $ipuce_status == 'invalid') { ?>
										<span style="color:red;"><?php _e('invalid'); ?></span>
									<?php }
									wp_nonce_field('ipuce_nonce', 'ipuce_nonce'); ?>
									<input type="submit" class="button-secondary" name="ipuce_license_activate" value="<?php _e('Activate License'); ?>"/>
								<?php } ?>
							</td>
						</tr>
					<?php } ?>
				</tbody>
			</table>
			
			<h3><?php _e('IPU-Chart Multi-Series'); ?></h3>
			
			<table class="form-table">
				<tbody>
					<tr valign="top">
						<th scope="row" valign="top">
							<?php _e('License Key'); ?>
						</th>
						<td>
							<input id="ipucms_license_key" name="ipucms_license_key" type="text" class="regular-text" value="<?php esc_attr_e($ipucms_license); ?>" />
							<label class="description" for="ipucms_license_key"><?php _e('Enter your license key'); ?></label>
						</td>
					</tr>
					<?php if(false !== $ipucms_license) { ?>
						<tr valign="top">	
							<th scope="row" valign="top">
								<?php _e('Activate License'); ?>
							</th>
							<td>
								<?php if($ipucms_status !== false && $ipucms_status == 'valid') { ?>
									<span style="color:green;"><?php _e('active'); ?></span>
									<?php wp_nonce_field('ipucms_nonce', 'ipucms_nonce'); ?>
									<input type="submit" class="button-secondary" name="ipucms_license_deactivate" value="<?php _e('Deactivate License'); ?>"/>
								<?php } else {
									if($ipucms_status !== false && $ipucms_status == 'invalid') { ?>
										<span style="color:red;"><?php _e('invalid'); ?></span>
									<?php }
									wp_nonce_field('ipucms_nonce', 'ipucms_nonce'); ?>
									<input type="submit" class="button-secondary" name="ipucms_license_activate" value="<?php _e('Activate License'); ?>"/>
								<?php } ?>
							</td>
						</tr>
					<?php } ?>
				</tbody>
			</table>	
			<?php submit_button(); ?>
		</form>
	<?php
}
?>

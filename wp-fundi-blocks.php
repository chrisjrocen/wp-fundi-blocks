<?php
/**
 * Plugin Name:     WP Fundi blocks
 * Plugin URI:      https://www.wp-fundi.com
 * Description:     A Post Type and Block Toolset for the management of people listings inside WordPress.
 * Author:          Chris Ocen
 * Author URI:      https://www.wp-fundi.com
 * Text Domain:     wp-fundi-blocks
 * Domain Path:     /languages
 * Version:         0.2.0
 *
 * @package WP_FUNDI_BLOCKS
 */

// If this file is called firectly, abort!!!
defined( 'ABSPATH' ) || die( 'No Access!' );

define( 'WP_FUNDI_BLOCKS_VERSION', '0.2.0' );

// Require once the Composer Autoload.
if ( file_exists( __DIR__ . '/lib/autoload.php' ) ) {
	require_once __DIR__ . '/lib/autoload.php';
}

/**
 * The code that runs during plugin activation.
 *
 * @return void
 */
function activate_mrksuperblocks_people_addon_plugin() {
	WP_FUNDI_BLOCKS\Base\Activate::activate();
}
register_activation_hook( __FILE__, 'activate_mrksuperblocks_people_addon_plugin' );

/**
 * The code that runs during plugin deactivation.
 *
 * @return void
 */
function deactivate_mrksuperblocks_people_addon_plugin() {
	WP_FUNDI_BLOCKS\Base\Deactivate::deactivate();
}
register_deactivation_hook( __FILE__, 'deactivate_mrksuperblocks_people_addon_plugin' );

/**
 * Initialize all the core classes of the plugin.
 */
if ( class_exists( 'WP_FUNDI_BLOCKS\\Init' ) ) {
	WP_FUNDI_BLOCKS\Init::register_services();
}

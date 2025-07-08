<?php
/**
 * Plugin deactivation methods.
 *
 * @package WP_FUNDI_BLOCKS
 */

namespace WP_FUNDI_BLOCKS\Base;

/**
 * Run plugin deactivation methods.
 */
class Deactivate {

	/**
	 * Runs on deactivation hook.
	 *
	 * @return void
	 */
	public static function deactivate() {
		flush_rewrite_rules();
	}
}

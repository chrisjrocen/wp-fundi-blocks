<?php
/**
 * Plugin Activation methods.
 *
 * @package  WP_FUNDI_BLOCKS
 */

namespace WP_FUNDI_BLOCKS\Base;

/**
 * Run plugin activation methods.
 */
class Activate extends BaseController {

	/**
	 * Runs on activation hook.
	 *
	 * @return void
	 */
	public static function activate() {
		flush_rewrite_rules();
	}
}

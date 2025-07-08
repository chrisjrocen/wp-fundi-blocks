<?php

/**
 * Register Blocks for Fundi carousel Feature
 *
 * @package WP_FUNDI_BLOCKS
 */

namespace WP_FUNDI_BLOCKS\Blocks;

use WP_FUNDI_BLOCKS\Base\BaseController;

/**
 * Handle all the blocks required for Fundi carousel
 */
class FundiCarousel extends BaseController {

	/**
	 * Register function is called by default to get the class running
	 *
	 * @return void
	 */
	public function register() {

			add_action( 'init', array( $this, 'create_carousel_block_init' ) );
			// Admin Scripts called for usage on site.
			add_action( 'admin_enqueue_scripts', array( $this, 'register_scripts' ), 1 );
			add_action( 'admin_enqueue_scripts', array( $this, 'localise' ) );

			add_action( 'wp_enqueue_scripts', array( $this, 'register_scripts' ), 1 );
	}
	/**
	 * Localise variables for use inside block
	 *
	 * @return void
	 */
	public function localise() {
		wp_register_script( 'wp-fundi-localize-people', $this->plugin_url . 'assets/js/localize/index.js', array(), true );
		wp_enqueue_script( 'wp-fundi-localize-people' );
		wp_localize_script(
			'wp-fundi-localize-people',
			'wp-fundiPeople',
			array(
				'postTypeName'       => $this->post_type_name,
				'postTypeNameSingle' => $this->post_type_name_single,
				'postTypeSlug'       => $this->post_type_slug,
				'taxonomySlug'       => $this->people_taxonomy_slug,
				'taxonomyEnabled'    => $this->enable_taxonomy,
			)
		);
	}

	/**
	 * Get carousel is a render callback for the dynamic block - document list.
	 * Returns a formatted list for Gutenberg block
	 *
	 * @param object $attr default shortcode for attributes from React.
	 * @return string
	 */
	public function get_carousel( $attr ) {

		return 'Block here';
	}

	/**
	 * Register block function called by init hook
	 *
	 * @return void
	 */
	public function create_carousel_block_init() {
		register_block_type_from_metadata(
			$this->plugin_path . 'build/fundi-carousel/',
			array(
				'render_callback' => array( $this, 'get_carousel' ),
			)
		);
	}
}

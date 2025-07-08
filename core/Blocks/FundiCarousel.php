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
			add_action( 'wp_enqueue_scripts', array( $this, 'register_scripts' ), 1 );
	}

	/**
	 * Register scripts and styles for the block.
	 *
	 * @return void
	 */
	public function register_scripts() {
		wp_enqueue_script(
			'swiper-script',
			'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js',
			array( 'wp-element' ),
			null,
			true
		);

		wp_enqueue_style(
			'swiper-style',
			'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
			array(),
			null
		);
	}

	/**
	 * Get carousel is a render callback for the dynamic block - document list.
	 * Returns a formatted list for Gutenberg block
	 *
	 * @param array $attributes Attributes from React.
	 * @return string
	 */
	public function get_carousel( $attributes ) {
		$slides = $attributes['slides'] ?? array();

		if ( empty( $slides ) ) {
			return '';
		}

		$uid         = uniqid( 'swiper-' );
		$slides_html = '';

		foreach ( $slides as $slide ) {
			$image_html = '';
			if ( ! empty( $slide['imageUrl'] ) ) {
				$image_html = sprintf(
					'<img src="%s" alt="">',
					esc_url( $slide['imageUrl'] )
				);
			}

			$slides_html .= sprintf(
				'<div class="swiper-slide">
					<div class="carousel-image">%s</div>
					<div class="carousel-content">
						<div class="carousel-title">%s</div>
						<div class="carousel-subtitle">%s</div>
						<div class="carousel-author">by %s</div>
					</div>
				</div>',
				$image_html,
				esc_html( $slide['title'] ?? '' ),
				esc_html( $slide['subtitle'] ?? '' ),
				esc_html( $slide['author'] ?? '' )
			);
		}

		$html = sprintf(
			'<div class="swiper-container %1$s">
				<div class="swiper-wrapper">%2$s</div>
				<div class="swiper-pagination"></div>
			</div>',
			esc_attr( $uid ),
			$slides_html
		);

		// Optionally append Swiper JS initialization.
		$html .= $this->register_swiper_js( $uid );

		return $html;
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


	/**
	 * Register Swiper JS for the carousel block.
	 *
	 * @param string $uid Unique identifier for the swiper instance.
	 * @return string
	 */
	public function register_swiper_js( $uid ) {
		$script = sprintf(
			"<script>
document.addEventListener('DOMContentLoaded', function () {
	new Swiper('.%s', {
		loop: true,
		pagination: {
			el: '.%s .swiper-pagination',
			clickable: true
		},
	});
});
</script>",
			esc_js( $uid ),
			esc_js( $uid )
		);
		return $script;
	}
}

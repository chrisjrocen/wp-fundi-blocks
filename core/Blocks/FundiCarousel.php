<?php

/**
 * Register Blocks for Fundi Carousel Feature
 *
 * @package WP_FUNDI_BLOCKS
 */

namespace WP_FUNDI_BLOCKS\Blocks;

use WP_FUNDI_BLOCKS\Base\BaseController;

/**
 * Handle all the blocks required for Fundi Carousel
 */
class FundiCarousel extends BaseController {

	/**
	 * Register hooks for carousel block and scripts.
	 */
	public function register() {
		add_action( 'init', array( $this, 'create_carousel_block_init' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'register_scripts' ), 1 );
		add_action( 'wp_enqueue_scripts', array( $this, 'register_scripts' ), 1 );
	}

	/**
	 * Enqueue Swiper scripts and styles
	 */
	public function register_scripts() {
		wp_enqueue_script(
			'swiper-script',
			'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js',
			array(),
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
	 * Register the block using metadata and dynamic render callback
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
	 * Render callback for the Swiper carousel
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public function get_carousel( $attributes ) {

		do_action( 'qm/debug', $attributes );

		$slides = $attributes['slides'] ?? array();

		if ( empty( $slides ) ) {
			return '';
		}

		$uid = uniqid( 'swiper-' );

		ob_start();
		?>
		<div <?php echo get_block_wrapper_attributes( array( 'class' => 'swiper-container ' . esc_attr( $uid ) ) ); ?>>
			<div class="swiper-wrapper">
				<?php foreach ( $slides as $slide ) : ?>
					<div class="swiper-slide">
						<div class="carousel-image">
							<?php if ( ! empty( $slide['imageUrl'] ) ) : ?>
								<img src="<?php echo esc_url( $slide['imageUrl'] ); ?>" alt="">
							<?php endif; ?>
						</div>
						<div class="carousel-content">
							<div class="carousel-title"><?php echo esc_html( $slide['title'] ?? '' ); ?></div>
							<div class="carousel-subtitle"><?php echo esc_html( $slide['subtitle'] ?? '' ); ?></div>
							<div class="carousel-author">by <?php echo esc_html( $slide['author'] ?? '' ); ?></div>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
			<div class="swiper-pagination"></div>
		</div>
		<?php

		$html  = ob_get_clean();
		$html .= $this->register_swiper_js( $uid, $attributes );

		return $html;
	}

	/**
	 * Inject Swiper initialization script with fallback values
	 *
	 * @param string $uid Unique ID for the swiper instance.
	 * @param array  $attributes Block attributes.
	 * @return string
	 */
	public function register_swiper_js( $uid, $attributes ) {
		$lazy                    = $attributes['lazyLoad'] ?? 'false';
		$loop                    = $attributes['loopSlides'] ?? 'true';
		$slides_per_view         = $attributes['slidesPerView'] ?? 1;
		$space_between           = $attributes['spaceBetween'] ?? 10;
		$autoplay_delay          = $attributes['autoplayDelay'] ?? 4000;
		$disable_on_interaction  = $attributes['disableOnInteraction'] ?? 'true';
		$phone_slides_per_view   = $attributes['phoneSlidesPerView'] ?? 1;
		$phone_space_between     = $attributes['phoneSpaceBetween'] ?? 10;
		$tab_slides_per_view     = $attributes['tabSlidesPerView'] ?? 1;
		$tab_space_between       = $attributes['tabSpaceBetween'] ?? 10;
		$desktop_slides_per_view = $attributes['desktopSlidesPerView'] ?? $slides_per_view;
		$desktop_space_between   = $attributes['desktopSpaceBetween'] ?? $space_between;

		ob_start();
		?>
		<script>
		window.addEventListener('load', function () {
			if (typeof Swiper !== 'undefined') {
				new Swiper('.<?php echo esc_js( $uid ); ?>', {
					loop: <?php echo esc_js( $loop ); ?>,
					pagination: {
						el: '.<?php echo esc_js( $uid ); ?> .swiper-pagination',
						clickable: true
					},
					lazy: <?php echo esc_js( $lazy ); ?>,
					slidesPerView: <?php echo esc_js( $slides_per_view ); ?>,
					spaceBetween: <?php echo esc_js( $space_between ); ?>,
					autoplay: {
						delay: <?php echo esc_js( $autoplay_delay ); ?>,
						disableOnInteraction: <?php echo esc_js( $disable_on_interaction ); ?>
					},
					breakpoints: {
						0: {
							slidesPerView: <?php echo esc_js( $phone_slides_per_view ); ?>,
							spaceBetween: <?php echo esc_js( $phone_space_between ); ?>
						},
						640: {
							slidesPerView: <?php echo esc_js( $tab_slides_per_view ); ?>,
							spaceBetween: <?php echo esc_js( $tab_space_between ); ?>
						},
						1024: {
							slidesPerView: <?php echo esc_js( $desktop_slides_per_view ); ?>,
							spaceBetween: <?php echo esc_js( $desktop_space_between ); ?>
						}
					}
				});
			}
		});
		</script>
		<?php
		return ob_get_clean();
	}
}

<?php
/**
 * Image Comparison Shortcode Block
 *
 * @package  WP-FUNDI
 */

namespace WP_FUNDI_BLOCKS\Shortcodes;

use WP_FUNDI_BLOCKS\Base\BaseController;

/**
 * ImageCompare class handles the image comparison shortcode functionality
 */
class ImageCompare extends BaseController {

	/**
	 * Shortcode tag
	 *
	 * @var string
	 */
	private $shortcode_tag = 'image_comparison';

	/**
	 * Register actions and filters
	 */
	public function register() {
		add_shortcode( $this->shortcode_tag, array( $this, 'render_shortcode' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
	}

	/**
	 * Enqueue necessary styles and scripts for the image comparison shortcode
	 */
	public function enqueue_scripts() {
		global $post;

		// Only enqueue if shortcode is present on the page
		if ( ! is_a( $post, 'WP_Post' ) || ! has_shortcode( $post->post_content, $this->shortcode_tag ) ) {
			return;
		}

		wp_enqueue_style( 'image-comparison-style', $this->plugin_url . 'assets/css/image-comparison.css', array(), WP_FUNDI_BLOCKS_VERSION );
		wp_enqueue_script( 'image-comparison-script', $this->plugin_url . 'assets/js/image-comparison.js', array(), WP_FUNDI_BLOCKS_VERSION, true );
	}

	/**
	 * Render the image comparison shortcode
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string HTML output for the image comparison.
	 */
	public function render_shortcode( $atts ) {
		// Parse and sanitize attributes
		$atts = $this->parse_attributes( $atts );

		// Validate required images
		if ( empty( $atts['image1'] ) || empty( $atts['image2'] ) ) {
			return $this->render_error( 'Both image1 and image2 attributes are required for the image comparison shortcode.' );
		}

		// Return the rendered HTML
		return $this->render_html( $atts );
	}

	/**
	 * Parse and sanitize shortcode attributes
	 *
	 * @param array $atts Raw shortcode attributes.
	 * @return array Parsed and sanitized attributes.
	 */
	private function parse_attributes( $atts ) {
		$defaults = array(
			'image1'         => '',
			'image2'         => '',
			'alt1'           => '',
			'alt2'           => '',
			'start_position' => '50',
			'orientation'    => 'vertical',
			'handle_color'   => '#ffffff',
			'overlay_color'  => 'transparent',
			'max_width'      => '100%',
			'height'         => 'auto',
			'show_labels'    => 'false',
			'id'             => uniqid( 'comparison-' ),
		);

		$atts = shortcode_atts( $defaults, $atts, $this->shortcode_tag );

		// Sanitize attributes.
		$atts['image1']         = esc_url( $atts['image1'] );
		$atts['image2']         = esc_url( $atts['image2'] );
		$atts['alt1']           = esc_attr( $atts['alt1'] );
		$atts['alt2']           = esc_attr( $atts['alt2'] );
		$atts['start_position'] = absint( $atts['start_position'] );
		$atts['orientation']    = in_array( $atts['orientation'], array( 'vertical', 'horizontal' ), true ) ? $atts['orientation'] : 'vertical';
		$atts['handle_color']   = sanitize_hex_color( $atts['handle_color'] ) ?: '#ffffff';
		$atts['max_width']      = esc_attr( $atts['max_width'] );
		$atts['height']         = esc_attr( $atts['height'] );
		$atts['show_labels']    = filter_var( $atts['show_labels'], FILTER_VALIDATE_BOOLEAN );
		$atts['id']             = esc_attr( $atts['id'] );

		return $atts;
	}

	/**
	 * Render error message
	 *
	 * @param string $message Error message to display.
	 * @return string HTML error message.
	 */
	private function render_error( $message ) {
		return sprintf(
			'<div class="image-comparison-error" style="color: red; padding: 10px; border: 1px solid red; background: #ffe6e6; border-radius: 4px;">
                <strong>Error:</strong> %s
            </div>',
			esc_html( $message )
		);
	}

	/**
	 * Render the comparison HTML
	 *
	 * @param array $atts Parsed attributes.
	 * @return string HTML output.
	 */
	private function render_html( $atts ) {
		ob_start();
		?>
		<div class="image-comparison-container" 
			id="<?php echo esc_attr( $atts['id'] ); ?>"
			data-orientation="<?php echo esc_attr( $atts['orientation'] ); ?>"
			data-start-position="<?php echo esc_attr( $atts['start_position'] ); ?>"
			style="max-width: <?php echo esc_attr( $atts['max_width'] ); ?>;">
			
			<div class="comparison-wrapper">
				<!-- Original/Before Image -->
				<img src="<?php echo esc_url( $atts['image1'] ); ?>" 
					alt="<?php echo esc_attr( $atts['alt1'] ); ?>" 
					class="comparison-image comparison-image-1"
					loading="lazy">
				
				<!-- Overlay/After Image Container -->
				<div class="comparison-overlay" 
					style="clip-path: inset(0 <?php echo 100 - absint( $atts['start_position'] ); ?>% 0 0);">
					<img src="<?php echo esc_url( $atts['image2'] ); ?>" 
						alt="<?php echo esc_attr( $atts['alt2'] ); ?>" 
						class="comparison-image comparison-image-2"
						loading="lazy">
				</div>
				
				<!-- Slider Handle -->
				<div class="comparison-slider" 
					style="left: <?php echo esc_attr( $atts['start_position'] ); ?>%; background-color: <?php echo esc_attr( $atts['handle_color'] ); ?>;"
					role="slider"
					aria-label="Image comparison slider"
					aria-valuenow="<?php echo esc_attr( $atts['start_position'] ); ?>"
					aria-valuemin="0"
					aria-valuemax="100"
					tabindex="0">
					<div class="slider-handle">
						<?php echo $this->get_slider_icon(); ?>
					</div>
				</div>
				
				<?php if ( $atts['show_labels'] ) : ?>
					<!-- Optional Labels -->
					<div class="comparison-labels">
						<span class="label-before"><?php echo esc_html( $atts['alt1'] ); ?></span>
						<span class="label-after"><?php echo esc_html( $atts['alt2'] ); ?></span>
					</div>
				<?php endif; ?>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the slider icon SVG
	 *
	 * @return string SVG icon HTML.
	 */
	private function get_slider_icon() {
		return '<svg class="slider-icon" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
            <path fill="currentColor" d="M10 5 L5 15 L10 25 M20 5 L25 15 L20 25" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>';
	}
}

<?php

/**
 * Register Blocks for Masthead
 *
 * @package WP_FUNDI_BLOCKS
 */

namespace WP_FUNDI_BLOCKS\Blocks;

use WP_FUNDI_BLOCKS\Base\BaseController;

/**
 * Handle all the blocks required for Masthead
 */
class Masthead extends BaseController {

	/**
	 * Register hooks for masthead block.
	 */
	public function register() {
		add_action( 'init', array( $this, 'masthead_block_init' ) );
	}

	/**
	 * Registers the block using the metadata loaded from the `block.json` file.
	 * Behind the scenes, it registers also all assets so they can be enqueued
	 * through the block editor in the corresponding context.
	 *
	 * @see https://developer.wordpress.org/reference/functions/register_block_type/
	 */
	public function masthead_block_init() {

		register_block_type_from_metadata(
			$this->plugin_path . 'build/masthead/',
			array(
				'render_callback' => array( $this, 'render_masthead_block' ),
			)
		);
	}

	/**
	 * Render the masthead block.
	 *
	 * @param array  $attributes The block attributes.
	 * @param string $content The block content.
	 * @return string The rendered block output.
	 */
	public function render_masthead_block( $attributes, $content ) {

		// Sanitize and validate entries.
		$entries = isset( $attributes['entries'] ) ? $this->masthead_sanitize_entries( $attributes['entries'] ) : array();

		// Get styling attributes with defaults.
		$title_font_weight    = isset( $attributes['titleFontWeight'] ) ? esc_attr( $attributes['titleFontWeight'] ) : 'bold';
		$title_font_style     = isset( $attributes['titleFontStyle'] ) ? esc_attr( $attributes['titleFontStyle'] ) : 'normal';
		$title_color          = isset( $attributes['titleColor'] ) ? esc_attr( $attributes['titleColor'] ) : '#333';
		$title_text_transform = isset( $attributes['titleTextTransform'] ) ? esc_attr( $attributes['titleTextTransform'] ) : 'capitalize';

		$name_font_weight    = isset( $attributes['nameFontWeight'] ) ? esc_attr( $attributes['nameFontWeight'] ) : 'normal';
		$name_font_style     = isset( $attributes['nameFontStyle'] ) ? esc_attr( $attributes['nameFontStyle'] ) : 'normal';
		$name_color          = isset( $attributes['nameColor'] ) ? esc_attr( $attributes['nameColor'] ) : '#555';
		$name_text_transform = isset( $attributes['nameTextTransform'] ) ? esc_attr( $attributes['nameTextTransform'] ) : 'none';

		$background_color = isset( $attributes['backgroundColor'] ) && 'transparent' !== $attributes['backgroundColor'] ? esc_attr( $attributes['backgroundColor'] ) : '';
		$padding_top      = isset( $attributes['paddingTop'] ) ? floatval( $attributes['paddingTop'] ) : 2;
		$padding_bottom   = isset( $attributes['paddingBottom'] ) ? floatval( $attributes['paddingBottom'] ) : 2;
		$padding_left     = isset( $attributes['paddingLeft'] ) ? floatval( $attributes['paddingLeft'] ) : 1;
		$padding_right    = isset( $attributes['paddingRight'] ) ? floatval( $attributes['paddingRight'] ) : 1;
		$full_width       = isset( $attributes['fullWidth'] ) ? $attributes['fullWidth'] : false;

		// Build inline styles.
		$container_styles = array();
		if ( $background_color ) {
			$container_styles[] = 'background-color: ' . $background_color;
		}
		$container_styles[] = 'padding: ' . $padding_top . 'rem ' . $padding_right . 'rem ' . $padding_bottom . 'rem ' . $padding_left . 'rem';
		if ( $full_width ) {
			$container_styles[] = 'text-align: center';
			$container_styles[] = 'max-width: none';
		} else {
			$container_styles[] = 'text-align: left';
		}

		$title_styles = array(
			'font-weight: ' . $title_font_weight,
			'font-style: ' . $title_font_style,
			'color: ' . $title_color,
			'text-transform: ' . $title_text_transform,
			'margin: 0',
			'line-height: 1.6em',
		);

		$name_styles = array(
			'font-weight: ' . $name_font_weight,
			'font-style: ' . $name_font_style,
			'color: ' . $name_color,
			'text-transform: ' . $name_text_transform,
			'margin: 0',
			'line-height: 1.6em',
		);

		$wrapper_attributes = get_block_wrapper_attributes(
			array(
				'style' => implode( '; ', $container_styles ),
			)
		);

		if ( empty( $entries ) ) {
			return '';
		}

		ob_start();
		?>
<div <?php echo $wrapper_attributes; ?>>
	<div class="masthead-container" role="list" aria-label="<?php esc_attr_e( 'Masthead contributors', 'masthead-block-wp' ); ?>">
		<?php foreach ( $entries as $entry ) : ?>
			<?php if ( ! empty( $entry['title'] ) && ! empty( $entry['names'] ) ) : ?>
				<div class="masthead-entry" role="listitem">
					<?php if ( ! empty( $entry['section'] ) ) : ?>
						<div class="masthead-section" style="margin: 2em 0 1em 0; border-top: 1px solid #eee; padding-top: 1em; font-weight: bold; text-transform: uppercase; font-size: 0.9em; letter-spacing: 0.5px; text-align: center; grid-column: 1 / -1;">
							<?php echo esc_html( $entry['section'] ); ?>
						</div>
					<?php endif; ?>
					
					<div class="masthead-title" style="<?php echo esc_attr( implode( '; ', $title_styles ) ); ?>">
						<?php echo esc_html( $entry['title'] ); ?>
					</div>
					
					<div class="masthead-names">
						<?php foreach ( $entry['names'] as $index => $name ) : ?>
							<div class="masthead-name" style="<?php echo esc_attr( implode( '; ', $name_styles ) ); ?>">
								<?php
								if ( $index > 0 ) :
									?>
									<?php endif; ?><?php echo esc_html( $name ); ?>
							</div>
						<?php endforeach; ?>
					</div>
				</div>
			<?php endif; ?>
		<?php endforeach; ?>
	</div>
</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Sanitize masthead entries.
	 *
	 * @param array $entries The entries to sanitize.
	 * @return array The sanitized entries.
	 */
	public function masthead_sanitize_entries( $entries ) {
		if ( ! is_array( $entries ) ) {
			return array();
		}

		$sanitized = array();
		foreach ( $entries as $entry ) {
			if ( ! is_array( $entry ) || ! isset( $entry['title'] ) || ! isset( $entry['names'] ) ) {
				continue;
			}

			$sanitized_entry = array(
				'title'   => sanitize_text_field( $entry['title'] ),
				'names'   => array(),
				'section' => isset( $entry['section'] ) ? sanitize_text_field( $entry['section'] ) : '',
			);

			if ( is_array( $entry['names'] ) ) {
				foreach ( $entry['names'] as $name ) {
					if ( is_string( $name ) && ! empty( trim( $name ) ) ) {
						$sanitized_entry['names'][] = sanitize_text_field( $name );
					}
				}
			}

			if ( ! empty( $sanitized_entry['title'] ) && ! empty( $sanitized_entry['names'] ) ) {
				$sanitized[] = $sanitized_entry;
			}
		}

		return $sanitized;
	}
}

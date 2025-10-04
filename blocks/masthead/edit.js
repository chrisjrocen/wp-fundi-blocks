/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { 
	useBlockProps, 
	InspectorControls,
} from '@wordpress/block-editor';

import {
	PanelBody,
	TextareaControl,
	SelectControl,
	ColorPicker,
	ToggleControl,
	RangeControl,
	Button,
	Notice
} from '@wordpress/components';

import { useState } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		entries,
		jsonInput,
		titleFontWeight,
		titleFontStyle,
		titleColor,
		titleTextTransform,
		nameFontWeight,
		nameFontStyle,
		nameColor,
		nameTextTransform,
		backgroundColor,
		paddingTop,
		paddingBottom,
		paddingLeft,
		paddingRight,
		fullWidth
	} = attributes;

	const [jsonError, setJsonError] = useState('');

	const blockProps = useBlockProps({
		style: {
			backgroundColor: backgroundColor !== 'transparent' ? backgroundColor : undefined,
			padding: `${paddingTop}rem ${paddingRight}rem ${paddingBottom}rem ${paddingLeft}rem`,
			textAlign: fullWidth ? 'center' : 'left',
			maxWidth: fullWidth ? 'none' : '100%'
		}
	});

	const fontWeightOptions = [
		{ label: __('Normal', 'masthead-block-wp'), value: 'normal' },
		{ label: __('Semibold', 'masthead-block-wp'), value: '600' },
		{ label: __('Bold', 'masthead-block-wp'), value: 'bold' }
	];

	const textTransformOptions = [
		{ label: __('None', 'masthead-block-wp'), value: 'none' },
		{ label: __('Capitalize', 'masthead-block-wp'), value: 'capitalize' },
		{ label: __('Uppercase', 'masthead-block-wp'), value: 'uppercase' }
	];

	const handleJsonUpdate = () => {
		if (!jsonInput.trim()) {
			setJsonError('');
			return;
		}

		try {
			const parsedEntries = JSON.parse(jsonInput);
			if (!Array.isArray(parsedEntries)) {
				throw new Error(__('Input must be an array', 'masthead-block-wp'));
			}

			// Validate structure
			for (const entry of parsedEntries) {
				if (!entry.title || !entry.names || !Array.isArray(entry.names)) {
					throw new Error(__('Each entry must have "title" (string) and "names" (array)', 'masthead-block-wp'));
				}
			}

			setAttributes({ entries: parsedEntries });
			setJsonError('');
		} catch (error) {
			setJsonError(error.message);
		}
	};

	const exportJson = () => {
		navigator.clipboard.writeText(JSON.stringify(entries, null, 2));
	};

	const renderEntry = (entry, index) => {
		const titleStyle = {
			fontWeight: titleFontWeight,
			fontStyle: titleFontStyle,
			color: titleColor,
			textTransform: titleTextTransform,
			margin: 0,
			lineHeight: '1.6em'
		};

		const nameStyle = {
			fontWeight: nameFontWeight,
			fontStyle: nameFontStyle,
			color: nameColor,
			textTransform: nameTextTransform,
			margin: 0,
			lineHeight: '1.6em'
		};

		return (
			<div key={index} className="masthead-entry">
				{entry.section && (
					<div className="masthead-section" style={{ margin: '2em 0 1em 0', borderTop: '1px solid #eee', paddingTop: '1em', textAlign: 'center', gridColumn: '1 / -1' }}>
						{entry.section}
					</div>
				)}
				<div className="masthead-title" style={titleStyle}>{entry.title}:</div>
				<div className="masthead-names">
					{entry.names.map((name, nameIndex) => (
						<div key={nameIndex} className="masthead-name" style={nameStyle}>
							{nameIndex > 0 && '— '}{name}
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Content', 'masthead-block-wp')} initialOpen={true}>
					<TextareaControl
						label={__('JSON Input', 'masthead-block-wp')}
						help={__('Enter contributor data as JSON. Format: [{"title": "Role", "names": ["Name 1", "Name 2"]}]', 'masthead-block-wp')}
						value={jsonInput}
						onChange={(value) => setAttributes({ jsonInput: value })}
						rows={8}
					/>
					{jsonError && (
						<Notice status="error" isDismissible={false}>
							{jsonError}
						</Notice>
					)}
					<div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
						<Button isPrimary onClick={handleJsonUpdate}>
							{__('Update from JSON', 'masthead-block-wp')}
						</Button>
						<Button isSecondary onClick={exportJson}>
							{__('Copy Current Data', 'masthead-block-wp')}
						</Button>
					</div>
				</PanelBody>

				<PanelBody title={__('Title Styling', 'masthead-block-wp')} initialOpen={false}>
					<SelectControl
						label={__('Font Weight', 'masthead-block-wp')}
						value={titleFontWeight}
						options={fontWeightOptions}
						onChange={(value) => setAttributes({ titleFontWeight: value })}
					/>
					<ToggleControl
						label={__('Italic', 'masthead-block-wp')}
						checked={titleFontStyle === 'italic'}
						onChange={(value) => setAttributes({ titleFontStyle: value ? 'italic' : 'normal' })}
					/>
					<div style={{ marginBottom: '16px' }}>
						<label>{__('Color', 'masthead-block-wp')}</label>
						<ColorPicker
							color={titleColor}
							onChange={(color) => setAttributes({ titleColor: color })}
						/>
					</div>
					<SelectControl
						label={__('Text Transform', 'masthead-block-wp')}
						value={titleTextTransform}
						options={textTransformOptions}
						onChange={(value) => setAttributes({ titleTextTransform: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Name Styling', 'masthead-block-wp')} initialOpen={false}>
					<SelectControl
						label={__('Font Weight', 'masthead-block-wp')}
						value={nameFontWeight}
						options={fontWeightOptions}
						onChange={(value) => setAttributes({ nameFontWeight: value })}
					/>
					<ToggleControl
						label={__('Italic', 'masthead-block-wp')}
						checked={nameFontStyle === 'italic'}
						onChange={(value) => setAttributes({ nameFontStyle: value ? 'italic' : 'normal' })}
					/>
					<div style={{ marginBottom: '16px' }}>
						<label>{__('Color', 'masthead-block-wp')}</label>
						<ColorPicker
							color={nameColor}
							onChange={(color) => setAttributes({ nameColor: color })}
						/>
					</div>
					<SelectControl
						label={__('Text Transform', 'masthead-block-wp')}
						value={nameTextTransform}
						options={textTransformOptions}
						onChange={(value) => setAttributes({ nameTextTransform: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Layout', 'masthead-block-wp')} initialOpen={false}>
					<div style={{ marginBottom: '16px' }}>
						<label>{__('Background Color', 'masthead-block-wp')}</label>
						<ColorPicker
							color={backgroundColor}
							onChange={(color) => setAttributes({ backgroundColor: color })}
						/>
						<Button 
							isSmall 
							isSecondary 
							onClick={() => setAttributes({ backgroundColor: 'transparent' })}
							style={{ marginTop: '8px' }}
						>
							{__('Clear', 'masthead-block-wp')}
						</Button>
					</div>
					<RangeControl
						label={__('Padding Top (rem)', 'masthead-block-wp')}
						value={paddingTop}
						onChange={(value) => setAttributes({ paddingTop: value })}
						min={0}
						max={8}
						step={0.5}
					/>
					<RangeControl
						label={__('Padding Bottom (rem)', 'masthead-block-wp')}
						value={paddingBottom}
						onChange={(value) => setAttributes({ paddingBottom: value })}
						min={0}
						max={8}
						step={0.5}
					/>
					<RangeControl
						label={__('Padding Left (rem)', 'masthead-block-wp')}
						value={paddingLeft}
						onChange={(value) => setAttributes({ paddingLeft: value })}
						min={0}
						max={8}
						step={0.5}
					/>
					<RangeControl
						label={__('Padding Right (rem)', 'masthead-block-wp')}
						value={paddingRight}
						onChange={(value) => setAttributes({ paddingRight: value })}
						min={0}
						max={8}
						step={0.5}
					/>
					<ToggleControl
						label={__('Full Width Centered', 'masthead-block-wp')}
						checked={fullWidth}
						onChange={(value) => setAttributes({ fullWidth: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="masthead-container" role="list" aria-label={__('Masthead contributors', 'masthead-block-wp')} style={{ maxWidth: '800px', margin: '0 auto' }}>
					{entries && entries.length > 0 ? (
						entries.map((entry, index) => renderEntry(entry, index))
					) : (
						<div className="masthead-placeholder">
							{__('Add contributors using the JSON input in the block settings.', 'masthead-block-wp')}
						</div>
					)}
				</div>
			</div>
		</>
	);
}
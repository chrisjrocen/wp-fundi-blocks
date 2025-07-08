/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { InspectorControls, useBlockProps, MediaUpload, MediaUploadCheck, RichText } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { TextControl, PanelBody, Button } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

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
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
    const slides = attributes.slides || [];

    const updateSlide = (index, key, value) => {
        const newSlides = [...slides];
        newSlides[index][key] = value;
        setAttributes({ slides: newSlides });
    };

    const addSlide = () => {
        const newSlides = [...slides, { imageUrl: '', title: '', subtitle: '', author: '' }];
        setAttributes({ slides: newSlides });
    };

    const removeSlide = (index) => {
        const newSlides = [...slides];
        newSlides.splice(index, 1);
        setAttributes({ slides: newSlides });
    };

    return (
        <Fragment>
            <InspectorControls>
                <PanelBody title={__('Slides')}>
                    <Button onClick={addSlide} variant="primary">Add Slide</Button>
                </PanelBody>
            </InspectorControls>
            <div {...useBlockProps()}>
                {slides.map((slide, index) => (
                    <div key={index} className="editor-slide" style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={(media) => updateSlide(index, 'imageUrl', media.url)}
                                allowedTypes={['image']}
                                render={({ open }) => (
                                    <Button onClick={open} className="button">
                                        {slide.imageUrl ? (
                                            <img src={slide.imageUrl} style={{ width: '100px', height: 'auto' }} alt="" />
                                        ) : 'Upload Image'}
                                    </Button>
                                )}
                            />
                        </MediaUploadCheck>
                        <TextControl
                            label="Title"
                            value={slide.title}
                            onChange={(value) => updateSlide(index, 'title', value)}
                        />
                        <TextControl
                            label="Subtitle"
                            value={slide.subtitle}
                            onChange={(value) => updateSlide(index, 'subtitle', value)}
                        />
                        <TextControl
                            label="Author"
                            value={slide.author}
                            onChange={(value) => updateSlide(index, 'author', value)}
                        />
                        <Button onClick={() => removeSlide(index)} isDestructive>Remove Slide</Button>
                    </div>
                ))}
                <ServerSideRender
                    block="wp-fundi-blocks/wp-fundi-carousel"
                    attributes={attributes}
                />
            </div>
        </Fragment>
    );
}
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
import { TextControl, PanelBody, PanelRow, Button, SelectControl, ToggleControl, RangeControl } from '@wordpress/components';
import { Fragment, useEffect } from '@wordpress/element';
import Devices from './devices';

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
export default function Edit({ attributes, setAttributes, clientId }) {
    const {
        numberOfItems,
        showText,
        showTextName,
        showTextCompany,
        showTextBlurb,
        orderBy,
        order,
        autoplayDelay,
        autoplayDisableOninteraction,
        itemDevice,
        desktopSlidesPerView,
        tabSlidesPerView,
        phoneSlidesPerView,
        desktopSpaceBetween,
        tabSpaceBetween,
        phoneSpaceBetween,
        lazyLoad,
        loopSlides,
        showDots
    } = attributes;


    const blockProps = useBlockProps({
        padding: '1rem',
        margin: '1rem 0',
    });

    const instanceId = clientId;
    useEffect(() => {
        setAttributes({ instanceId });
    }, [instanceId]);

    const orderby_options = [
        {
            label: 'Default',
            value: '',
        },
        {
            label: 'Name',
            value: 'title',
        },
        {
            label: 'Custom Rank',
            value: 'people_ranking',
        }
    ];

    const order_options = [
        {
            label: 'Ascending',
            value: 'ASC',
        },
        {
            label: 'Descending',
            value: 'DESC',
        }
    ];

    const boolean_options = [
        {
            label: 'Yes',
            value: true
        },
        {
            label: 'No',
            value: false
        }
    ];

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
                <PanelBody
                    title={__('Number of Items', 'wp-fundi-blocks')}
                    initialOpen={false}
                >
                    <PanelRow>
                        <fieldset>
                            <TextControl
                                label={__('Enter the number of items to display', 'wp-fundi-blocks')}
                                value={numberOfItems}
                                onChange={(value) => setAttributes({ numberOfItems: parseInt(value) })}
                                type="number"
                            />
                        </fieldset>
                    </PanelRow>
                </PanelBody>
                <PanelBody
                    title={__('Text Display Settings', 'wp-fundi-blocks')}
                    initialOpen={false}
                >
                    <PanelRow>
                        <fieldset>
                            <ToggleControl
                                label="Show Text"
                                checked={showText}
                                onChange={(value) => setAttributes({ showText: value })}
                            />
                        </fieldset>
                    </PanelRow>
                    {showText && (
                        <PanelRow>
                            <fieldset>
                                <ToggleControl
                                    label="Show Name"
                                    checked={showTextName}
                                    onChange={(value) => setAttributes({ showTextName: value })}
                                />
                                <ToggleControl
                                    label="Show Company"
                                    checked={showTextCompany}
                                    onChange={(value) => setAttributes({ showTextCompany: value })}
                                />
                                <ToggleControl
                                    label="Show Blurb"
                                    checked={showTextBlurb}
                                    onChange={(value) => setAttributes({ showTextBlurb: value })}
                                />
                            </fieldset>
                        </PanelRow>
                    )}
                </PanelBody>
                <PanelBody
                    title={__('Order options', 'wp-fundi-blocks')}
                    initialOpen={false}
                >
                    <PanelRow>
                        <fieldset>
                            <SelectControl
                                label={__('Order by', 'wp-fundi-blocks')}
                                options={orderby_options}
                                value={orderBy}
                                onChange={(value) => {
                                    setAttributes({ orderBy: value });
                                }}
                            />
                        </fieldset>
                    </PanelRow>
                    <PanelRow>
                        <fieldset>
                            <SelectControl
                                label={__('Order in', 'wp-fundi-blocks')}
                                options={order_options}
                                value={order}
                                onChange={(value) => {
                                    setAttributes({ order: value });
                                }}
                            />
                        </fieldset>
                    </PanelRow>
                </PanelBody>
                <PanelBody
                    title={__('Slides Settings', 'wp-fundi-blocks')}
                    initialOpen={false}
                >
                    <Devices
                        device={itemDevice}
                        title={__(
                            'Slides Per View',
                            'wp-fundi-blocks'
                        )}
                        renderFunction={(device) =>
                            setAttributes({
                                itemDevice: device,
                            })
                        }
                    />
                    {itemDevice === 'desktop' && (
                        <RangeControl
                            value={desktopSlidesPerView}
                            onChange={(desktopSlidesPerView) =>
                                setAttributes({ desktopSlidesPerView })
                            }
                            min={1}
                            max={10}
                        />
                    )}
                    {itemDevice === 'tablet' && (
                        <RangeControl
                            value={tabSlidesPerView}
                            onChange={(tabSlidesPerView) =>
                                setAttributes({ tabSlidesPerView })
                            }
                            min={1}
                            max={10}
                        />
                    )}
                    {itemDevice === 'smartphone' && (
                        <RangeControl
                            value={phoneSlidesPerView}
                            onChange={(phoneSlidesPerView) =>
                                setAttributes({ phoneSlidesPerView })
                            }
                            min={1}
                            max={10}
                        />
                    )}

                    <Devices
                        device={itemDevice}
                        title={__(
                            'Space Between Slides',
                            'wp-fundi-blocks'
                        )}
                        renderFunction={(device) =>
                            setAttributes({
                                itemDevice: device,
                            })
                        }
                    />
                    {itemDevice === 'desktop' && (
                        <RangeControl
                            value={desktopSpaceBetween}
                            onChange={(desktopSpaceBetween) =>
                                setAttributes({ desktopSpaceBetween })
                            }
                            min={0}
                            max={100}
                        />
                    )}
                    {itemDevice === 'tablet' && (
                        <RangeControl
                            value={tabSpaceBetween}
                            onChange={(tabSpaceBetween) =>
                                setAttributes({ tabSpaceBetween })
                            }
                            min={0}
                            max={100}
                        />
                    )}
                    {itemDevice === 'smartphone' && (
                        <RangeControl
                            value={phoneSpaceBetween}
                            onChange={(phoneSpaceBetween) =>
                                setAttributes({ phoneSpaceBetween })
                            }
                            min={0}
                            max={100}
                        />
                    )}
                    <PanelRow>
                        <fieldset>
                            <TextControl
                                label={__('Auto play Delay', 'wp-fundi-blocks')}
                                value={autoplayDelay}
                                onChange={(value) =>  setAttributes({ autoplayDelay: parseInt(value) }) }
                                type="number"
                            />
                        </fieldset>
                    </PanelRow>
                    <PanelRow>
                        <fieldset>
                            <SelectControl
                                label={__('Autoplay on interaction', 'wp-fundi-blocks')}
                                options={boolean_options}
                                value={autoplayDisableOninteraction}
                                onChange={(value) => {
                                    setAttributes({ autoplayDisableOninteraction: value });
                                }}
                            />
                        </fieldset>
                    </PanelRow>
                    <PanelRow>
                        <fieldset>
                            <SelectControl
                                label={__('Lazy Load', 'wp-fundi-blocks')}
                                options={boolean_options}
                                value={lazyLoad}
                                onChange={(value) => {
                                    setAttributes({ lazyLoad: value });
                                }}
                            />
                        </fieldset>
                    </PanelRow>
                    <PanelRow>
                        <fieldset>
                            <SelectControl
                                label={__('Loop Slides?', 'wp-fundi-blocks')}
                                options={boolean_options}
                                value={loopSlides}
                                onChange={(value) => {
                                    setAttributes({ loopSlides: value });
                                }}
                            />
                        </fieldset>
                    </PanelRow>
                    <PanelRow>
                        <fieldset>
                            <SelectControl
                                label={__('Show Pagination dots', 'wp-fundi-blocks')}
                                options={boolean_options}
                                value={showDots}
                                onChange={(value) => {
                                    setAttributes({ showDots: value });
                                }}
                            />
                        </fieldset>
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
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
            </div>
            <ServerSideRender
                    block="wp-fundi-blocks/wp-fundi-carousel"
                    attributes={attributes}
                />
        </Fragment>
    );
}
const { Card, CardBody, ToggleControl, TextControl, Button, SelectControl, Dashicon, FormTokenField, Dropdown, RangeControl, ResponsiveWrapper, ButtonGroup, CheckboxControl } = wp.components
const { useState, useEffect } = wp.element;
const { escapeHTML } = wp.escapeHtml;
const { __ } = wp.i18n;
const { customize } = wp;
const { MediaUpload } = wp.blockEditor;
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import {arrayMoveImmutable} from 'array-move';
import Select from 'react-select'
import AsyncSelect from 'react-select/async'

var ajaxurl = customizerControlsObject.ajaxUrl, _wpnonce = customizerControlsObject._wpnonce;

import { __experimentalNumberControl as NumberControl } from '@wordpress/components';

// Block repeater control 
export const NewsmaticBlockRepeater = ( props ) =>  {
    const [ repeater, setRepeater ] = useState(JSON.parse(props.value)),
        { label, description } = customize.settings.controls[props.setting]

    useEffect(() => {
        customize.value( props.setting )( JSON.stringify( repeater ) )
    }, [ repeater ]);

    const onSortEnd = ( e ) => {
        setRepeater(( prev ) => {
            return arrayMoveImmutable( prev, e.oldIndex, e.newIndex )
        })
    }

    function updateValue( key, block ) {
        setRepeater( prev => {
            const newRepeater = [ ...prev ];
            newRepeater[ key ] = block;
            return newRepeater;
        });
    }

    return (
        <>
            <label className="customize-control-title">{ label }</label>
            <span className="customize-control-description">{ description }</span>
            <BlockSortableList 
                onSortEnd = { onSortEnd }
                hideSortableGhost = { false }
                repeater = { repeater }
                updateValue = { updateValue }
            />
        </>
    )
}

const PostBlock = ( props ) => {
    const { block, itemKey, updateValue } = props,
        [ responsiveIcon, setResponsiveIcon ] = useState('desktop'),
        [ option, setOption ] = useState( block.option ),
        [ title, setTitle ] = useState( block.title),
        [ uniqueId, setUniqueId ] = useState( block.uniqueId || Date.now().toString() + generateRandomLetter()),
        [ blockId, setBlockId ] = useState( block.blockId ),
        [ imageSize, setImageSize ] = useState( block.imageSize || 'medium' ),
        [ imageRatio, setImageRatio ] = useState( block.imageRatio || { 'desktop':  0.6, 'tablet': 0.8, 'smartphone': 0.6} ),
        [ imageRadius, setImageRadius ] = useState( block.imageRadius || { 'desktop':  0, 'tablet': 0, 'smartphone': 0} ),
        [ thumbOption, setThumbOption ] = useState( block.thumbOption ),
        [ dateOption, setDateOption ] = useState( block.dateOption ),
        [ authorOption, setAuthorOption ] = useState( block.authorOption ),
        [ categoryOption, setCategoryOption ] = useState( block.categoryOption ),
        [ commentOption, setCommentOption ] = useState( block.commentOption ),
        [ excerptOption, setExcerptOption ] = useState( block.excerptOption ),
        [ excerptLength, setExcerptLength ] = useState( block.excerptLength ),
        [ query, setQuery ] = useState( block.query ),
        [ buttonOption, setButtonOption ] = useState( block.buttonOption ),
        [ viewallOption, setViewallOption ] = useState( block.viewallOption ),
        [ viewallUrl, setViewallUrl ] = useState( block.viewallUrl ),
        [ column, setColumn ] = useState( block.column || 'two'),
        [ columns, setColumns ] = useState( block.columns || 4 ),
        [ dots, setDots ] = useState( block.dots ),
        [ loop, setLoop ] = useState( block.loop ),
        [ arrows, setArrows ] = useState( block.arrows ),
        [ auto, setAuto ] = useState( block.auto ),
        [ layout, setLayout ] = useState( block.layout ),
        [ dropdown, setDropdown ] = useState( false ),
        imageSizes = customizerControlsObject.imageSizes;

    const updateImageRatio = (newImageRatio) => {
        let tempImageRatio = imageRatio
        tempImageRatio[responsiveIcon] = newImageRatio
        setImageRatio(JSON.parse(JSON.stringify(tempImageRatio)))
    }

    const updateImageRadius = (newImageRadius) => {
        let tempImageRadius = imageRadius
        tempImageRadius[responsiveIcon] = newImageRadius
        setImageRadius(JSON.parse(JSON.stringify(tempImageRadius)))
    }

    const updateResponsiveIcon = (newIcon) => {
        const footer = document.getElementById( "customize-footer-actions" )
        if( newIcon == 'tablet' ) { 
            setResponsiveIcon( 'tablet' )
            footer.getElementsByClassName( "preview-tablet" )[0].click()
        }
        if( newIcon == 'smartphone' ) {
            setResponsiveIcon( 'smartphone' )
            footer.getElementsByClassName( "preview-mobile" )[0].click()
        }
        if( newIcon == 'desktop' ) {
            setResponsiveIcon( 'desktop' )
            footer.getElementsByClassName( "preview-desktop" )[0].click()
        }
    }

    const triggerDevice = (device) => {
        if( device == 'mobile' ) {
            setResponsiveIcon( 'smartphone' )
        } else {
            setResponsiveIcon( device )
        }
    }

    useEffect(() => {
        const resFooter = document.getElementById( "customize-footer-actions" )
        const resFooterClass =  resFooter.getElementsByClassName( "devices-wrapper" )
        const buttons = resFooterClass[0].getElementsByTagName( "button" )
        for(  const button of buttons ) {
            button.addEventListener( "click", function() {
                const currentDevice =  button.getAttribute("data-device")
                triggerDevice(currentDevice)
            })
        }
    },[])

    // update parent value
    useEffect(() => {
        let postBlockData = {
            'type':  block.type,
            'option': option,
            'title': title,
            'imageSize': imageSize,
            'imageRatio': imageRatio,
            'imageRadius': imageRadius,
            'blockId': blockId,
            'uniqueId': uniqueId,
            'dateOption': dateOption,
            'authorOption': authorOption,
            'categoryOption': categoryOption,
            'commentOption': commentOption,
            'excerptOption': excerptOption,
            'excerptLength': excerptLength,
            'query': query,
            'buttonOption': buttonOption,
            'viewallOption': viewallOption,
            'viewallUrl': viewallUrl,
            'layout': layout
        }
        if(  block.type == 'news-list' ||  block.type == 'news-grid' ) {
            postBlockData.column = column
            postBlockData.thumbOption = thumbOption
        }
        if(  block.type == 'news-carousel' ) {
            postBlockData.columns = columns
            postBlockData.dots = dots
            postBlockData.loop = loop
            postBlockData.arrows = arrows
            postBlockData.auto = auto
        }
        updateValue( itemKey, postBlockData )
    }, [ option, title, blockId, imageSize, imageRatio, imageRadius, dateOption, authorOption, categoryOption, commentOption, excerptOption, excerptLength, buttonOption, viewallOption, viewallUrl, thumbOption, column, columns, layout, query, dots, loop, arrows, auto ])

    return (
        <div className={ `block-item block--${ block.option ? "visibility" : "hidden" }` } elevation={ 4 } isRounded={ false } size="x-small">
            <div className="block-header">
                <span className="control-title">{ escapeHTML( block.type.replace( '-', ' ' ) ) }</span>
                <Dashicon
                    className = "dropdown-icon"
                    icon = { `arrow-${ dropdown ? 'down' : 'up' }-alt2` }
                    onClick = {() => setDropdown( ! dropdown )}
                />
                <span className={ `display-icon dashicons dashicons-${ block.option ? "visibility" : "hidden"}` } onClick={() => setOption( ! option )}></span>
            </div>
            { dropdown && <div className="block-content">
                <TextControl
                    label = { __( escapeHTML( 'Block Title' ), 'newsmatic-pro' ) }
                    value = { title }
                    onChange = {( newValue ) => setTitle( newValue )}
                />
                {( block.type == 'news-list' || block.type == 'news-grid' ) &&
                    <ToggleControl
                        label = { __( escapeHTML( 'Show post thumbnail' ), 'newsmatic-pro' ) }
                        checked = { thumbOption }
                        onChange = {( newToggle ) => setThumbOption( newToggle )}
                    />
                }
                <ToggleControl
                    label = { __( escapeHTML( 'Show post date' ), 'newsmatic-pro' ) }
                    checked = { dateOption }
                    onChange = {( newToggle ) => setDateOption( newToggle )}
                />
                <ToggleControl
                    label = { __( escapeHTML( 'Show post author' ), 'newsmatic-pro' ) }
                    checked = { authorOption }
                    onChange = {( newToggle ) => setAuthorOption( newToggle )}
                />
                <ToggleControl
                    label = { __( escapeHTML( 'Show post category' ), 'newsmatic-pro' ) }
                    checked = { categoryOption }
                    onChange = {( newToggle ) => setCategoryOption( newToggle )}
                />
                <ToggleControl
                    label = { __( escapeHTML( 'Show post comment' ), 'newsmatic-pro' ) }
                    checked = { commentOption }
                    onChange = {( newToggle ) => setCommentOption( newToggle )}
                />
                {( block.type != 'news-carousel' &&  block.type != 'news-filter' ) &&
                    <>
                        <ToggleControl
                            label = { __( escapeHTML( 'Show read more button' ), 'newsmatic-pro' ) }
                            checked = { buttonOption }
                            onChange = {( newToggle ) => setButtonOption( newToggle )}
                        />
                        <ToggleControl
                            label = { __( escapeHTML( 'Show post excerpt' ), 'newsmatic-pro' ) }
                            checked = { excerptOption }
                            onChange = {( newToggle ) => setExcerptOption( newToggle )}
                        />
                        { excerptOption &&
                            <RangeControl
                                label = { __( escapeHTML( 'Excerpt length' ), 'newsmatic-pro' ) }
                                value = { excerptLength }
                                allowReset = {true}
                                onChange = {( newRange ) => setExcerptLength( newRange )}
                                min = { 1 }
                                max = { 50 }
                                step = { 1 }
                                resetFallbackValue = { 10 }
                            />
                        }
                    </>
                }
                <PostQuery query={ block.query } setParentQuery={ setQuery }/>
                { block.type == 'news-list' &&
                    <SelectControl
                        label = { __( escapeHTML( 'No. of columns' ), 'newsmatic-pro' ) }
                        value = { column }
                        options = {[
                            { label: __( escapeHTML( '1' ), 'newsmatic-pro' ), value: 'one' },
                            { label: __( escapeHTML( '2' ), 'newsmatic-pro' ), value: 'two' },
                            { label: __( escapeHTML( '3' ), 'newsmatic-pro' ), value: 'three' }
                        ]}
                        onChange = {( newColumn ) => setColumn( newColumn )}
                    />
                }
                { block.type == 'news-grid' &&
                    <SelectControl
                        label = { __( escapeHTML( 'No. of columns' ), 'newsmatic-pro' ) }
                        value = { column }
                        options = {[
                            { label: __( escapeHTML( '2' ), 'newsmatic-pro' ), value: 'two' },
                            { label: __( escapeHTML( '3' ), 'newsmatic-pro' ), value: 'three' },
                            { label: __( escapeHTML( '4' ), 'newsmatic-pro' ), value: 'four' }
                        ]}
                        onChange = {( newColumn ) => setColumn( newColumn )}
                    />
                }
                <ToggleControl
                    label = { __( escapeHTML( 'Show view all icon' ), 'newsmatic-pro' ) }
                    checked = { viewallOption }
                    onChange = {( newToggle ) => setViewallOption( newToggle )}
                />
                { viewallOption &&
                    <TextControl
                        label = { __( escapeHTML( 'View all URL' ), 'newsmatic-pro' ) }
                        value = { viewallUrl }
                        onChange = {( newUrl ) => setViewallUrl( newUrl )}
                    />
                }
                <ButtonGroup className="control-inner">
                    <Button variant={( layout == 'one' ) ? 'primary' : 'secondary' } onClick ={(e) => updateLayout( e, 'one' )} >{ __( escapeHTML( 'One' ), 'newsmatic-pro' ) }</Button>
                    <Button variant={( layout == 'two' ) ? 'primary' : 'secondary' } onClick ={(e) => updateLayout( e, 'two' )} >{ __( escapeHTML( 'Two' ), 'newsmatic-pro' ) }</Button>
                    <Button variant={( layout == 'three' ) ? 'primary' : 'secondary' } onClick ={(e) => updateLayout( e, 'three' )} >{ __( escapeHTML( 'Three' ), 'newsmatic-pro' ) }</Button>
                    <Button variant={( layout == 'four' ) ? 'primary' : 'secondary' } onClick ={(e) => updateLayout( e, 'four' )} >{ __( escapeHTML( 'Four' ), 'newsmatic-pro' ) }</Button>
                </ButtonGroup>
                { block.type == 'news-carousel' &&
                    <>
                        <RangeControl
                            label = { __( escapeHTML( 'No. of columns' ), 'newsmatic-pro' ) }
                            value = { columns }
                            allowReset = { true }
                            onChange = {( newColumns ) => setColumns( newColumns )}
                            min = { 2 }
                            max = { 4 }
                            step = { 1 }
                            resetFallbackValue = { 4 }
                        />
                        <CheckboxControl
                            label = { __( escapeHTML( 'Show dots / pagers' ), 'newsmatic-pro' ) }
                            checked = { dots }
                            onChange = {( newDots ) => setDots( newDots )}
                        />
                        <CheckboxControl
                            label = { __( escapeHTML( 'Show controller / arrows' ), 'newsmatic-pro' ) }
                            checked = { arrows }
                            onChange = {( newArrows ) => setArrows( newArrows )}
                        />
                        <CheckboxControl
                            label = { __( escapeHTML( 'Enable loop items' ), 'newsmatic-pro' ) }
                            checked = { loop }
                            onChange = {( newLoop ) => setLoop( newLoop )}
                        />
                        <CheckboxControl
                            label = { __( escapeHTML( 'Enable auto mode' ), 'newsmatic-pro' ) }
                            checked = { auto }
                            onChange = {( newAuto ) => setAuto( newAuto )}
                        />
                    </>
                }
                <h2 class="block-heading">{ __( escapeHTML( 'Image Settings' ), 'newsmatic-pro' ) }</h2>
                <SelectControl
                    label = { __( escapeHTML( 'Image Size' ), 'newsmatic-pro' ) }
                    value = { imageSize }
                    options = { imageSizes }
                    onChange = {( newImageSize ) => setImageSize( newImageSize )}
                />
                <div class="responsive-control">
                    <div className="responsive-icons">
                        <Dashicon className={ `responsive-trigger ${( responsiveIcon == 'desktop' ) && "isActive" }` } data-tip={ __( escapeHTML( 'Desktop' ), 'newsmatic-pro' ) } icon="desktop" onClick={() => updateResponsiveIcon( "desktop" ) } />
                        <Dashicon className={ `responsive-trigger ${( responsiveIcon == 'tablet' ) && "isActive" }` } data-tip={ __( escapeHTML( 'Tablet' ), 'newsmatic-pro' ) } icon="tablet" onClick={() => updateResponsiveIcon( "tablet" ) } />
                        <Dashicon className={ `responsive-trigger ${( responsiveIcon == 'smartphone' ) && "isActive" }` } data-tip={ __( escapeHTML( 'Mobile' ), 'newsmatic-pro' ) } icon="smartphone" onClick={() => updateResponsiveIcon( "smartphone" ) } />
                    </div>
                    <RangeControl
                        label = { __( escapeHTML( 'Image Ratio' ), 'newsmatic-pro' ) }
                        value = { imageRatio[ responsiveIcon ] }
                        onChange = {( newImageRatio ) => updateImageRatio( newImageRatio )}
                        min = { 0 }
                        max = { 2 }
                        step = { 0.1 }
                    />
                </div>
                <div class="responsive-control">
                    <div className="responsive-icons">
                        <Dashicon className={ `responsive-trigger ${( responsiveIcon == 'desktop' ) && "isActive" }` } data-tip={ __( escapeHTML( 'Desktop' ), 'newsmatic-pro' ) } icon="desktop" onClick={() => updateResponsiveIcon( "desktop" ) } />
                        <Dashicon className={ `responsive-trigger ${( responsiveIcon == 'tablet' ) && "isActive" }` } data-tip={ __( escapeHTML( 'Tablet' ), 'newsmatic-pro' ) } icon="tablet" onClick={() => updateResponsiveIcon( "tablet" ) } />
                        <Dashicon className={ `responsive-trigger ${( responsiveIcon == 'smartphone' ) && "isActive" }` } data-tip={ __( escapeHTML( 'Mobile' ), 'newsmatic-pro' ) } icon="smartphone" onClick={() => updateResponsiveIcon( "smartphone" ) } />
                    </div>
                    <RangeControl
                        label = { __( escapeHTML( 'Image Border Radius' ), 'newsmatic-pro' ) }
                        value = { imageRadius[ responsiveIcon ] }
                        onChange = {( newImageRadius ) => updateImageRadius( newImageRadius )}
                        min = { 0 }
                        max = { 100 }
                        step = { 1 }
                    />
                </div>
                <TextControl
                    label = { __( escapeHTML( 'Block Id Attribute' ), 'newsmatic-pro' ) }
                    value = { blockId }
                    onChange = {( newValue ) => setBlockId( newValue )}
                />
            </div>}
        </div>
    )
}

const PostAdBlock = ( props ) => {
    const { block, itemKey, updateValue } = props,
        [ option, setOption ] = useState( block.option ),
        [ media, setMedia ] = useState( block.media ),
        [ url, setUrl ] = useState( block.url ),
        [ targetAttr, setTargetAttr ] = useState( block.targetAttr ),
        [ relAttr, setRelAttr ] = useState( block.relAttr ),
        [ blockId, setBlockId ] = useState( block.blockId )
    
    // update parent value
    useEffect(() => {
        let postBlockData = {
            'type': block.type,
            'option': option,
            'media': media,
            'url': url,
            'targetAttr': targetAttr,
            'relAttr': relAttr,
            'blockId': blockId
        }
        updateValue( itemKey, postBlockData )
    }, [ option, media, url, targetAttr, relAttr, blockId ])

    const removeMedia = () => {
		setMedia({
			media_id: 0,
			media_url: ''
		});
	}

    const onSelectMedia = (newMedia) => {
		setMedia({
			media_id: newMedia.id,
			media_url: newMedia.url
		});
	}

    return (
        <div className={ `block-item block--${block.option ? "visibility" : "hidden"}` } elevation={ 4 } isRounded={ false } size="x-small">
            <div className="block-header">
                <span className="control-title">{ escapeHTML( block.type.replace( '-', ' ' ) ) }</span>
                <Dropdown
                        popoverProps = {{ resize:false, noArrow:false, flip:true, placement:'bottom-start' }}
                        renderToggle = {({ isOpen, onToggle }) => (
                            <span className="setting-icon dashicons dashicons-admin-generic" onClick={ onToggle } aria-expanded={ isOpen }></span>
                        )}
                        renderContent = {() => <div className="block-content">
                            <div className="media-field">
                                <MediaUpload
                                    onSelect = { onSelectMedia }
                                    value = { media.media_id }
                                    allowedTypes = { ['image'] }
                                    render = {({ open }) => (
                                        <Button 
                                            className = { media.media_id == 0 ? 'media-field-image__toggle' : 'media-field-image__preview' }
                                            onClick = { open }
                                        >
                                            { media.media_id == 0 && __( 'Upload an image', 'newsmatic' )}
                                            { media != undefined && 
                                                <ResponsiveWrapper
                                                    naturalWidth = { 200 }
                                                    naturalHeight = { 200 }
                                                >
                                                    <img src={ media.media_url } />
                                                </ResponsiveWrapper>
                                            }
                                        </Button>
                                    )}
                                />
                                { media.media_id != 0 && 
                                    <MediaUpload
                                        title = { __('Replace image', 'newsmatic')}
                                        value = { media.media_id }
                                        onSelect = { onSelectMedia }
                                        allowedTypes = {[ 'image' ]}
                                        render = {({ open }) => (
                                            <Button onClick={ open } variant="secondary" isLink isLarge>{ __( 'Replace image', 'newsmatic' ) }</Button>
                                        )}
                                    />
                                }
                                { media.media_id != 0 && 
                                    <Button onClick={ removeMedia } isLink isDestructive>{ __( 'Remove image', 'newsmatic' ) }</Button>
                                }
                            </div>
                            <TextControl
                                label = { __( escapeHTML( 'URL' ), 'newsmatic' ) }
                                value = { url }
                                onChange = {( newUrl ) => setUrl( newUrl )}
                            />
                            <SelectControl
                                label = { __( escapeHTML( 'Ad link open in' ), 'newsmatic' ) }
                                value = { targetAttr }
                                options = {[
                                    { label: __( escapeHTML( 'Open link in new tab' ), 'newsmatic' ), value: '_blank' },
                                    { label: __( escapeHTML( 'Open link in same tab' ), 'newsmatic' ), value: '_self' }
                                ]}
                                onChange = {( newTargetAttr ) => setTargetAttr( newTargetAttr )}
                            />
                            <SelectControl
                                label = { __( escapeHTML( 'Link rel attribute value' ), 'newsmatic' ) }
                                value = { relAttr }
                                options = {[
                                    { label: __( escapeHTML( 'nofollow' ), 'newsmatic' ), value: 'nofollow' },
                                    { label: __( escapeHTML( 'noopener' ), 'newsmatic' ), value: 'noopener' },
                                    { label: __( escapeHTML( 'noreferrer' ), 'newsmatic' ), value: 'noreferrer' }
                                ]}
                                onChange = {( newRelAttr ) => setRelAttr( newRelAttr )}
                            />
                            <TextControl
                                label = { __( escapeHTML( 'Block ID Attribute' ), 'newsmatic' ) }
                                value = { blockId }
                                onChange = {( newValue ) => setBlockId( newValue )}
                            />
                        </div>}
                    />
                <span className={`display-icon dashicons dashicons-${ block.option ? "visibility" : "hidden" }`} onClick={() => setOption( ! option )}></span>
            </div>
        </div>
    )
}

const PostQuery = ( props ) => {
    const { query, setParentQuery } = props,
        [ order, setOrder ] = useState( query.order ),
        [ count, setCount ] = useState( query.count ),
        [ postFilter, setPostFilter ] = useState( query.postFilter ),
        [ dateFilter, setDateFilter ] = useState( query.dateFilter ),
        [ categories, setCategories ] = useState( query.categories ),
        [ posts, setPosts ] = useState( query.posts ),
        [ ids, setIds ] = useState( query.ids ),
        choices = customizerControlsObject.categorie,
        postChoices = customizerControlsObject.post;

    useEffect(() => {
        setParentQuery({ 
            order: order,
            count: count,
            categories: categories,
            posts: posts,
            postFilter: postFilter,
            dateFilter: dateFilter,
            ids: ids
        })
    }, [ order, count, ids, postFilter, dateFilter, posts, categories ])

    const getPosts = async ( key ) => {
        let postsArray = []
        await jQuery.ajax({
            method: 'post',
            url: ajaxurl,
            data: ({
                'action': 'newsmatic_get_multicheckbox_posts_simple_array',
                '_wpnonce': _wpnonce,
                'search': key
            }),
            success: function( response ) {
                if( response.data ) postsArray = response.data
            }
        })
        return postsArray
    }

    // get categories options
    const getCategories = async ( key ) => {
        let postsArray = []
        await jQuery.ajax({
            method: 'post',
            url: ajaxurl,
            data: ({
                'action': 'newsmatic_get_multicheckbox_categories_simple_array',
                '_wpnonce': _wpnonce,
                'search': key
            }),
            success: function( response ) {
                if( response.data ) postsArray = response.data
            }
        })
        return postsArray
    }

    const categoriesPromiseOptions = ( inputValue ) => new Promise(( resolve ) => {
        setTimeout(() => {
            resolve(
                getCategories( inputValue )
            );
        }, 1000);
    });

    const promiseOptions = ( inputValue ) => new Promise(( resolve ) => {
        setTimeout(() => {
            resolve(
                getPosts( inputValue )
            );
        }, 1000);
    });

    return (
        <div className="post-query-field">
            <label className="post-query-field-label">{ __( escapeHTML( 'Posts query' ), 'newsmatic' ) }</label>
            <div>
                <Dropdown
                    popoverProps = {{ resize:false, noArrow:false, flip:true, placement:'top-start' }}
                    renderToggle = {({ isOpen, onToggle }) => (
                        <Dashicon
                            className = "popover-trigger"
                            icon = "edit" 
                            onClick = { onToggle }
                            aria-expanded = { isOpen }
                        />
                    )}
                    renderContent = {() =>
                        <Card>
                            <CardBody>
                                <SelectControl
                                    label = { __( escapeHTML( 'Orderby' ), 'newsmatic' ) }
                                    value = { order }
                                    options = {[
                                        { label: __( escapeHTML( 'Newest - Oldest' ), 'newsmatic' ), value: 'date-desc' },
                                        { label: __( escapeHTML( 'Oldest - Newest' ), 'newsmatic' ), value: 'date-asc' },
                                        { label: __( escapeHTML( 'A - Z' ), 'newsmatic' ), value: 'title-asc' },
                                        { label: __( escapeHTML( 'Z - A' ), 'newsmatic' ), value: 'title-desc' },
                                        { label: __( escapeHTML( 'Random' ), 'newsmatic' ), value: 'rand-desc' }
                                    ]}
                                    onChange={( newOrder ) => setOrder( newOrder )}
                                />
                                { postFilter == 'category' && 
                                    <>
                                        <NumberControl
                                            label = { __( escapeHTML( 'Number of posts to display' ), 'newsmatic' ) }
                                            isShiftStepEnabled = { true }
                                            onChange = {( newNumber ) => setCount( newNumber )}
                                            shiftStep = { 5 }
                                            value = { count }
                                        />
                                        <FormTokenField
                                            label = { __( escapeHTML( 'Exclude post ids' ), 'newsmatic' ) }
                                            value = { ids }
                                            onChange = {( newids ) => setIds( newids )}
                                        />
                                    </>
                                }
                                <div className="radio-bubbles column-2">
                                    <span className={ postFilter == 'category' ? 'radio-bubble isActive' : 'radio-bubble isItem' } onClick={() => setPostFilter( 'category' ) }>{__( escapeHTML( 'By category' ), 'newsmatic' )}</span>
                                    <span className={ postFilter == 'title' ? 'radio-bubble isActive' : 'radio-bubble isItem' } onClick={() => setPostFilter( 'title' ) }>{__( escapeHTML( 'By title' ), 'newsmatic' )}</span>
                                </div>
                                { ( choices && categories && ( postFilter == 'category' ) ) && 
                                    <AsyncSelect
                                        isMulti = { true }
                                        inputId = "newsmatic-search-in-select"
                                        isSearchable = { true }
                                        heading = { __( escapeHTML( 'Post categories' ), 'newsmatic' ) }
                                        placeholder = { __( escapeHTML( 'Type to search . . ' ), 'newsmatic' ) }
                                        value = { categories }
                                        loadOptions = { categoriesPromiseOptions }
                                        defaultOptions = { choices }
                                        onChange = {( newCategories ) => setCategories( newCategories )}
                                    />
                                }
                                {  postFilter == 'title' &&
                                    <AsyncSelect
                                        isMulti = { true }
                                        inputId = "newsmatic-search-in-select"
                                        isSearchable  = { true }
                                        heading = { __( escapeHTML( 'Posts titles' ), 'newsmatic' ) }
                                        placeholder = { __( escapeHTML( 'Type to search . . ' ), 'newsmatic' ) }
                                        value = { posts }
                                        defaultOptions = { postChoices }
                                        loadOptions = { promiseOptions }
                                        onChange = {( newPosts ) => setPosts( newPosts )}
                                    />
                                }
                                { postFilter == 'category' && 
                                    <div className="radio-bubbles column-4">
                                        <span className={ dateFilter == 'all' ? 'radio-bubble isActive' : 'radio-bubble isItem' } onClick={() => setDateFilter( 'all' ) }>{__( escapeHTML( 'All' ), 'newsmatic' )}</span>
                                        <span className={ dateFilter == 'last-seven-days' ? 'radio-bubble isActive' : 'radio-bubble isItem' } onClick={() => setDateFilter( 'last-seven-days' ) }>{__( escapeHTML( 'Last 7 days' ), 'newsmatic' )}</span>
                                        <span className={ dateFilter == 'today' ? 'radio-bubble isActive' : 'radio-bubble isItem' } onClick={() => setDateFilter( 'today' ) }>{__( escapeHTML( 'Today' ), 'newsmatic' )}</span>
                                        <span className={ dateFilter == 'this-week' ? 'radio-bubble isActive' : 'radio-bubble isItem' } onClick={() => setDateFilter( 'this-week' ) }>{__( escapeHTML( 'This Week' ), 'newsmatic' )}</span>
                                        <span className={ dateFilter == 'last-week' ? 'radio-bubble isActive' : 'radio-bubble isItem' } onClick={() => setDateFilter( 'last-week' ) }>{__( escapeHTML( 'Last Week' ), 'newsmatic' )}</span>
                                        <span className={ dateFilter == 'this-month' ? 'radio-bubble isActive' : 'radio-bubble isItem' } onClick={() => setDateFilter( 'this-month' ) }>{__( escapeHTML( 'This Month' ), 'newsmatic' )}</span>
                                        <span className={ dateFilter == 'last-month' ? 'radio-bubble isActive' : 'radio-bubble isItem' } onClick={() => setDateFilter( 'last-month' ) }>{__( escapeHTML( 'Last Month' ), 'newsmatic' )}</span>
                                    </div>
                                }
                            </CardBody>
                        </Card>
                    }
                />
            </div>
        </div>
    )
}

const blockSortList = ( props ) => {
    const { repeater, updateValue } = props 

    return <div className="blocks-wrap">
        { 
            repeater && repeater.map(( block, index ) => <BlockSortableItem
                index = { index }
                key = { block.uniqueId || index }
                itemKey = { index }
                block = { block }
                updateValue = { updateValue }
            />)
        }
    </div>
};

const blockSortItem = ( props ) => {
    const { block, itemKey, updateValue } = props

    if( block.type == 'news-list' && ! block.imageRatio ) block.imageRatio = { 'desktop':  0.25, 'tablet': 0.25, 'smartphone': 0.25 }

    switch( block.type ) {
        case "ad-block": return <PostAdBlock
                block = { block }
                itemKey = { itemKey }
                updateValue = { updateValue }
            />
            break;
        default: return <PostBlock
                block = { block }
                itemKey = { itemKey }
                updateValue = { updateValue }
            />
    }
}

const BlockSortableList = SortableContainer(blockSortList),
    BlockSortableItem = SortableElement(blockSortItem);

function generateRandomLetter() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz"
    return alphabet[ Math.floor( Math.random() * alphabet.length ) ]
}
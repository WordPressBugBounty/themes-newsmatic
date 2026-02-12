const { TabPanel, ColorPicker, GradientPicker, Card, CardBody, ToggleControl, ColorIndicator, ButtonGroup, Button, ResponsiveWrapper, RangeControl, CheckboxControl, Dropdown, SelectControl, Dashicon, TextControl } = wp.components;
const { render, useState, useEffect, useMemo } = wp.element;
const { MediaUpload } = wp.blockEditor;
const { __ } = wp.i18n;
const { escapeHTML } = wp.escapeHtml;
const { customize } = wp;
const { useSelect, useDispatch } = wp.data
import { __experimentalBoxControl as BoxControl } from '@wordpress/components';
import { NewsmaticBlockRepeater } from './repeaterComponent'
import { NewsmaticBorder } from './borderComponent'
import { NewsmaticItemSort } from './sortComponent'
import { NewsmaticTypography } from './typographyComponent'
import { NewsmaticBoxShadow } from './boxShadowComponent'
import { NewsmaticPostsMultiselect } from './asyncPostsMultiSelect'
import { NewsmaticCategoriesMultiselect } from './asyncCategoriesMultiSelect'
import { Tooltip } from 'react-tooltip'
import Select from 'react-select'
import { NewsmaticHeaderBuilder } from './headerBuilder'
import { NewsmaticResponsiveBuilder } from './responsiveBuilder'
import { NewsmaticResponsiveRadioImage } from './responsiveRadioImage'
import { newsmaticReflectResponsiveInControl, newsmaticReflectResponsiveInCustomizer, NewsmaticControlHeader, NewsmaticGetResponsiveIcons, newsmaticCheckIfPresetColor } from './components'
import { store as myCustomStore } from './store';

const NewsmaticInfoBox = ( props ) => {
    const [ choices, setChoices ] = useState(customize.settings.controls[props.setting].choices) 
    return (
        <Card>
            <CardBody>
                <h2 className="info-box-label"><Dashicon className="info-box-icon" icon="info"/>{ customize.settings.controls[props.setting].label }</h2>
                { customize.settings.controls[props.setting].description &&
                    <p className="info-box-description">{ customize.settings.controls[props.setting].description }</p>
                }
                { choices &&
                    choices.map(function(choice, key) {
                        return (
                            <Button className="info-box-button" href={ choice.url } target="__blank" variant="primary" text={ choice.label } isSmall={true}/>
                        )
                    })
                }
            </CardBody>
        </Card>
    )
}

const NewsmaticInfoBoxAction = ( props ) => {
    const [ choices, setChoices ] = useState(customize.settings.controls[props.setting].choices) 
    return (
        <Card>
            <CardBody>
                <h2 className="info-box-label"><Dashicon className="info-box-icon" icon="info"/>{ customize.settings.controls[props.setting].label }</h2>
                { customize.settings.controls[props.setting].description &&
                    <p className="info-box-description">{ customize.settings.controls[props.setting].description }</p>
                }
                { choices &&
                    choices.map(function(choice, key) {
                        return (
                            <Button className="info-box-button" data-action={ choice.action } variant="primary" text={ choice.label } isSmall={true}/>
                        )
                    })
                }
            </CardBody>
        </Card>
    )
}

// Responsive multiselect tab control
const NewsmaticResponsiveMultiselectTab = ( props ) => {
    const [ tab, setTab ] = useState(props.value)
    const [ desktop, setDesktop ] = useState(tab.desktop)
    const [ tablet, setTablet ] = useState(tab.tablet)
    const [ mobile, setMobile ] = useState(tab.mobile)
    
    useEffect(() => {
        let newTab = {
            desktop: desktop,
            tablet: tablet,
            mobile: mobile
        }
        setTab(newTab)
        customize.value( props.setting )(newTab)
    }, [desktop,tablet,mobile])

    return(
        <>
            <div className="block-header">
                <span class="customize-control-title">{ customize.settings.controls[props.setting].label }</span>
            </div>
            <ButtonGroup className="control-inner">
                <Button data-tip={ __( escapeHTML( 'show on desktop' ), 'newsmatic' ) } variant={ desktop ? 'primary' : 'secondary' } onClick={() => setDesktop(!desktop) }><span class="dashicons dashicons-desktop"></span></Button>
                <Button data-tip={ __( escapeHTML( 'show on tablet' ), 'newsmatic' ) } variant={ tablet ? 'primary' : 'secondary' } onClick={() => setTablet(!tablet) }><span class="dashicons dashicons-tablet"></span></Button>
                <Button data-tip={ __( escapeHTML( 'show on mobile' ), 'newsmatic' ) } variant={ mobile ? 'primary' : 'secondary' } onClick={() => setMobile(!mobile) }><span class="dashicons dashicons-smartphone"></span></Button>
            </ButtonGroup>
            <Tooltip effect="solid"/>
        </>
    )
}

// Radio Tab control
const NewsmaticRadioTab = ( props ) => {
    const [ tab, setTab ] = useState(props.value)
    const { choices } = customize.settings.controls[props.setting]
    
    useEffect(() => {
        customize.value( props.setting )(tab)
    }, [tab])

    return(
        <>
            <div className="block-header">
                <span class="customize-control-title">{ customize.settings.controls[props.setting].label }</span>
            </div>
            <ButtonGroup className="control-inner">
                { choices &&
                    choices.map( (choice) => {
                        return(
                            <Button variant={ tab == choice.value ? 'primary' : 'secondary' } onClick={() => setTab(choice.value) }>{choice.label}</Button>
                        )
                    })
                }
            </ButtonGroup>
        </>
    )
}

// Radio Bubble control
const NewsmaticRadioBubble = ( props ) => {
    const [ bubble, setBubble ] = useState(props.value)
    const { choices } = customize.settings.controls[props.setting]
    
    useEffect(() => {
        customize.value( props.setting )(bubble)
    }, [bubble])

    return(
        <>
            { customize.settings.controls[props.setting].label && 
                <div className="block-header">
                    <span class="customize-control-title">{ customize.settings.controls[props.setting].label }</span>
                </div>
            }
            <div className={ choices.length > 2 ? `radio-bubbles column-4` : `radio-bubbles column-2`}>
                { choices &&
                    choices.map( (choice) => {
                        return(
                            <span className={ bubble == choice.value ? 'radio-bubble isActive' : 'radio-bubble isItem' } onClick={() => setBubble(choice.value) }>{choice.label}</span>
                        )
                    })
                }
            </div>
        </>
    )
}

// Preset Gradient color picker
const NewsmaticPresetGradientPicker = ( props ) =>  {
    const [ preset, setPreset ] = useState(props.value)
    const { variable } = customize.settings.controls[props.setting]
    
    const updateControl = ( currentPreset ) => {
        setPreset( currentPreset )
        customize.value( props.setting )(currentPreset)
    }

    useEffect(() => {
        const html = document.getElementsByTagName( "html" )
        let style = html[0].getAttribute("style")
        if( style != null ) {
            style += variable + ":" + preset + ";"
        } else {
            style = variable + ":" + preset + ";"
        }
        html[0].setAttribute( "style", style )
        customize.value( props.setting )(preset)
    }, [preset])

    return (
        <div className="control-header">
            <div className="control-header-trigger">
                <label>{ customize.settings.controls[props.setting].label }</label>
                <span>
                    <Dropdown
                        popoverProps={{resize:false,noArrow:false,flip:false,placement:'bottom-end'}}
                        renderToggle={ ( { isOpen, onToggle } ) => (
                            <span className={ "color-indicator-wrapper" + ( newsmaticCheckIfPresetColor( preset ) ? ' preset-isactive' : '') }>
                                <ColorIndicator 
                                    className={ ( preset == null || preset == '' ) && "null-color" }
                                    data-tip={ __( escapeHTML( 'Gradient' ), 'newsmatic' ) }
                                    colorValue = { preset }
                                    onClick={ onToggle }
                                    aria-expanded={ isOpen }
                                />
                            </span>
                        ) }
                        renderContent={ () => <Card>
                            <GradientPicker
                                value={ preset }
                                onChange={ ( currentPreset ) => updateControl( currentPreset ) }
                                __nextHasNoMargin={true}
                                gradients={[]}
                            />
                        </Card> }
                    />
                    <Tooltip effect="solid"/>
                </span>
            </div>
        </div>
    )
}

// Color Group control
const NewsmaticColorGroup = ( props ) =>  {
    const [ colorGroup, setColorGroup ] = useState(props.value )
    const [ color, setColor ] = useState(props.value.solid )
    const [ gradient, setGradient ] = useState(props.value.gradient)
    const [ type, setType ] = useState(props.value.type)

    useEffect(() => {
        setColorGroup({ type: type, solid: color, gradient: gradient })
        customize.value( props.setting )(JSON.stringify({ type: type, solid: color, gradient: gradient }))
    },[color,gradient] );

    const resetData = () => {
        setType(props.value.type)
        setColor(props.value.solid)
        setGradient(props.value.gradient)
    }

    function getBackground(color) {
        if( color == null ) return
        if( color.includes('preset') ) {
            return 'var(' + color + ')'
        } else {
            return color
        }
    }

    return (
        <div className="control-header">
            <div className="control-header-trigger">
                <label>{ customize.settings.controls[props.setting].label }</label>
                <span className="control-content-wrap">
                    <span class="reset-button components-button is-secondary is-small" onClick={() => resetData() }><span class="dashicon dashicons dashicons-image-rotate"></span></span>
                    <Dropdown
                        popoverProps={{resize:false,noArrow:false,flip:false,placement:'bottom-end'}}
                        style={{
                            backgroundColor: "#00000"
                        }}
                        renderToggle={ ( { isOpen, onToggle } ) => (
                            <span className={ "color-indicator-wrapper" + ( newsmaticCheckIfPresetColor( colorGroup[type] ) ? ' preset-isactive' : '') }>
                                <ColorIndicator 
                                    className={ colorGroup[type] == null && "null-color" }
                                    data-tip={type}
                                    colorValue = { getBackground(colorGroup[type]) }
                                    onClick={ onToggle }
                                    aria-expanded={ isOpen }
                                />
                            </span>
                        ) }
                        renderContent={ () => 
                            <TabPanel
                                className="newsmatic-group-tab-panel"
                                activeClass="active-tab"
                                initialTabName = {type}
                                onSelect = { (tabName) => setType( tabName )
                                }
                                tabs={ [
                                    {
                                        name: 'solid',
                                        title: 'Solid',
                                        className: 'tab-solid',
                                    },
                                    {
                                        name: 'gradient',
                                        title: 'Gradient',
                                        className: 'tab-gradient',
                                    },
                                ] }
                            >
                                { ( tab ) => {
                                    if( tab.name == "solid" ) {
                                        return <>
                                            <div className="preset-colors">
                                                <ul className="preset-colors-inner">
                                                    <li className={ ( color == '--newsmatic-global-preset-color-1' ) && 'active' } data-tip={ __( escapeHTML( 'color 1' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-1)' }} onClick={()=> setColor('--newsmatic-global-preset-color-1')}/>
                                                    <li className={ ( color == '--newsmatic-global-preset-color-2' ) && 'active' } data-tip={ __( escapeHTML( 'color 2' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-2)' }} onClick={()=> setColor('--newsmatic-global-preset-color-2')}/>
                                                    <li className={ ( color == '--newsmatic-global-preset-color-3' ) && 'active' } data-tip={ __( escapeHTML( 'color 3' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-3)' }} onClick={()=> setColor('--newsmatic-global-preset-color-3')}/>
                                                    <li className={ ( color == '--newsmatic-global-preset-color-4' ) && 'active' } data-tip={ __( escapeHTML( 'color 4' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-4)' }} onClick={()=> setColor('--newsmatic-global-preset-color-4')}/>
                                                    <li className={ ( color == '--newsmatic-global-preset-color-5' ) && 'active' } data-tip={ __( escapeHTML( 'color 5' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-5)' }} onClick={()=> setColor('--newsmatic-global-preset-color-5')}/>
                                                    <li className={ ( color == '--newsmatic-global-preset-color-6' ) && 'active' } data-tip={ __( escapeHTML( 'color 6' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-6)' }} onClick={()=> setColor('--newsmatic-global-preset-color-6')}/>
                                                    <li className={ ( color == '--newsmatic-global-preset-color-7' ) && 'active' } data-tip={ __( escapeHTML( 'color 7' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-7)' }} onClick={()=> setColor('--newsmatic-global-preset-color-7')}/>
                                                    <li className={ ( color == '--newsmatic-global-preset-color-8' ) && 'active' } data-tip={ __( escapeHTML( 'color 8' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-8)' }} onClick={()=> setColor('--newsmatic-global-preset-color-8')}/>
                                                    <li className={ ( color == '--newsmatic-global-preset-color-9' ) && 'active' } data-tip={ __( escapeHTML( 'color 9' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-9)' }} onClick={()=> setColor('--newsmatic-global-preset-color-9')}/>
                                                    <li className={ ( color == '--newsmatic-global-preset-color-10' ) && 'active' } data-tip={ __( escapeHTML( 'color 10' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-10)' }} onClick={()=> setColor('--newsmatic-global-preset-color-10')}/>
                                                    <li className={ ( color == '--newsmatic-global-preset-color-11' ) && 'active' } data-tip={ __( escapeHTML( 'color 11' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-11)' }} onClick={()=> setColor('--newsmatic-global-preset-color-11')}/>
                                                    <li className={ ( color == '--newsmatic-global-preset-color-12' ) && 'active' } data-tip={ __( escapeHTML( 'color 12' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-12)' }} onClick={()=> setColor('--newsmatic-global-preset-color-12')}/>
                                                </ul>
                                            </div>
                                            <ColorPicker
                                                color={color}
                                                onChange={setColor}
                                                enableAlpha
                                            />
                                            <button type="button" class="components-button is-secondary is-small" onClick={ () => setColor(null) }>{ __( 'Clear', 'newsmatic' ) }</button>
                                            <Tooltip effect="solid"/>
                                            </>
                                    } else if( tab.name == "gradient" ) {
                                        return <>
                                                <div className="preset-colors">
                                                    <ul className="preset-colors-inner">
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-1' ) && 'active' } data-tip={ __( escapeHTML( 'gradient 1' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-1)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-1')}/>
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-2' ) && 'active' } data-tip={ __( escapeHTML( 'gradient 2' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-2)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-2')}/>
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-3' ) && 'active' } data-tip={ __( escapeHTML( 'gradient 3' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-3)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-3')}/>
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-4' ) && 'active' } data-tip={ __( escapeHTML( 'gradient 4' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-4)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-4')}/>
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-5' ) && 'active' } data-tip={ __( escapeHTML( 'gradient 5' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-5)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-5')}/>
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-6' ) && 'active' } data-tip={ __( escapeHTML( 'gradient 6' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-6)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-6')}/>
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-7' ) && 'active' } data-tip={ __( escapeHTML( 'color 7' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-7)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-7')}/>
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-8' ) && 'active' } data-tip={ __( escapeHTML( 'color 8' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-8)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-8')}/>
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-9' ) && 'active' } data-tip={ __( escapeHTML( 'color 9' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-9)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-9')}/>
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-10' ) && 'active' } data-tip={ __( escapeHTML( 'color 10' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-10)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-10')}/>
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-11' ) && 'active' } data-tip={ __( escapeHTML( 'color 11' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-11)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-11')}/>
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-12' ) && 'active' } data-tip={ __( escapeHTML( 'color 12' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-12)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-12')}/>
                                                    </ul>
                                                </div>
                                                <GradientPicker
                                                    value={ gradient }
                                                    onChange={ ( currentGradient ) => setGradient( currentGradient ) }
                                                    __nextHasNoMargin={true}
                                                    gradients={[]}
                                                />
                                                <Tooltip effect="solid"/>
                                            </>
                                    }
                                } }
                            </TabPanel> }
                    />
                </span>
            </div>
        </div>
    )
}

// Toggle Button control
const NewsmaticToggleButton = ( props ) =>  {
    const [ toggle, setToggle ] = useState(props.value)

    const updateControl = ( newToggle ) => {
        setToggle( newToggle )
        customize.value( props.setting )(newToggle)
    }
    return (
        <Card elevation={2} isRounded={false} isBorderless={true} size="small">
            <CardBody>
                <ToggleControl
                    label={ customize.settings.controls[props.setting].label }
                    help={
                        toggle
                            ? 'Currently enabled.'
                            : 'Currently disabled.'
                    }
                    checked={ toggle }
                    onChange={ (newToggle) => updateControl( newToggle ) }
                />
                { customize.settings.controls[props.setting].description && <span className="description customize-control-description">{ customize.settings.controls[props.setting].description }</span> }
            </CardBody>
        </Card>
    )
}

// Simple Toggle Button control
const NewsmaticSimpleToggleButton = ( props ) =>  {
    const [ toggle, setToggle ] = useState(props.value)

    const updateControl = ( newToggle ) => {
        setToggle( newToggle )
        customize.value( props.setting )(newToggle)
    }
    return (
        <ToggleControl
            label={ customize.settings.controls[props.setting].label }
            checked={ toggle }
            onChange={ (newToggle) => updateControl( newToggle ) }
        />
    )
}

// Preset Color Picker control
const NewsmaticPresetColorPicker = ( props ) =>  {
    const [ preset, setPreset ] = useState(props.value)
    const { variable } = customize.settings.controls[props.setting]

    useEffect(() => {
        const html = document.getElementsByTagName( "html" )
        let style = html[0].getAttribute("style")
        if( style != null ) {
            style += variable + ":" + preset + ";"
        } else {
            style = variable + ":" + preset + ";"
        }
        html[0].setAttribute( "style", style )
        customize.value( props.setting )(preset)
    }, [preset])

    return (
        <div className="control-header">
            <div className="control-header-trigger">
                <label>{ customize.settings.controls[props.setting].label }</label>
                <span className="control-content-wrap">
                    <Dropdown
                        popoverProps={{resize:false,noArrow:false,flip:false,placement:'bottom-end'}}
                        renderToggle={ ( { isOpen, onToggle } ) => (
                            <span className={ "color-indicator-wrapper" + ( newsmaticCheckIfPresetColor( preset ) ? ' preset-isactive' : '') }>
                                <ColorIndicator 
                                    data-tip={ __( escapeHTML( 'preset' ), 'newsmatic' ) }
                                    colorValue = { preset }
                                    onClick={ onToggle }
                                    aria-expanded={ isOpen }
                                />
                            </span>
                        ) }
                        renderContent={ () => <>
                            <ColorPicker
                                color={preset}
                                onChange={ ( newPreset ) => setPreset( newPreset ) }
                                enableAlpha
                            />
                            <Tooltip effect="solid"/>
                        </> }
                    />
                    <Tooltip effect="solid"/>
                </span>
            </div>
        </div>
    )
}

// Color Picker control
const NewsmaticColorPicker = ( props ) =>  {
    const [ color, setColor ] = useState(props.value)

    useEffect(() => {
        customize.value( props.setting )(color)
    }, [color])

    const updateControl = ( newColor ) => {
        setColor( newColor )
    }

    const resetData = () => {
        setColor(props.value)
    }

    function getBackground(color) {
        if( color == null ) return
        if( color.includes('preset') ) {
            return 'var(' + color + ')'
        } else {
            return color
        }
    }

    return (
        <div className="control-header">
            <div className="control-header-trigger">
                <label>{ customize.settings.controls[props.setting].label }</label>
                <span className="control-content-wrap">
                    <span class="reset-button components-button is-secondary is-small" onClick={() => resetData() }><span class="dashicon dashicons dashicons-image-rotate"></span></span>
                    <Dropdown
                        popoverProps={{resize:false,noArrow:false,flip:false,placement:'bottom-end'}}
                        renderToggle={ ( { isOpen, onToggle } ) => (
                            <span className={ "color-indicator-wrapper" + ( newsmaticCheckIfPresetColor( color ) ? ' preset-isactive' : '') }>
                                <ColorIndicator 
                                    className={ color == null && "null-color" }
                                    data-tip={ __( escapeHTML( 'initial' ), 'newsmatic' ) }
                                    colorValue = { getBackground(color) }
                                    onClick={ onToggle }
                                    aria-expanded={ isOpen }
                                />
                            </span>
                        ) }
                        renderContent={ () => <>
                            <div className="preset-colors">
                                <ul className="preset-colors-inner">
                                    <li className={ ( color == '--newsmatic-global-preset-color-1' ) && 'active' } data-tip={ __( escapeHTML( 'color 1' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-1)' }} onClick={()=> setColor('--newsmatic-global-preset-color-1')}/>
                                    <li className={ ( color == '--newsmatic-global-preset-color-2' ) && 'active' } data-tip={ __( escapeHTML( 'color 2' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-2)' }} onClick={()=> setColor('--newsmatic-global-preset-color-2')}/>
                                    <li className={ ( color == '--newsmatic-global-preset-color-3' ) && 'active' } data-tip={ __( escapeHTML( 'color 3' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-3)' }} onClick={()=> setColor('--newsmatic-global-preset-color-3')}/>
                                    <li className={ ( color == '--newsmatic-global-preset-color-4' ) && 'active' } data-tip={ __( escapeHTML( 'color 4' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-4)' }} onClick={()=> setColor('--newsmatic-global-preset-color-4')}/>
                                    <li className={ ( color == '--newsmatic-global-preset-color-5' ) && 'active' } data-tip={ __( escapeHTML( 'color 5' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-5)' }} onClick={()=> setColor('--newsmatic-global-preset-color-5')}/>
                                    <li className={ ( color == '--newsmatic-global-preset-color-6' ) && 'active' } data-tip={ __( escapeHTML( 'color 6' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-6)' }} onClick={()=> setColor('--newsmatic-global-preset-color-6')}/>
                                    <li className={ ( color == '--newsmatic-global-preset-color-7' ) && 'active' } data-tip={ __( escapeHTML( 'color 7' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-7)' }} onClick={()=> setColor('--newsmatic-global-preset-color-7')}/>
                                    <li className={ ( color == '--newsmatic-global-preset-color-8' ) && 'active' } data-tip={ __( escapeHTML( 'color 8' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-8)' }} onClick={()=> setColor('--newsmatic-global-preset-color-8')}/>
                                    <li className={ ( color == '--newsmatic-global-preset-color-9' ) && 'active' } data-tip={ __( escapeHTML( 'color 9' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-9)' }} onClick={()=> setColor('--newsmatic-global-preset-color-9')}/>
                                    <li className={ ( color == '--newsmatic-global-preset-color-10' ) && 'active' } data-tip={ __( escapeHTML( 'color 10' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-10)' }} onClick={()=> setColor('--newsmatic-global-preset-color-10')}/>
                                    <li className={ ( color == '--newsmatic-global-preset-color-11' ) && 'active' } data-tip={ __( escapeHTML( 'color 11' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-11)' }} onClick={()=> setColor('--newsmatic-global-preset-color-11')}/>
                                    <li className={ ( color == '--newsmatic-global-preset-color-12' ) && 'active' } data-tip={ __( escapeHTML( 'color 12' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-12)' }} onClick={()=> setColor('--newsmatic-global-preset-color-12')}/>
                                </ul>
                            </div>
                            <ColorPicker
                                color={color}
                                onChange={ ( newColor ) => updateControl( newColor ) }
                                enableAlpha
                            />
                            <Tooltip effect="solid"/>
                        </> }
                    />
                    <Tooltip effect="solid"/>
                </span>
            </div>
        </div>
    )
}

// Color and image field Group control
const NewsmaticColorImageGroup = ( props ) =>  {
    const [ controlValue,setControlValue ] = useState(props.value)
    const [ styles, setStyles ] = useState()
    const [ color, setColor ] = useState(props.value.solid)
    const [ gradient, setGradient ] = useState(props.value.gradient)
    const [ image, setImage ] = useState(props.value.image )
    const [ position, setPosition ] = useState(props.value.position )
    const [ attachment, setAttachment ] = useState(props.value.attachment )
    const [ repeat, setRepeat ] = useState(props.value.repeat )
    const [ size, setSize ] = useState(props.value.size )
    const [ type, setType ] = useState(props.value.type )
    const [ imageSettings, setImageSettings ] = useState(false)

    useEffect(() => {
        setControlValue({ type: type, solid: color, gradient: gradient, image: image })
    },[color,gradient,image] );

    useEffect(() => {
        const newStyles = type == 'image' ? "#fff": getBackground( controlValue[type] )
        setStyles(newStyles)
    },[controlValue])

    useEffect(() => {
        customize.value( props.setting )(JSON.stringify({ type: type, solid: color, gradient: gradient, image: image, position: position, attachment: attachment, repeat: repeat, size: size }))
    },[color,gradient,image,position,attachment,repeat,size] );

    const removeMedia = () => {
		setImage({
			media_id: 0,
			media_url: ''
		});
	}

    function getBackground(newPreFormatColor) {
        if( newPreFormatColor == null ) return
        if( newPreFormatColor.includes('preset') ) {
            return 'var(' + newPreFormatColor + ')'
        } else {
            return newPreFormatColor
        }
    }

 	const onSelectMedia = (media) => {
		setImage({
			media_id: media.id,
			media_url: media.url
		});
	}

    const resetData = () => {
        setType(props.value.type)
        setColor(props.value.solid)
        setGradient(props.value.gradient)
        setImage(props.value.image)
    }

    return (
        <div className="control-header">
            <div className="control-header-trigger">
                <label>{ customize.settings.controls[props.setting].label }</label>
                <span className="control-content-wrap">
                    <span class="reset-button components-button is-secondary is-small" onClick={() => resetData() }><span class="dashicon dashicons dashicons-image-rotate"></span></span>
                    <Dropdown
                        popoverProps={{resize:false,noArrow:false,flip:false,placement:'bottom-end'}}
                        renderToggle={ ( { isOpen, onToggle } ) => (
                            <span className={ "color-indicator-wrapper" + ( newsmaticCheckIfPresetColor( controlValue[type] ) ? ' preset-isactive' : '') }>
                                <ColorIndicator 
                                    className={ controlValue[type] == null ? "null-color" : type == "image" ? "dashicons dashicons-format-image" : type }
                                    data-tip={ type }
                                    style = {{ background: styles }}
                                    onClick={ onToggle }
                                    aria-expanded={ isOpen }
                                />
                            </span>
                        ) }
                        renderContent={ () => 
                            <TabPanel
                                className="newsmatic-group-tab-panel"
                                activeClass="active-tab"
                                initialTabName = {type}
                                onSelect = { (tabName) => setType( tabName )
                                }
                                tabs={ [
                                    {
                                        name: 'solid',
                                        title: __( 'Solid', 'newsmatic' ),
                                        className: 'tab-solid',
                                    },
                                    {
                                        name: 'gradient',
                                        title: __( 'Gradient', 'newsmatic' ),
                                        className: 'tab-gradient',
                                    },
                                    {
                                        name: 'image',
                                        title: __( 'Image', 'newsmatic' ),
                                        className: 'tab-image',
                                    },
                                ] }
                            >
                                { ( tab ) => {
                                    if( tab.name == "solid" ) {
                                        return <>
                                                <div className="preset-colors">
                                                    <ul className="preset-colors-inner">
                                                        <li className={ ( color == '--newsmatic-global-preset-color-1' ) && 'active' } data-tip={ __( escapeHTML( 'color 1' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-1)' }} onClick={()=> setColor('--newsmatic-global-preset-color-1')}/>
                                                        <li className={ ( color == '--newsmatic-global-preset-color-2' ) && 'active' } data-tip={ __( escapeHTML( 'color 2' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-2)' }} onClick={()=> setColor('--newsmatic-global-preset-color-2')}/>
                                                        <li className={ ( color == '--newsmatic-global-preset-color-3' ) && 'active' } data-tip={ __( escapeHTML( 'color 3' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-3)' }} onClick={()=> setColor('--newsmatic-global-preset-color-3')}/>
                                                        <li className={ ( color == '--newsmatic-global-preset-color-4' ) && 'active' } data-tip={ __( escapeHTML( 'color 4' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-4)' }} onClick={()=> setColor('--newsmatic-global-preset-color-4')}/>
                                                        <li className={ ( color == '--newsmatic-global-preset-color-5' ) && 'active' } data-tip={ __( escapeHTML( 'color 5' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-5)' }} onClick={()=> setColor('--newsmatic-global-preset-color-5')}/>
                                                        <li className={ ( color == '--newsmatic-global-preset-color-6' ) && 'active' } data-tip={ __( escapeHTML( 'color 6' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-6)' }} onClick={()=> setColor('--newsmatic-global-preset-color-6')}/>
                                                        <li className={ ( color == '--newsmatic-global-preset-color-7' ) && 'active' } data-tip={ __( escapeHTML( 'color 7' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-7)' }} onClick={()=> setColor('--newsmatic-global-preset-color-7')}/>
                                                        <li className={ ( color == '--newsmatic-global-preset-color-8' ) && 'active' } data-tip={ __( escapeHTML( 'color 8' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-8)' }} onClick={()=> setColor('--newsmatic-global-preset-color-8')}/>
                                                        <li className={ ( color == '--newsmatic-global-preset-color-9' ) && 'active' } data-tip={ __( escapeHTML( 'color 9' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-9)' }} onClick={()=> setColor('--newsmatic-global-preset-color-9')}/>
                                                        <li className={ ( color == '--newsmatic-global-preset-color-10' ) && 'active' } data-tip={ __( escapeHTML( 'color 10' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-10)' }} onClick={()=> setColor('--newsmatic-global-preset-color-10')}/>
                                                        <li className={ ( color == '--newsmatic-global-preset-color-11' ) && 'active' } data-tip={ __( escapeHTML( 'color 11' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-11)' }} onClick={()=> setColor('--newsmatic-global-preset-color-11')}/>
                                                        <li className={ ( color == '--newsmatic-global-preset-color-12' ) && 'active' } data-tip={ __( escapeHTML( 'color 12' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-12)' }} onClick={()=> setColor('--newsmatic-global-preset-color-12')}/>
                                                    </ul>
                                                </div>
                                                <ColorPicker
                                                    color={color}
                                                    onChange={setColor}
                                                    enableAlpha
                                                />
                                                <button type="button" className="components-button is-secondary is-small" onClick={()=>setColor(null)}>{ __('Clear', 'newsmatic') }</button>
                                                <Tooltip effect="solid"/>
                                            </>
                                    } else if( tab.name == "gradient" ) {
                                        return <>
                                                <div className="preset-colors">
                                                    <ul className="preset-colors-inner">
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-1' ) && 'active' } data-tip={ __( escapeHTML( 'gradient 1' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-1)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-1')}/>
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-2' ) && 'active' } data-tip={ __( escapeHTML( 'gradient 2' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-2)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-2')}/>
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-3' ) && 'active' } data-tip={ __( escapeHTML( 'gradient 3' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-3)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-3')}/>
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-4' ) && 'active' } data-tip={ __( escapeHTML( 'gradient 4' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-4)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-4')}/>
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-5' ) && 'active' } data-tip={ __( escapeHTML( 'gradient 5' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-5)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-5')}/>
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-6' ) && 'active' } data-tip={ __( escapeHTML( 'gradient 6' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-6)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-6')}/>
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-7' ) && 'active' } data-tip={ __( escapeHTML( 'color 7' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-7)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-7')}/>
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-8' ) && 'active' } data-tip={ __( escapeHTML( 'color 8' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-8)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-8')}/>
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-9' ) && 'active' } data-tip={ __( escapeHTML( 'color 9' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-9)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-9')}/>
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-10' ) && 'active' } data-tip={ __( escapeHTML( 'color 10' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-10)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-10')}/>
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-11' ) && 'active' } data-tip={ __( escapeHTML( 'color 11' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-11)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-11')}/>
                                                        <li className={ ( gradient == '--newsmatic-global-preset-gradient-color-12' ) && 'active' } data-tip={ __( escapeHTML( 'color 12' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-gradient-color-12)' }} onClick={()=> setGradient('--newsmatic-global-preset-gradient-color-12')}/>
                                                    </ul>
                                                </div>
                                                <GradientPicker
                                                    value={ gradient }
                                                    onChange={ ( currentGradient ) => setGradient( currentGradient ) }
                                                    __nextHasNoMargin={true}
                                                    gradients={[]}
                                                />
                                                <Tooltip effect="solid"/>
                                            </>
                                    } else if( tab.name == "image" ) {
                                        return (
                                            <><div className="editor-post-featured-image">
                                                <MediaUpload
                                                    onSelect={onSelectMedia}
                                                    value={image.media_id}
                                                    allowedTypes={ ['image'] }
                                                    render={({open}) => (
                                                        <Button 
                                                            className={image.media_id == 0 ? 'editor-post-featured-image__toggle' : 'editor-post-featured-image__preview'}
                                                            onClick={open}
                                                        >
                                                            {image.media_id == 0 && __('Choose an image', 'newsmatic')}
                                                            {( image != undefined && image.media_id != 0 && image.media_url != '' ) &&
                                                                <ResponsiveWrapper
                                                                    naturalWidth={ 200 }
                                                                    naturalHeight={ 200 }
                                                                >
                                                                    <img src={image.media_url} />
                                                                </ResponsiveWrapper>
                                                                }
                                                        </Button>
                                                    )}
                                                />
                                                {image.media_id != 0 && 
                                                    <MediaUpload
                                                        title={__('Replace image', 'newsmatic')}
                                                        value={image.media_id}
                                                        onSelect={onSelectMedia}
                                                        allowedTypes={['image']}
                                                        render={({open}) => (
                                                            <Button onClick={open} variant="secondary" isLarge>{__('Replace image', 'newsmatic')}</Button>
                                                        )}
                                                    />
                                                }
                                                {image.media_id != 0 && 
                                                    <Button onClick={removeMedia} isLink isDestructive>{__('Remove image', 'newsmatic')}</Button>
                                                }
                                            </div>
                                            <div className="more-settings">
                                                <Button variant="tertiary" isSmall={true} iconPosition="right" icon={ imageSettings ? 'arrow-up-alt' : 'arrow-down-alt'} onClick={() => setImageSettings(!imageSettings)}>{ imageSettings ? __( 'Show less settings!', 'newsmatic') : __( 'Show more settings!', 'newsmatic') }</Button>
                                                { ( imageSettings && image.media_id != 0  ) &&
                                                    <>
                                                        <SelectControl
                                                            label= { __( 'Background Position', 'newsmatic') }
                                                            value={ position }
                                                            options={ [
                                                                { label: 'Left Top', value: 'left top' },
                                                                { label: 'Left Center', value: 'left center' },
                                                                { label: 'Left Bottom', value: 'left bottom' },
                                                                { label: 'Right Top', value: 'right top' },
                                                                { label: 'Right Center', value: 'right center' },
                                                                { label: 'Right Bottom', value: 'right bottom' },
                                                                { label: 'Center Top', value: 'center top' },
                                                                { label: 'Center Center', value: 'center center' },
                                                                { label: 'Center Bottom', value: 'center bottom' },
                                                            ] }
                                                            onChange={ ( newPosition ) => setPosition( newPosition ) }
                                                        />
                                                        <SelectControl
                                                            label= { __( 'Background Repeat', 'newsmatic') }
                                                            value={ repeat }
                                                            options={ [
                                                                { label: 'No Repeat', value: 'no-repeat' },
                                                                { label: 'Repeat All', value: 'repeat' },
                                                                { label: 'Repeat Horizontally', value: 'repeat-x' },
                                                                { label: 'Repeat Vertically', value: 'repeat-y' }
                                                            ] }
                                                            onChange={ ( newRepeat ) => setRepeat( newRepeat ) }
                                                        />
                                                        <div>
                                                            <div className="components-truncate components-text components-input-control__label">{ __( 'Background Attachment', 'newsmatic') }</div>
                                                            <ButtonGroup>
                                                                <Button variant={ attachment == 'fixed' ? 'primary' : 'secondary' } onClick={() => setAttachment('fixed')}>{ __( 'Fixed', 'newsmatic') }</Button>
                                                                <Button variant={ attachment == 'scroll' ? 'primary' : 'secondary' } onClick={() => setAttachment('scroll')}>{ __( 'Scroll', 'newsmatic') }</Button>
                                                            </ButtonGroup>
                                                        </div>
                                                        <div>
                                                            <div className="components-truncate components-text components-input-control__label">{ __( 'Background Size', 'newsmatic') }</div>
                                                            <ButtonGroup>
                                                                <Button variant={ size == 'auto' ? 'primary' : 'secondary' } onClick={() => setSize('auto')}>{ __( 'Auto', 'newsmatic') }</Button>
                                                                <Button variant={ size == 'cover' ? 'primary' : 'secondary' } onClick={() => setSize('cover')}>{ __( 'Cover', 'newsmatic') }</Button>
                                                                <Button variant={ size == 'contain' ? 'primary' : 'secondary' } onClick={() => setSize('contain')}>{ __( 'Contain', 'newsmatic') }</Button>
                                                            </ButtonGroup>
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                            </>
                                        )
                                    }
                                } }
                            </TabPanel>
                        }
                    />
                </span>
            </div>
            <Tooltip effect="solid"/>
        </div>
    )
}

// Range control
const NewsmaticRange = ( props ) =>  {
    const [ range, setRange ] = useState( props.value ),
        [ initialValue ] = useState( props.value ),
        { label, description, input_attrs } = customize.settings.controls[props.setting]

    const updateControl = ( newRange ) => {
        setRange( newRange )
        customize.value( props.setting )(newRange)
    }
    return <>
        <RangeControl
            label = { label }
            description = { description }
            value = { range }
            allowReset = {input_attrs.reset}
            onChange = {( newRange ) => updateControl( newRange )}
            min = { input_attrs.min }
            max = { input_attrs.max }
            step = { input_attrs.step }
            resetFallbackValue = { initialValue }
        />
        { description && <span class="description customize-control-description">{ description }</span> }
    </>
}

// Responsive Control
const NewsmaticResponsiveBox = ( props ) =>  {
    const [ icon, setIcon ] = useState('desktop')
    const [ value, setValue ] = useState(props.value)

    const updateControl = ( newBox ) => {
        let newValue = value
        newValue[icon] = newBox
        setValue(JSON.parse(JSON.stringify(newValue)))
        customize.value( props.setting )(JSON.parse(JSON.stringify(newValue)))
    }
    
    const updateIcon = (newIcon) => {
        const footer = document.getElementById( "customize-footer-actions" )
        if( newIcon == 'tablet' ) { 
            setIcon( 'tablet' )
            footer.getElementsByClassName( "preview-tablet" )[0].click()
        }
        if( newIcon == 'smartphone' ) {
            setIcon( 'smartphone' )
            footer.getElementsByClassName( "preview-mobile" )[0].click()
        }
        if( newIcon == 'desktop' ) {
            setIcon( 'desktop' )
            footer.getElementsByClassName( "preview-desktop" )[0].click()
        }
    }

    const triggerDevice = (device) => {
        if( device == 'mobile' ) {
            setIcon( 'smartphone' )
        } else {
            setIcon( device )
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

    return (
        <>
            <div className="responsive-icons">
                <Dashicon className={ `responsive-trigger ${ ( icon == 'desktop' ) && "isActive" }` } data-tip={ __( escapeHTML( 'Desktop' ), 'newsmatic' ) } icon="desktop" onClick={() => updateIcon("desktop") } />
                <Dashicon className={ `responsive-trigger ${ ( icon == 'tablet' ) && "isActive" }` } data-tip={ __( escapeHTML( 'Tablet' ), 'newsmatic' ) } icon="tablet" onClick={() => updateIcon("tablet") } />
                <Dashicon className={ `responsive-trigger ${ ( icon == 'smartphone' ) && "isActive" }` } data-tip={ __( escapeHTML( 'Mobile' ), 'newsmatic' ) } icon="smartphone" onClick={() => updateIcon("smartphone") } />
            </div>
            <BoxControl
                label={customize.settings.controls[props.setting].label}
                allowReset={false}
                values={ value[icon] }
                onChange={ ( newBox ) => updateControl( newBox ) }
            />
        </>
    )
}

// Responsive Range Control
const NewsmaticRangeResponsive = ( props ) =>  {
    const [ icon, setIcon ] = useState('desktop')
    const [ range, setRange ] = useState(props.value)
    const [ initialRange ] = useState(props.value)
    
    const updateControl = ( newBox ) => {
        range[icon] = newBox
        setRange(JSON.parse(JSON.stringify(range)))
        customize.value( props.setting )(range)
    }
    
    const updateIcon = (newIcon) => {
        const footer = document.getElementById( "customize-footer-actions" )
        if( newIcon == 'tablet' ) { 
            setIcon( 'tablet' )
            footer.getElementsByClassName( "preview-tablet" )[0].click()
        }
        if( newIcon == 'smartphone' ) {
            setIcon( 'smartphone' )
            footer.getElementsByClassName( "preview-mobile" )[0].click()
        }
        if( newIcon == 'desktop' ) {
            setIcon( 'desktop' )
            footer.getElementsByClassName( "preview-desktop" )[0].click()
        }
    }

    const triggerDevice = (device) => {
        if( device == 'mobile' ) {
            setIcon( 'smartphone' )
        } else {
            setIcon( device )
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

    return (
        <>
            <div className="responsive-icons">
                <Dashicon className={ `responsive-trigger ${ ( icon == 'desktop' ) && "isActive" }` } data-tip={ __( escapeHTML( 'Desktop' ), 'newsmatic' ) } icon="desktop" onClick={() => updateIcon("desktop") } />
                <Dashicon className={ `responsive-trigger ${ ( icon == 'tablet' ) && "isActive" }` } data-tip={ __( escapeHTML( 'Tablet' ), 'newsmatic' ) } icon="tablet" onClick={() => updateIcon("tablet") } />
                <Dashicon className={ `responsive-trigger ${ ( icon == 'smartphone' ) && "isActive" }` } data-tip={ __( escapeHTML( 'Mobile' ), 'newsmatic' ) } icon="smartphone" onClick={() => updateIcon("smartphone") } />
            </div>
            <RangeControl
                label={ customize.settings.controls[props.setting].label }
                description={ customize.settings.controls[props.setting].description }
                value={ range[icon] }
                allowReset = {customize.settings.controls[props.setting].input_attrs.reset}
                onChange={ ( newRange ) => updateControl( newRange ) }
                min={ customize.settings.controls[props.setting].input_attrs.min }
                max={ customize.settings.controls[props.setting].input_attrs.max }
                step={ customize.settings.controls[props.setting].input_attrs.step }
                resetFallbackValue={initialRange[icon]}
            />
        </>
    )
}

// Multiselect category control
const NewsmaticMultiselect = ( props ) => {
    const [ multiselect, setMultiselect ] = useState(JSON.parse(props.value))
    const { choices } = customize.settings.controls[props.setting]
    
    useEffect(() => {
        customize.value( props.setting )(JSON.stringify(multiselect))
    }, [multiselect]);

    return (
        <>
            { choices && 
                <Select
                    isMulti={true}
                    inputId="newsmatic-search-in-select"
                    isSearchable ={true}
                    heading={customize.settings.controls[props.setting].label}
                    placeholder={__( escapeHTML( 'Type to search . . ' ), 'newsmatic' )}
                    value={multiselect}
                    options={choices}
                    onChange={ ( newMultiselect ) => setMultiselect( newMultiselect ) }
                />
            }
        </>
    )
}

// Checkbox control
const NewsmaticCheckbox = ( props ) =>  {
    const [ checkbox, setCheckbox ] = useState(props.value)

    const updateControl = ( newCheckbox ) => {
        setCheckbox( newCheckbox )
        customize.value( props.setting )(newCheckbox)
    }
    return (
        <CheckboxControl
            label= { customize.settings.controls[props.setting].label }
            help={ customize.settings.controls[props.setting].description }
            checked={ checkbox }
            onChange={ (newCheckbox) => updateControl(newCheckbox) }
        />
    )
}

// Color Group control
const NewsmaticColorGroupPicker = ( props ) =>  {
    const [ color, setColor ] = useState(props.value.color)
    const [ hover, setHover ] = useState(props.value.hover)
    
    useEffect(() => {
        customize.value( props.setting )({ color: color, hover: hover })
    },[color,hover] );

    const resetData = () => {
        setColor(props.value.color)
        setHover(props.value.hover)
    }

    function getBackground(color) {
        if( color == null ) return
        if( color.includes('preset') ) {
            return 'var(' + color + ')'
        } else {
            return color
        }
    }
    
    return (
        <div className="control-header">
            <div className="control-header-trigger color-group-inner-wrap">
                <label>{ customize.settings.controls[props.setting].label }</label>
                <span className="control-content-wrap">
                    <span class="reset-button components-button is-secondary is-small" onClick={() => resetData() }><span class="dashicon dashicons dashicons-image-rotate"></span></span>
                    <Dropdown
                        popoverProps={{resize:false,noArrow:false,flip:false,placement:'bottom-end'}}
                        renderToggle={ ( { isOpen, onToggle } ) => (
                            <span className={ "color-indicator-wrapper" + ( newsmaticCheckIfPresetColor( color ) ? ' preset-isactive' : '') }>
                                <ColorIndicator 
                                    className={ color == null && "null-color" }
                                    data-tip={ __( escapeHTML( 'initial' ), 'newsmatic' ) }
                                    colorValue = { getBackground(color) }
                                    onClick={ onToggle }
                                    aria-expanded={ isOpen }
                                />
                            </span>
                        ) }
                        renderContent={ () => <>
                            <div className="preset-colors">
                                <ul className="preset-colors-inner">
                                    <li className={ ( color == '--newsmatic-global-preset-color-1' ) && 'active' } data-tip={ __( escapeHTML( 'color 1' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-1)' }} onClick={()=> setColor('--newsmatic-global-preset-color-1')}/>
                                    <li className={ ( color == '--newsmatic-global-preset-color-2' ) && 'active' } data-tip={ __( escapeHTML( 'color 2' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-2)' }} onClick={()=> setColor('--newsmatic-global-preset-color-2')}/>
                                    <li className={ ( color == '--newsmatic-global-preset-color-3' ) && 'active' } data-tip={ __( escapeHTML( 'color 3' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-3)' }} onClick={()=> setColor('--newsmatic-global-preset-color-3')}/>
                                    <li className={ ( color == '--newsmatic-global-preset-color-4' ) && 'active' } data-tip={ __( escapeHTML( 'color 4' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-4)' }} onClick={()=> setColor('--newsmatic-global-preset-color-4')}/>
                                    <li className={ ( color == '--newsmatic-global-preset-color-5' ) && 'active' } data-tip={ __( escapeHTML( 'color 5' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-5)' }} onClick={()=> setColor('--newsmatic-global-preset-color-5')}/>
                                    <li className={ ( color == '--newsmatic-global-preset-color-6' ) && 'active' } data-tip={ __( escapeHTML( 'color 6' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-6)' }} onClick={()=> setColor('--newsmatic-global-preset-color-6')}/>
                                    <li className={ ( color == '--newsmatic-global-preset-color-7' ) && 'active' } data-tip={ __( escapeHTML( 'color 7' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-7)' }} onClick={()=> setColor('--newsmatic-global-preset-color-7')}/>
                                    <li className={ ( color == '--newsmatic-global-preset-color-8' ) && 'active' } data-tip={ __( escapeHTML( 'color 8' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-8)' }} onClick={()=> setColor('--newsmatic-global-preset-color-8')}/>
                                    <li className={ ( color == '--newsmatic-global-preset-color-9' ) && 'active' } data-tip={ __( escapeHTML( 'color 9' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-9)' }} onClick={()=> setColor('--newsmatic-global-preset-color-9')}/>
                                    <li className={ ( color == '--newsmatic-global-preset-color-10' ) && 'active' } data-tip={ __( escapeHTML( 'color 10' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-10)' }} onClick={()=> setColor('--newsmatic-global-preset-color-10')}/>
                                    <li className={ ( color == '--newsmatic-global-preset-color-11' ) && 'active' } data-tip={ __( escapeHTML( 'color 11' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-11)' }} onClick={()=> setColor('--newsmatic-global-preset-color-11')}/>
                                    <li className={ ( color == '--newsmatic-global-preset-color-12' ) && 'active' } data-tip={ __( escapeHTML( 'color 12' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-12)' }} onClick={()=> setColor('--newsmatic-global-preset-color-12')}/>
                                </ul>
                            </div>
                            <ColorPicker
                                color={color}
                                onChange={ ( newColor ) => setColor( newColor ) }
                                enableAlpha
                            />
                            <button type="button" class="components-button is-secondary is-small" onClick={ () => setColor(null) }>{ __( 'Clear', 'newsmatic' ) }</button>
                            <Tooltip effect="solid"/>
                        </> }
                    />
                    <Dropdown
                        popoverProps={{resize:false,noArrow:false,flip:false,placement:'bottom-end'}}
                        renderToggle={ ( { isOpen, onToggle } ) => (
                            <span className={ "color-indicator-wrapper" + ( newsmaticCheckIfPresetColor( hover ) ? ' preset-isactive' : '') }>
                                <ColorIndicator
                                    className={ hover == null && "null-color" }
                                    data-tip={ __( escapeHTML( 'hover' ), 'newsmatic' ) }
                                    colorValue = { getBackground(hover) }
                                    onClick={ onToggle }
                                    aria-expanded={ isOpen }
                                />
                            </span>
                        ) }
                        renderContent={ () => <>
                            <div className="preset-colors">
                                <ul className="preset-colors-inner">
                                    <li className={ ( hover == '--newsmatic-global-preset-color-1' ) && 'active' } data-tip={ __( escapeHTML( 'color 1' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-1)' }} onClick={()=> setHover('--newsmatic-global-preset-color-1')}/>
                                    <li className={ ( hover == '--newsmatic-global-preset-color-2' ) && 'active' } data-tip={ __( escapeHTML( 'color 2' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-2)' }} onClick={()=> setHover('--newsmatic-global-preset-color-2')}/>
                                    <li className={ ( hover == '--newsmatic-global-preset-color-3' ) && 'active' } data-tip={ __( escapeHTML( 'color 3' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-3)' }} onClick={()=> setHover('--newsmatic-global-preset-color-3')}/>
                                    <li className={ ( hover == '--newsmatic-global-preset-color-4' ) && 'active' } data-tip={ __( escapeHTML( 'color 4' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-4)' }} onClick={()=> setHover('--newsmatic-global-preset-color-4')}/>
                                    <li className={ ( hover == '--newsmatic-global-preset-color-5' ) && 'active' } data-tip={ __( escapeHTML( 'color 5' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-5)' }} onClick={()=> setHover('--newsmatic-global-preset-color-5')}/>
                                    <li className={ ( hover == '--newsmatic-global-preset-color-6' ) && 'active' } data-tip={ __( escapeHTML( 'color 6' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-6)' }} onClick={()=> setHover('--newsmatic-global-preset-color-6')}/>
                                    <li className={ ( hover == '--newsmatic-global-preset-color-7' ) && 'active' } data-tip={ __( escapeHTML( 'color 7' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-7)' }} onClick={()=> setHover('--newsmatic-global-preset-color-7')}/>
                                    <li className={ ( hover == '--newsmatic-global-preset-color-8' ) && 'active' } data-tip={ __( escapeHTML( 'color 8' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-8)' }} onClick={()=> setHover('--newsmatic-global-preset-color-8')}/>
                                    <li className={ ( hover == '--newsmatic-global-preset-color-9' ) && 'active' } data-tip={ __( escapeHTML( 'color 9' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-9)' }} onClick={()=> setHover('--newsmatic-global-preset-color-9')}/>
                                    <li className={ ( hover == '--newsmatic-global-preset-color-10' ) && 'active' } data-tip={ __( escapeHTML( 'color 10' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-10)' }} onClick={()=> setHover('--newsmatic-global-preset-color-10')}/>
                                    <li className={ ( hover == '--newsmatic-global-preset-color-11' ) && 'active' } data-tip={ __( escapeHTML( 'color 11' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-11)' }} onClick={()=> setHover('--newsmatic-global-preset-color-11')}/>
                                    <li className={ ( hover == '--newsmatic-global-preset-color-12' ) && 'active' } data-tip={ __( escapeHTML( 'color 12' ), 'newsmatic' ) } style ={{background: 'var(--newsmatic-global-preset-color-12)' }} onClick={()=> setHover('--newsmatic-global-preset-color-12')}/>
                                </ul>
                            </div>
                            <ColorPicker
                                color={hover}
                                onChange={ ( newHoverColor ) => setHover( newHoverColor ) }
                                enableAlpha
                            />
                            <button type="button" class="components-button is-secondary is-small" onClick={ () => setHover(null) }>{ __( 'Clear', 'newsmatic' ) }</button>
                            <Tooltip effect="solid"/>
                        </> }
                    />
                    <Tooltip effect="solid"/>
                </span>
            </div>
        </div>
    )
}

 // section tab control
const NewsmaticSectionTab = (props) => {
    const { value, setting } = props
    const { choices } = customize.settings.controls[props.setting]

    useEffect (() => {
        onTabChange(value)
    })
    
    function onTabChange(tabName) {
        var sectionName =  wp.customize.control( setting ).section()
        var controlsName = wp.customize.section(sectionName).controls()
        for( var i = 0; i < controlsName.length; i++ ) {
            if( ! controlsName[i].params.tab ) controlsName[i].params.tab = 'general'
            if( controlsName[i].id == 'header_textcolor' ) controlsName[i].params.tab = 'design'
            if( i > 0 && controlsName[i].params.tab ) {
                if(tabName == controlsName[i].params.tab && controlsName[i].params.active ) {
                    controlsName[i].container[0].removeAttribute( "style" )
                } else {
                    controlsName[i].container[0].setAttribute( "style", "display:none" )
                }
            }
        }
    }

    return(
        <TabPanel
            activeClass="active-tab"
            initialTabName={value}
            onSelect={ ( tabName => onTabChange(tabName) ) }
            tabs={ choices }
        >
            { ( tab ) => {
                return;
            }}
        </TabPanel>
    )
}

const NewsmaticIconText = (props) => {
    const [ icon, setIcon ] = useState(props.value.icon)
    const [ text, setText ] = useState(props.value.text)
    const [ choiceIcons, setChoiceIcons ] = useState(customize.control( props.setting ).params.icons)

    useEffect(() => {
        customize.value( props.setting )({ icon: icon, text: text})
    },[icon,text])

    return(
        <div className="field-main">
            <span class="customize-control-title">{ customize.settings.controls[props.setting].label }</span>
            <div className="field-wrap">
                <Dropdown
                    popoverProps={{resize:false,noArrow:false,flip:false,placement:'top-start'}}
                    className="icon-field"
                    renderToggle={ ( { isOpen, onToggle } ) => (
                        <i class={icon}
                        onClick={ onToggle }
                        aria-expanded={ isOpen }></i>
                    ) }
                    renderContent={ () => <div className="icon-picker-modal">
                        { choiceIcons &&
                            choiceIcons.map( choiceIcon => {
                                return(
                                    <i className={choiceIcon} onClick={ () => setIcon(choiceIcon) }></i>
                                )
                            })
                        }
                    </div> }
                />
                <TextControl
                    className="text-field"
                    value={ text }
                    onChange={ ( newText ) => setText( newText ) }
                />
            </div>
        </div>
    )
}

/**
 * Responsive Radio Tab control
 * 
 * @since 1.4.0
 */
const NewsmaticResponsiveRadioTab = ( props ) => {
    const [ tab, setTab ] = useState( props.value ),
        { label, description, choices, double_line: doubleLine, responsive: isResponsive } = customize.settings.controls[ props.setting ],
        [ responsive, setResponsive ] = useState( 'desktop' ),
        _thisValue = isResponsive ? tab[responsive] : tab
    
    useEffect(() => {
        customize.value( props.setting )( tab )
    }, [ tab ])

    /**
     * Reflect the active responsive in our custom controls
     * 
     * @since 1.4.0
     */
    useEffect(() => {
        newsmaticReflectResponsiveInControl( setResponsive )
    }, [])

    /**
     * Handle responsive icons click
     * 
     * @since 1.4.0
     */
    const handleResponsiveIconsClick = ( type ) => {
        newsmaticReflectResponsiveInCustomizer( setResponsive, type )
    }

    /**
     * Handle button click
     * 
     * @since 1.4.0
     */
    const handleButtonClick = ( value ) => {
        if( isResponsive ) {
            setTab({ ...tab, [responsive]: value })
        } else {
            setTab( value )
        }
    }

    return(
        <div className={ 'radio-tab-wrapper' + ( doubleLine ? ' double-line' : '' ) }>
            <NewsmaticControlHeader label={ label } description={ description }>
                { isResponsive && <NewsmaticGetResponsiveIcons responsive={ responsive } stateToSet={ handleResponsiveIconsClick } /> }
            </NewsmaticControlHeader>
            <ButtonGroup className="control-inner">
                { choices &&
                    choices.map( (choice) => {
                        const { value, label: tabLabel = '', icon } = choice
                        return(
                            <Button
                                variant = { _thisValue === value ? 'primary' : 'secondary' }
                                onClick = {() => handleButtonClick( value )}
                                label = { icon ? tabLabel : '' }
                                showTooltip = { icon ? true : false }
                                className = { icon ? 'is-icon' : ''}
                                tooltipPosition = { 'top' }
                            >
                                { icon ? <Dashicon icon={ icon } /> : tabLabel }
                            </Button>
                        )
                    })
                }
            </ButtonGroup>
        </div>
    )
}

/**
 * Builder Widget Reflector
 * 
 * @since 1.4.0
 */
const NewsmaticBuilderReflector = ( props ) => {
    const { placement, row, label, description, builder, responsive: responsiveBuilder, responsive_builder_id: responsiveBuilderId } = customize.settings.controls[ props.setting ],
        [ responsive, setResponsive ] = useState( 'desktop' )

    useEffect(() => {
        newsmaticReflectResponsiveInControl( setResponsive )
    }, [])

    const reflectors = useSelect(( select ) => {
        return {
            /* Header builder reflector*/
            "header" : select( myCustomStore ).getHeaderBuilderReflector(),
            /* Footer builder reflector*/
            "footer" : select( myCustomStore ).getFooterBuilderReflector(),
            /* Responsive header builder reflector*/
            "responsive-header" : select( myCustomStore ).getResponsiveHeaderBuilderReflector()
        }
    }, []);

    /**
     * All widgets of a row
     * 
     * @since 1.4.0
     */
    const widgets = useMemo(() => {
        let builderValues
        if( responsive === 'desktop' ) {
            builderValues = reflectors[placement]
        } else {
            builderValues = ( responsiveBuilder !== null ) ? reflectors[responsiveBuilder] : reflectors[placement]
        }
        if( builderValues === null || builderValues === undefined ) return []
        if( Object.keys( builderValues ).length > 0 ) {
            const rowWidgets = builderValues[ row - 1 ]
            return Object.values( rowWidgets ).flatMap(( widget ) => widget )
        } else {
            return []
        }
    }, [ reflectors, responsive ])


    /**
     * Get instance of related builder using builder variable
     * 
     * @since 1.4.0
     */
    const builderWidgets = useMemo(() => {
        let activeBuilder
        if( responsive === 'desktop' ) {
            activeBuilder = builder
        } else {
            activeBuilder = ( responsiveBuilderId !== null ) ? responsiveBuilderId : builder
        }
        const sectionInstance = customize.control( activeBuilder ).params.widgets
        return sectionInstance
    }, [ responsive ])

    return <div className='field-main'>
        <NewsmaticControlHeader label={ label } description={ description } />
        <ul className='field-wrap'>
            {
                ( widgets.length > 0 ) ? 
                widgets.map(( widget, index ) => {
                    const { label: widgetLabel, section } = builderWidgets[widget]
                    return <li className='widget-reflector' key={ index } onClick={() => customize.section( section ).expand()}>
                        <span className='reflector-label'>{ widgetLabel }</span>
                        <Dashicon icon={ 'arrow-right-alt2' } />
                    </li>
                }) :
                <span className='no-widgets'>{ 'This row has no widgets.' }</span>
            }
        </ul>
    </div>
}

/**
 * Builder Number
 * 
 * @since 1.4.0
 */
const NewsmaticNumber = ( props ) => {
    const [ value, setValue ] = useState( props.value )
    const [ activeResponsive, setActiveResponsive ] = useState( 'desktop' )
    const { label, description, input_attrs: inputAttrs, responsive, default: defaulValue } = customize.settings.controls[props.setting]
    const { setHeaderFirstRow, setHeaderSecondRow, setHeaderThirdRow, setFooterFirstRow, setFooterSecondRow, setFooterThirdRow } = useDispatch( myCustomStore );

    useEffect(() => {
        customize.value( props.setting )( value )
        switch( props.setting ) {
            /* Header Count */
            case 'header_first_row_column' :
                setHeaderFirstRow( value )
                break;
            case 'header_second_row_column' :
                setHeaderSecondRow( value )
                break;
            case 'header_third_row_column' :
                setHeaderThirdRow( value )
                break;
            /* Footer Count */
            case 'footer_first_row_column' :
                setFooterFirstRow( value )
                break;
            case 'footer_second_row_column' :
                setFooterSecondRow( value )
                break;
            case 'footer_third_row_column' :
                setFooterThirdRow( value )
                break;
        }
    }, [ ( responsive ) ? value[activeResponsive] : value ] )

    useEffect(() => {
        newsmaticReflectResponsiveInControl( setActiveResponsive )
    }, [])

    // handle responsive icon click
    const handleDashIconClick = ( type ) => {
        newsmaticReflectResponsiveInCustomizer( setActiveResponsive, type )
    }

    return (
        <>
            <div className='field-main'>
                <NewsmaticControlHeader label={ label } description={ description }>
                    { responsive && <NewsmaticGetResponsiveIcons responsive={ activeResponsive } stateToSet={ handleDashIconClick } >
                        <Dashicon icon='image-rotate' className="reset-button" onClick={() => setValue( defaulValue )}/>
                    </NewsmaticGetResponsiveIcons> }
                </NewsmaticControlHeader>
                <RangeControl
                    onChange = { ( newValue ) => setValue( ( responsive ) ? { ...value, [activeResponsive]: newValue } : newValue ) }
                    value = { ( responsive ) ? value[activeResponsive] : value }
                    min = { inputAttrs.min }
                    max = { inputAttrs.max }
                    step = { inputAttrs.step }
                />
            </div>
        </>
    );
}

// Render components to html
customize.bind( 'ready', function () {
    // render color group control component
    const colorGroupControls = document.getElementsByClassName( "customize-color-group-control" )
    for( let colorGroupControl of colorGroupControls ) {
        const setting = colorGroupControl.getAttribute( 'data-setting' );
        const settingValue =  JSON.parse( customize.settings.settings[setting].value )
        if( colorGroupControl ) {
            render( <NewsmaticColorGroup value={settingValue} setting={setting}/>, colorGroupControl )
        }
    }
    
    // render toggle button control
    const toggleButtonControls = document.getElementsByClassName( "customize-toggle-button-control" )
    for( let toggleButtonControl of toggleButtonControls ) {
        const setting = toggleButtonControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( toggleButtonControl ) {
            render( <NewsmaticToggleButton value={settingValue} setting={setting}/>, toggleButtonControl )
        }
    }

    // render toggle button control
    const simpleToggleButtonControls = document.getElementsByClassName( "customize-simple-toggle-control" )
    for( let simpleToggleButtonControl of simpleToggleButtonControls ) {
        const setting = simpleToggleButtonControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( simpleToggleButtonControl ) {
            render( <NewsmaticSimpleToggleButton value={settingValue} setting={setting}/>, simpleToggleButtonControl )
        }
    }

    // radio-tab control component
    const radioTabControls = document.getElementsByClassName( "customize-radio-tab-control" )
    for( let radioTabControl of radioTabControls ) {
        const setting = radioTabControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( radioTabControl ) {
            render( <NewsmaticRadioTab value={settingValue} setting={setting}/>, radioTabControl )
        }
    }

    // radio-bubble control component
    const radioBubbleControls = document.getElementsByClassName( "customize-radio-bubble-control" )
    for( let radioBubbleControl of radioBubbleControls ) {
        const setting = radioBubbleControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( radioBubbleControl ) {
            render( <NewsmaticRadioBubble value={settingValue} setting={setting}/>, radioBubbleControl )
        }
    }

    // responsive multi select tab control component
    const responsiveMultiselectTabControls = document.getElementsByClassName( "customize-responsive-multiselect-tab-control" )
    for( let responsiveMultiselectTabControl of responsiveMultiselectTabControls ) {
        const setting = responsiveMultiselectTabControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( responsiveMultiselectTabControl ) {
            render( <NewsmaticResponsiveMultiselectTab value={settingValue} setting={setting}/>, responsiveMultiselectTabControl )
        }
    }

    // render color picker control component
    const colorPickerControls = document.getElementsByClassName( "customize-color-picker-control" )
    for( let colorPickerControl of colorPickerControls ) {
        const setting = colorPickerControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( colorPickerControl ) {
            render( <NewsmaticColorPicker value={settingValue} setting={setting}/>, colorPickerControl )
        }
    }

    // render preset color picker control component
    const presetColorPickerControls = document.getElementsByClassName( "customize-preset-color-picker-control" )
    for( let presetColorPickerControl of presetColorPickerControls ) {
        const setting = presetColorPickerControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( presetColorPickerControl ) {
            render( <NewsmaticPresetColorPicker value={settingValue} setting={setting}/>, presetColorPickerControl )
        }
    }

    // render preset gradient picker control component
    const presetGradientPickerControls = document.getElementsByClassName( "customize-preset-gradient-picker-control" )
    for( let presetGradientPickerControl of presetGradientPickerControls ) {
        const setting = presetGradientPickerControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( presetGradientPickerControl ) {
            render( <NewsmaticPresetGradientPicker value={settingValue} setting={setting}/>, presetGradientPickerControl )
        }
    }

    // render colors with image group control component
    const colorImageGroupControls = document.getElementsByClassName( "customize-color-image-group-control" )
    for( let colorImageGroupControl of colorImageGroupControls ) {
        const setting = colorImageGroupControl.getAttribute( 'data-setting' );
        const settingValue =  JSON.parse(customize.settings.settings[setting].value)
        if( colorImageGroupControl ) {
            render( <NewsmaticColorImageGroup value={settingValue} setting={setting}/>, colorImageGroupControl )
        }
    }
    
    // render range control component
    const rangeControls = document.getElementsByClassName( "customize-range-control" )
    for( let rangeControl of rangeControls ) {
        const setting = rangeControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( rangeControl ) {
            render( <NewsmaticRange value={settingValue} setting={setting}/>, rangeControl )
        }
    }

    // render responsive range control component
    const responsiveRangeControls = document.getElementsByClassName( "customize-responsive-range-control" )
    for( let responsiveRangeControl of responsiveRangeControls ) {
        const setting = responsiveRangeControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( responsiveRangeControl ) {
            render( <NewsmaticRangeResponsive value={settingValue} setting={setting}/>, responsiveRangeControl )
        }
    }

    // render responsive box control component
    const responsiveBoxControls = document.getElementsByClassName( "customize-responsive-box-control" )
    for( let responsiveBoxControl of responsiveBoxControls ) {
        const setting = responsiveBoxControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( responsiveBoxControl ) {
            render( <NewsmaticResponsiveBox value={settingValue} setting={setting}/>, responsiveBoxControl )
        }
    }

    // render multicheckbox control component
    const multiselectControls = document.getElementsByClassName( "customize-multiselect-control" )
    for( let multiselectControl of multiselectControls ) {
        const setting = multiselectControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( multiselectControl ) {
            render( <NewsmaticMultiselect value={settingValue} setting={setting}/>, multiselectControl )
        }
    }

    // render categories multicheckbox control component
    const categoriesMultiselectControls = document.getElementsByClassName( "customize-categories-multiselect-control" )
    for( let categoriesMultiselectControl of categoriesMultiselectControls ) {
        const setting = categoriesMultiselectControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( categoriesMultiselectControl ) {
            render( <NewsmaticCategoriesMultiselect value={settingValue} setting={setting}/>, categoriesMultiselectControl )
        }
    }

    // render posts multicheckbox control component
    const postsMultiselectControls = document.getElementsByClassName( "customize-posts-multiselect-control" )
    for( let postsMultiselectControl of postsMultiselectControls ) {
        const setting = postsMultiselectControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( postsMultiselectControl ) {
            render( <NewsmaticPostsMultiselect value={settingValue} setting={setting}/>, postsMultiselectControl )
        }
    }

    // render checkbox control component
    const checkboxControls = document.getElementsByClassName( "customize-checkbox-control" )
    for( let checkboxControl of checkboxControls ) {
        const setting = checkboxControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( checkboxControl ) {
            render( <NewsmaticCheckbox value={settingValue} setting={setting}/>, checkboxControl )
        }
    }

    // render block repeater control component
    const blockRepeaterControls = document.getElementsByClassName( "customize-block-repeater-control" )
    for( let blockRepeaterControl of blockRepeaterControls ) {
        const setting = blockRepeaterControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( blockRepeaterControl ) {
            render( <NewsmaticBlockRepeater value={settingValue} setting={setting}/>, blockRepeaterControl )
        }
    }

    // render block item sortable control component
    const itemSortableControls = document.getElementsByClassName( "customize-item-sortable-control" )
    for( let itemSortableControl of itemSortableControls ) {
        const setting = itemSortableControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( itemSortableControl ) {
            render( <NewsmaticItemSort value={settingValue} setting={setting}/>, itemSortableControl )
        }
    }

    // render block typography control component
    const typographyControls = document.getElementsByClassName( "customize-typography-control" )
    for( let typographyControl of typographyControls ) {
        const setting = typographyControl.getAttribute( 'data-setting' );
        const settingValue = customize.settings.settings[setting].value
        if( typographyControl ) {
            render( <NewsmaticTypography value={settingValue} setting={setting}/>, typographyControl )
        }
    }

    // render block box shadow control component
    const boxShadowControls = document.getElementsByClassName( "customize-box-shadow-control" )
    for( let boxShadowControl of boxShadowControls ) {
        const setting = boxShadowControl.getAttribute( 'data-setting' );
        const settingValue = customize.settings.settings[setting].value
        if( boxShadowControl ) {
            render( <NewsmaticBoxShadow value={settingValue} setting={setting}/>, boxShadowControl )
        }
    }

    // render color group color an hover color picker control component
    const colorGroupPickerControls = document.getElementsByClassName( "customize-color-group-picker-control" )
    for( let colorGroupPickerControl of colorGroupPickerControls ) {
        const setting = colorGroupPickerControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( colorGroupPickerControl ) {
            render( <NewsmaticColorGroupPicker value={settingValue} setting={setting}/>, colorGroupPickerControl )
        }
    }

    // render section tab control component
    const sectionTabControls = document.getElementsByClassName( "customize-section-tab-control" )
    for( let sectionTabControl of sectionTabControls ) {
        const setting = sectionTabControl.getAttribute( 'data-setting' );
        const settingValue = customize.settings.settings[setting].value
        if( sectionTabControl ) {
            render( <NewsmaticSectionTab value={settingValue} setting={setting}/>, sectionTabControl )
        }
    }

    // render icon-text control component
    const iconTextControls = document.getElementsByClassName( "customize-icon-text-control" )
    for( let iconTextControl of iconTextControls ) {
        const setting = iconTextControl.getAttribute( 'data-setting' );
        const settingValue = customize.settings.settings[setting].value
        if( iconTextControl ) {
            render( <NewsmaticIconText value={settingValue} setting={setting}/>, iconTextControl )
        }
    }

    // render border control component
    const borderControls = document.getElementsByClassName( "customize-border-control" )
    for( let borderControl of borderControls ) {
        const setting = borderControl.getAttribute( 'data-setting' );
        const settingValue = customize.settings.settings[setting].value
        if( borderControl ) {
            render( <NewsmaticBorder value={settingValue} setting={setting}/>, borderControl )
        }
    }

    // render info box control
    const infoBoxControls = document.getElementsByClassName( "customize-info-box-control" )
    for( let infoBoxControl of infoBoxControls ) {
        const setting = infoBoxControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( infoBoxControl ) {
            render( <NewsmaticInfoBox value={settingValue} setting={setting}/>, infoBoxControl )
        }
    }

    // render info box control
    const infoBoxActionControls = document.getElementsByClassName( "customize-info-box-action-control" )
    for( let infoBoxActionControl of infoBoxActionControls ) {
        const setting = infoBoxActionControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( infoBoxActionControl ) {
            render( <NewsmaticInfoBoxAction value={settingValue} setting={setting}/>, infoBoxActionControl )
        }
    }

    // render builder control
    const builderControls = document.getElementsByClassName( "customize-builder-control" )
    for( let builderControl of builderControls ) {
        const setting = builderControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( builderControl ) render( <NewsmaticHeaderBuilder value={settingValue} setting={setting}/>, builderControl )
    }

    // render responsive builder control
    const responsivebuilderControls = document.getElementsByClassName( "customize-responsive-builder-control" )
    for( let responsivebuilderControl of responsivebuilderControls ) {
        const setting = responsivebuilderControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( responsivebuilderControl ) render( <NewsmaticResponsiveBuilder value={settingValue} setting={setting}/>, responsivebuilderControl )
    }

    // render responsive radio tab control
    const responsiveRadioTabControls = document.getElementsByClassName( "customize-responsive-radio-tab-control" )
    for( let responsiveRadioTabControl of responsiveRadioTabControls ) {
        const setting = responsiveRadioTabControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( responsiveRadioTabControl ) render( <NewsmaticResponsiveRadioTab value={settingValue} setting={setting}/>, responsiveRadioTabControl )
    }

    // render builder reflector control
    const numberRangeControls = document.getElementsByClassName( "customize-number-range-control" )
    for( let numberRangeControl of numberRangeControls ) {
        const setting = numberRangeControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( numberRangeControl ) render( <NewsmaticNumber value={settingValue} setting={setting}/>, numberRangeControl )
    }

    // render responsive radio image control
    const responsiveRadioImageControls = document.getElementsByClassName( "customize-responsive-radio-image-control" )
    for( let responsiveRadioImageControl of responsiveRadioImageControls ) {
        const setting = responsiveRadioImageControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( responsiveRadioImageControl ) render( <NewsmaticResponsiveRadioImage value={settingValue} setting={setting}/>, responsiveRadioImageControl )
    }

    // render builder reflector control
    const builderReflectorControls = document.getElementsByClassName( "customize-builder-reflector-control" )
    for( let builderReflectorControl of builderReflectorControls ) {
        const setting = builderReflectorControl.getAttribute( 'data-setting' );
        const settingValue =  customize.settings.settings[setting].value
        if( builderReflectorControl ) render( <NewsmaticBuilderReflector value={settingValue} setting={setting}/>, builderReflectorControl )
    }

    ///  Handle the user interface 
    const sectionsArray = [ 'newsmatic_full_width_section', 'newsmatic_leftc_rights_section', 'newsmatic_lefts_rightc_section', 'newsmatic_bottom_full_width_section' ]
    sectionsArray.forEach(function(section) {
        customize.section(section).expanded.bind(function (isExpanded) {
            if( isExpanded ) {
                wp.customize.control( 'homepage_content_order' ).section(section)
            } else {
                wp.customize.control( 'homepage_content_order' ).section( 'newsmatic_front_sections_reorder_section' )
            }
        })
    })
})
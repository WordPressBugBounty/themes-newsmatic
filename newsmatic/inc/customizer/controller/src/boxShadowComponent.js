const { Dropdown, RangeControl, ColorIndicator, ColorPicker, SelectControl, ButtonGroup, Button } = wp.components;
const { escapeHTML } = wp.escapeHtml;
const { __ } = wp.i18n;
const { useState, useEffect } = wp.element;
const { customize } = wp;
import { Tooltip } from 'react-tooltip'
import { newsmaticCheckIfPresetColor } from './components';

export const NewsmaticBoxShadow = (props) => {
    const [boxShadow, setBoxShadow] = useState(props.value)
    const [option, setOption] = useState(boxShadow.option)
    const [hoffset, setHoffset] = useState(boxShadow.hoffset)
    const [voffset, setVoffset] = useState(boxShadow.voffset)
    const [blur, setBlur] = useState(boxShadow.blur)
    const [spread, setSpread] = useState(boxShadow.spread)
    const [type, setType] = useState(boxShadow.type)
    const [color, setColor] = useState(boxShadow.color)

    useEffect(() => {
        const newValue = {
            option: option,
            hoffset: hoffset,
            voffset: voffset,
            blur: blur,
            spread: spread,
            type: type,
            color: color
        }
        setBoxShadow(JSON.parse(JSON.stringify(newValue)))
        customize.value( props.setting )(JSON.parse(JSON.stringify(newValue)))
    },[option,hoffset,voffset,blur,spread,type,color])

    const toDefault = () => {
        setFontFamily(props.value.option)
        setFontFamily(props.value.hoffset)
        setFontWeight(props.value.voffset)
        setFontSize(props.value.blur)
        setLineHeight(props.value.spread)
        setLetterSpacing(props.value.type)
        setTextTransform(props.value.color)
    }

    const options = [
        { label: __( escapeHTML( "None" ), "newsmatic" ), value: 'none' },
        { label: __( escapeHTML( "Adjust" ), "newsmatic" ), value: 'adjust' }
    ]

    function getBackground(color) {
        if( color == null ) return
        if( color.includes('preset') ) {
            return 'var(' + color + ')'
        } else {
            return color
        }
    }

    return(
        <>
            <label className="control-title">{ customize.settings.controls[props.setting].label }<span class="reset-button components-button is-secondary is-small" onClick={() => toDefault() }><span class="dashicon dashicons dashicons-image-rotate"></span></span></label>
            <div className="control-inner-content">
                <Dropdown
                    popoverProps={{resize:false,noArrow:false,flip:true,placement:'bottom-start'}}
                    renderToggle={ ( { isOpen, onToggle } ) => (
                        <div className="box-shadow-value-holder">
                            <div className="box-shadow-summ-value" onClick={ onToggle } aria-expanded={ isOpen }>
                                <div className="summ-vals">
                                    { option == 'none' &&
                                        <span className="summ-val">{__( escapeHTML( 'None' ), 'newsmatic' )}</span>
                                    }
                                    { option == 'adjust' &&
                                        <>
                                            <span className="summ-val">{`${hoffset}H`}</span><i>/</i>
                                            <span className="summ-val">{`${voffset}V`}</span><i>/</i>
                                            <span className="summ-val">{`${blur}px`}</span><i>/</i>
                                            <span className="summ-val">{`${spread}px`}</span>
                                        </>
                                    }
                                </div>
                                <span className="append-icon dashicons dashicons-ellipsis"></span>
                            </div>
                        </div>
                    )}
                    renderContent={ () => <ul className="inner-fields">
                            <li className="inner-field">
                                <SelectControl
                                    value={ option }
                                    options={ options }
                                    onChange={ ( newOption ) => setOption(newOption) }
                                />
                            </li>
                            <li className="inner-field">
                                <RangeControl
                                    label={__( escapeHTML( 'Horizontal Offset (px)' ), 'newsmatic' )}
                                    value={ hoffset }
                                    onChange={ ( newHoffset ) => setHoffset(newHoffset) }
                                    min={-100}
                                    max={100}
                                    step={1}
                                />
                            </li>
                            <li className="inner-field">
                                <RangeControl
                                    label={__( escapeHTML( 'Vertical Offset (px)' ), 'newsmatic' )}
                                    value={ voffset }
                                    onChange={ ( newVoffset ) => setVoffset(newVoffset) }
                                    min={-100}
                                    max={100}
                                    step={1}
                                />
                            </li>
                            <li className="inner-field">
                                <RangeControl
                                    label={__( escapeHTML( 'Blur (px)' ), 'newsmatic' )}
                                    value={ blur }
                                    onChange={ ( newBlur ) => setBlur(newBlur) }
                                    min={-100}
                                    max={100}
                                    step={1}
                                />
                            </li>
                            <li className="inner-field">
                                <RangeControl
                                    label={__( escapeHTML( 'Spread (px)' ), 'newsmatic' )}
                                    value={ spread }
                                    onChange={ ( newSpread ) => setSpread(newSpread) }
                                    min={-100}
                                    max={100}
                                    step={1}
                                />
                            </li>
                            <li className="inner-field">
                                <ButtonGroup className="control-inner">
                                    <Button variant={ type == 'outset' ? 'primary' : 'secondary' } onClick={() => setType('outset') }>{ __( escapeHTML( 'Outset' ), 'newsmatic' ) }</Button>
                                    <Button variant={ type == 'inset' ? 'primary' : 'secondary' } onClick={() => setType('inset') }>{ __( escapeHTML( 'Inset' ), 'newsmatic' ) }</Button>
                                </ButtonGroup>
                            </li>
                            <Tooltip effect="solid"/>
                        </ul>
                    }
                />
                { ( option == 'adjust' ) &&
                    <Dropdown
                        popoverProps={{resize:false,noArrow:false,flip:true,placement:'bottom-end'}}
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
                                </ul>
                            </div>
                            <ColorPicker
                                color={color}
                                onChange={ ( newColor ) => setColor( newColor ) }
                                enableAlpha
                            />
                            <Tooltip effect="solid"/>
                        </> }
                    />
                }
            </div>
        </>
    )
}
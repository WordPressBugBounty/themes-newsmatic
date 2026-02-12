const { ColorPicker, ColorIndicator, Dropdown, SelectControl } = wp.components;
import { __experimentalNumberControl as NumberControl } from '@wordpress/components';
const { useState, useEffect } = wp.element;
const { escapeHTML } = wp.escapeHtml;
const { __ } = wp.i18n;
const { customize } = wp;
import { Tooltip } from 'react-tooltip'
import { newsmaticCheckIfPresetColor } from './components';

export const NewsmaticBorder = ( props ) =>  {
    const [ border, setBorder ] = useState(props.value)
    const [ type, setType ] = useState(border.type)
    const [ color, setColor ] = useState(border.color)
    const [ width, setWidth ] = useState(border.width)
    
    const types = [
        { label: __( escapeHTML( "None" ), "newsmatic" ), value: 'none' },
        { label: __( escapeHTML( "Dotted" ), "newsmatic" ), value: 'dotted' },
        { label: __( escapeHTML( "Dashed" ), "newsmatic" ), value: 'dashed' },
        { label: __( escapeHTML( "Solid" ), "newsmatic" ), value: 'solid' }
    ]

    useEffect(() => {
        let newBorder = {
            type: type,
            color: color,
            width: width
        }
        setBorder(newBorder)
        customize.value( props.setting )(newBorder)
    },[type,color,width] );

    function getBackground(color) {
        if( color == null ) return
        if( color.includes('preset') ) {
            return 'var(' + color + ')'
        } else {
            return color
        }
    }

    return (
        <>
            <div className="block-header">
                <span className="customize-control-title">{ customize.settings.controls[props.setting].label }</span>
            </div>
            <div className="control-inner">
                <SelectControl
                    value={ type }
                    options={ types }
                    onChange={ ( newType ) => setType( newType ) }
                />
                { ( type != 'none' ) &&
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
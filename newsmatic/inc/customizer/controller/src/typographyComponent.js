const { Dropdown, RangeControl, Dashicon } = wp.components;
const { escapeHTML } = wp.escapeHtml;
const { __ } = wp.i18n;
const { useState, useEffect } = wp.element;
const { customize } = wp;
import Select from 'react-select'
import GoogleFonts from '../../assets/googleFonts.json'
import { Tooltip } from 'react-tooltip';

export const NewsmaticTypography = (props) => {
    const [typography, setTypography] = useState(props.value)
    const [fontFamily, setFontFamily] = useState(typography.font_family)
    const [fontFamilies, setFontFamilies] = useState([])
    const [fontWeight, setFontWeight] = useState(typography.font_weight)
    const [fontWeights, setFontWeights] = useState([])
    const [fontSize, setFontSize] = useState(typography.font_size)
    const [lineHeight, setLineHeight] = useState(typography.line_height)
    const [letterSpacing, setLetterSpacing] = useState(typography.letter_spacing)
    const [textTransform, setTextTransform] = useState(typography.text_transform)
    const [textDecoration, setTextDecoration] = useState(typography.text_decoration)
    const [ icon, setIcon ] = useState('desktop')
    
    useEffect(() => {
        const newRepeater = {
            font_family: fontFamily,
            font_weight: fontWeight,
            font_size: fontSize,
            line_height: lineHeight,
            letter_spacing: letterSpacing,
            text_transform: textTransform,
            text_decoration: textDecoration
        }
        setTypography(JSON.parse(JSON.stringify(newRepeater)))
        customize.value( props.setting )(JSON.parse(JSON.stringify(newRepeater)))
    },[fontFamily,fontWeight,fontSize,lineHeight,letterSpacing,textTransform,textDecoration])

    useEffect(() => {
        const fonts = FontFamilyArray()
        setFontFamilies(fonts)
    },[])

    useEffect(() => {
        let weights = FontWeightsArray(fontFamily)
        var data = weights.find(function(ele) {
            return ele.value === fontWeight.value;
        });

        if( ! data ) {
            setFontWeight( weights[0] )
        }
        setFontWeights( weights )
    },[fontFamily])

    const toDefault = () => {
        setFontFamily(props.value.font_family)
        setFontWeight(props.value.font_weight)
        setFontSize(props.value.font_size)
        setLineHeight(props.value.line_height)
        setLetterSpacing(props.value.letter_spacing)
        setTextTransform(props.value.text_transform)
        setTextDecoration(props.value.text_decoration)
    }

    const toDefaultFontSize = () => {
        setFontSize(props.value.font_size)
    }

    const toDefaultLineHeight = () => {
        setLineHeight(props.value.line_height)
    }

    const toDefaultLetterSpacing = () => {
        setLetterSpacing(props.value.letter_spacing)
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

    const updateFontsize = ( newFontsize ) => {
        fontSize[icon] = newFontsize
        setFontSize(JSON.parse(JSON.stringify(fontSize)))
    }

    const updateLineHeight = ( newLineheight ) => {
        lineHeight[icon] = newLineheight
        setLineHeight(JSON.parse(JSON.stringify(lineHeight)))
    }

    const updateLetterSpacing = ( newLetterspacing ) => {
        letterSpacing[icon] = newLetterspacing
        setLetterSpacing(JSON.parse(JSON.stringify(letterSpacing)))
    }

    return(
        <>
            <label className="control-title">{ customize.settings.controls[props.setting].label }<span class="reset-button components-button is-secondary is-small" onClick={() => toDefault() }><span class="dashicon dashicons dashicons-image-rotate"></span></span></label>
            <Dropdown
                contentClassName="newsmatic-typography-popover"
                popoverProps={{resize:false,noArrow:false,flip:true,placement:'bottom'}}
                renderToggle={ ( { isOpen, onToggle } ) => (
                    <div className="typo-value-holder">
                        <div className="typo-summ-value" onClick={ onToggle } aria-expanded={ isOpen }>
                            <div className="summ-vals">
                                <span className="summ-val">{fontFamily.label}</span><i>/</i>
                                <span className="summ-val">{ `${fontSize[icon]}px` }</span><i>/</i>
                                <span className="summ-val">{fontWeight.label}</span>
                            </div>
                            <span className="append-icon dashicons dashicons-ellipsis"></span>
                        </div>
                    </div>
                )}
                renderContent={ () => <ul className="typo-fields">
                        <li className="typo-field">
                            <Select
                                className="inner-field font-family"
                                inputId="newsmatic-search-in-select"
                                isSearchable ={true}
                                value={fontFamily}
                                placeholder={__( escapeHTML( 'Search . .' ), 'newsmatic' )}
                                options={fontFamilies}
                                onChange={ ( newFont ) => setFontFamily( newFont ) }
                            />
                        </li>
                        <li className="typo-field">
                            <Select
                                className="inner-field font-weight"
                                inputId="newsmatic-search-in-select"
                                isSearchable ={false}
                                value={fontWeight}
                                options={fontWeights}
                                onChange={ ( newFont ) => setFontWeight( newFont ) }
                            />
                        </li>
                        <li className="typo-field">
                            <span class="reset-button components-button is-secondary is-small" onClick={() => toDefaultFontSize() }><span class="dashicon dashicons dashicons-image-rotate"></span></span>
                            <div className="responsive-icons">
                                <Dashicon className={ `responsive-trigger ${ ( icon == 'desktop' ) && "isActive" }` } data-tip={ __( escapeHTML( 'Desktop' ), 'newsmatic' ) } icon="desktop" onClick={() => updateIcon("desktop") } />
                                <Dashicon className={ `responsive-trigger ${ ( icon == 'tablet' ) && "isActive" }` } data-tip={ __( escapeHTML( 'Tablet' ), 'newsmatic' ) } icon="tablet" onClick={() => updateIcon("tablet") } />
                                <Dashicon className={ `responsive-trigger ${ ( icon == 'smartphone' ) && "isActive" }` } data-tip={ __( escapeHTML( 'Mobile' ), 'newsmatic' ) } icon="smartphone" onClick={() => updateIcon("smartphone") } />
                            </div>
                            <RangeControl
                                label={__( escapeHTML( 'Font Size (px)' ), 'newsmatic' )}
                                value={ fontSize[icon] }
                                onChange={ ( newRange ) => updateFontsize( newRange ) }
                                min={1}
                                max={100}
                                step={1}
                            />
                        </li>
                        <li className="typo-field">
                            <span class="reset-button components-button is-secondary is-small" onClick={() => toDefaultLineHeight() }><span class="dashicon dashicons dashicons-image-rotate"></span></span>
                            <div className="responsive-icons">
                                <Dashicon className={ `responsive-trigger ${ ( icon == 'desktop' ) && "isActive" }` } data-tip={ __( escapeHTML( 'Desktop' ), 'newsmatic' ) } icon="desktop" onClick={() => updateIcon("desktop") } />
                                <Dashicon className={ `responsive-trigger ${ ( icon == 'tablet' ) && "isActive" }` } data-tip={ __( escapeHTML( 'Tablet' ), 'newsmatic' ) } icon="tablet" onClick={() => updateIcon("tablet") } />
                                <Dashicon className={ `responsive-trigger ${ ( icon == 'smartphone' ) && "isActive" }` } data-tip={ __( escapeHTML( 'Mobile' ), 'newsmatic' ) } icon="smartphone" onClick={() => updateIcon("smartphone") } />
                            </div>
                            <RangeControl
                                label={__( escapeHTML( 'Line Height (px)' ), 'newsmatic' )}
                                value={ lineHeight[icon] }
                                onChange={ ( newRange ) => updateLineHeight( newRange ) }
                                min={1}
                                max={100}
                                step={1}
                            />
                        </li>
                        <li className="typo-field">
                            <span class="reset-button components-button is-secondary is-small" onClick={() => toDefaultLetterSpacing() }><span class="dashicon dashicons dashicons-image-rotate"></span></span>
                            <div className="responsive-icons">
                                <Dashicon className={ `responsive-trigger ${ ( icon == 'desktop' ) && "isActive" }` } data-tip={ __( escapeHTML( 'Desktop' ), 'newsmatic' ) } icon="desktop" onClick={() => updateIcon("desktop") } />
                                <Dashicon className={ `responsive-trigger ${ ( icon == 'tablet' ) && "isActive" }` } data-tip={ __( escapeHTML( 'Tablet' ), 'newsmatic' ) } icon="tablet" onClick={() => updateIcon("tablet") } />
                                <Dashicon className={ `responsive-trigger ${ ( icon == 'smartphone' ) && "isActive" }` } data-tip={ __( escapeHTML( 'Mobile' ), 'newsmatic' ) } icon="smartphone" onClick={() => updateIcon("smartphone") } />
                            </div>
                            <RangeControl
                                label={__( escapeHTML( 'Letter Spacing (px)' ), 'newsmatic' )}
                                value={ letterSpacing[icon] }
                                onChange={ ( newRange ) => updateLetterSpacing( newRange ) }
                                min={0}
                                max={5}
                                step={1}
                            />
                        </li>
                        <li className="typo-field field-group">
                            <div className="inner-field text-transform">
                                <span className={ ( textTransform == 'unset' ) && 'isActive' } data-tip={ __( escapeHTML( 'Unset' ), 'newsmatic' ) } onClick={ () => setTextTransform('unset') }>N</span>
                                <span className={ ( textTransform == 'capitalize' ) && 'isActive' } data-tip={ __( escapeHTML( 'Capitalize' ), 'newsmatic' ) } onClick={ () => setTextTransform('capitalize') }>Aa</span>
                                <span className={ ( textTransform == 'uppercase' ) && 'isActive' } data-tip={ __( escapeHTML( 'Uppercase' ), 'newsmatic' ) } onClick={ () => setTextTransform('uppercase') }>AA</span>
                                <span className={ ( textTransform == 'lowercase' ) && 'isActive' } data-tip={ __( escapeHTML( 'Lowercase' ), 'newsmatic' ) } onClick={ () => setTextTransform('lowercase') }>aa</span>
                            </div>
                            <div className="inner-field text-decoration">
                                <span className={ ( textDecoration == 'none' ) && 'isActive' } data-tip={ __( escapeHTML( 'None' ), 'newsmatic' ) } onClick={ () => setTextDecoration('none') }>Aa</span>
                                <span className={ ( textDecoration == 'line-through' ) && 'isActive' } data-tip={ __( escapeHTML( 'Line Through' ), 'newsmatic' ) } onClick={ () => setTextDecoration('line-through') }><strike>Aa</strike></span>
                                <span className={ ( textDecoration == 'underline' ) && 'isActive' } data-tip={ __( escapeHTML( 'Underline' ), 'newsmatic' ) } onClick={ () => setTextDecoration('underline') }><u>Aa</u></span>
                            </div>
                        </li>
                        <Tooltip effect="solid"/>
                    </ul>
                }
            />
        </>
    )
}

const FontFamilyArray = () => {
    let families = []
    if( GoogleFonts ) {
        families = Object.keys(GoogleFonts).map( font => {
            return({ value: font, label: font })
        })
    }
   return(families)
}

const FontWeightsArray = (family) => {
    const weights = GoogleFonts[family.value].variants.normal
    let weightsOptions = []
    if( weights ) {
        let label = "Regular 400"
        weightsOptions = Object.keys(weights).map( weight => {
            if( weight == 400 ) {
                label = "Regular 400"
            } else if( weight == 100 ) {
                label = "Thin 100"
            } else if( weight == 300 ) {
                label = "Light 300"
            } else if( weight == 500 ) {
                label = "Medium 500"
            } else if( weight == 600 ) {
                label = "SemiBold 600"
            } else if( weight == 700 ) {
                label = "Bold 700"
            } else if( weight == 900 ) {
                label = "Black 900"
            } else {
                label = weight
            }
            return({ value: weight, label: label })
        })
    }
    return weightsOptions
}
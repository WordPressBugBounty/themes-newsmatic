const { customize } = wp;
const { useSelect, useDispatch } = wp.data
const { Tooltip, RadioControl } = wp.components;
const { useState, useEffect, useMemo } = wp.element;
import { store as myCustomStore } from './store';
import { NewsmaticControlHeader, newsmaticReflectResponsiveInControl, newsmaticReflectResponsiveInCustomizer, NewsmaticGetResponsiveIcons, convertNumbertoCardinalString } from './components'

export const NewsmaticResponsiveRadioImage = ( props ) => {
    const [ value, setValue ] = useState( props.value )
    const controlInstance = customize.control( props.setting ).params
    const { label, description, choices, has_callback: hasCallback, row, builder } = controlInstance
    const [ responsive, setResponsive ] = useState( 'desktop' )
    const { setHeaderFirstRowLayout, setHeaderSecondRowLayout, setHeaderThirdRowLayout, setFooterFirstRowLayout, setFooterSecondRowLayout, setFooterThirdRowLayout } = useDispatch( myCustomStore );

    /**
     * Save the control
     * 
     * @since 1.0.0
     */
    useEffect(() => {
        customize.value( props.setting )( value )
        if( hasCallback ) {
            switch( props.setting ) {
                /* Header Layouts */
                case 'header_first_row_column_layout' :
                    setHeaderFirstRowLayout( value )
                    break;
                case 'header_second_row_column_layout' :
                    setHeaderSecondRowLayout( value )
                    break;
                case 'header_third_row_column_layout' :
                    setHeaderThirdRowLayout( value )
                    break;
                /* Footer Layouts */
                case 'footer_first_row_column_layout' :
                    setFooterFirstRowLayout( value )
                    break;
                case 'footer_second_row_column_layout' :
                    setFooterSecondRowLayout( value )
                    break;
                case 'footer_third_row_column_layout' :
                    setFooterThirdRowLayout( value )
                    break;
            }
        }
    }, [ value ])

    /**
    * An array that contains the values from the column count controls
    * 
    * @since 1.0.0
    */
   const columnCounts = useSelect(( select ) => {
        return {
            /* Header Count */
            "header_0" : select( myCustomStore ).getHeaderFirstRow(),
            "header_1" : select( myCustomStore ).getHeaderSecondRow(),
            "header_2" : select( myCustomStore ).getHeaderThirdRow(),
            /* Footer Count */
            "footer_0" : select( myCustomStore ).getFooterFirstRow(),
            "footer_1" : select( myCustomStore ).getFooterSecondRow(),
            "footer_2" : select( myCustomStore ).getFooterThirdRow()
        }
    }, []);

    /**
     * Reflect the active responsive in our custom controls
     * 
     * @since 1.0.0
     */
    useEffect(() => {
        newsmaticReflectResponsiveInControl( setResponsive )
    }, [])

    /**
     * Handle responsive icons click
     * 
     * @since 1.0.0
     */
    const handleResponsiveIconsClick = ( type ) => {
        newsmaticReflectResponsiveInCustomizer( setResponsive, type )
    }

    /**
     * Filter the choices according to colum count
     * 
     * @since 1.0.0
     */
    const filteredChoices = useMemo(() => {
        if( hasCallback ) {
            let count = columnCounts[ builder + "_" + ( row - 1 ) ]
            return Object.entries( choices ).reduce(( newValue, [ layoutId, layoutValues ] ) => {
                if( "columns" in layoutValues || "devices" in layoutValues ) {
                    const { columns, devices } = layoutValues
                    if( columns.includes( count ) ) {
                        if( devices.includes( responsive ) ) {
                            newValue = { ...newValue, [ layoutId ]: layoutValues }
                        } 
                    }
                } else {
                    newValue = { ...newValue, [ layoutId ]: layoutValues }
                }
                return newValue
            }, {})
        } else {
            return choices
        }
    }, [ columnCounts, responsive ])

    /**
     * Structuring the choices because RadioControl component requires data in a certain format
     * 
     * @since 1.0.0
     */
    const structuredChoices = useMemo(() => {
        return Object.entries( filteredChoices ).map(([ layoutId, layoutValue ], index ) => {
            const { label: layoutLabel, url } = layoutValue
            return {
                label: <Tooltip placement="top" delay={200} text={ layoutLabel }>
                    <img src={ url } loading="lazy" />
                </Tooltip>,
                value: convertNumbertoCardinalString( index + 1 )
            }
        })
    }, [ filteredChoices, responsive ])

    /**
     * If selected layout is not preset set it to default
     * 
     * @since 1.0.0
     */
    useEffect(() => {
        const { desktop, tablet, smartphone } = value
        let layoutIds = Object.values( structuredChoices ).reduce(( newValue, current ) => {
            const { value: _thisValue } = current
            newValue = [ ...newValue, _thisValue ]
            return newValue
        }, [])
        if( ! layoutIds.includes( desktop ) && responsive === 'desktop' ) setValue({ ...value, desktop: 'one' })
        if( ! layoutIds.includes( tablet ) && responsive === 'tablet' ) setValue({ ...value, tablet: 'one' })
        if( ! layoutIds.includes( smartphone ) && responsive === 'smartphone' ) setValue({ ...value, smartphone: 'one' })
    }, [ columnCounts ])


    return <div className='radio-image-wrapper'>
        <NewsmaticControlHeader label={ label } description={ description }>
            <NewsmaticGetResponsiveIcons responsive={ responsive } stateToSet={ handleResponsiveIconsClick } />
        </NewsmaticControlHeader>
        <div className="control-inner">
            <RadioControl
                selected = { value[ responsive ] }
                options = { structuredChoices }
                onChange = {( newValue ) => setValue({ ...value, [responsive]: newValue })}
            />
        </div>
    </div>
}
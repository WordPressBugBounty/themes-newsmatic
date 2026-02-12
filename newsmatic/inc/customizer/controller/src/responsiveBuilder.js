const { Dropdown } = wp.components;
const { useState, useEffect, useMemo, useRef } = wp.element;
const { escapeHTML } = wp.escapeHtml;
const { __ } = wp.i18n;
const { customize } = wp;
const { useSelect, useDispatch } = wp.data
import { NewsmaticControlHeader, convertNumbertoOrdinalString, newsmaticReflectResponsiveInControl, newsmaticBackButtonClick } from './components'
import { DndContext, useSensors, MouseSensor, useSensor } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { store as myCustomStore } from './store';
import { RowSettings, Draggable, Droppable, HeaderItems, Footer } from './headerBuilder'

export const NewsmaticResponsiveBuilder = ( props ) => {
    const [ value, setValue ] = useState( props.value ),
        { label, description, widgets, responsive_canvas_id: canvasId, placement, builder_settings_section: builderSettingsSection, responsive_section: responsiveSection } = customize.settings.controls[props.setting],
        [ isBuilderHidden, setIsBuilderHidden ] = useState( false ),
        [ activeContainer, setActiveContainer ] = useState( null ),
        [ activeIndicator, setActiveIndicator ] = useState( null ),
        [ activeWidget, setActiveWidget ] = useState( null ),
        [ responsive, setResponsive ] = useState( 'tablet' ),
        elementRef = useRef( null ),
        { setResponsiveHeaderBuilderReflector } = useDispatch( myCustomStore );

    useEffect(() => {
        newsmaticReflectResponsiveInControl( setResponsive )
    }, [])

    useEffect(() => {
        const widgetsSection = Object.values( widgets ).map( widget => widget.section )
        const rowCount = [ 1, 2, 3 ]
        const rowSections = rowCount.map( row => `newsmatic_${ placement }_${ convertNumbertoOrdinalString( row ) }_row` )
        newsmaticBackButtonClick( builderSettingsSection, [ ...rowSections, ...widgetsSection ], setActiveWidget, setActiveIndicator )
    }, [])

    /* To prevent events from being swallowed */
    const sensors = useSensors(
        useSensor( MouseSensor, {
            // Require the mouse to move by 3 pixels before activating
            activationConstraint: {
                distance: 3
            }
        })
    );

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
     * An array that contains the values from the column layout controls
     * 
     * @since 1.0.0
     */
    const columnLayouts = useSelect(( select ) => {
        return {
            /* Header Layout */
            "header_0" : select( myCustomStore ).getHeaderFirstRowLayout(),
            "header_1" : select( myCustomStore ).getHeaderSecondRowLayout(),
            "header_2" : select( myCustomStore ).getHeaderThirdRowLayout(),
            /* Footer Layout */
            "footer_0" : select( myCustomStore ).getFooterFirstRowLayout(),
            "footer_1" : select( myCustomStore ).getFooterSecondRowLayout(),
            "footer_2" : select( myCustomStore ).getFooterThirdRowLayout()
        }
    }, []);

    /**
     * An array that has all the widgets that are not being used
     * 
     * @since 1.0.0
     */
    const filteredWidgets = useMemo(() => {
        let widgetsBeingUsed = Object.values( value ).reduce(( newValue, wid ) => {
            newValue = [ ...newValue, ...wid ]
            return newValue
        }, [])

        const widgetsArray = Object.entries( widgets ).filter(([ widgetId, widgetInfo ]) => ! widgetsBeingUsed.includes( widgetId ) )
        return Object.fromEntries( widgetsArray )
    }, [ value ])

    /**
     * A structured value to render out HTML div structure
     * 
     * @since 1.0.0
     */
    const structuredValue = useMemo(() => {
        return Object.entries(value).reduce(( newValue, [ containerID, containerValue ]) => {
            if( containerID !== canvasId ){
                const [ row ] = containerID; // Split the key into two parts
                if ( ! newValue[ row ] ) {
                    newValue[ row ] = {}; // Initialize the row level if it doesn't exist
                }
                newValue[ row ] = { ...newValue[ row ], [ containerID ]: containerValue }; // Assign the value to the column level
            } else {
                newValue = { [ Object.keys( newValue ).length ]: { [ canvasId ]: containerValue }, ...newValue }
            }
            return newValue;
        }, {});
    }, [ value ])

    /**
     * Save the control
     * 
     * @since 1.0.0
     */
    useEffect(() => {
        customize.value( props.setting )( value )
        setResponsiveHeaderBuilderReflector( structuredValue )
    }, [ value ])

    /**
     * Handle drag over event
     *
     * @since 1.0.0
     */
    const handleDragOver = ( event ) => {
        const { active: start, over } = event
        if( over === null || over === undefined ) return
        const { id: startId } = start
        const { id: overId } = over
        // Find the containers
        const activeContainer = findContainer( startId );
        const overContainer = findContainer( overId );

        if ( ! activeContainer || ! overContainer || activeContainer === overContainer ) return

        setValue({
            ...value,
            [ activeContainer ]: [
                ...value[ activeContainer ].filter(( item ) => item !== startId )
            ],
            [ overContainer ]: [ ...value[ overContainer ], startId ]
        });
    }

    /**
     * Handle drag end event
     *
     * @since 1.0.0
     */
    const handleDragEnd = ( event ) => {
        const { active: start, over } = event;
        if( over === null || over === undefined ) return
        const { id: startId } = start
        const { id: overId } = over

        const activeContainer = findContainer( startId );
        const overContainer = findContainer( overId );

        if ( ! activeContainer || ! overContainer || activeContainer !== overContainer ) return

        const activeIndex = value[activeContainer].indexOf( startId );
        const overIndex = value[overContainer].indexOf( overId );

        if (activeIndex !== overIndex) {
            setValue(( prevValue ) => ({
                ...prevValue,
                [overContainer]: arrayMove( prevValue[overContainer], activeIndex, overIndex )
            }));
        }
    }

    /* Find the container id from the given widget id */
    const findContainer = ( id ) => {
        if ( id in value ) return id; // if id is container id return it
      
        return Object.keys( value ).find(( key ) => value[key].includes( id ));
    }

    /**
     * Add new widget
     * 
     * @since 1.0.0
     */
    const addNewWidget = ( widgetId, onToggle ) => {
        setValue({ ...value, [ activeContainer ]: [ ...value[activeContainer], widgetId ] })
        customize.section( widgets[ widgetId ].section ).expand()
        onToggle()
        setActiveContainer( null )
    }

    /**
     * Remove selected widget
     * 
     * @since 1.0.0
     */
    const removeWidget = ( widgetId, containerId, event ) => {
        event.preventDefault()
        event.stopPropagation()
        customize.section( builderSettingsSection ).expand()
        setValue({
            ...value,
            [ containerId ]: value[ containerId ].filter( widget => widgetId !== widget )
        })
    }

    return (
        <>
            <NewsmaticControlHeader label={ label } description={ description } />
            <div className='field-main' ref={ elementRef }>
                <div className='builder-wrapper'>
                    <div className='rows-wrapper mobile-canvas--active'>
                        <DndContext
                            onDragEnd = { handleDragEnd }
                            onDragOver = { handleDragOver }
                            sensors = { sensors }
                        >   
                            { Object.values( structuredValue ).map(( row, rowIndex ) => { 
                                let rowClass = 'row'
                                rowClass += ' ' + convertNumbertoOrdinalString( rowIndex + 1 )
                                if( canvasId in row ) {
                                    rowClass += ' mobile-canvas'
                                } else {
                                    rowClass += ' layout-' + columnLayouts[ placement + "_" + rowIndex ][ responsive ]
                                    rowClass += ' column-' + columnCounts[ placement + "_" + rowIndex ]
                                }
                                const rowSettingsSection = placement + '_' + convertNumbertoOrdinalString( rowIndex + 1 ) + '_row'
                                return (
                                    <div className={ rowClass } key={ rowIndex }>
                                        <RowSettings
                                            section = { canvasId in row ? responsiveSection : rowSettingsSection }
                                            value = { value }
                                            setValue = { setValue }
                                            isActive = { activeIndicator === rowIndex }
                                            setActiveIndicator = { setActiveIndicator }
                                            activeIndicator = { rowIndex }
                                            setActiveWidget = { setActiveWidget }
                                            label = { canvasId in row ? escapeHTML( 'Mobile Canvas' ) : '' }
                                        />
                                        <div className='column-wrapper'>
                                            {
                                                Object.entries( row ).map(( [ containerId, columnWidgets ], columnIndex ) => {
                                                    if( columnIndex >= columnCounts[placement + "_" + rowIndex] ) return
                                                    const columnHasElements = columnWidgets.length
                                                    return <Dropdown
                                                        key = { columnIndex }
                                                        popoverProps = {{ resize:false, noArrow:false, flip:true, variant:"unstyled", placement:'bottom-end' }}
                                                        contentClassName = "newsmatic-header-builder-popover"
                                                        renderToggle = { ({ onToggle }) => (
                                                            <Droppable
                                                                id = { containerId }
                                                                columnHasElements = { columnHasElements }
                                                                onToggle = { onToggle }
                                                                mainClass = { 'column ' + convertNumbertoOrdinalString( parseInt( columnIndex ) + 1 ) }
                                                                items = { columnWidgets }
                                                            >
                                                                { 
                                                                    columnWidgets.map(( element, elementIndex ) => {
                                                                        return <Draggable
                                                                            key = { elementIndex }
                                                                            id = { element }
                                                                            containerId = { containerId }
                                                                            widgets = { widgets }
                                                                            removeItem = { removeWidget }
                                                                            parent = { 'builder' }
                                                                            setActiveIndicator = { setActiveIndicator }
                                                                            activeWidget = { activeWidget }
                                                                            setActiveWidget = { setActiveWidget }
                                                                        />
                                                                    })
                                                                }
                                                            </Droppable>
                                                        )}
                                                        onToggle = {() => setActiveContainer( containerId )}
                                                        renderContent={({ onToggle }) => <>
                                                            <HeaderItems
                                                                widgets = { filteredWidgets }
                                                                onToggle = { onToggle }
                                                                addItem = { addNewWidget }
                                                            />
                                                        </>}
                                                    />
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            })}
                        </DndContext> 
                    </div>
                </div>
                <Footer 
                    setIsBuilderHidden = { setIsBuilderHidden }
                    isBuilderHidden = { isBuilderHidden }
                />
            </div>
        </>
    )
}
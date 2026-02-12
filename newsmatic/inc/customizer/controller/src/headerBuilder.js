const { Dropdown, Dashicon, Button } = wp.components;
const { useState, useEffect, useMemo } = wp.element;
const { escapeHTML } = wp.escapeHtml;
const { __ } = wp.i18n;
const { customize } = wp;
const { useSelect, useDispatch } = wp.data
import { NewsmaticControlHeader, convertNumbertoOrdinalString, newsmaticBackButtonClick, newsmaticReflectResponsiveInControl } from './components'
import { DndContext, useDroppable, useSensors, MouseSensor, useSensor } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, rectSwappingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { store as myCustomStore } from './store';

export const NewsmaticHeaderBuilder = ( props ) => {
    const [ value, setValue ] = useState( props.value ),
        [ activeContainer, setActiveContainer ] = useState( null ),
        { label, description, widgets, placement, builder_settings_section: builderSettingsSection, default: defaultValue } = customize.settings.controls[props.setting],
        [ isBuilderHidden, setIsBuilderHidden ] = useState(  ),
        [ activeWidget, setActiveWidget ] = useState( null ),
        [ activeIndicator, setActiveIndicator ] = useState( null ),
        [ responsive, setResponsive ] = useState( 'desktop' ),
        { setHeaderBuilderReflector, setFooterBuilderReflector } = useDispatch( myCustomStore );

    useEffect(() => {
        newsmaticReflectResponsiveInControl( setResponsive )
    }, [])

    useEffect(() => {
        const widgetsSection = Object.values( widgets ).map( widget => widget.section )
        const rowCount = [ 1, 2, 3 ]
        const rowSections = rowCount.map( row => `newsmatic_${ placement }_${ convertNumbertoOrdinalString( row ) }_row` )
        newsmaticBackButtonClick( builderSettingsSection, [ ...rowSections, ...widgetsSection ], setActiveWidget, setActiveIndicator )
    }, [])

    /* A structured value to render out HTML div structure */
    const structuredValue = useMemo(() => {
        return Object.entries(value).reduce(( newValue, [ containerID, containerValue ]) => {
            const [ row ] = containerID; // Split the key into two parts
            if ( ! newValue[ row ] ) {
                newValue[ row ] = {}; // Initialize the row level if it doesn't exist
            }
            newValue[ row ] = { ...newValue[ row ], [ containerID ]: containerValue }; // Assign the value to the column level
            return newValue;
        }, {});
    }, [ value ])

    /* An array that contains the values from the column count controls */
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

    /* An array that contains the values from the column layout controls */
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

    /* Save the changes */
    useEffect(() => {
        customize.value( props.setting )( value )
        switch( placement ) {
            /* Header Count */
            case 'header' :
                setHeaderBuilderReflector( structuredValue )
                break;
            case 'footer' :
                setFooterBuilderReflector( structuredValue )
                break;
        }
    }, [ value ])

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
     * An array that has all the widgets that are currently being used
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

    /* Add Item to setValue() */
    const addItem = ( widgetId, onToggle ) => {
        setValue({ ...value, [ activeContainer ]: [ ...value[activeContainer], widgetId ] })
        customize.section( widgets[ widgetId ].section ).expand()
        onToggle()
        setActiveIndicator( null )
        setActiveWidget( widgetId )
    }

    /* Remove Item from value state and return an array*/
    const removeItem = ( widget, containerId ) => {
        let columnElements = value[containerId].filter( _thisWidget => widget !== _thisWidget )
        return {
            ...value,
            [containerId] : columnElements
        }
    }

    /* Retrieve the value from removeItem() and set that value into setValue() */
    const removeItemAndUpdate = ( widget, containerId, event ) => {
        event.preventDefault()
        event.stopPropagation()
        customize.section( builderSettingsSection ).expand()
        setValue( removeItem( widget, containerId ) )
    }

    /* Handle drag */
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

    /* Handle Drag Over */
    const handleDragOver = ( event ) => {
        const { active: start, over, draggingRect } = event
        if( over === null || over === undefined ) return
        const { id: startId } = start
        const { id: overId } = over
        // Find the containers
        const activeContainer = findContainer( startId );
        const overContainer = findContainer( overId );

        if ( !activeContainer || ! overContainer || activeContainer === overContainer ) return

        setValue((prev) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];

            // Find the indexes for the items
            const activeIndex = activeItems.indexOf( startId );
            const overIndex = overItems.indexOf( overId );

            let newIndex;
            if ( overId in prev ) {
                // We're at the root droppable of a container
                newIndex = overItems.length + 1;
            } else {
                const isBelowLastItem =
                over &&
                overIndex === overItems.length - 1 &&
                draggingRect?.offsetTop > over.rect.offsetTop + over.rect.height;

                const modifier = isBelowLastItem ? 1 : 0;

                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return {
                ...prev,
                [activeContainer]: [
                ...prev[activeContainer].filter(( item ) => item !== startId )
                ],
                [overContainer]: [
                ...prev[overContainer].slice(0, newIndex),
                value[activeContainer][activeIndex],
                ...prev[overContainer].slice(newIndex, prev[overContainer].length)
                ]
            };
        });
    }

    // Handle Reset Button
    const handleResetButton = () => {
        setValue( defaultValue )
    }
    
    // Handle Clean Button
    const handleClearButton = () => {
        let newValue = Object.keys( value ).reduce(( _thisVal, _this ) => {
            _thisVal = { ..._thisVal, [ _this ] : [] }
            return _thisVal;
        }, {})
        setValue( newValue )
    }

    return (
        <>
            <NewsmaticControlHeader label={ label } description={ description } />
            <div className='field-main'>
                <div className='builder-wrapper'>
                    <div className='rows-wrapper'> 
                        <DndContext
                            onDragEnd = { handleDragEnd }
                            onDragOver = { handleDragOver }
                            sensors = { sensors }
                        >   
                            { Object.values( structuredValue ).map(( row, rowIndex ) => {
                                let rowClass = 'row'
                                rowClass += ' ' + convertNumbertoOrdinalString( rowIndex + 1 )
                                rowClass += ' layout-' + columnLayouts[placement + "_" + rowIndex][ responsive ]
                                rowClass += ' column-' + columnCounts[placement + "_" + rowIndex]
                                return (
                                    <div className={ rowClass } key={ rowIndex }>
                                        <RowSettings
                                            section = { placement + '_' + convertNumbertoOrdinalString( rowIndex + 1 ) + '_row' }
                                            value = { value }
                                            setValue = { setValue }
                                            isActive = { activeIndicator === rowIndex }
                                            setActiveIndicator = { setActiveIndicator }
                                            activeIndicator = { rowIndex }
                                            setActiveWidget = { setActiveWidget }
                                        />
                                        <div className='column-wrapper'>
                                            {
                                                Object.entries( row ).map(( [ containerId, columnWidgets ], columnIndex ) => {
                                                    let columnCount = ( columnIndex + 1 )
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
                                                                mainClass = { 'column ' + convertNumbertoOrdinalString( columnCount ) }
                                                                items = { columnWidgets }
                                                            >
                                                                { 
                                                                    columnWidgets.map(( element, elementIndex ) => {
                                                                        return <Draggable
                                                                            key = { elementIndex }
                                                                            id = { element }
                                                                            containerId = { containerId }
                                                                            widgets = { widgets }
                                                                            removeItem = { removeItemAndUpdate }
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
                                                                addItem = { addItem }
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
                    handleResetButton = { handleResetButton }
                    handleClearButton = { handleClearButton }
                />
            </div>
        </>
    )
}

/**
 * Draggable Component
 * Render Column Elements HTML
 * 
 * @since 1.0.0
 */
export const Draggable = ( props ) => {
    const { widgets, id: ID, containerId, activeWidget } = props
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: ID,
    })
    const label = widgets[ID]?.label
    const section = widgets[ID]?.section
    
    const style = {
        transform: CSS.Transform.toString( transform ),
        transition
    };

    /**
     * Handle click
     * 
     * @since 1.0.0
     */
    const handleClick = ( event, section ) => {
        event.preventDefault()
        event.stopPropagation()
        props.setActiveIndicator( null )
        props.setActiveWidget( ID )
        customize.section( section ).expand()
    }

    return <div className={ 'column-item' + ( activeWidget === ID ? ' is-active' : '' ) } ref={ setNodeRef } style={ style } { ...listeners } { ...attributes } onClick={( event ) => handleClick( event, section )}>
        <span className='item-label'>{ label }</span>
        <Dashicon className='item-label' icon='no-alt' onClick={( event ) => props.removeItem( ID, containerId, event )} />
    </div>
}
Draggable.defaultProps = {
    removeItem: function(){},
    containerId : ''
}

/**
 * Droppable Component
 * 
 * @since 1.0.0
 */
export const Droppable = ( props ) => {
    const { columnHasElements, mainClass, items } = props
    const { setNodeRef } = useDroppable({
        id: props.id
    })

    return (
        <SortableContext
            items = { items === undefined ? [] : items }
            id = { props.id }
            strategy = { rectSwappingStrategy }
        >
            <div className={ mainClass + ( columnHasElements ? ' has-children' : ' no-children' ) } ref={ setNodeRef } onClick={() => props.onToggle()}>
                { props.children }
            </div>
        </SortableContext>
    );
}

/**
 * Render Popup HTML
 * 
 * @since 1.0.0
 */
export const HeaderItems = ( props ) => {
    const { widgets } = props
    let elementClass = 'header-elements-wrapper'
    if( Object.entries( widgets ).length <= 0 ) elementClass += ' no-elements'

    return(
        <div className={ elementClass }>
            { Object.entries( widgets ).length > 0 ? Object.entries( widgets ).map(([ widgetId, widgetValues ])=> {
                const { label, icon, section } = widgetValues
                return <div className="element" onClick={() => props.addItem( widgetId, props.onToggle )}>
                    <Dashicon className={ 'item-icon' } icon={ icon } />
                    <span className='item-label'>{ label }</span>
                </div>
            } ) : <span>{ 'No Elements Available' }</span> }
        </div>
    )
}

/**
 * Row settings
 * 
 * @since 1.0.0
 */
export const RowSettings = ( props ) => {
    const { section, label, isActive, activeIndicator } = props
    let _thisClass = 'row-settings'
    if( isActive ) _thisClass += ' is-active'

    const handleOnClick = () => {
        customize.section( `newsmatic_${ section }` ).expand()
        props.setActiveIndicator( activeIndicator )
        props.setActiveWidget( null )
    }

    return <div className={ _thisClass } onClick={ handleOnClick }>
        <Dashicon icon="admin-generic"/>
        { ( label !== '' ) && <span>{ __( escapeHTML( label ), 'newsmatic' ) }</span> }
    </div>
}
RowSettings.defaultProps = {
    label: ''
}

/**
 * Builder footer
 * 
 * @since 1.0.0
 */
export const Footer = ( props ) =>  {
    const { isBuilderHidden, handleResetButton, handleClearButton } = props

    /* Toggle the builder */
    const toggleBuilder = () => {
        const mainContainer = document.getElementById('customize-controls')
        if( mainContainer.classList.contains( 'newsmatic-builder-collapsed' ) ) {
            mainContainer.classList.remove( 'newsmatic-builder-collapsed' )
            props.setIsBuilderHidden( false )
        } else {
            mainContainer.classList.add( 'newsmatic-builder-collapsed' )
            props.setIsBuilderHidden( true )
        }
    }

    return (
        <div className='builder-footer-wrapper'>
            <div className='upgrade-notice-wrapper'>
                <span className='upgrade-notice'>{ 'Having troubling working with builder ?' }</span>
                <Button
                    className = "builder-button notice-button"
                    variant = 'primary'
                    href = 'https://blazethemes.com/support/'
                    target = 'blank'
                >
                    { __( 'Get Support', 'newsmatic' ) }
                </Button>
                <Button
                    className = "builder-button reset-button"
                    variant = 'primary'
                    onClick = { handleResetButton }
                >
                    { __( 'Reset to Default', 'newsmatic' ) }
                </Button>
                <Button
                    className = "builder-button clear-button"
                    variant = 'primary'
                    onClick = { handleClearButton }
                >
                    { __( 'Clear All Widgets', 'newsmatic' ) }
                </Button>
            </div>
            <div className='show-hide-wrapper'>
                <Dashicon icon={ "arrow-" + ( ! isBuilderHidden ? 'down' : 'up' ) + "-alt2" } className="builder-visibility" onClick={ toggleBuilder } >
                    { 'Hide / Show' }
                </Dashicon>
            </div>
        </div>
    )
}
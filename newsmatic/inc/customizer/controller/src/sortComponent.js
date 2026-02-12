const { useState, useEffect } = wp.element;
const { escapeHTML } = wp.escapeHtml;
const { customize } = wp;
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import {arrayMoveImmutable} from 'array-move';

export const NewsmaticItemSort = ( props ) => {
    const [ items, setItems ] = useState(props.value)
    const [ setting, setSetting ] = useState(props.setting)
    const [ fields, setFields ] = useState(customize.control( props.setting ).params.fields)
    
    useEffect(() => {
        customize.value( props.setting )(items)
    }, [items]);

    const onSortEnd = (e) => {
        var newItems = arrayMoveImmutable(items, e.oldIndex, e.newIndex )
        setItems(newItems)
    }

    function updateItemVisibility(itemKey) {
        let newItems = JSON.parse(JSON.stringify(items))
        newItems[itemKey]['option'] = newItems[itemKey]['option'] ? false : true
        setItems(JSON.parse(JSON.stringify(newItems)))
    }

    return(
        <>
            <span class="customize-control-title">{ customize.settings.controls[props.setting].label }</span>
            <span className="customize-control-description">{ customize.settings.controls[props.setting].description }</span>
            <div className="items-wrap">
                <SortableList items={items} fields={fields} setting={setting} onSortEnd={onSortEnd} hideSortableGhost={false} updateItemVisibility={updateItemVisibility}/>
            </div>
        </>
    )
}

const sortList = ({items, fields, setting, updateItemVisibility}) => {
    return (
       <div className="sort-list">
            {items.map((key,i)=>{
                return <SortableItem
                        item={key}
                        index={i}
                        disabled={!key.option}
                        setting={setting}
                        itemKey={i}
                        updateItemVisibility={updateItemVisibility}
                        fields={fields}
                />})
            }
        </div>
    );
};

const sortItem = ({item, itemKey, fields, setting, updateItemVisibility}) => {
    return(
        <div className={`sort-item ${item.value} ${item.option ? 'visible': 'invisible'}`}>
            <span className="sort-title">{ escapeHTML( fields[item.value].label ) }</span>
            { 
                ( setting == 'banner_section_order' ) ? <span className={`trigger-icon dashicons dashicons-menu`}></span>: <span className={`trigger-icon dashicons dashicons-${item.option ? 'visibility': 'hidden'}`} onClick ={ () => updateItemVisibility(itemKey)}></span>
            }
        </div>
    )
}
const SortableList = SortableContainer(sortList);
const SortableItem = SortableElement(sortItem)
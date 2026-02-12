const { useState, useEffect } = wp.element;
const { customize } = wp;
const { __ } = wp.i18n;
const { escapeHTML } = wp.escapeHtml;
import AsyncSelect from 'react-select/async'
var ajaxurl = customizerControlsObject.ajaxUrl, _wpnonce = customizerControlsObject._wpnonce;

// Multiselect categories control
export const NewsmaticCategoriesMultiselect = ( props ) => {
    const [ multiselect, setMultiselect ] = useState(JSON.parse(props.value))
    const { choices } = customize.settings.controls[props.setting]

    useEffect(() => {
        customize.value( props.setting )(JSON.stringify(multiselect))
    }, [multiselect]);

    const getCategories = async (key) => {
        let categoriesArray = []
        await jQuery.ajax({
            method: 'post',
            url: ajaxurl,
            data: ({
                'action': 'newsmatic_get_multicheckbox_categories_simple_array',
                '_wpnonce': _wpnonce,
                'search': key
            }),
            success: function(response) {
                if(response.data) {
                    categoriesArray = response.data
                }
            }
        })
        return (categoriesArray)
    }

    const promiseOptions = (inputValue) => new Promise((resolve) => {
            console.log("load news with inputValue:", inputValue);
            setTimeout(() => {
                resolve(
                    getCategories(inputValue)
                );
            }, 1000);
    });

    return (
        <>
            { choices && 
                <AsyncSelect
                    cacheOptions
                    isMulti={true}
                    inputId="newsmatic-search-in-select"
                    isSearchable ={true}
                    heading={customize.settings.controls[props.setting].label}
                    placeholder={__( escapeHTML( 'Type to search . . ' ), 'newsmatic' )}
                    value={multiselect}
                    defaultOptions={choices}
                    loadOptions={promiseOptions}
                    onChange={ ( newMultiselect ) => setMultiselect( newMultiselect ) }
                />
            }
        </>
    )
}
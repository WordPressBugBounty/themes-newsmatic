const { useState, useEffect } = wp.element;
const { customize } = wp;
const { __ } = wp.i18n;
const { escapeHTML } = wp.escapeHtml;
import AsyncSelect from 'react-select/async'
var ajaxurl = customizerControlsObject.ajaxUrl, _wpnonce = customizerControlsObject._wpnonce;

// Multiselect posts control
export const NewsmaticPostsMultiselect = ( props ) => {
    const [ multiselect, setMultiselect ] = useState(JSON.parse(props.value))
    const { choices } = customize.settings.controls[props.setting]

    useEffect(() => {
        customize.value( props.setting )(JSON.stringify(multiselect))
    }, [multiselect]);

    const getPosts = async (key) => {
        let postsArray = []
        await jQuery.ajax({
            method: 'post',
            url: ajaxurl,
            data: ({
                'action': 'newsmatic_get_multicheckbox_posts_simple_array',
                '_wpnonce': _wpnonce,
                'search': key
            }),
            success: function(response) {
                if(response.data) {
                    postsArray = response.data
                }
            }
        })
        return (postsArray)
    }

    const promiseOptions = (inputValue) => new Promise((resolve) => {
            console.log("load news with inputValue:", inputValue);
            setTimeout(() => {
                resolve(
                    getPosts(inputValue)
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
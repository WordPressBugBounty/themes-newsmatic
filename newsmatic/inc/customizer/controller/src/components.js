import { useState, useEffect } from "react";
import { store as myCustomStore } from './store';

const { __ } = wp.i18n,
    { escapeHTML } = wp.escapeHtml,
    { Tooltip, Dashicon } = wp.components,
    { customize } = wp;

/**
 * Newsmatic Control Header Component
 * 
 * @since 1.4.0
 * @package Newsmatic Pro
 */
export const NewsmaticControlHeader = ({ label, description, children }) => {
    return(
        <div className='control-title'>
            { label && <span className='customize-control-title'>{ label }</span> }
            { description && <span className='customize-control-description'>{ description }</span> }
            { ( children !== undefined ) && children }
        </div>
    )
}

/**
 * convert number to ordinal string
 * 
 * @since 1.4.0
 * @return string
 */
export const convertNumbertoOrdinalString = ( number ) => {
    let string
    switch( number ) {
        case 2 : 
            string = 'second';
        break;
        case 3 : 
            string = 'third';
        break;
        case 4 : 
            string = 'fourth';
        break;
        case 5 : 
            string = 'fifth';
        break;
        case 6 : 
            string = 'sixth';
        break;
        case 7 : 
            string = 'seventh';
        break;
        case 8 : 
            string = 'eighth';
        break;
        case 9 : 
            string = 'ninth';
        break;
        case 10 : 
            string = 'tenth';
        break;
        default : 
            string = 'first';
        break;
    }
    return string;
}

/**
 * Detect Back Button click in customizer
 * 
 * @since 1.4.0
 */
export const newsmaticBackButtonClick = ( home, sections, resetWidget, resetRows ) => {
    if( sections.length > 0 ) {
        sections.map(( section ) => {
            const sectionInstance = customize.section( section )
            const sectionContainer = sectionInstance.contentContainer
            const backButton = sectionContainer[0].querySelector( '.section-meta .customize-section-back' )
            backButton.addEventListener( "click", function( event ) {
                event.preventDefault()
                event.stopPropagation()
                const sectionInstance = customize.section( home )
                const sectionContent = sectionInstance.contentContainer
                if( sectionContent[0].classList.contains( 'active-builder-setting' ) ) sectionInstance.expand()
                resetWidget( null )
                resetRows( null )
            })
        })
    }
}

/**
 * Reflect responsive change when user interact with responsive icons in customizer footer
 * 
 * @since 1.4.0
 */
export const newsmaticReflectResponsiveInControl = ( stateToSet ) => {
    const resFooter = document.getElementById( "customize-footer-actions" )
    const resFooterClass =  resFooter.getElementsByClassName( "devices-wrapper" )
    const buttons = resFooterClass[0].getElementsByTagName( "button" )
    for(  const button of buttons ) {
        button.addEventListener( "click", function() {
            const currentDevice =  button.getAttribute("data-device")
            stateToSet( currentDevice == 'mobile' ? 'smartphone': currentDevice )
        })
    }
}

/**
 * Trigger responsive buttons
 * 
 * @since 1.4.0
 */
export const newsmaticReflectResponsiveInCustomizer = ( stateToSet, responsive ) => {
    stateToSet( responsive )
    let footer = document.getElementById('customize-footer-actions')
    if( responsive == 'desktop' ) footer.getElementsByClassName('preview-desktop')[0].click()
    if( responsive == 'tablet' ) footer.getElementsByClassName('preview-tablet')[0].click()
    if( responsive == 'smartphone' ) footer.getElementsByClassName('preview-mobile')[0].click()
}

/**
 * Render responsive icons i.e deskto icon, tablet icon, mobile icon
 * 
 * @since 1.0.0
 */
export const NewsmaticGetResponsiveIcons = ({ responsive, stateToSet, children }) => {
    return <div className="responsive-icons">
        { ( children !== undefined ) && children }
        <Tooltip placement="top" delay={200} text={ __( escapeHTML( 'Desktop' ), 'newsmatic' ) }>
            <Dashicon className={ `responsive-trigger ${ ( responsive == 'desktop' ) && "isActive" }` } icon="desktop" onClick={() => stateToSet("desktop") } />
        </Tooltip>
        <Tooltip placement="top" delay={200} text={ __( escapeHTML( 'Tablet' ), 'newsmatic' ) }>
            <Dashicon className={ `responsive-trigger ${ ( responsive == 'tablet' ) && "isActive" }` } icon="tablet" onClick={() => stateToSet("tablet") } />
        </Tooltip>
        <Tooltip placement="top" delay={200} text={ __( escapeHTML( 'Mobile' ), 'newsmatic' ) }>
            <Dashicon className={ `responsive-trigger ${ ( responsive == 'smartphone' ) && "isActive" }` } icon="smartphone" onClick={() => stateToSet("smartphone") } />
        </Tooltip>
    </div>
}

/**
 * convert number to cardinal string
 * 
 * @since 1.0.0
 * @return string
 */
export const convertNumbertoCardinalString = ( number ) => {
    let string
    switch( number ) {
        case 2 : 
            string = 'two';
        break;
        case 3 : 
            string = 'three';
        break;
        case 4 : 
            string = 'four';
        break;
        case 5 : 
            string = 'five';
        break;
        case 6 : 
            string = 'six';
        break;
        case 7 : 
            string = 'seven';
        break;
        case 8 : 
            string = 'eight';
        break;
        case 9 : 
            string = 'nine';
        break;
        case 10 : 
            string = 'ten';
        break;
        default : 
            string = 'one';
        break;
    }
    return string;
}

/**
 * Check if given color is preset color or not
 * 
 * @since 1.4.0
 */
export const newsmaticCheckIfPresetColor = ( color ) => {
    if( ( color == null ) || ( typeof color === 'object' ) ) return
    return color.includes( 'preset' )
}
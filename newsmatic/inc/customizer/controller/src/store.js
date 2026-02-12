import { createReduxStore, register } from '@wordpress/data';

const DEFAULT_VALUE = {
    /* Header Rows */
    headerFirstRow: 2,
    headerSecondRow: 3,
    headerThirdRow: 3,
    /* Footer Rows */
    footerFirstRow: 2,
    footerSecondRow: 2,
    footerThirdRow: 2,
    /* Header layouts */
    headerFirstRowLayout: { desktop: 'one', tablet: 'one', smartphone: 'one' },
    headerSecondRowLayout: { desktop: 'one', tablet: 'one', smartphone: 'one' },
    headerThirdRowLayout: { desktop: 'one', tablet: 'one', smartphone: 'one' },
    /* Footer layouts */
    footerFirstRowLayout: { desktop: 'one', tablet: 'one', smartphone: 'one' },
    footerSecondRowLayout: { desktop: 'one', tablet: 'one', smartphone: 'one' },
    footerThirdRowLayout: { desktop: 'one', tablet: 'one', smartphone: 'one' },
    /* Header Builder reflector */
    headerBuilderReflector: [],
    /* Footer Builder reflector */
    footerBuilderReflector: [],
    /* Responsive Header Builder reflector */
    responsiveHeaderBuilderReflector: {},
    themeColor: '#EC6A2A', 
    gradientThemeColor: 'linear-gradient(135deg,#942cddcc 0,#38a3e2cc 100%)',
    solidColorPreset: [ '#40E0D0', '#F4C430', '#FF00FF', '#007BA7', '#DC143C', '#7FFF00' ],
    gradientColorPreset: [ 'linear-gradient(135deg, #000000, #FFFF00)', 'linear-gradient(135deg, #191970, #FFD700)', 'linear-gradient(135deg, #4B0082, #FFA500)', 'linear-gradient(135deg, #FF8C00, #483D8B)', 'linear-gradient(135deg, #006400, #8B4513)', 'linear-gradient(135deg, #DC143C, #FFD700)' ],
    /* Typography Preset */
    typographyPreset: {}
}

const actions = {
    /* Header Rows */
    setHeaderFirstRow( headerFirstRow ) {
        return {
            type: 'SET_HEADER_FIRST_ROW',
            headerFirstRow
        };
    },
    setHeaderSecondRow( headerSecondRow ) {
        return {
            type: 'SET_HEADER_SECOND_ROW',
            headerSecondRow
        };
    },
    setHeaderThirdRow( headerThirdRow ) {
        return {
            type: 'SET_HEADER_THIRD_ROW',
            headerThirdRow
        };
    },
    /* Header layouts */
    setHeaderFirstRowLayout( headerFirstRowLayout ) {
        return {
            type: 'SET_HEADER_FIRST_ROW_LAYOUT',
            headerFirstRowLayout
        };
    },
    setHeaderSecondRowLayout( headerSecondRowLayout ) {
        return {
            type: 'SET_HEADER_SECOND_ROW_LAYOUT',
            headerSecondRowLayout
        };
    },
    setHeaderThirdRowLayout( headerThirdRowLayout ) {
        return {
            type: 'SET_HEADER_THIRD_ROW_LAYOUT',
            headerThirdRowLayout
        };
    },
    /* Footer Rows */
    setFooterFirstRow( footerFirstRow ) {
        return {
            type: 'SET_FOOTER_FIRST_ROW',
            footerFirstRow
        };
    },
    setFooterSecondRow( footerSecondRow ) {
        return {
            type: 'SET_FOOTER_SECOND_ROW',
            footerSecondRow
        };
    },
    setFooterThirdRow( footerThirdRow ) {
        return {
            type: 'SET_FOOTER_THIRD_ROW',
            footerThirdRow
        };
    },
    /* Footer layouts */
    setFooterFirstRowLayout( footerFirstRowLayout ) {
        return {
            type: 'SET_FOOTER_FIRST_ROW_LAYOUT',
            footerFirstRowLayout
        };
    },
    setFooterSecondRowLayout( footerSecondRowLayout ) {
        return {
            type: 'SET_FOOTER_SECOND_ROW_LAYOUT',
            footerSecondRowLayout
        };
    },
    setFooterThirdRowLayout( footerThirdRowLayout ) {
        return {
            type: 'SET_FOOTER_THIRD_ROW_LAYOUT',
            footerThirdRowLayout
        };
    },
    /* Header Builder Reflector */
    setHeaderBuilderReflector( headerBuilderReflector ) {
        return {
            type: 'SET_HEADER_BUILDER_REFLECTOR',
            headerBuilderReflector
        };
    },
    /* Footer Builder Reflector */
    setFooterBuilderReflector( footerBuilderReflector ) {
        return {
            type: 'SET_FOOTER_BUILDER_REFLECTOR',
            footerBuilderReflector
        };
    },
    /* Responsive Header Builder Reflector */
    setResponsiveHeaderBuilderReflector( responsiveHeaderBuilderReflector ) {
        return {
            type: 'SET_RESPONSIVE_HEADER_BUILDER_REFLECTOR',
            responsiveHeaderBuilderReflector
        };
    },
    /* =========================== */
    setThemeColor( themeColor ) {
        return {
            type: 'SET_THEME_COLOR',
            themeColor
        };
    },
    setGradientThemeColor( gradientThemeColor ) {
        return {
            type: 'SET_GRADIENT_THEME_COLOR',
            gradientThemeColor
        };
    },
    setSolidColorPreset( solidColorPreset ) {
        return {
            type: 'SET_SOLID_COLOR_PRESET',
            solidColorPreset
        };
    },
    setGradientColorPreset( gradientColorPreset ) {
        return {
            type: 'SET_GRADIENT_COLOR_PRESET',
            gradientColorPreset
        };
    },
    setTypographyPreset( typographyPreset ) {
        return {
            type: 'SET_TYPOGRAPHY_PRESET',
            typographyPreset
        };
    }
};

export const store = createReduxStore( 'demo', {
    reducer: ( state = DEFAULT_VALUE, action ) => {
        switch( action.type ) {
            /* Header Rows */
            case 'SET_HEADER_FIRST_ROW' :
                return {
                    ...state,
                    headerFirstRow: action.headerFirstRow
                }
            case 'SET_HEADER_SECOND_ROW' :
                return {
                    ...state,
                    headerSecondRow: action.headerSecondRow
                }
            case 'SET_HEADER_THIRD_ROW' :
                return {
                    ...state,
                    headerThirdRow: action.headerThirdRow
                }
            /* Header Layouts */
            case 'SET_HEADER_FIRST_ROW_LAYOUT' :
                return {
                    ...state,
                    headerFirstRowLayout: action.headerFirstRowLayout
                }
            case 'SET_HEADER_SECOND_ROW_LAYOUT' :
                return {
                    ...state,
                    headerSecondRowLayout: action.headerSecondRowLayout
                }
            case 'SET_HEADER_THIRD_ROW_LAYOUT' :
                return {
                    ...state,
                    headerThirdRowLayout: action.headerThirdRowLayout
                }
            /* Footer Rows */
            case 'SET_FOOTER_FIRST_ROW' :
                return {
                    ...state,
                    footerFirstRow: action.footerFirstRow
                }
            case 'SET_FOOTER_SECOND_ROW' :
                return {
                    ...state,
                    footerSecondRow: action.footerSecondRow
                }
            case 'SET_FOOTER_THIRD_ROW' :
                return {
                    ...state,
                    footerThirdRow: action.footerThirdRow
                }
            /* Footer Layouts */
            case 'SET_FOOTER_FIRST_ROW_LAYOUT' :
                return {
                    ...state,
                    footerFirstRowLayout: action.footerFirstRowLayout
                }
            case 'SET_FOOTER_SECOND_ROW_LAYOUT' :
                return {
                    ...state,
                    footerSecondRowLayout: action.footerSecondRowLayout
                }
            case 'SET_FOOTER_THIRD_ROW_LAYOUT' :
                return {
                    ...state,
                    footerThirdRowLayout: action.footerThirdRowLayout
                }
            /* Header builder reflector */
            case 'SET_HEADER_BUILDER_REFLECTOR' :
                return {
                    ...state,
                    headerBuilderReflector: action.headerBuilderReflector
                }
            /* Footer builder reflector */
            case 'SET_FOOTER_BUILDER_REFLECTOR' :
                return {
                    ...state,
                    footerBuilderReflector: action.footerBuilderReflector
                }
            /* Footer builder reflector */
            case 'SET_RESPONSIVE_HEADER_BUILDER_REFLECTOR' :
                return {
                    ...state,
                    responsiveHeaderBuilderReflector: action.responsiveHeaderBuilderReflector
                }
            /* ============================*/
            case 'SET_THEME_COLOR' :
                return {
                    ...state,
                    themeColor: action.themeColor
                }
            case 'SET_GRADIENT_THEME_COLOR' :
                return {
                    ...state,
                    gradientThemeColor: action.gradientThemeColor
                }
            case 'SET_SOLID_COLOR_PRESET' :
                return {
                    ...state,
                    solidColorPreset: action.solidColorPreset
                }
            case 'SET_GRADIENT_COLOR_PRESET' :
                return {
                    ...state,
                    gradientColorPreset: action.gradientColorPreset
                }
            case 'SET_TYPOGRAPHY_PRESET' :
                return {
                    ...state,
                    typographyPreset: action.typographyPreset
                }
        }
        return state
    },
    actions,
    selectors: {
        /* Header count */
        getHeaderFirstRow: ( state ) => state.headerFirstRow,
        getHeaderSecondRow: ( state ) => state.headerSecondRow,
        getHeaderThirdRow: ( state ) => state.headerThirdRow,
        /* Header Layouts */
        getHeaderFirstRowLayout: ( state ) => state.headerFirstRowLayout,
        getHeaderSecondRowLayout: ( state ) => state.headerSecondRowLayout,
        getHeaderThirdRowLayout: ( state ) => state.headerThirdRowLayout,
        /* Footer count */
        getFooterFirstRow: ( state ) => state.footerFirstRow,
        getFooterSecondRow: ( state ) => state.footerSecondRow,
        getFooterThirdRow: ( state ) => state.footerThirdRow,
        /* Footer Layouts */
        getFooterFirstRowLayout: ( state ) => state.footerFirstRowLayout,
        getFooterSecondRowLayout: ( state ) => state.footerSecondRowLayout,
        getFooterThirdRowLayout: ( state ) => state.footerThirdRowLayout,
        /* Header Builder Reflector */
        getHeaderBuilderReflector: ( state ) => state.headerBuilderReflector,
        /* Footer Builder Reflector */
        getFooterBuilderReflector: ( state ) => state.footerBuilderReflector,
        /* Responsive Header Builder Reflector */
        getResponsiveHeaderBuilderReflector: ( state ) => state.responsiveHeaderBuilderReflector,
        /* ============= */
        getThemeColor: ( state ) => state.themeColor,
        getGradientThemeColor: ( state ) => state.gradientThemeColor,
        getSolidColorPreset: ( state ) => state.solidColorPreset,
        getGradientColorPreset: ( state ) => state.gradientColorPreset,
        /* Typography Preset */
        getTypographyPreset: ( state ) => state.typographyPreset
    }
} );
register( store );
import * as React from 'react';
import { themeContext } from '../context/ThemeContext';
import { ClickHandler } from './App';
import { useContext } from 'react';
/** A react element serving as the backdrop of some other component
 * 
 */

     export type BackgroundProp = {

        backgroundColor? : string,

        /**
         * A content describing the react components to be rendered inside of the background-component, should return a 
         * {@link React.ReactNode}
         * 
         */
        children? : (React.ReactNode),

        cssClassName : string,

        clickHandler? : ClickHandler




    }


export function Background({cssClassName,backgroundColor, children=null, clickHandler}:BackgroundProp){
    
    const appThemeContext = useContext(themeContext);
        let backgroundColorIn = (backgroundColor) ? backgroundColor : appThemeContext.primaryBackgroundColor; 
    return(<div className={cssClassName} style={ 
            {backgroundColor : backgroundColorIn,
              
            }

    }>
        {children}
    </div>);

}
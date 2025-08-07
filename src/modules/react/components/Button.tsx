import { useContext } from "react";
import { themeContext } from "../context/ThemeContext";
import React from "react";

export type ButtonProps = {
            /**
             * The callback function to run when the button is clicked
             * @property {ButtonProps}
             */
            onClick :  React.MouseEventHandler<HTMLButtonElement> 
            
         
            
            /**
             * The content  of the button
             * @property {ButtonProps}
             */
            children? : React.ReactNode,
            
            /**
             * Whether the button can currently be pressed by the user or not.
             * @property {ButtonProps}
             */
            isDisabled : boolean,
            /**An object containing the styling of a specific element, as given via the styling property
             *    @example
             *    Implicit value :      {       //Gives color to button
             *                                  backgroundColor : appThemeContext.secondaryContentColor, 
             *                                  //Gives color to button contents, usually text
             *                                  color : appThemeContext.secondaryBackgroundColor
             *                          }
             *                      
             *                      
             *                      
             *                      
             * 
             * @see | {@linkcode React.HTMLAttributes<T>.style}| {@linkcode React.CSSProperties<T>}|
             */
            style? : React.CSSProperties,
            cssClassName : string

};
export function Button({ onClick, children, isDisabled, style }: ButtonProps){
        
        const appThemeContext = useContext(themeContext);

        style = (style != null) ? style : {backgroundColor : appThemeContext.secondaryContentColor, 
                                   color : appThemeContext.secondaryBackgroundColor
                
        };


        return(<>
        <button style={style} onClick={(e)=>onClick(e)} disabled = {isDisabled}>{children}</button>
        </>);
}
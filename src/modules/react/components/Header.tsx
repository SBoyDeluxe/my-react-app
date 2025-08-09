import { useContext } from "react";
import { ApplicationConfiguration } from "../application_config"
import { Background } from "./background"
import { themeContext } from "../context/ThemeContext";



     export type HeaderProps = {
        
        children? : (React.ReactNode),
        /**
         * The title of the header - textstring to be displayed 
         * 
         *  - standard : {@link ApplicationConfiguration.title}
         */ 
        title? : string,
        /**
         * The css class name of the header
         * 
         *  -standard : page-header
         */
        cssClassName? : string,
        /**
         * The css class name of the title component
         * 
         *      -standard : page-title
         */
        titleClassName? : string





    }

/**
 * The basic header of the page, containing the title of the application unless specified, any alternate content will be added after 
 * the titile, going from left to right and up to down
 * 
 * @param 
 * @returns 
 */
export function Header({titleClassName="page-title" ,cssClassName="page-header" , children, title=ApplicationConfiguration.title}:HeaderProps){

const appThemeContext = useContext(themeContext);
return (
<>
<Background cssClassName={cssClassName} backgroundColor={appThemeContext.primaryContentColor} >

    <p style={{
        backgroundColor:appThemeContext.secondaryContrastColor,
    }} className={titleClassName}>{title}</p>
        {children}
        

</Background>
       
</>)
}
import { useContext } from "react";
import { ApplicationConfiguration } from "../application_config"
import { Background } from "./background"
import { themeContext } from "../context/ThemeContext";



     export type HeaderProps = {
        
        renderContent? : ()=>React.ReactNode,
        






    }

/**
 * The basic header of the page, always containing the title of the page, any alternate content will be added after 
 * the titile, going from left to right and up to down
 * 
 * @param 
 * @returns 
 */
export function Header({ renderContent}:HeaderProps){
const title = ApplicationConfiguration.title;
const appThemeContext = useContext(themeContext);
return (
<>
<Background cssClassName="page-header" backgroundColor={appThemeContext.primaryContentColor} >

    <p style={{
        backgroundColor:appThemeContext.secondaryContrastColor,
    }} className="page-title">{title}</p>
        {renderContent}
        

</Background>
       
</>)
}
import {ReactNode, useContext} from "react"
import { Background } from "./background"
import { themeContext } from "../store/ThemeStore";
import { randomUUID } from "crypto";


export type FooterProps = {

    content? :React.ReactNode,

}

export function Footer({content}:FooterProps):ReactNode{
   const appThemeContext = useContext(themeContext);

    return(
        <>
            <Background key={()=>randomUUID} cssClassName="page-footer" >
                                {content}
            </Background>
        </>

    )

}
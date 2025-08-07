import {ReactNode, useContext} from "react"
import { Background } from "./background"
import { themeContext } from "../context/ThemeContext"


export type FooterProps = {

    content? :React.ReactNode,

}

export function Footer({content}:FooterProps):ReactNode{
   const appThemeContext = useContext(themeContext);

    return(
        <>
            <Background cssClassName="page-footer" >
                                {content}
            </Background>
        </>

    )

}
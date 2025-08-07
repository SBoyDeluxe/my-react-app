import { CSSProperties, useContext, MouseEventHandler } from "react"
import { Button } from "./Button"
import { themeContext } from "../context/ThemeContext"
import { ClickHandler, State } from "./App"
import React from "react"

export type ToggleButtonProp = {
    onClick : ClickHandler,
    children?: React.ReactNode,
    cssClassName: string
    style : CSSProperties,
    isDisabled : boolean
}

export function ToggleButton({ cssClassName, style ,children, onClick, isDisabled }: ToggleButtonProp) {
    const appThemeContext = useContext(themeContext);




    return (

        <>
        <Button cssClassName={cssClassName} isDisabled = {isDisabled} onClick={(event: React.MouseEvent<Element, MouseEvent>)=>onClick.onClick(event)} children = {children} style={style} ></Button>
        </>
    )


}
import { CSSProperties, useContext } from "react"
import { themeContext } from "../context/ThemeContext"
import React from "react"

export type FormProps = {
    onSubmit?: React.FormEventHandler<HTMLFormElement>,
    children?: React.ReactNode,
    fieldSetOptions?: FieldSetOptions,
    cssClassName: string,
    style?: CSSProperties


}

export type FieldSetOptions = {

    children: React.ReactNode,
    backgroundColor?: string,
    textColor?: string

}
export function Form({ cssClassName, onSubmit, children = null, fieldSetOptions = null }: FormProps) {

    let appThemeContext = useContext(themeContext);
    switch ((fieldSetOptions !== (null))) {

        case true: {
            return (<>   <form className={cssClassName} >
                <fieldset>
                    <legend>    {fieldSetOptions.children} </legend>

                    {children}


                </fieldset>
            </form>
            </>
            )

        }
            break;
        case false: {
            return (<>                                       <form>
                {children}
            </form>
            </>)
        }
    }



}
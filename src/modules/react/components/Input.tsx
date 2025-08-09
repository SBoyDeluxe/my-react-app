import { ChangeEventHandler, CSSProperties, MouseEventHandler } from "react"
import { State } from "./App"
import React from "react"
import { ThemeValues } from "../../theme"

export type InputProps = {
    /**
     * 
     *  text: A single-line text field, which is the default input type.
     *  password: A single-line text field where the characters are masked (shown as asterisks or circles) for security.
     *  submit: A button that submits the form data to a server.
     *  checkbox: A toggle that allows users to select one or more options from a set.
     *  radio: A radio button that allows a single value to be selected out of multiple choices with the same name.
     *  file: A control that lets the user select a file from their device.
     *  hidden: A control that is not displayed but whose value is submitted to the server.
     *  image: A graphical submit button that displays an image.
     *  button: A clickable button that can be used for any purpose relevant to the solution.
     *  color: A control for specifying a color, opening a color picker when active in supporting browsers.
     *  date: A control for entering a date (year, month, and day, with no time).
     *  datetime-local: A control for entering a date and time, with no time zone.
     *  email: A field for editing an email address with validation parameters.
     *  month: A control for entering a month and year, with no time zone.
     *  number: A control for entering a number with a spinner and default validation.
     *  range: A control for entering a number where the exact value is not important, displayed as a range widget.
     *  reset: A button that resets the contents of the form to default values.
     *  search: A single-line text field for entering search strings, may include a delete icon.
     *  tel: A control for entering a telephone number, displays a telephone keypad on some devices.
     *  time: A control for entering a time value with no time zone.
     *  url: A field for entering a URL with validation parameters.
     *  week: A control for entering a date consisting of a week-year number and a week number with no time zone 
     * 
     * 
     */
    inputType: (
"text" |
"password"|
"submit"|
"checkbox"|
"radio"|
"file"|
"hidden"|
"image" |
"button"|
"color" |
"date"|
"datetime"|
"email" |
"month" |
"number"|
"range" |
"reset" |
"search"|
"tel"|
"time"|
"url"|
"week"),
onEvent? : (e :React.ChangeEvent<HTMLInputElement>)=>void,
onInput?:(event: React.FormEvent<HTMLInputElement>)=>void,
cssClassName : string,
labelName:string
inputState : string | number | readonly string[] ,
style? : CSSProperties
name : string
}
/**
 * Generates a labeled input field of the type = inputType.
 * 
 * 
 */
export function Input({inputType, onEvent, cssClassName, labelName, inputState, onInput, name}:InputProps){
    let children : React.ReactNode = (<>
    </>);
    if(onEvent && onInput){

      children =  (<>
                <label htmlFor={name} className={labelName} > <p>{labelName}</p>
                        <input value = {inputState} onInput={(e)=>onInput(e)}  type={inputType} name={name} className={cssClassName}   onChange={(e)=>onEvent(e)}>

                        </input>

                </label>
        </>)
    } 
    else if(onInput){
          children =  (<>
                <label htmlFor={name} className={labelName} > <p>{labelName}</p>
                        <input value = {inputState} onInput={(e)=>onInput(e)}  type={inputType} name={name} className={cssClassName}>

                        </input>

                </label>
        </>)

    }
    else if(onEvent){

                   children =  (<>
                <label htmlFor={name} className={labelName} > <p>{labelName}</p>
                        <input value = {inputState}   type={inputType} name={name} className={cssClassName} onChange={(e)=>onEvent(e)}>

                        </input>

                </label>
        </>)

    }
    
    return(
                children
    )


}
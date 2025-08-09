import * as React from "react"
import { State } from "./App"
import { Background } from "./background"
import { themeContext } from "../context/ThemeContext"
import { Form } from "./Form"
import { ToggleButton } from "./ToggleButton"
import { TogglePair } from "./TogglePair"
import { Input } from "./Input"
import { Button } from "./Button"


type LoginFormProp = {

    setFormState : React.Dispatch<React.SetStateAction<{
    username: string;
    password: string;
}>>, 
    formState :{
    username: string;
    password: string;
},
    toggleState : State<boolean>,
    login:(username : string, password : string)=>void,
    signUp:(username : string, password : string)=>void,
}
export function LoginForm({login,signUp,setFormState, formState,toggleState, }:LoginFormProp){

    function handleChange(e : React.ChangeEvent<HTMLInputElement>){
     
        const nameOfChangingAttribute = e.target.name;
        setFormState(()=>{
            return {...formState,
                [nameOfChangingAttribute] : e.target.value
                
            }
        });

        console.log(e);

    };

    function handleInput(event: React.FormEvent<HTMLInputElement>){
          event.stopPropagation();
          
        const nameOfChangingAttribute = event.target.name;
        setFormState(()=>{
            return {...formState,
                [nameOfChangingAttribute] : event.target.value
                
            }
        });

        console.log(event);

    }

    function handleClick( event :  React.MouseEvent<HTMLButtonElement, MouseEvent>){

        event.stopPropagation();
        event.preventDefault();

    if(formState.username && formState.password){
        toggleState.stateVariable ? login(formState.username, formState.password) : signUp(formState.username, formState.password);
}
    else{
        alert("One or more of the textfields can not be empty, please try again");
    }
    }

    const appThemeContext = React.useContext(themeContext);
    let buttonString = (toggleState.stateVariable) ? ("Login") : "Sign-up";
    let buttonCssString = (toggleState.stateVariable) ? ("login-button") : "sign-up-button";
    return(
        <Background cssClassName="login-form-container" backgroundColor={appThemeContext.secondaryBackgroundColor}>
                    <Form cssClassName="login-form" fieldSetOptions={ {children :TogglePair({toggleState})}} >
                            <Input inputState={formState.username} cssClassName="username-input" inputType="text" labelName="Username : " name="username"   onEvent={handleChange} onInput={handleInput} ></Input>
                            <Input inputState={formState.password} cssClassName="password-input" inputType="password" labelName="Password : " name="password" onEvent={handleChange} onInput={handleInput}  ></Input>

                            <Button cssClassName={buttonCssString} children={<p>{buttonString}</p>} isDisabled={false} onClick={handleClick}/>
                      
                    </Form>
        </Background>

    )

    

}
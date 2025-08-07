import { createContext } from "react";
import {  Theme, ThemeValues } from "../../theme"
import * as Colors from "colorjs.io";



    export   const themeContext : React.Context<ThemeValues> = createContext(Theme.generateTheme([new Colors.default("#a9bbbd9f")], 0, 0));
       

      

      


import Color from "colorjs.io";

/**Represents the theme-utility, holds the current selection of {@linkcode ThemeValues }
 * 
 */
export class Theme {
    static  THEME_CONSTANTS = {

        /**Constants describing color theme generation strategies
         * 
         * For use with {@linkcode Theme.generateTheme}
         * 
         */
        generationStrategies: {
            /**A generation strategy that makes a theme of different hues (The content color is a different hue of the background color), creating less contrast and strain on the eyes
             * 
             * - Can be harder to differentiate for people with low color vision
             * 
             * @constant {number}
             * @memberof generationStrategies
             */
            MONO_CHROMATIC: 0,
            /**
             * Using the analogous, that is the next color over on the color wheel, to project its content over the background. For example, green would have blue as a projected color 
             * 
             * @constant {number}
             * @memberof generationStrategies
             */
            ANALOGOUS: 1,
            /**Uses complementary, that is opposite colors, for background and content. This means a blue background would have red content coloring
             * 
             */
            COMPLEMENTARY: 2,
            /**This generation strategy yields hues that are equally spaced on the color wheel, so that the difference in hue makes for a whole "spin around on the color wheel"
             * 
             * @constant {number}
             * @memberof generationStrategies
             */
            TRIADIC: 3,
            /**Compound generates colors which, instead of using the exact opposite color, it uses hues to equal sides of the opposite for its content, introducing more variation
             * 
             * @constant {number}
             * @memberof generationStrategies
             */
            COMPOUND: 4,



        },
        /**Defines the lightness preference from the presets selecteted by the user in theme-generation
         * 
         *  
         * For use with {@linkcode Theme.generateTheme}
         */
        lightnessSetting: {
            /**Males for a theme-generation that generates colors which keep colors darker
            * 
            * @constant {number}
            * @memberof lightnessSetting
            */
            DARK: 0,
            /**Males for a theme-generation that generates colors which are "medium" in lightness
              * 
              * @constant {number}
              * @memberof lightnessSetting
              */
            MEDIUM: 1,
            /**Males for a theme-generation that generates colors which keep colors lighter
              * 
              * @constant {number}
              * @memberof lightnessSetting
              */
            LIGHT: 2,

        }
    }

    /**The values of the theme, used to store the hexadecimal values, as returned by the color wheel in string format.
     *  
     * - Can be generated with {@linkcode Theme.generateTheme}
     * 
     * @property {Theme}
     * @see | {@linkcode Theme.generateTheme Generate ThemeValues with this method} | {@linkcode ThemeValues} |
     */
    themeValues: ThemeValues;




    /**
     *  Gets the ThemeValues as Color-objects. These Color-objects can be used to manipulate and translate the values to equivalent values in other color-spaces (such as with rgba, for example).
     */
    themeColors:  Map<string, Color>;



    constructor(themeValues: ThemeValues) {

        this.themeValues = themeValues;
        this.themeColors = themeValues.getThemeValuesAsColors();
       


    }

   
    /** Generates Themevalues that can be used to create a theme
     * 
     * @param {Color[]} inColor - At most three, at least 1 
     * @param {number} generationStrategy - Describes the generation strategy for the color selection. Should be a member of THEME.THEMECONSTANTS.generationStrategies
     * @param {number} lightnessSetting - Describes the lightness preference for the color selection. Should be a member of THEME.THEMECONSTANTS.lightnessSettings. Not needed for custom theme.
     * 
     * 
     * @throws {Error} - Error on a number not included in the generation strategy constants
     * @see | {@linkcode Theme.THEME_CONSTANTS.generationStrategies Theme generation strategies provided in the Theme class| {@linkcode Theme.THEME_CONSTANTS.lightnessSetting Theme generation lightness preference presets}|
     */
    static generateTheme(inColors: Color[], generationStrategy: number, lightnessSetting: (number)): ThemeValues {
        // One color  = 120 degrees on hue, 0 -> 100 % is the value of saturation, 0 is complete grayscale (Achromatic). Percentage on lightness too, where 100 is white and 0 is black.
        // For primary, secondary and tertiary we need a palette : That is, a complete selection of colors : background, text and content. 

        /**Process of theme gen ->
         * 
         *          Palette : From one color, generate a light version, a dark version and a contrasting color. This is known as a palette. A palette makes up a color selection that fit with that main color. 
         *                    
         * 
         *            -> This pallete, in usual standard "light themes", would then use the light version as a background, the main as header and the dark as footer. The dark would then be used -on- the light one, 
         *                  the light would be used -on- the dark one (darker blue text on a blue-almost-white background) and the contrast would be used for elements needing to be clearly legible, as the title in the header.
         * 
         *             With a dark preference, we use the dark version as the background color and the lighter one for text.
         * 
         *              We can then generate a theme with one color, or up to three colors, depending on the deepness of the hierarchy of components (3 <=> Primary, secondary and tertiary main colors. Contrasting primary => Error, focused. ). 
         * 
         *              if interested :https://m2.material.io/design/color/the-color-system.html#tools-for-picking-colors
         *                             https://mui.com/material-ui/customization/palette/   
         *                             https://www.w3schools.com/colors/colors_monochromatic.asp
         *                              https://mui.com/material-ui/customization/theming/
         * 
         *              Strategy : with HSL-val of picked color ->  
         *                                                          Light version ; L-value of light version of main color =(100-LValuemain)/2* + LValuemain : Rest the same
         *                                                          Dark : Inverse of light , LVal - (*) instead 
         *                                                          Contrast : contrastH = Hvalmain + 180 
         *                              Must be adjusted with % 360, of course
         */

        // For mono-chromatic color-gen : The background of the page is usually a very light or very dark (but small value of  => light hue) hue for dark and light preset respectively.   

        //Check so that number is in range and assure that inColors is in hsl.
        inColors = inColors.map((color)=>{return color.to("hsl")});
        const numberOfConstantsGenStrat = Object.keys(Theme.THEME_CONSTANTS.generationStrategies).length;
        const numberOfConstantsLightPref = Object.keys(Theme.THEME_CONSTANTS.lightnessSetting).length;
        if ((generationStrategy >= 0 && generationStrategy < numberOfConstantsGenStrat) && (lightnessSetting >= 0 && (lightnessSetting < numberOfConstantsLightPref))) {
            //Create an array to store the colors : Main, light, dark, contrast
            let paletteArray: string[][] = new Array(inColors.length);
                        let resultThemeVals: ThemeValues = new ThemeValues("#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa",1);

            switch(generationStrategy) {

                case 0: {
                    //Monochrome generation - Same  hue, different lightness. If lightness preference is light, the lighter version for background, darker for content, else the reverse.

                    switch (lightnessSetting) {

                        case 0: {
                          resultThemeVals = makeMonoChromaticDarkThemeValues(paletteArray);


                        }
                        break;
                        case 1: {
                          resultThemeVals = makeMonochromaticMediumThemeValues(paletteArray);


                        }
                        break;

                        case 2: {
                          resultThemeVals = makeMonochromaticLightThemeValues(paletteArray);


                        }
                        break;

                    }

                }
                    break;
                //Analogous scheme generation - Here we  use colours 45 degrees in hue over
                case 1: {

                    switch (lightnessSetting) {

                        case 0: {

                            resultThemeVals = makeDarkAnalogousThemeValues(paletteArray);


                        }
                        break;
                        case 1: {
                            resultThemeVals = makeMediumAnalagousThemeValues(paletteArray);


                        }

                        case 2: {
                            resultThemeVals = makeAnalgousLightThemeValues(paletteArray);


                        }
                    }


                }

                    break;
                //Complementary theme gen
                case 2: {

                    switch (lightnessSetting) {

                        case 0: {



                            resultThemeVals = makeDarkComplementaryThemeValues(paletteArray);


                        }
                        case 1: {

                            resultThemeVals = makeMediumComplementaryThemeValues(paletteArray);


                        }

                        case 2: {



                            resultThemeVals = makeLightComplementaryThemeValues(paletteArray);


                        }
                    }


                }
                    break;

                //Triadic theme gen
                case 3: {

                    switch (lightnessSetting) {

                        case 0: {



                            resultThemeVals = makeDarkTriadicThemeValues(paletteArray);


                        }
                        case 1: {


                            resultThemeVals = makeMediumTriadicThemeValues(paletteArray);


                        }

                        case 2: {




                            resultThemeVals = makeLightTriadicThemeValues(paletteArray);


                        }
                    }


                }
                    break;

                    //Compund theme gen
                case 4: {

                    switch (lightnessSetting) {

                        case 0: {



                            
            resultThemeVals = makeDarkCompoundThemeValues(paletteArray);


                        }
                        case 1: {



            resultThemeVals = makeMediumCompoundThemeValues(paletteArray);

                        }

                        case 2: {




                            
            resultThemeVals = makeLightCompoundThemeValues(paletteArray);


                        }
                    }

                    


                }
            }
            return resultThemeVals;

        }
        //Indicates that either/or both the generationStrategy-const or lightness-const were not valid
        else{
            let errorMessage : string = "Error(s) : ";
            errorMessage += !((generationStrategy >= 0 && generationStrategy < numberOfConstantsGenStrat)) ? `Generation strategy constant not in range (${generationStrategy})` : "";
            errorMessage += !((lightnessSetting >= 0 && lightnessSetting < numberOfConstantsLightPref)) ? `Generation strategy constant not in range (${lightnessSetting})` : "";
            throw new Error(errorMessage);


        }

        function makeLightCompoundThemeValues(paletteArray: string[][]) {
      let resultThemeVals: ThemeValues = new ThemeValues("#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa",1);

                                    let mainColorHVal ,mainColorSVal ,mainColorLVal = 0

            //Light
            inColors.forEach((mainColor, index) => {

                mainColorHVal = mainColor.h;
                mainColorLVal = mainColor.l;
                mainColorSVal = mainColor.s;



                let lighterColorLValue = ((100 - mainColorLVal) / 3) * 4 + mainColorLVal;
                let lighterColorHValue = (mainColorHVal - (180 + 45) >= 0) ? mainColorHVal - (180 + 45) : -1 * (mainColorHVal - (180 + 45));
                let lighterColor = new Color("hsl", [lighterColorHValue, lighterColorLValue, mainColorSVal]);

                let darkerColorLVal = mainColorLVal - (mainColorLVal / 2);
                let darkerColorHValue = (mainColorHVal + (180 + 45) <= 360) ? mainColorHVal + (180 + 45) : (mainColorHVal + (180 + 45)) % 360;
                let darkerColor = new Color("hsl", [darkerColorHValue, mainColorSVal, darkerColorLVal]);

                //Generate a contrast color, the hue val must be between 0 and 360 <=> If(mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180; 
                let contrastColorHVal = (mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180;
                //We want a contrast color to be a bit extra eye-catching on a light background <=> Add a little extra darkness and saturation
                let contrastColorLVal = mainColorLVal - (((mainColorLVal) / 6) * 5);
                let contrastColorSVal = ((100 - mainColorLVal) / 6) * 5 + mainColorLVal;

                let contrastColor = new Color("hsl", [contrastColorHVal, contrastColorSVal, contrastColorLVal]);

                paletteArray[index] = [mainColor.to("srgb").toString({"format":"hex"}), lighterColor.to("srgb").toString({"format":"hex"}), darkerColor.to("srgb").toString({"format":"hex"}), contrastColor.to("srgb").toString({"format":"hex"})];









            });

            //Once done with the loop we have gotten enough colors to supply our theme values
            switch (inColors.length) {

                case 1: {

                    //This means we should have only the first array to choose from - All background colors hould be  main, all contents should be the lighter version and all texts + focused 
                    // should use contrast version and error should have the inverse : contrast as background, darker as content and main as text.
                    //If l value of maincolor is >=50, darker version should be used for content 
                    resultThemeVals = new ThemeValues(paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        1);

                }
                break;
                case 2: {



                    resultThemeVals = new ThemeValues(paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[1][2], paletteArray[1][1], paletteArray[1][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        1);

                }
                break;
                case 3: {

                    //This means we should have only the first two arrays to choose from. Follows the same pattern as above but instead uses the third palette generated
                    resultThemeVals = new ThemeValues(paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[1][0], paletteArray[1][2], paletteArray[1][3],
                        paletteArray[2][2], paletteArray[2][1], paletteArray[2][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        1);

                }
                break;
            }
           return resultThemeVals;
        }

        function makeMediumCompoundThemeValues(paletteArray: string[][]) {
            let resultThemeVals: ThemeValues = new ThemeValues("#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa",1);

            let mainColorHVal = 0;
            let mainColorSVal = 0;
            let mainColorLVal = 0;


            //Medium
            inColors.forEach((mainColor, index) => {

                mainColorHVal = mainColor.h;
                mainColorLVal = mainColor.l;
                mainColorSVal = mainColor.s;



                let lighterColorLValue = (100 - mainColorLVal) / 2 + mainColorLVal;
                let lighterColorHValue = (mainColorHVal + (180 + 45) < 360) ? mainColorHVal + 120 : (mainColorHVal + 120) % 360;

                let lighterColor = new Color("hsl", [lighterColorHValue, lighterColorLValue, mainColorSVal]);

                let darkerColorLVal = mainColorLVal - (mainColorLVal / 2);
                let darkerColorHValue = (mainColorHVal - (180 + 45) >= 0) ? mainColorHVal - (180 + 45) : -1 * (mainColorHVal - (180 + 45));

                let darkerColor = new Color("hsl", [darkerColorHValue, mainColorSVal, darkerColorLVal]);

                //Generate a contrast color, the hue val must be between 0 and 360 <=> If(mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180; 
                let contrastColorHVal = (mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180;
                //We want a contrast color to be a bit extra eye-catching on a dark background <=> Add a little extra lightness and saturation
                let contrastColorLVal = ((100 - mainColorLVal) / 2) + mainColorLVal;
                let contrastColorSVal = ((100 - mainColorLVal) / 2) + mainColorLVal;

                let contrastColor = new Color("hsl", [contrastColorHVal, contrastColorSVal, contrastColorLVal]);

                paletteArray[index] = [mainColor.to("srgb").toString({"format":"hex"}), lighterColor.to("srgb").toString({"format":"hex"}), darkerColor.to("srgb").toString({"format":"hex"}), contrastColor.to("srgb").toString({"format":"hex"})];









            });

            //Once done with the loop we have gotten enough colors to supply our theme values
            switch (inColors.length) {

                case 1: {

                    //This means we should have only the first array to choose from - All background colors hould be  main, all contents should be the lighter version and all texts + focused 
                    // should use contrast version and error should have the inverse : contrast as background, darker as content and main as text.
                    //If l value of maincolor is >=50, darker version should be used for content 
                    if (mainColorLVal >= 50) {

                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);
                    }
                    else {
                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);

                    }
                }
                    break;
                case 2: {

                    //This means we should have only the first two arrays to choose from. Follows the same pattern as above but instead uses the secondary palette generated
                    if (mainColorLVal >= 50) {

                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[1][1], paletteArray[1][2], paletteArray[1][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);
                    }
                    else {
                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[1][1], paletteArray[1][2], paletteArray[1][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);

                    }
                }
                    break;
                case 3: {

                    //This means we should have only the first two arrays to choose from. Follows the same pattern as above but instead uses the third palette generated
                    if (mainColorLVal >= 50) {

                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[1][1], paletteArray[1][2], paletteArray[1][3],
                            paletteArray[2][2], paletteArray[2][1], paletteArray[2][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);
                    }
                    else {
                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[1][1], paletteArray[1][2], paletteArray[1][3],
                            paletteArray[2][2], paletteArray[2][1], paletteArray[2][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);

                    }
                }
                    break;
            }
            return resultThemeVals;
        }

        function makeDarkCompoundThemeValues(paletteArray: string[][]) {
                        let resultThemeVals: ThemeValues = new ThemeValues("#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa",1);

                                    let mainColorHVal ,mainColorSVal ,mainColorLVal = 0


            //Light
            inColors.forEach((mainColor, index) => {

                mainColorHVal = mainColor.h;
                mainColorLVal = mainColor.l;
                mainColorSVal = mainColor.s;



                let lighterColorLValue = ((100 - mainColorLVal) / 3) * 4 + mainColorLVal;
                let lighterColorHValue = (mainColorHVal - (180 + 45) >= 0) ? mainColorHVal - (180 + 45) : -1 * (mainColorHVal - (180 + 45));
                let lighterColor = new Color("hsl", [lighterColorHValue, lighterColorLValue, mainColorSVal]);

                let darkerColorLVal = mainColorLVal - (mainColorLVal / 2);
                let darkerColorHValue = (mainColorHVal + (180 + 45) <= 360) ? mainColorHVal + (180 + 45) : (mainColorHVal + (180 + 45)) % 360;
                let darkerColor = new Color("hsl", [darkerColorHValue, mainColorSVal, darkerColorLVal]);

                //Generate a contrast color, the hue val must be between 0 and 360 <=> If(mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180; 
                let contrastColorHVal = (mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180;
                //We want a contrast color to be a bit extra eye-catching on a light background <=> Add a little extra darkness and saturation
                let contrastColorLVal = mainColorLVal - (((mainColorLVal) / 6) * 5);
                let contrastColorSVal = ((100 - mainColorLVal) / 6) * 5 + mainColorLVal;

                let contrastColor = new Color("hsl", [contrastColorHVal, contrastColorSVal, contrastColorLVal]);

                paletteArray[index] = [mainColor.to("srgb").toString({"format":"hex"}), lighterColor.to("srgb").toString({"format":"hex"}), darkerColor.to("srgb").toString({"format":"hex"}), contrastColor.to("srgb").toString({"format":"hex"})];









            });

            //Once done with the loop we have gotten enough colors to supply our theme values
            switch (inColors.length) {

                case 1: {

                    //This means we should have only the first array to choose from - All background colors hould be  main, all contents should be the lighter version and all texts + focused 
                    // should use contrast version and error should have the inverse : contrast as background, darker as content and main as text.
                    //If l value of maincolor is >=50, darker version should be used for content 
                    resultThemeVals = new ThemeValues(paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        1);

                }
                    break;
                case 2: {



                    resultThemeVals = new ThemeValues(paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[1][2], paletteArray[1][1], paletteArray[1][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        1);

                }
                    break;
                case 3: {

                    //This means we should have only the first two arrays to choose from. Follows the same pattern as above but instead uses the third palette generated
                    resultThemeVals = new ThemeValues(paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[1][0], paletteArray[1][2], paletteArray[1][3],
                        paletteArray[2][2], paletteArray[2][1], paletteArray[2][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        1);

                }
                    break;
            }
            return resultThemeVals;
        }

        function makeLightTriadicThemeValues(paletteArray: string[][]) {
            let resultThemeVals: ThemeValues = new ThemeValues("#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa",1);
                              let mainColorHVal ,mainColorSVal ,mainColorLVal = 0



            //Light
            inColors.forEach((mainColor, index) => {

                mainColorHVal = mainColor.h;
                mainColorLVal = mainColor.l;
                mainColorSVal = mainColor.s;



                let lighterColorLValue = ((100 - mainColorLVal) / 3) * 4 + mainColorLVal;
                let lighterColorHValue = (mainColorHVal - 120 >= 0) ? mainColorHVal - 120 : -1 * (mainColorHVal - 120);
                let lighterColor = new Color("hsl", [lighterColorHValue, lighterColorLValue, mainColorSVal]);

                let darkerColorLVal = mainColorLVal - (mainColorLVal / 2);
                let darkerColorHValue = (mainColorHVal + 120 <= 360) ? mainColorHVal + 120 : (mainColorHVal + 120) % 360;
                let darkerColor = new Color("hsl", [darkerColorHValue, mainColorSVal, darkerColorLVal]);

                //Generate a contrast color, the hue val must be between 0 and 360 <=> If(mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180; 
                let contrastColorHVal = (mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180;
                //We want a contrast color to be a bit extra eye-catching on a light background <=> Add a little extra darkness and saturation
                let contrastColorLVal = mainColorLVal - (((mainColorLVal) / 6) * 5);
                let contrastColorSVal = ((100 - mainColorLVal) / 6) * 5 + mainColorLVal;

                let contrastColor = new Color("hsl", [contrastColorHVal, contrastColorSVal, contrastColorLVal]);

                paletteArray[index] = [mainColor.toString({format:"hex"}), lighterColor.to("srgb").toString({"format":"hex"}), darkerColor.to("srgb").toString({"format":"hex"}), contrastColor.to("srgb").toString({"format":"hex"})];









            });

            //Once done with the loop we have gotten enough colors to supply our theme values
            switch (inColors.length) {

                case 1: {

                    //This means we should have only the first array to choose from - All background colors hould be  main, all contents should be the lighter version and all texts + focused 
                    // should use contrast version and error should have the inverse : contrast as background, darker as content and main as text.
                    //If l value of maincolor is >=50, darker version should be used for content 
                    resultThemeVals = new ThemeValues(paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        1);

                }
                    break;
                case 2: {



                    resultThemeVals = new ThemeValues(paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[1][2], paletteArray[1][1], paletteArray[1][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        1);

                }
                    break;
                case 3: {

                    //This means we should have only the first two arrays to choose from. Follows the same pattern as above but instead uses the third palette generated
                    resultThemeVals = new ThemeValues(paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[1][0], paletteArray[1][2], paletteArray[1][3],
                        paletteArray[2][2], paletteArray[2][1], paletteArray[2][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        1);

                }
                    break;
            }
          return resultThemeVals;
        }

        function makeMediumTriadicThemeValues(paletteArray: string[][]) {
            let resultThemeVals: ThemeValues = new ThemeValues("#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa",1);

                  let mainColorHVal ,mainColorSVal ,mainColorLVal = 0



            //Medium
            inColors.forEach((mainColor, index) => {

                mainColorHVal = mainColor.h;
                mainColorLVal = mainColor.l;
                mainColorSVal = mainColor.s;



                let lighterColorLValue = (100 - mainColorLVal) / 2 + mainColorLVal;
                let lighterColorHValue = (mainColorHVal + 120 < 360) ? mainColorHVal + 120 : (mainColorHVal + 120) % 360;

                let lighterColor = new Color("hsl", [lighterColorHValue, lighterColorLValue, mainColorSVal]);

                let darkerColorLVal = mainColorLVal - (mainColorLVal / 2);
                let darkerColorHValue = (mainColorHVal - 120 >= 0) ? mainColorHVal - 120 : -1 * (mainColorHVal - 120);

                let darkerColor = new Color("hsl", [darkerColorHValue, mainColorSVal, darkerColorLVal]);

                //Generate a contrast color, the hue val must be between 0 and 360 <=> If(mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180; 
                let contrastColorHVal = (mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180;
                //We want a contrast color to be a bit extra eye-catching on a dark background <=> Add a little extra lightness and saturation
                let contrastColorLVal = ((100 - mainColorLVal) / 2) + mainColorLVal;
                let contrastColorSVal = ((100 - mainColorLVal) / 2) + mainColorLVal;

                let contrastColor = new Color("hsl", [contrastColorHVal, contrastColorSVal, contrastColorLVal]);

                paletteArray[index] = [mainColor.to("srgb").toString({"format":"hex"}), lighterColor.to("srgb").toString({"format":"hex"}), darkerColor.to("srgb").toString({"format":"hex"}), contrastColor.to("srgb").toString({"format":"hex"})];









            });

            //Once done with the loop we have gotten enough colors to supply our theme values
            switch (inColors.length) {

                case 1: {

                    //This means we should have only the first array to choose from - All background colors hould be  main, all contents should be the lighter version and all texts + focused 
                    // should use contrast version and error should have the inverse : contrast as background, darker as content and main as text.
                    //If l value of maincolor is >=50, darker version should be used for content 
                    if (mainColorLVal >= 50) {

                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);
                    }
                    else {
                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);

                    }
                }
                    break;
                case 2: {

                    //This means we should have only the first two arrays to choose from. Follows the same pattern as above but instead uses the secondary palette generated
                    if (mainColorLVal >= 50) {

                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[1][1], paletteArray[1][2], paletteArray[1][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);
                    }
                    else {
                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[1][1], paletteArray[1][2], paletteArray[1][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);

                    }
                }
                    break;
                case 3: {

                    //This means we should have only the first two arrays to choose from. Follows the same pattern as above but instead uses the third palette generated
                    if (mainColorLVal >= 50) {

                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[1][1], paletteArray[1][2], paletteArray[1][3],
                            paletteArray[2][2], paletteArray[2][1], paletteArray[2][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);
                    }
                    else {
                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[1][1], paletteArray[1][2], paletteArray[1][3],
                            paletteArray[2][2], paletteArray[2][1], paletteArray[2][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);

                    }
                }
                    break;
            }
            return resultThemeVals;
        }

        function makeDarkTriadicThemeValues(paletteArray: string[][]) {
            let resultThemeVals: ThemeValues = new ThemeValues("#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa",1);
                  let mainColorHVal, mainColorSVal, mainColorLVal = 0;



            //Light
            inColors.forEach((mainColor, index) => {

                mainColorHVal = mainColor.h;
                mainColorLVal = mainColor.l;
                mainColorSVal = mainColor.s;



                let lighterColorLValue = ((100 - mainColorLVal) / 3) * 4 + mainColorLVal;
                let lighterColorHValue = (mainColorHVal - 120 >= 0) ? mainColorHVal - 120 : -1 * (mainColorHVal - 120);
                let lighterColor = new Color("hsl", [lighterColorHValue, lighterColorLValue, mainColorSVal]);

                let darkerColorLVal = mainColorLVal - (mainColorLVal / 2);
                let darkerColorHValue = (mainColorHVal + 120 <= 360) ? mainColorHVal + 120 : (mainColorHVal + 120) % 360;
                let darkerColor = new Color("hsl", [darkerColorHValue, mainColorSVal, darkerColorLVal]);

                //Generate a contrast color, the hue val must be between 0 and 360 <=> If(mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180; 
                let contrastColorHVal = (mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180;
                //We want a contrast color to be a bit extra eye-catching on a light background <=> Add a little extra darkness and saturation
                let contrastColorLVal = mainColorLVal - (((mainColorLVal) / 6) * 5);
                let contrastColorSVal = ((100 - mainColorLVal) / 6) * 5 + mainColorLVal;

                let contrastColor = new Color("hsl", [contrastColorHVal, contrastColorSVal, contrastColorLVal]);

                paletteArray[index] = [mainColor.to("srgb").toString({"format":"hex"}), lighterColor.to("srgb").toString({"format":"hex"}), darkerColor.to("srgb").toString({"format":"hex"}), contrastColor.to("srgb").toString({"format":"hex"})];









            });

            //Once done with the loop we have gotten enough colors to supply our theme values
            switch (inColors.length) {

                case 1: {

                    //This means we should have only the first array to choose from - All background colors hould be  main, all contents should be the lighter version and all texts + focused 
                    // should use contrast version and error should have the inverse : contrast as background, darker as content and main as text.
                    //If l value of maincolor is >=50, darker version should be used for content 
                    resultThemeVals = new ThemeValues(paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        1);

                }
                    break;
                case 2: {



                    resultThemeVals = new ThemeValues(paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[1][2], paletteArray[1][1], paletteArray[1][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        1);

                }
                    break;
                case 3: {

                    //This means we should have only the first two arrays to choose from. Follows the same pattern as above but instead uses the third palette generated
                    resultThemeVals = new ThemeValues(paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[1][0], paletteArray[1][2], paletteArray[1][3],
                        paletteArray[2][2], paletteArray[2][1], paletteArray[2][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        1);

                }
                    break;
            }
          return resultThemeVals;
        }

        function makeLightComplementaryThemeValues(paletteArray: string[][]) {
                                    let resultThemeVals: ThemeValues = new ThemeValues("#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa",1);

            let mainColorHVal, mainColorSVal, mainColorLVal = 0;


            //Light
            inColors.forEach((mainColor, index) => {

                mainColorHVal = mainColor.h;
                mainColorLVal = mainColor.l;
                mainColorSVal = mainColor.s;



                let lighterColorLValue = ((100 - mainColorLVal) / 3) * 4 + mainColorLVal;
                let lighterColorHValue = (mainColorHVal - 90 >= 0) ? mainColorHVal - 90 : -1 * (mainColorHVal - 90);
                let lighterColor = new Color("hsl", [lighterColorHValue, lighterColorLValue, mainColorSVal]);

                let darkerColorLVal = mainColorLVal - (mainColorLVal / 2);
                let darkerColorHValue = (mainColorHVal + 90 <= 360) ? mainColorHVal + 90 : (mainColorHVal + 90) % 360;
                let darkerColor = new Color("hsl", [darkerColorHValue, mainColorSVal, darkerColorLVal]);

                //Generate a contrast color, the hue val must be between 0 and 360 <=> If(mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180; 
                let contrastColorHVal = (mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180;
                //We want a contrast color to be a bit extra eye-catching on a light background <=> Add a little extra darkness and saturation
                let contrastColorLVal = mainColorLVal - (((mainColorLVal) / 6) * 5);
                let contrastColorSVal = ((100 - mainColorLVal) / 6) * 5 + mainColorLVal;

                let contrastColor = new Color("hsl", [contrastColorHVal, contrastColorSVal, contrastColorLVal]);

                paletteArray[index] = [mainColor.to("srgb").toString({"format":"hex"}), lighterColor.to("srgb").toString({"format":"hex"}), darkerColor.to("srgb").toString({"format":"hex"}), contrastColor.to("srgb").toString({"format":"hex"})];









            });

            //Once done with the loop we have gotten enough colors to supply our theme values
            switch (inColors.length) {

                case 1: {

                    //This means we should have only the first array to choose from - All background colors hould be  main, all contents should be the lighter version and all texts + focused 
                    // should use contrast version and error should have the inverse : contrast as background, darker as content and main as text.
                    //If l value of maincolor is >=50, darker version should be used for content 
                    resultThemeVals = new ThemeValues(paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        1);

                }
                    break;
                case 2: {



                    resultThemeVals = new ThemeValues(paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[1][2], paletteArray[1][1], paletteArray[1][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        1);

                }
                    break;
                case 3: {

                    //This means we should have only the first two arrays to choose from. Follows the same pattern as above but instead uses the third palette generated
                    resultThemeVals = new ThemeValues(paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[1][0], paletteArray[1][2], paletteArray[1][3],
                        paletteArray[2][2], paletteArray[2][1], paletteArray[2][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        1);

                }
                    break;
            }
           return resultThemeVals;
        }

        function makeMediumComplementaryThemeValues(paletteArray: string[][]) {
            let mainColorHVal ,mainColorSVal ,mainColorLVal = 0

                        let resultThemeVals: ThemeValues = new ThemeValues("#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa",1);


            //Medium
            inColors.forEach((mainColor, index) => {

                mainColorHVal = mainColor.h;
                mainColorLVal = mainColor.l;
                mainColorSVal = mainColor.s;



                let lighterColorLValue = (100 - mainColorLVal) / 2 + mainColorLVal;
                let lighterColorHValue = (mainColorHVal + 90 < 360) ? mainColorHVal + 90 : (mainColorHVal + 90) % 360;

                let lighterColor = new Color("hsl", [lighterColorHValue, lighterColorLValue, mainColorSVal]);

                let darkerColorLVal = mainColorLVal - (mainColorLVal / 2);
                let darkerColorHValue = (mainColorHVal - 90 >= 0) ? mainColorHVal - 90 : -1 * (mainColorHVal - 90);

                let darkerColor = new Color("hsl", [darkerColorHValue, mainColorSVal, darkerColorLVal]);

                //Generate a contrast color, the hue val must be between 0 and 360 <=> If(mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180; 
                let contrastColorHVal = (mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180;
                //We want a contrast color to be a bit extra eye-catching on a dark background <=> Add a little extra lightness and saturation
                let contrastColorLVal = ((100 - mainColorLVal) / 2) + mainColorLVal;
                let contrastColorSVal = ((100 - mainColorLVal) / 2) + mainColorLVal;

                let contrastColor = new Color("hsl", [contrastColorHVal, contrastColorSVal, contrastColorLVal]);

                paletteArray[index] = [mainColor.to("srgb").toString({"format":"hex"}), lighterColor.to("srgb").toString({"format":"hex"}), darkerColor.to("srgb").toString({"format":"hex"}), contrastColor.to("srgb").toString({"format":"hex"})];









            });

            //Once done with the loop we have gotten enough colors to supply our theme values
            switch (inColors.length) {

                case 1: {

                    //This means we should have only the first array to choose from - All background colors hould be  main, all contents should be the lighter version and all texts + focused 
                    // should use contrast version and error should have the inverse : contrast as background, darker as content and main as text.
                    //If l value of maincolor is >=50, darker version should be used for content 
                    if (mainColorLVal >= 50) {

                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);
                    }
                    else {
                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);

                    }
                }
                    break;
                case 2: {

                    //This means we should have only the first two arrays to choose from. Follows the same pattern as above but instead uses the secondary palette generated
                    if (mainColorLVal >= 50) {

                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[1][1], paletteArray[1][2], paletteArray[1][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);
                    }
                    else {
                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[1][1], paletteArray[1][2], paletteArray[1][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);

                    }
                }
                    break;
                case 3: {

                    //This means we should have only the first two arrays to choose from. Follows the same pattern as above but instead uses the third palette generated
                    if (mainColorLVal >= 50) {

                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[1][1], paletteArray[1][2], paletteArray[1][3],
                            paletteArray[2][2], paletteArray[2][1], paletteArray[2][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);
                    }
                    else {
                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[1][1], paletteArray[1][2], paletteArray[1][3],
                            paletteArray[2][2], paletteArray[2][1], paletteArray[2][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);

                    }
                }
                    break;
            }
          return resultThemeVals;
        }

        function makeDarkComplementaryThemeValues(paletteArray: string[][]) {
                        let resultThemeVals: ThemeValues = new ThemeValues("#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa",1);

            let mainColorHVal;
            let mainColorSVal;
            let mainColorLVal;


            //DARK
            inColors.forEach((mainColor, index) => {

                mainColorHVal = mainColor.h;
                mainColorLVal = mainColor.l;
                mainColorSVal = mainColor.s;

                //For complementary color generation, we should use opposite colors on the color wheel for the palette <=> 90 degrees in hue
                let lighterColorHValue = (mainColorHVal + 90 < 360) ? mainColorHVal + 90 : (mainColorHVal + 90) % 360;
                let lighterColorLValue = (100 - mainColorLVal) / 2 + mainColorLVal;
                let lighterColor = new Color("hsl", [lighterColorHValue, lighterColorLValue, mainColorSVal]);

                let darkerColorLVal = mainColorLVal - (mainColorLVal / 2);
                let darkerColorHValue = (mainColorHVal - 90 >= 0) ? mainColorHVal - 90 : -1 * (mainColorHVal - 90);
                let darkerColor = new Color("hsl", [darkerColorHValue, mainColorSVal, darkerColorLVal]);

                //Generate a contrast color, the hue val must be between 0 and 360 <=> If(mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180; 
                let contrastColorHVal = (mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180;
                //We want a contrast color to be a bit extra eye-catching on a dark background <=> Add a little extra lightness and saturation
                let contrastColorLVal = ((100 - mainColorLVal) / 6) * 5 + mainColorLVal;
                let contrastColorSVal = ((100 - mainColorLVal) / 6) * 5 + mainColorLVal;

                let contrastColor = new Color("hsl", [contrastColorHVal, contrastColorSVal, contrastColorLVal]);


                paletteArray[index] = [mainColor.to("srgb").toString({"format":"hex"}), lighterColor.to("srgb").toString({"format":"hex"}), darkerColor.to("srgb").toString({"format":"hex"}), contrastColor.to("srgb").toString({"format":"hex"})];









            });

            //Once done with the loop we have gotten enough colors to supply our theme values
            switch (inColors.length) {

                case 1: {

                    //This means we should have only the first array to choose from - All background colors hould be dark version of main, all contents should be the lighter version and all texts + focused 
                    // should use contrast version and error should have the inverse : contrast as background, darker as content and main as text
                    resultThemeVals = new ThemeValues(paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        1);
                }
                    break;
                case 2: {

                    //This means we should have only the first two arrays to choose from. Follows the same pattern as above but instead uses the secondary palette generated
                    resultThemeVals = new ThemeValues(paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[1][2], paletteArray[1][1], paletteArray[1][3],
                        paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        1);
                }
                    break;
                case 3: {

                    //This means we should have only the first two arrays to choose from. Follows the same pattern as above but instead uses the third palette generated
                    resultThemeVals = new ThemeValues(paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[1][2], paletteArray[1][1], paletteArray[1][3],
                        paletteArray[2][2], paletteArray[2][1], paletteArray[2][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        1);
                }
                    break;
            }
            return resultThemeVals;
        }

        function makeAnalgousLightThemeValues(paletteArray: string[][]) {
            let resultThemeVals: ThemeValues = new ThemeValues("#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa",1);

            let mainColorHVal;
            let mainColorSVal;
            let mainColorLVal;


            //Light
            inColors.forEach((mainColor, index) => {

                mainColorHVal = mainColor.h;
                mainColorLVal = mainColor.l;
                mainColorSVal = mainColor.s;



                let lighterColorLValue = ((100 - mainColorLVal) / 3) * 4 + mainColorLVal;
                let lighterColorHValue = (mainColorHVal - 45 >= 0) ? mainColorHVal - 45 : -1 * (mainColorHVal - 45);
                let lighterColor = new Color("hsl", [lighterColorHValue, lighterColorLValue, mainColorSVal]);

                let darkerColorLVal = mainColorLVal - (mainColorLVal / 2);
                let darkerColorHValue = (mainColorHVal + 45 <= 360) ? mainColorHVal + 45 : (mainColorHVal + 45) % 360;
                let darkerColor = new Color("hsl", [darkerColorHValue, mainColorSVal, darkerColorLVal]);

                //Generate a contrast color, the hue val must be between 0 and 360 <=> If(mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180; 
                let contrastColorHVal = (mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180;
                //We want a contrast color to be a bit extra eye-catching on a light background <=> Add a little extra darkness and saturation
                let contrastColorLVal = mainColorLVal - (((mainColorLVal) / 6) * 5);
                let contrastColorSVal = ((100 - mainColorLVal) / 6) * 5 + mainColorLVal;

                let contrastColor = new Color("hsl", [contrastColorHVal, contrastColorSVal, contrastColorLVal]);

                paletteArray[index] = [mainColor.to("srgb").toString({"format":"hex"}), lighterColor.to("srgb").toString({"format":"hex"}), darkerColor.to("srgb").toString({"format":"hex"}), contrastColor.to("srgb").toString({"format":"hex"})];









            });

            //Once done with the loop we have gotten enough colors to supply our theme values
            switch (inColors.length) {

                case 1: {

                    //This means we should have only the first array to choose from - All background colors hould be  main, all contents should be the lighter version and all texts + focused 
                    // should use contrast version and error should have the inverse : contrast as background, darker as content and main as text.
                    //If l value of maincolor is >=50, darker version should be used for content 
                    resultThemeVals = new ThemeValues(paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        1);

                }
                    break;
                case 2: {



                    resultThemeVals = new ThemeValues(paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[1][2], paletteArray[1][1], paletteArray[1][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        1);

                }
                    break;
                case 3: {

                    //This means we should have only the first two arrays to choose from. Follows the same pattern as above but instead uses the third palette generated
                    resultThemeVals = new ThemeValues(paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[1][0], paletteArray[1][2], paletteArray[1][3],
                        paletteArray[2][2], paletteArray[2][1], paletteArray[2][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        1);

                }
                    break;
            }
           return resultThemeVals;
        }

        function makeMediumAnalagousThemeValues(paletteArray: string[][]) {
            let resultThemeVals: ThemeValues = new ThemeValues("#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa",1);

                    let mainColorHVal ,mainColorSVal ,mainColorLVal = 0



            //Medium
            inColors.forEach((mainColor, index) => {

                mainColorHVal = mainColor.h;
                mainColorLVal = mainColor.l;
                mainColorSVal = mainColor.s;



                let lighterColorLValue = (100 - mainColorLVal) / 2 + mainColorLVal;
                let lighterColorHValue = (mainColorHVal + 45 < 360) ? mainColorHVal + 45 : (mainColorHVal + 45) % 360;

                let lighterColor = new Color("hsl", [lighterColorHValue, lighterColorLValue, mainColorSVal]);

                let darkerColorLVal = mainColorLVal - (mainColorLVal / 2);
                let darkerColorHValue = (mainColorHVal - 45 >= 0) ? mainColorHVal - 45 : -1 * (mainColorHVal - 45);

                let darkerColor = new Color("hsl", [darkerColorHValue, mainColorSVal, darkerColorLVal]);

                //Generate a contrast color, the hue val must be between 0 and 360 <=> If(mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180; 
                let contrastColorHVal = (mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180;
                //We want a contrast color to be a bit extra eye-catching on a dark background <=> Add a little extra lightness and saturation
                let contrastColorLVal = ((100 - mainColorLVal) / 2) + mainColorLVal;
                let contrastColorSVal = ((100 - mainColorLVal) / 2) + mainColorLVal;

                let contrastColor = new Color("hsl", [contrastColorHVal, contrastColorSVal, contrastColorLVal]);

                paletteArray[index] = [mainColor.to("srgb").toString({"format":"hex"}), lighterColor.to("srgb").toString({"format":"hex"}), darkerColor.to("srgb").toString({"format":"hex"}), contrastColor.to("srgb").toString({"format":"hex"})];









            });

            //Once done with the loop we have gotten enough colors to supply our theme values
            switch (inColors.length) {

                case 1: {

                    //This means we should have only the first array to choose from - All background colors hould be  main, all contents should be the lighter version and all texts + focused 
                    // should use contrast version and error should have the inverse : contrast as background, darker as content and main as text.
                    //If l value of maincolor is >=50, darker version should be used for content 
                    if (mainColorLVal >= 50) {

                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);
                    }
                    else {
                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);

                    }
                }
                    break;
                case 2: {

                    //This means we should have only the first two arrays to choose from. Follows the same pattern as above but instead uses the secondary palette generated
                    if (mainColorLVal >= 50) {

                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[1][1], paletteArray[1][2], paletteArray[1][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);
                    }
                    else {
                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[1][1], paletteArray[1][2], paletteArray[1][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);

                    }
                }
                    break;
                case 3: {

                    //This means we should have only the first two arrays to choose from. Follows the same pattern as above but instead uses the third palette generated
                    if (mainColorLVal >= 50) {

                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[1][1], paletteArray[1][2], paletteArray[1][3],
                            paletteArray[2][2], paletteArray[2][1], paletteArray[2][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);
                    }
                    else {
                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[1][1], paletteArray[1][2], paletteArray[1][3],
                            paletteArray[2][2], paletteArray[2][1], paletteArray[2][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);

                    }
                }
                    break;
            }
           return resultThemeVals;
        }

        function makeDarkAnalogousThemeValues(paletteArray: string[][]) {
            let resultThemeVals: ThemeValues = new ThemeValues("#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa",1);

                      let mainColorHVal ,mainColorSVal ,mainColorLVal = 0



            //DARK
            inColors.forEach((mainColor, index) => {

                mainColorHVal = mainColor.h;
                mainColorLVal = mainColor.l;
                mainColorSVal = mainColor.s;

                //For analogous color generation, we should use neighbouring colors on the color wheel for the palette
                let lighterColorHValue = (mainColorHVal + 45 < 360) ? mainColorHVal + 45 : (mainColorHVal + 45) % 360;
                let lighterColorLValue = (100 - mainColorLVal) / 2 + mainColorLVal;
                let lighterColor = new Color("hsl", [lighterColorHValue, lighterColorLValue, mainColorSVal]);

                let darkerColorLVal = mainColorLVal - (mainColorLVal / 2);
                let darkerColorHValue = (mainColorHVal - 45 >= 0) ? mainColorHVal - 45 : -1 * (mainColorHVal - 45);
                let darkerColor = new Color("hsl", [darkerColorHValue, mainColorSVal, darkerColorLVal]);

                //Generate a contrast color, the hue val must be between 0 and 360 <=> If(mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180; 
                let contrastColorHVal = (mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180;
                //We want a contrast color to be a bit extra eye-catching on a dark background <=> Add a little extra lightness and saturation
                let contrastColorLVal = ((100 - mainColorLVal) / 6) * 5 + mainColorLVal;
                let contrastColorSVal = ((100 - mainColorLVal) / 6) * 5 + mainColorLVal;

                let contrastColor = new Color("hsl", [contrastColorHVal, contrastColorSVal, contrastColorLVal]);

                paletteArray[index] = [mainColor.to("srgb").toString({"format":"hex"}), lighterColor.to("srgb").toString({"format":"hex"}), darkerColor.to("srgb").toString({"format":"hex"}), contrastColor.to("srgb").toString({"format":"hex"})];









            });

            //Once done with the loop we have gotten enough colors to supply our theme values
            switch (inColors.length) {

                case 1: {

                    //This means we should have only the first array to choose from - All background colors hould be dark version of main, all contents should be the lighter version and all texts + focused 
                    // should use contrast version and error should have the inverse : contrast as background, darker as content and main as text
                    resultThemeVals = new ThemeValues(paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        1);
                }
                    break;
                case 2: {

                    //This means we should have only the first two arrays to choose from. Follows the same pattern as above but instead uses the secondary palette generated
                    resultThemeVals = new ThemeValues(paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[1][2], paletteArray[1][1], paletteArray[1][3],
                        paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        1);
                }
                    break;
                case 3: {

                    //This means we should have only the first two arrays to choose from. Follows the same pattern as above but instead uses the third palette generated
                    resultThemeVals = new ThemeValues(paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[1][2], paletteArray[1][1], paletteArray[1][3],
                        paletteArray[2][2], paletteArray[2][1], paletteArray[2][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        1);
                }
                    break;
            }
           return resultThemeVals;
        }

        function makeMonochromaticLightThemeValues(paletteArray: string[][]) {
            let resultThemeVals: ThemeValues = new ThemeValues("#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa",1);
            
            let mainColorHVal ,mainColorSVal ,mainColorLVal = 0
          


            //Light
            inColors.forEach((mainColor, index) => {

                mainColorHVal = mainColor.h;
                mainColorLVal = mainColor.l;
                mainColorSVal = mainColor.s;



                let lighterColorLValue = ((100 - mainColorLVal) / 3) * 4 + mainColorLVal;
                let lighterColor = new Color("hsl", [mainColorHVal, lighterColorLValue, mainColorSVal]);

                let darkerColorLVal = mainColorLVal - (mainColorLVal / 2);
                let darkerColor = new Color("hsl", [mainColorHVal, mainColorSVal, darkerColorLVal]);

                //Generate a contrast color, the hue val must be between 0 and 360 <=> If(mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180; 
                let contrastColorHVal = (mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180;
                //We want a contrast color to be a bit extra eye-catching on a light background <=> Add a little extra darkness and saturation
                let contrastColorLVal = mainColorLVal - (((mainColorLVal) / 6) * 5);
                let contrastColorSVal = ((100 - mainColorLVal) / 6) * 5 + mainColorLVal;

                let contrastColor = new Color("hsl", [contrastColorHVal, contrastColorSVal, contrastColorLVal]);

                paletteArray[index] = [mainColor.to("srgb").toString({"format":"hex"}), lighterColor.to("srgb").toString({"format":"hex"}), darkerColor.to("srgb").toString({"format":"hex"}), contrastColor.to("srgb").toString({"format":"hex"})];









            });

            //Once done with the loop we have gotten enough colors to supply our theme values
            switch (inColors.length) {

                case 1: {

                    //This means we should have only the first array to choose from - All background colors hould be  main, all contents should be the lighter version and all texts + focused 
                    // should use contrast version and error should have the inverse : contrast as background, darker as content and main as text.
                    //If l value of maincolor is >=50, darker version should be used for content 
                    resultThemeVals = new ThemeValues(paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        1);

                }
                    break;
                case 2: {



                    resultThemeVals = new ThemeValues(paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[1][2], paletteArray[1][1], paletteArray[1][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        1);

                }
                    break;
                case 3: {

                    //This means we should have only the first two arrays to choose from. Follows the same pattern as above but instead uses the third palette generated
                    resultThemeVals = new ThemeValues(paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[1][0], paletteArray[1][2], paletteArray[1][3],
                        paletteArray[2][2], paletteArray[2][1], paletteArray[2][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        1);

                }
                    break;
            }
           return resultThemeVals;
        }

        function makeMonochromaticMediumThemeValues(paletteArray: string[][]
) {
            let resultThemeVals: ThemeValues = new ThemeValues("#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa",1);

                      let mainColorHVal ,mainColorSVal ,mainColorLVal = 0



            //Medium
            inColors.forEach((mainColor, index) => {

                mainColorHVal = mainColor.h;
                mainColorLVal = mainColor.l;
                mainColorSVal = mainColor.s;



                let lighterColorLValue = (100 - mainColorLVal) / 2 + mainColorLVal;
                let lighterColor = new Color("hsl", [mainColorHVal, lighterColorLValue, mainColorSVal]);

                let darkerColorLVal = mainColorLVal - (mainColorLVal / 2);
                let darkerColor = new Color("hsl", [mainColorHVal, mainColorSVal, darkerColorLVal]);

                //Generate a contrast color, the hue val must be between 0 and 360 <=> If(mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180; 
                let contrastColorHVal = (mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180;
                //We want a contrast color to be a bit extra eye-catching on a dark background <=> Add a little extra lightness and saturation
                let contrastColorLVal = ((100 - mainColorLVal) / 2) + mainColorLVal;
                let contrastColorSVal = ((100 - mainColorLVal) / 2) + mainColorLVal;

                let contrastColor = new Color("hsl", [contrastColorHVal, contrastColorSVal, contrastColorLVal]);

                paletteArray[index] = [mainColor.to("srgb").toString({"format":"hex"}), lighterColor.to("srgb").toString({"format":"hex"}), darkerColor.to("srgb").toString({"format":"hex"}), contrastColor.to("srgb").toString({"format":"hex"})];









            });

            //Once done with the loop we have gotten enough colors to supply our theme values
            switch (inColors.length) {

                case 1: {

                    //This means we should have only the first array to choose from - All background colors hould be  main, all contents should be the lighter version and all texts + focused 
                    // should use contrast version and error should have the inverse : contrast as background, darker as content and main as text.
                    //If l value of maincolor is >=50, darker version should be used for content 
                    if (mainColorLVal >= 50) {

                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);
                    }
                    else {
                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);

                    }
                }
                    break;
                case 2: {

                    //This means we should have only the first two arrays to choose from. Follows the same pattern as above but instead uses the secondary palette generated
                    if (mainColorLVal >= 50) {

                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[1][1], paletteArray[1][2], paletteArray[1][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);
                    }
                    else {
                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[1][1], paletteArray[1][2], paletteArray[1][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);

                    }
                }
                    break;
                case 3: {

                    //This means we should have only the first two arrays to choose from. Follows the same pattern as above but instead uses the third palette generated
                    if (mainColorLVal >= 50) {

                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][2], paletteArray[0][3],
                            paletteArray[1][1], paletteArray[1][2], paletteArray[1][3],
                            paletteArray[2][2], paletteArray[2][1], paletteArray[2][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);
                    }
                    else {
                        resultThemeVals = new ThemeValues(paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[1][1], paletteArray[1][2], paletteArray[1][3],
                            paletteArray[2][2], paletteArray[2][1], paletteArray[2][3],
                            paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                            paletteArray[0][1], paletteArray[0][1], paletteArray[0][3],
                            paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                            1);
                             

                    }
                }
                    break;
            }
            return resultThemeVals;
         
        }

        function makeMonoChromaticDarkThemeValues(paletteArray: string[][]) {
            let resultThemeVals: ThemeValues = new ThemeValues("#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa","#00ffaa",1);

              let mainColorHVal ,mainColorSVal ,mainColorLVal = 0



            //DARK
            inColors.forEach((mainColor, index) => {

                mainColorHVal = mainColor.h;
                mainColorLVal = mainColor.l;
                mainColorSVal = mainColor.s;



                let lighterColorLValue = (100 - mainColorLVal) / 2 + mainColorLVal;
                let lighterColor = new Color("hsl", [mainColorHVal, lighterColorLValue, mainColorSVal]);

                let darkerColorLVal = mainColorLVal - (mainColorLVal / 2);
                let darkerColor = new Color("hsl", [mainColorHVal, mainColorSVal, darkerColorLVal]);

                //Generate a contrast color, the hue val must be between 0 and 360 <=> If(mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180; 
                let contrastColorHVal = (mainColorHVal + 180 > 360) ? (mainColorHVal + 180) % 360 : mainColorHVal + 180;
                //We want a contrast color to be a bit extra eye-catching on a dark background <=> Add a little extra lightness and saturation
                let contrastColorLVal = ((100 - mainColorLVal) / 6) * 5 + mainColorLVal;
                let contrastColorSVal = ((100 - mainColorLVal) / 6) * 5 + mainColorLVal;

                let contrastColor = new Color("hsl", [contrastColorHVal, contrastColorSVal, contrastColorLVal]);

                paletteArray[index] = [mainColor.to("srgb").toString({"format":"hex"}), lighterColor.to("srgb").toString({"format":"hex"}), darkerColor.to("srgb").toString({"format":"hex"}), contrastColor.to("srgb").toString({"format":"hex"})];









            });

            //Once done with the loop we have gotten enough colors to supply our theme values
            switch (inColors.length) {

                case 1: {

                    //This means we should have only the first array to choose from - All background colors hould be dark version of main, all contents should be the lighter version and all texts + focused 
                    // should use contrast version and error should have the inverse : contrast as background, darker as content and main as text
                    resultThemeVals = new ThemeValues(paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        1);
                }
                break;
                case 2: {

                    //This means we should have only the first two arrays to choose from. Follows the same pattern as above but instead uses the secondary palette generated
                    resultThemeVals = new ThemeValues(paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[1][2], paletteArray[1][1], paletteArray[1][3],
                        paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        1);
                }break;
                case 3: {

                    //This means we should have only the first two arrays to choose from. Follows the same pattern as above but instead uses the third palette generated
                    resultThemeVals = new ThemeValues(paletteArray[0][2], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[1][2], paletteArray[1][1], paletteArray[1][3],
                        paletteArray[2][2], paletteArray[2][1], paletteArray[2][3],
                        paletteArray[0][3], paletteArray[0][2], paletteArray[0][0],
                        paletteArray[0][0], paletteArray[0][1], paletteArray[0][3],
                        paletteArray[0][1], paletteArray[0][2], paletteArray[0][3],
                        1);

                        
                }
                break;
            }
            return resultThemeVals;
        } 
    }



}


/**
* Set from the colour selection by the user in the footer (Login/Sign-up-page) or settings-options (When logged in).
* Follows ARIA-declarations for accessibility so that each user can see to their needs for colour selection to achieve a fully accesible and optimally enjoyable user-experience.
* All values are given by running JSON.stringify on a chosen color object.
* 
*  - Background Color primary : The background of the main website and the header, if all contents were removed this colour would fill the whole page
*  - Content Color primary : The content, text etc and the colour given to that content. For example : Text in header that show web-page title. Set to the inverse of the background if not changed
* 
*  - Background Color secondary : The background of the main body content of the page, such as the background of the login/sign-up panel or the background of the projects list-items or schedule when logged in
*  - Content Color secondary : The content, text etc and the colour given to that content presented on the secondary background. For example : Title of projects, menu-mode buttons etc. Set to the inverse of the background if not changed
* 
* - Background Color tertiary : The background of previews when opening features, projects, the footer, status-notifier (loading, completed - If not customset : Error is also set to this) etc
*  - Content Color tertiary : The content, text etc and the colour given to that content presented on the tertiary background. For example : Error-text, setting-options,  menu-mode buttons etc. Set to the inverse of the background if not changed
* 
*   - Focused/unfocused Backround color : Defines the background color of focused elements : Selected features/tasks, login/sign-up-buttons etc. If the background of the login butto is focused that means it is selected, otherwise given unfocused
*   - Focused/unfocused Content color : Defines the content color of focused elements : Text in selected features/tasks, login/sign-up-buttons etc. If the background of the login butto is focused that means it is selected, otherwise given unfocused. Set to the inverse of the background if not changed
* 
*   - opacityValue : Sets whether transparency should be allowed and how transparent an element-color is allowed to be. A value between 0 and 1 (alpha value)
* 
*       For any given background the text is always given  a contrast color.
*/
export class ThemeValues {



    primaryBackgroundColor: string;
    primaryContentColor: string;
    primaryContrastColor: string;
    secondaryBackgroundColor: string;
    secondaryContentColor: string;
    secondaryContrastColor: string;
    tertiaryBackgroundColor: string;
    tertiaryContentColor: string;
    tertiaryContrastColor: string;
    errorBackgroundColor: string;
    errorContentColor: string;
    errorContrastColor: string;
    focusedBackgroundColor: string;
    focusedContentColor: string;
    focusedContrastColor: string;
    unfocusedBackgroundColor: string;
    unfocusedContentColor: string;
    unfocusedContrastColor: string;
    /**
     * Sets whether transparency should be allowed and how transparent an element-color is allowed to be. A value between 0 and 1 (alpha value)
     * 
     * @property {number}
     */

    opacityValue: number;


    constructor(primaryBackgroundColor: string,
        primaryContentColor: string,
        primaryContrastColor: string,
        secondaryBackgroundColor: string,
        secondaryContentColor: string,
        secondaryContrastColor: string,
        tertiaryBackgroundColor: string,
        tertiaryContentColor: string,
        tertiaryContrastColor: string,
        errorBackgroundColor: string,
        errorContentColor: string,
        errorContrastColor: string,
        focusedBackgroundColor: string,
        focusedContentColor: string,
        focusedContrastColor: string,
        unfocusedBackgroundColor: string,
        unfocusedContentColor: string,
        unfocusedContrastColor: string,


        opacityValue: number) {

        this.primaryBackgroundColor = primaryBackgroundColor;
        this.primaryContentColor = primaryContentColor;
        this.primaryContrastColor = primaryContrastColor;

        this.secondaryBackgroundColor = secondaryBackgroundColor;
        this.secondaryContentColor = secondaryContentColor;
        this.secondaryContrastColor = secondaryContrastColor;
        this.tertiaryBackgroundColor = tertiaryBackgroundColor;
        this.tertiaryContentColor = tertiaryContentColor;
        this.tertiaryContrastColor = tertiaryContrastColor;
        this.errorBackgroundColor = errorBackgroundColor;
        this.errorContentColor = errorContentColor;
        this.errorContrastColor = errorContrastColor;
        this.focusedBackgroundColor = focusedBackgroundColor;
        this.focusedContentColor = focusedContentColor;
        this.focusedContrastColor = focusedContrastColor;
        this.unfocusedBackgroundColor = unfocusedBackgroundColor;
        this.unfocusedContentColor = unfocusedContentColor;
        this.unfocusedContrastColor = unfocusedContrastColor;
        this.opacityValue = opacityValue;

       


    }

    /**Gets the ThemeValues as Color-objects. These Color-objects can be used to manipulate and translate the values to equivalent values in other color-spaces (such as with rgba, for example) 
     * 
     * @returns {Map<string, Color>} - The colors represented in the themevalues. 
     * 
     */
    getThemeValuesAsColors(): Map<string, Color>{
     let colorMap : Map<string, Color> = new Map<string, Color>(Object.entries(this).map(([key, hexString])=>{
                   return [key, new Color(hexString)];

            }));

       return colorMap;     
            
    


    }





}
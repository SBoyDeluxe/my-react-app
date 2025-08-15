import { useContext } from "react";
import { Background } from "./background";
import { themeContext } from "../context/ThemeContext";

type ProgressBarProps = {

    /**
     *  The color of the progressbar -> Defaults to focusedContentColor of the themeContext
     */
    barColor : string|undefined,
    /**
     * Defines the percentage of the progressbar to be filled
     */
    progress : number|undefined,

}

/**
 * Generates a progressbar taking up <progress> % of the parent it is inserted to,
 * defaultColor = focusedContentColor, defaultProgress = 0
 * 
 * @param progress  0 <= progress <=100 represents how the progressbar should be filled
 * @param barColor The hex-color value of the wanted color
 */
export function ProgressBar({barColor, progress = 0} : ProgressBarProps ){
    const appThemeContext = useContext(themeContext);

    barColor = (barColor !==undefined) ? barColor : appThemeContext.focusedContentColor;
    return (
        <div style = {
            {
                width : `${progress}%`,
                height : "auto",
                backgroundColor: barColor
            }
        }>
                {`${Math.floor(progress)} % (time passed)`}

        </div>
    )

}
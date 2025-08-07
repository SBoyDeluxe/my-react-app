import { ThemeValues } from "../../theme";

export function renderColors(themeVals: ThemeValues) {
  const themeValsAsPalletteList: Array<string[]> = new Array(Object.keys(themeVals).length / 3);
    let keysThemeVal = Object.values(themeVals);
  for (let i = 0; i + 3 < Object.keys(themeVals).length; i += 3) {
    let palette: string[] = [keysThemeVal[i], keysThemeVal[i + 1], keysThemeVal[i + 2],];
    themeValsAsPalletteList[i] = palette;
  }
  const divCol = themeValsAsPalletteList.map((palette, index) => {


    return (
      <div className= "mainColor" style = { {backgroundColor :`${palette[0]}`,
                                            color : `${palette[1]}`, border: `10px groove ${palette[1]}`  }} key={index }>
        background
        <div className='lighterColor' style = { {backgroundColor :palette[1], color : palette[2], border: `10px dashed ${palette[2]}`}} key = {index+1} >
            content
          <div className="darkerColor" style = { {backgroundColor :palette[2], color : palette[0], border: `10px dotted ${palette[1]}`}} key={index+2} > 
            text
          </div>
          </div>
          
              </div>
              );
              




});

return(divCol) as React.ReactNode;

}
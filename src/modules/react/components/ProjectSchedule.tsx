import { useContext, ReactNode, Fragment } from "react";
import { Feature } from "../../feature";
import { Developer } from "../../User";
import { themeContext } from "../context/ThemeContext";
import { Background } from "./background";
import { getKeysForList } from "./ProjectsTab";

export function ProjectSchedule({ features, projectDevs }: { features: Feature[] | null; projectDevs: Developer[] | null; }) {
    const appThemeContext = useContext(themeContext);


    if (features === null) {

        return (<></>);
    }
    else {
        let tableRows: ReactNode[] = [];
        let featureRows: ReactNode[] = [];
        const keysForProjectDevs = (projectDevs !== null) ? getKeysForList(projectDevs) : [""];
        let assignedDevList: ReactNode = projectDevs?.map((dev, index) => {
            const devTypeElement = (dev.developerType[0] !== "") ? `(${dev.developerType})` : "";

            return (<li key={keysForProjectDevs[index]}>{`${dev.username} ${devTypeElement}`} </li>);

        });

        const keysForFeatures = getKeysForList(features);
        features.map((feature, index) => {

            if (feature.developmentTasks !== null) {
                const activeTasks = feature.getActiveDevelopmentTasks();
                const pendingTasks = feature.getPendingDevelopmentTasks();
                const completedTasks = feature.developmentTasks!.filter((devTask) => (devTask.currentTaskStatus === "Completed"));
                const numberOfPendingTasks = pendingTasks.length;
                const numberOfActiveTasks = activeTasks.length;
                const numberOfCompletedTasks = completedTasks.length;


                // We need to generate a number of rows accomodating the largest of the active, pending or complete tasks : this array is sorted from largest to smallest
                // <=> We need as many rows as the first element of the array
                let amountOfDifferentTasks = [numberOfActiveTasks, numberOfCompletedTasks, numberOfPendingTasks].sort((numberA, numberB) => {
                    return numberB - numberA;
                });

                //We will need one key for each row, since this is a mapping call
                const keysForTableRows = getKeysForList(new Array(amountOfDifferentTasks[0]));
                //We will also need one key per  task and type of task
                const activeTaskKeys = getKeysForList(activeTasks);
                const pendingTaskKeys = getKeysForList(pendingTasks);
                const completedTaskKeys = getKeysForList(new Array(numberOfCompletedTasks));

                let activeTds = new Array(activeTasks.length);
                if (activeTasks.length > 0) {

                    activeTasks.map((task, index) => {

                        activeTds[index] = (<td key={activeTaskKeys[index]}><div style={{ border: `medium inset ${appThemeContext.primaryBackgroundColor} ` }}><h5>{`${task.timeconstraints.startdate} -> ${task.timeconstraints.enddate}`}</h5>
                            <h5>{`${task.type}`}</h5>

                            <textarea disabled={false} defaultValue={task.description}>

                            </textarea>

                        </div></td>);


                    });
                }
                let pendingdTds = new Array(pendingTasks.length);
                if (pendingTasks.length > 0) {

                    pendingTasks.map((task, index) => {

                        pendingdTds[index] = (<td key={pendingTaskKeys[index]}><div style={{ border: `medium inset ${appThemeContext.primaryBackgroundColor} ` }}><h5>{`${task.timeconstraints._startdate} -> ${task.timeconstraints._enddate}`}</h5>
                            <h5>{`${task.type}`}</h5>

                            <textarea disabled={false} defaultValue={task.description}>

                            </textarea>

                        </div></td>);


                    });
                }

                let completedTds = new Array(completedTasks.length);
                if (completedTasks.length > 0) {

                    completedTasks.map((task, index) => {

                        completedTds[index] = (<td key={completedTaskKeys[index]}><div style={{ border: `medium inset ${appThemeContext.primaryBackgroundColor} ` }}><h5>{`${task.timeconstraints._startdate} -> ${task.timeconstraints._enddate}`}</h5>
                            <h5>{`${task.type}`}</h5>

                            <textarea disabled={false} defaultValue={task.description}>

                            </textarea>

                        </div></td>);


                    });
                }
                //amountOfDifferentTasks[0] === amount of rows we need
                //We go down each row and try to add the completed, active and pending tasks in the order:
                //Pending (0)-> Active (1) -> Completed (2)
                // let mappedTasks : ReactNode[][] = new Array(amountOfDifferentTasks[0]).fill(new Array(3));
                // for(let i = 0 ; i < amountOfDifferentTasks[0] ; i++){
                //         for(let k = 0 ; k < 3 ; k++){
                //                 switch (k) {
                //                     case 0:{
                //                                                 //We only try taskKeys after the check that i < ... .length <=> We can just check for i
                //                         mappedTasks[i][k] = (i < pendingTasks.length && pendingTasks.length > 0) ? (<div style={{border : `medium inset ${appThemeContext.primaryBackgroundColor} `}} key={pendingTaskKeys[i]}><h5>{`${pendingTasks[i].timeconstraints.startdate} -> ${pendingTasks[i].timeconstraints.enddate}`}</h5>
                //                                                                                 <h5>{`${pendingTasks[i].type}`}</h5>
                //                                                                                 <textarea disabled = {false} defaultValue={pendingTasks[i].description}>
                //                                                                                     </textarea>         
                //                                                                                                                                                                                 </div>) 
                //                                                                     :       (<></>) ;
                //                     }
                //                         break;
                //                     case 1: {
                //                                                 //We only try taskKeys after the check that i < ... .length <=> We can just check for i
                //                         mappedTasks[i][k] = (i < activeTasks.length && activeTasks.length > 0) ? (<div style={{border : `medium inset ${appThemeContext.primaryBackgroundColor} `}} key={activeTaskKeys[i]}><h5>{`${activeTasks[i].timeconstraints.startdate} -> ${activeTasks[i].timeconstraints.enddate}`}</h5>
                //                                                                                 <h5>{`${activeTasks[i].type}`}</h5>
                //                                                                                 <textarea disabled = {false} defaultValue={activeTasks[i].description}>
                //                                                                                     </textarea>
                //                                                                                                                                                          </div>) 
                //                                                                     :       (<></>) ;
                //                     }
                //                         break;
                //                     case 2:{
                //                                                 //We only try taskKeys after the check that i < ... .length <=> We can just check for i
                //                         mappedTasks[i][k] = (i < completedTasks.length && completedTasks.length > 0) ? (<div className={"completed-task-schedule-cell"}  style={{border : `medium inset ${appThemeContext.primaryBackgroundColor} `}} key={completedTaskKeys[i]}><h5>{`${completedTasks[i].timeconstraints.startdate} -> ${completedTasks[i].timeconstraints.enddate} \n \t Completed at : ${completedTasks[i].timeconstraints.completiondate}`}</h5>
                //                                                                                 <h5>{`${completedTasks[i].type}`}</h5>
                //                                                                                 <textarea defaultValue ={completedTasks[i].description} disabled = {false}>
                //                                                                                     </textarea>
                //                                                                                                                                                                             </div>) 
                //                                                                     :       (<></>) ;
                //                     }
                //                         break;
                //                     default:
                //                         break;
                //                 }
                //                 //Once we have exited the switch-statement we have mapped all our tasks for one row
                //         }
                //                                                                 //-----!!PUT DEVELOPERS IN EACH TASK !!--------
                // }
                //                         //Once we finish the for loop we have mapped all rows of elements, we can safely put each element into any table row since they´re, at worst, are empty
                tableRows = new Array(amountOfDifferentTasks[0]);
                for (let i = 0; i < amountOfDifferentTasks[0]; i++) {

                    tableRows[i] = (<Fragment key={keysForTableRows[i]}>
                        {(i < pendingTasks.length && pendingTasks.length > 0) ? (pendingdTds[i]) : (<td></td>)}
                        {(i < activeTasks.length && activeTasks.length > 0) ? (activeTds[i]) : (<td></td>)}
                        {(i < completedTasks.length && completedTasks.length > 0) ? (completedTds[i]) : (<td></td>)}
                    </Fragment>);
                }

                featureRows = (featureRows[0] === null || typeof featureRows[0] === undefined) ? [(<Fragment key={keysForFeatures[index]}>
                    <tr>
                        <th scope="row" rowSpan={amountOfDifferentTasks[0]}> {feature.title}</th>
                        {tableRows[0]}
                    </tr>
                    (  {(tableRows.length > 1) ? (tableRows.map((tableRow, rowIndex) => {
                        if (rowIndex > 0) {
                            return (<tr>
                                {tableRow}
                            </tr>);
                        }
                    })) : (<></>)})
                </Fragment>)] : [...featureRows, (<Fragment key={keysForFeatures[index]}>
                    <tr>
                        <th scope="col" rowSpan={amountOfDifferentTasks[0]}> {feature.title}</th>
                        {tableRows[0]}
                    </tr>
                    {(tableRows.length > 1) ? (tableRows.map((tableRow, rowIndex) => {
                        if (rowIndex > 0) {
                            return (<tr key={keysForTableRows[rowIndex]}>
                                {tableRow}
                            </tr>);
                        }
                    })) : (<></>)}
                </Fragment>)];

            }

        }
        );

        return (
            <details style={{ border: `medium solid ${appThemeContext.tertiaryContentColor} ` }}>
                <summary> {"Project schedule : "}</summary>
                <Background cssClassName="project-schedule-container">




                    <table bgcolor={`${appThemeContext.tertiaryContentColor}`} border={`medium double ${appThemeContext.primaryBackgroundColor}`}>

                        <thead>

                            <tr>
                                <th scope="col">{"Feature :"}</th>
                                <th scope="col">{"Pending tasks :"}</th>
                                <th scope="col">{"Active tasks :"}</th>
                                <th scope="col">{"Completed tasks :"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {featureRows}
                        </tbody>
                    </table>
                    <details>
                        <summary>{"Assigned developers to project :"}</summary>
                        <ul>
                            {assignedDevList}
                        </ul>
                    </details>

                </Background>
            </details>
        );

    }
}

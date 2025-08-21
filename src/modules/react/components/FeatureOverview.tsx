import { ReactNode, useContext } from "react";
import { themeContext } from "../context/ThemeContext";
import { Background } from "./background";
import { FeatureTableRows } from "./FeatureTableRows";
import { FeatureOverviewProps, getKeysForList } from "./ProjectsTab";

export function FeatureOverview({ handleStatusChange, features }: FeatureOverviewProps): ReactNode {





    if (features === null) {

        return <></>;
    }
    else {



        const keysForFeatures = getKeysForList(features);
        let assignedDevList: ReactNode = (<></>);
        const appThemeContext = useContext(themeContext);
        let tableRows = (<></>);
        return features.map((feature, index) => {

            if (feature.developmentTasks !== null) {

                let assignedFeatureDevelopers = feature.assignedDevelopers;
                if (assignedFeatureDevelopers !== null) {
                    const keys = getKeysForList(assignedFeatureDevelopers);
                    assignedDevList = assignedFeatureDevelopers?.map((dev, index) => {
                        const devTypeElement = (dev.developerType[0] !== "") ? `(${dev.developerType})` : "";
                        return (
                            <li key={keys[index]}>{dev.username} {devTypeElement}</li>
                        );
                    });
                }


            }



            return (
                <details key={keysForFeatures[index]} style={{ border: `medium solid ${appThemeContext.tertiaryContentColor} ` }}>
                    <summary> {"Feature overview : "}</summary>
                    <Background cssClassName="feature-overview">
                        <h3> {`${feature.title} ${feature.type ? `(${feature.type})` : ""}`} </h3>
                        <textarea defaultValue={feature.description} />


                        <details>
                            <summary>{"Task-schedule : "}</summary>
                            <table>

                                <thead>
                                    <tr>
                                        <th scope="col">{"Pending tasks :"}</th>
                                        <th scope="col">{"Active tasks :"}</th>
                                        <th scope="col">{"Completed tasks :"}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <FeatureTableRows feature={feature} featureIndex={index} handleStatusChange={handleStatusChange}></FeatureTableRows>
                                </tbody>
                            </table>
                        </details>
                        <details>
                            <summary>{"Assigned developers :"}</summary>
                            <ul>
                                {assignedDevList}
                            </ul>


                        </details>
                    </Background>
                </details>
            );
        }
        );
    }
}

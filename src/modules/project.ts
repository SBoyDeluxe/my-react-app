import { features } from "process";
import { Feature } from "./feature";
import { Client, Developer, Manager } from "./User";
import { TimeConstraints } from "./Timeconstraints";
import { CryptoUtilObject } from "./Cryptography_Util";

export class ProjectKeyObject {

    /** 
     * The key used to encrypt and decrypt project data, is an AES-GCM key.
     * Given to all members upon creation via inbox
     * @memberof ProjectKeyObject
     * @memberof Project
     */
    projectKey: JsonWebKey;

    /** 
     * The index of the project : Should be generated using {@linkcode Crypto.randomUUID}
     * @memberof ProjectKeyObject
     * @memberof Project
     */
    projectIndex: string;

    constructor(key: JsonWebKey, projectIndex: string) {

        this.projectKey = key;
        this.projectIndex = projectIndex;
    }
}

export class Project {
    /**
     * Title of the project
     * @memberof Project
     */
    title: string;

    /** 
    * The key-object containing 
    *       - The index of the project, a randomUUID
    *       - The encryption/decryption key of the project (AES-GCM), sent to the participants on creation
    *
    */
    projectKeyObject!: ProjectKeyObject;
    // A project is initiated by Manager at the behest of some programatically real Client (Say a client contacting
    // a consultant-firm about making a webpage, where some Manager at the firm instantiates the project and assigns developers from
    // the firm to the project, with a specification from the client and feature-wishes from the client).
    // It could also be a programtically imaginary one (In the context of a classroom it could be
    // a student starting a homework assignment at the behest of a teacher -> The teacher probably wouldn´t wish to observe the assignments progress with a login in that case but is probably pleased knowing if its done or not)

    /**The managers sets the time-constraints, writes and updates the project/feature-descriptions,
     *  and handles the assignment of the development team according to internal specs (for example we might have a front end team manager, backend team manager)
     * 
     * @memberof Project
     */
    managerTeam: Manager[];
    /**The clients should be given access to see the progress of the development of their project/features 
     * -> Given read-priviliege for the project data.
     * 
     *
     * @memberof Project
     * 
     */
    clients: Client[] | null;
    /**The features wished for in the project
     * @memberof Project
     */
    features: Feature[];
    /**The team at hand for developing the features in the project
     * @memberof Project
     */
    developerTeam: Developer[];
    /**The different competences in the developer team -> For example, "back-end", "full-stack", "artist". "P.R" etc.
     * Example developerTeam[0] would have the type(s) developerTeamTypes[0]
     * 
     * @memberof Project
     */
    developerTeamTypes: String[][];
    /**The featureTypes in the project, Ex: ["Marketing", "Front-end"...]
     * @memberof Project
     */
    featureTypes!: string[];

    /**A description of the overall project, for example, make a scheduling web-app for a warehouse company, with specific features 
     * that the client specifies and that then gets delegated to the developer team
     * @memberof Project
     */
    private _description!: string;
    public get description(): string {
        return this._description;
    }
    public set description(value: string) {
        this._description = value;
    }
    /**The proposed timewindow for the project : Where all of the feature and task-timeconstraints take place
     * 
     * @memberof Project
     */
    timeconstraints: TimeConstraints;

    hash : string|null = null;


    //End of property list




    constructor(
        title: string,
      
        managerTeam: Manager[],
        /**The clients should be given access to see the progress of the development of their project/features 
         * -> Given read-priviliege for the project data.
         * 
         *
         * 
         * 
         */
        clients: Client[] | null,
        /**The features wished for in the project
         * 
         */
        features: Feature[]|null,
        /**The team at hand for developing the features in the project
         * 
         */
        developerTeam: Developer[],


        /**A description of the overall project, for example, make a scheduling web-app for a warehouse company, with specific features 
         * that the client specifies and that then gets delegated to the developer team
         * 
         */
        description: string,

        timeConstraints: TimeConstraints,
    ) {

       const projectIndex = window.crypto.randomUUID();

       const projectCryptoKeyPromise =  CryptoUtilObject.generateAESGCMProjectKey().then((projectKey)=>{

                /** 
        * The key-object containing 
        *       - The index of the project, a randomUUID
        *       - The encryption/decryption key of the project (AES-GCM), sent to the participants on creation
        *
        */
        this.projectKeyObject = {
                projectIndex : projectIndex,
                projectKey : projectKey
        }
       });

      

        this.managerTeam = managerTeam;
        /**The clients should be given access to see the progress of the development of their project/features 
         * -> Given read-priviliege for the project data.
         * 
         *
         * 
         * 
         */
        this.clients = clients;
        /**The features wished for in the project
         * 
         */
        this.features = features;
        this.featureTypes = features.map((feature) => feature.type);
        /**The team at hand for developing the features in the project
         * 
         */
        this.developerTeam = developerTeam;


        /**A description of the overall project, for example, make a scheduling web-app for a warehouse company, with specific features 
         * that the client specifies and that then gets delegated to the developer team
         * 
         */
        this.description = description;
        /**The proposed timewindow for the pthis.roject  Where all of the feature and task-timeconstraints take place
         * 
         */
        this.timeconstraints = timeConstraints;

        this.developerTeamTypes = this.developerTeam.map((dev) => dev.developerType);
      

        this.title = title;

        //We produce a hash on creation of everything but the ProjectKeyObject

         CryptoUtilObject.createHash(JSON.stringify(this as Exclude<Project, (ProjectKeyObject | ArrayBuffer)>)).then((hash)=>this.hash = hash );






    }
    /**Returns the totalprogress of all features, or a specific feature type
     * @param {Feature[]|null} specificFeatures : Gets the total progress of some specific feature(s) 
     * @param {this.featureTypes[]|null } type : One of the feature type if wanting to filter progress on different parts of the project, if null gives totalprogress
     */
    getProgress(specificFeatures: Feature[] | null, type: string[] | null): number {
        let fractionSum = 0;
        let numberOfFeatures = this.features.length;
        if (type != null) {

            let typeFilteredFeatures = this.features.filter((feature) => type.includes(feature.type));
            numberOfFeatures = typeFilteredFeatures.length;
            fractionSum = 0;
            for (const feature of typeFilteredFeatures) {

                fractionSum += feature.getProgress();


            }





        }
        if (specificFeatures != null) {

            let filteredFeatures = this.features.filter((feature) => specificFeatures.includes(feature));
            numberOfFeatures = filteredFeatures.length;
            fractionSum = 0;
            for (const feature of filteredFeatures) {

                fractionSum += feature.getProgress();


            }





        }
        /*if type == null we just want to know the total progress for all of the features */
        else {
            for (const feature of this.features) {

                fractionSum += feature.getProgress();


            }

        }

        return fractionSum / numberOfFeatures;

    }

    public addFeature(feature:Feature){
        if(!this.features){
        this.features = [feature];
        this.featureTypes = [feature.type];
            
    }
    else{
        this.features.concat(feature);
        this.featureTypes.concat(feature.type);
    }
    }



}
import { Project } from "./project";
import { Task } from "./Task";
import { Developer } from "./User";
import { TimeConstraints } from "./Timeconstraints";

/**In the context of a sprint a feature is something to be developed for the end user in a certain period of time,
 * a feature consists of tasks to be completed to make this feature a reality 
 * 
 */
export class Feature{
    /**
     * The title of the feature
     */
    title : string;

    /** The type of feature to be developed for the product
     * 
     */
    type:string;
    /** Represents the time constraints of the feature (start/end/completiondate)
     * 
     */
    timeconstraints: TimeConstraints;
    /**The tasks the developers assigned to the feature need to complete
     * to accomplish the feature
     */
    developmentTasks:Task[]|undefined;
    /**A description of the feature (feature specification)
     * 
     */
    description:string;
 
    /**The developers assigned to the feature
     * 
     */
    assignedDevelopers: Developer[]|null;

    constructor(title:string,type:string, description:string,timeconstraints: TimeConstraints, developmentTasks:Task[], assignedDevelopers : Developer[]|null ){
            this.title = title;
            this.type = type; 
            this.description = description;         
            this.timeconstraints = timeconstraints;
            this.developmentTasks = developmentTasks;
            this.assignedDevelopers = assignedDevelopers;
            
    }
    /**Adds new development tasks in the development of the feature
     * 
     * @param tasksToAdd 
     */
    public addDevelopmentTasks(tasksToAdd:Task[]){

    if((this.developmentTasks === undefined) ||(this.developmentTasks=== null)){

        this.developmentTasks = tasksToAdd;

    }
    else{
        const concatedArray  = this.developmentTasks.concat(tasksToAdd);
        this.developmentTasks = concatedArray;
        console.log(this.developmentTasks);
    }

    }
    /**Removes the development task from the feature development plan
     * 
     * @param tasksToRemove 
     */
    public removeDevelopmentTasks(tasksToRemove:Task[]){
       this.developmentTasks = this.developmentTasks.filter((task) => !tasksToRemove.includes(task));

    }
    /**Sets the completion time to current time
     * 
     */
    public completeFeature(){

        this.timeconstraints.completeConstraint();
    }
    /**Updates the description of the feature
     * 
     * @param newDescription 
     * @param tasksToAdd : Any new development tasks included with the new description of the feature 
     * @param tasksToRemove : Any tasks to be removed as a result of the new feature description
     */
    public updateDescription(newDescription:string, tasksToAdd:Task[]|null, tasksToRemove:Task[]|null ){
        this.description = newDescription;
        if(tasksToAdd){
            this.addDevelopmentTasks(tasksToAdd);
        }
        if(tasksToRemove){

            this.removeDevelopmentTasks(tasksToRemove);
        }

    }
    /**Asssigns developers to the development of the feature, and a specific development task within the feature if 
     * one is specified. If the taskToBeAssigned is null, we just assign them to the team buildiing the feature
     * 
     * @param {Developer[]} developersToAssign 
     * @param {Task|null} taskToAssignDevelopers 
     * 
     */
    public assignDevelopers(developersToAssign:Developer[], taskToAssignDevelopers: Task|null){

        if(taskToAssignDevelopers !== null){
            //Assigns the team of developers to the task, the task can be instantiated with or without taskGoals that that you assign developers to
            taskToAssignDevelopers.assignDevelopers(developersToAssign, null);
            
        }
        else{
            /*Gets all developers not already included in building the feature and concatenates them to the assignedDevelopers-Array */
            developersToAssign.filter((devToAssign)=>! (this.assignedDevelopers.includes(devToAssign)) ).map((newDev)=>this.assignedDevelopers.concat(newDev));

        }

            
    }
    /**Returns the fraction of completed development-tasks that are completed
     * @returns {number} 0<=returnFraction<=1
     * 
     */
    public getProgress():number{

         /*If there´s no sub goals in the specific task we count it as one task -> For example, if one task was `add button to login` and it
         wasn´t further specified it would be 0% completed until the entire task was completed -> When the button was added it would be 100% completed.
         This could in turn be one of the taskGoals of make login screen, which then would be (1/<numberOfTaskGoals> *100) % done*/
        let totalFeatureDevelopmentTasks = this.developmentTasks.length;

        let completedDevelopmentTaskFractionSum = 0;
       
        /*we loop through these and see how many are done before returning the fraction*/
            // get total number of developmentTaks
            for (const developmentTask of this.developmentTasks) {
                //If all are 0 %-> 100 % complete <=> 1*totalAmountOfDevelopmentTasks <=> sumOfFractions = (0->1) * numberOfDevlopmentTasks
                completedDevelopmentTaskFractionSum += (developmentTask.getProgress());

            }
            /*Once the loop has ran we can return the fraction */


        

        return completedDevelopmentTaskFractionSum / totalFeatureDevelopmentTasks;
    }
    /**Returns all tasks with a current task status of active
     * 
     * @returns activeDevelopmentTasks 
     * 
     */
    getActiveDevelopmentTasks():Task[]{

        let returnArray = this.developmentTasks.filter((devTask)=>devTask.currentTaskStatus==="Active");
         
        return returnArray;

    }

    getPendingDevelopmentTasks():Task[]{

        let returnArray = this.developmentTasks.filter((devTask)=>devTask.currentTaskStatus=== "Pending");
         
        return returnArray;


    }








}
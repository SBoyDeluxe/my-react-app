import { TimeConstraints } from "./Timeconstraints";
import { Developer } from "./User";
/**A task is a sub-part goal of a feature, such as `make ui`. The make ui-task might look like:
 * Task(type="Front end", new TimeConstraints(( Date.now(), (Date.now().+ 5*24*60*60) ), frontEndDeveloperTeam, makeLoginScreenAndInputScreen, null ))
 * 
 * -> Make a task of type front end, with the start date of today (sprint start) and a end date in 5 days, with the frontEndDeveloperTeam assigned to the task,
 * with the task goals of make a login screen and input screen for some application(project) and a currentTaskState of pending.
 * 
 * One could arbitrarily then assign developers from the team or other teams to the task itself or it subgoals ; Say, assigning a developer of type "Design" to create color-theme or 
 * animations, a taskGoal within the login screen and input screen respectively. The design developer might then add any number of taskGoals within their task
 */
export class Task {
    /** The type of feature to be developed for the product
     * 
     */
    type: string;
    /** Represents the time constraints of the feature (start/end/completiondate)
     * 
     */
    timeconstraints: TimeConstraints;

    static taskStatus = {
        /**Means that the task is ongoing
         * 
         */
        active: "Active",
        /**Means the task is not currently worked on and is not finished
         * 
         */
        pending: "Pending",
        /**The task is completed
         * 
         */
        completed: "Completed"

    }
    /**Represents the status of the given task
     * @property {Task.taskStatus.active |Task.taskStatus.pending|Task.taskStatus.completed}
     */
    currentTaskStatus: "Active"|"Pending"|"Completed";
    /**The overall specification of the task
     * 
     */
    description: string;

    assignedDevelopers: Developer[] | null;
    /**The goals concerned with the task, all the sub points to be completed -> The progress is given by ;
     * goalsWithStatusCompleted/goals.length
     * 
     * if no goals are given the progress is only given by the status, changing to 100% on completion
     * 
     */
    taskGoals: Task[] | null;

    constructor(type: string,
        description: string,
        timeconstraints: TimeConstraints,
        assignedDevelopers: Developer[] | null,

        taskGoals: Task[] | null,
        currentTaskStatus: "Active"|"Pending"|"Completed"



    ) {

        this.type = type;
        this.description = description;
        this.timeconstraints = timeconstraints;
        if (assignedDevelopers) {
            this.assignedDevelopers = assignedDevelopers;
        }
        else {
            this.assignedDevelopers = null;
        }
        if (taskGoals) {
            this.taskGoals = taskGoals;
        }
        else {
            this.taskGoals = null;
        }
            this.currentTaskStatus = currentTaskStatus;
        
       

    }

    /**Adds new development goals in the development of the task
    * 
    * @param taskGoalsToAdd : The taskgoals to add to the task 
    */
    public addTaskGoals(goalsToAdd: Task[]) {
        if (this.taskGoals != null) {
            this.taskGoals = this.taskGoals.concat(goalsToAdd);
        }
        else {
            this.taskGoals = goalsToAdd;
        }
    }
    /**Removes the development goal from the task 
     * 
     * @param tasksToRemove 
     */
    public removeTaskGoals(goalsToRemove: Task[]) {
        if (this.taskGoals != null) {
            this.taskGoals = this.taskGoals.filter((goal) => !goalsToRemove.includes(goal));
        } else {
            return
        }
    }
    /**Sets the completion time to current time
     * 
     */
    public completeTask() {

        this.timeconstraints.completeConstraint();
        this.currentTaskStatus ="Completed";
    }

    public updateTimeConstraints(startDate: Date | null, endDate: Date | null) {
        if (startDate != null) { this.timeconstraints.startdate = startDate; }
        if (endDate != null) { this.timeconstraints.enddate = endDate; }

    }
    /**Updates the description of the feature
     * 
     * @param newDescription 
     * @param goalsToAdd : Any new development goals included with the new description of the feature 
     * @param goalsToRemove : Any goals to be removed as a result of the new feature description
     */
    public updateDescription(newDescription: string, goalsToAdd: Task[] | null, goalsToRemove: Task[] | null) {
        this.description = newDescription;
        if (goalsToAdd) {
            this.addTaskGoals(goalsToAdd);
        }
        if (goalsToRemove) {

            this.removeTaskGoals(goalsToRemove);
        }

    }
    /**Asssigns developers to the development of the feature, and a specific development goal within the task
     * 
     * 
     * @param {Developer[]} developersToAssign 
     * @param {Task|null} goalToAssignDevelopers 
     * 
     */
    public assignDevelopers(developersToAssign: Developer[], goalToAssignDevelopers: Task | null) {
        //We check if the assigned developers contain any of the developers to assign if goalToAssignDevelopers == null 
        // => We should only assign  developers to the task and must check for doubles
        if (goalToAssignDevelopers === null) {
            developersToAssign.filter((developerToAssign) => !(this.assignedDevelopers?.includes(developerToAssign))).map((newDev) => this.assignedDevelopers?.push(newDev));
        }
        else {
            if (this.taskGoals?.includes(goalToAssignDevelopers)) {
                this.taskGoals.filter((goal) => goal == goalToAssignDevelopers).map((taskGoalToBeAssigned) => taskGoalToBeAssigned.assignDevelopers(developersToAssign, null));
            }
            else {
                goalToAssignDevelopers.assignDevelopers(developersToAssign, null);
                this.addTaskGoals([goalToAssignDevelopers]);

            }
        }

    }
    /**Gets the fraction of completion for the task (0->1 Ex: Half of the task is done => 0.5)
     * 
     * @returns {number} fractionOfCompletion
     * 
     */
    public getProgress() : number {



        /*If there´s no sub goals in the specific task we count it as one task -> For example, if one task was `add button to login` and it
         wasn´t further specified it would be 0% completed until the entire task was completed -> When the button was added it would be 100% completed.
         This could in turn be one of the taskGoals of make login screen, which then would be (1/<numberOfTaskGoals> *100) % done*/
        let totalTaskGoals = 1;

        let completedTaskGoals = 0;
        if (this.currentTaskStatus == Task.taskStatus.completed) {

            completedTaskGoals = 1;

        }
        /*If we have taskGoals, we loop through these and see how many are done before returning the fraction*/
        if (this.taskGoals != null) {
            // get total number of task goals
            totalTaskGoals = this.taskGoals.length;
            let completedTaskGoals = 0;
            for (const taskGoal of this.taskGoals) {
                if (taskGoal.currentTaskStatus == Task.taskStatus.completed) {
                    completedTaskGoals++;
                }

            }
            /*Once the loop has ran we can return the fraction */


        }

        return completedTaskGoals / totalTaskGoals;
    }

}


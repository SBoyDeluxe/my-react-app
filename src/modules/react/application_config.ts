

export  class ApplicationConfiguration{
      static readonly title: string = "Scrumboard 3000";
       

      /**
       * Can be incremented for each list-element needing a specific key
       */
      private static keyCounter : number = Number.MIN_SAFE_INTEGER;
      /**
       * 
       * @returns {number} A counter variable that increments on each get, 
       */
      public static getKey(){

            return window.crypto.randomUUID();
      }
      
     


}
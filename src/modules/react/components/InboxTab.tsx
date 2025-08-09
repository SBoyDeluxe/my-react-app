import { useMemo } from "react";
import { MailBox } from "../../mailbox";

export type InboxTabProps = {
    /**
     * The mailbox whose contents are supposed to be displayed
     */
    mailBoxContents : string[],


}

/**
 * Generates the contents of a users inbox
 */
export function InboxTab({mailBoxContents}:InboxTabProps){
    const nodeKeys = useMemo(()=>{
           const keys : React.Key[] = mailBoxContents.map((val)=>{
                        return ( window.crypto.randomUUID().toString(),
                         window.crypto.randomUUID().toString())});
             const divKey : React.Key = window.crypto.randomUUID();             
               return ({ keys:keys,
                        ulKey : divKey
                });
               
    },[mailBoxContents.length]);

 const contents : React.ReactNode =   mailBoxContents.map((mail, index)=>{
        
         return  ( <li key={nodeKeys.keys[index]}><p key={nodeKeys.keys[nodeKeys.keys.length - index]}>{mail}</p> </li>)

    });
    return(
        <ul key={nodeKeys.ulKey}>
            {contents}
        </ul>
    )


}
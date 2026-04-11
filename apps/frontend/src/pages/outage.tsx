import {type ReactElement} from 'react';

interface OutageProps {
    contact?: string;
}


/**
 * Page that shows when the website fails to reach the backend
 * @param props (optional) Contact information to reach out to when the website is down
 * @constructor
 */
function OutagePage(props: OutageProps): ReactElement {
    return (
        <>
            <div style={{textAlign: "center"}}>
                <h1>Website Down</h1>
                <p>BRB {props.contact}</p>
            </div>
        </>
    )
}

export default OutagePage;
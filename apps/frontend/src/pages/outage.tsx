import {type ReactElement} from 'react';

interface OutageProps {
    contact?: string;
}

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
import React from 'react';
import {useCallback} from "react";
import Image from 'next/image';
import {Handle, Position} from "react-flow-renderer";

const TechStackImageWidth = 30;
const TechStackImageHeight = 30;

function Index(props) {
    // onChange will be written in callback hocks
    // onChange related to outsider onChange function pass from props.data
    const onClickHandler = useCallback((event)=>{
        props.data.onClick(props.data.value)
    },[props])

    return (
        <div className="text-updater-node" onClick={onClickHandler}>
            <Handle type="target" position={Position.Left}/>
            <div>
                {/*<label htmlFor="text">{props.data.value}</label>*/}
                <Image src={"/techStackImage/"+props.data.value+".png"} width={TechStackImageWidth} height={TechStackImageHeight}/>
            </div>
            <Handle type="source" position={Position.Right}/>
        </div>
    );
}

export default Index;
import React from 'react';
import Image from 'next/image';
const Index = (props) => {
    return (
        <div>
            <Image src={"/Profile.jpg"}//Note that default folder is public
                   height={props.height} width={props.width}//3:4 ratio
            />
        </div>
    );
};

export default Index;
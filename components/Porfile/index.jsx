import React from 'react';
import Image from 'next/image';
const Index = () => {
    return (
        <div>
            <Image src={"/Profile.jpg"}//Note that default folder is public
                   height={144} width={108}//3:4 ratio
            />
        </div>
    );
};

export default Index;
import React from 'react';
import Head from "next/head";
import Profile from '../Porfile';
import Link from "next/link";
const Index = ({children, home}) => {
    return (
        <div>
            <Head>
                {/*<link rel="icon" href="/favicon.ico"/>*/}
                <meta
                    name = "Yuxuan Yang blog"
                    content="Blogs about algorithm, web, and software design"
                />
                <title>Yuxuan's Blog</title>
            </Head>
            <header>
                <>
                    {
                        home?(
                            <>
                                <Profile/>
                                <h1>Yuxuan Yang</h1>
                            </>
                        ):
                            (
                            <>
                                <Link href="/">Back to Home</Link>
                            </>
                            )
                    }
                </>
            </header>
            {children}
        </div>
    );
};

export default Index;
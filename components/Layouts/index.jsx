import React from 'react';
import Head from "next/head";
import Profile from '../Porfile';
import Link from "next/link";
import styled from "styled-components";

const LayoutContainer = styled.div`
  height: 100%;
`

const BackToBlog = styled.div`
  position: sticky;
  position: -webkit-sticky;
  float: top;
  
  width: 100%;
  background-color: #00BB33;
  
`
const Index = ({children, home}) => {
    return (
        <LayoutContainer>
            <Head>
                {/*<link rel="icon" href="/favicon.ico"/>*/}
                <meta
                    name="Yuxuan Yang blog"
                    content="Blogs about algorithm, web, and software design"
                />
                <title>Yuxuan Blog</title>
            </Head>
            <header>
                <>
                    {
                        home ? (
                                <>
                                    <Profile height={144} width={108}/>
                                    <h1>Yuxuan Yang</h1>
                                </>
                            ) :
                            (
                                <BackToBlog>
                                    <Link href="/blog">Back to Home</Link>
                                </BackToBlog>
                            )
                    }
                </>
            </header>
            {children}
        </LayoutContainer>
    );
};

export default Index;
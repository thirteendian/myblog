import React from 'react';
import Head from "next/head";
import Profile from '../Porfile';
import Link from "next/link";
import styled from "styled-components";
import Image from "next/image";

const LayoutContainer = styled.div`
  height: 100%;
`

const NavigationBar = styled.div`
  margin: auto;
  padding-left: 10px;
  position: sticky;
  position: -webkit-sticky;
  float: top;
  background-color: grey;
  width: 100%;
  display: flex;
`

const NavigationProfile = styled.div`
  float: left;
  border-radius: 15px;
  overflow: hidden;
  width: 40px;
  height: 40px;
`

const NavigationBack = styled.nav`
  display: flex;
  justify-content: space-between;
  a {
    background-color: #353637;
    color: #fff;
    padding: 0.5rem;
    text-decoration: none;
  }
  a:hover{
    background-color: #999999;
    color: firebrick;
  }
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
                                <NavigationBar>
                                    <NavigationProfile>
                                        <Image src="/Profile_blog.png" width="40px" height="40px"
                                               objectFit="cover"/>
                                    </NavigationProfile>
                                    <NavigationBack>
                                        <Link href="/blog"><a>Back to Home</a></Link>
                                    </NavigationBack>


                                </NavigationBar>
                            )
                    }
                </>
            </header>
            {children}
        </LayoutContainer>
    );
};

export default Index;
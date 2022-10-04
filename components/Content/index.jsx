import React from 'react';
import styled from "styled-components";
import {MDXRemote} from "next-mdx-remote";
import Image from "next/image";
import Intro from "../ContentIntroduction";
const components = {Image,Intro}

const ContentContainer = styled.div`
  height: 100%;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  @media (min-width: 1220px) {
    padding-right: 10%;
    width: 1050px;
  }
`

const MarkDownHtmlColumn = styled.div`
  height: 100%;
  width: 100%;
  background-color: white;
  border-radius: 15pt;
`

const MarkDownHtmlContent = styled.div`
  display: block;
  bottom: 20px;
  padding-top: 2em;
  padding-bottom: 2em;
  position: relative;
  overflow: visible;
  margin-left: 4%;
  margin-right: 4%;
  margin-bottom: 4%;
`


function Index(props) {
    return (
        <div style={{fontVariantLigatures:props.style}}>
            <ContentContainer>
                <MarkDownHtmlColumn onClick={props.onClick}>
                    <MarkDownHtmlContent>
                        <MDXRemote {...props.content} components={components}/>
                    </MarkDownHtmlContent>
                    {/*<MarkDownHtmlContent dangerouslySetInnerHTML={{__html: postData.contentHtml}}/>*/}
                </MarkDownHtmlColumn>
            </ContentContainer>
        </div>

    );
}

export default Index;
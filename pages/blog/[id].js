import Layout from '../../components/Layouts';
import {getAllPostIds, getPostData} from '../../lib/posts';
import ReactFlow, {Background, MiniMap} from "react-flow-renderer";
import {useState, useCallback, useMemo, Fragment} from "react";
import Image from "next/image"
import TechStackFlowNode from "../../components/TechStackFlowNode";
import styled from "styled-components";
import TableOfContent from "../../components/ContentTableOfContent";
import useHeadingsData from "../../components/useHeadingsData";
import Link from "next/link";
import TitleColumn from "../../components/TitleColumn";
import Content from "../../components/Content";
import ContentMenu from "../../components/ContentMenu";

const components = {Image}

export async function getStaticPaths() {
    const paths = getAllPostIds();
    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({params}) {
    const postData = await getPostData(params.id);
    return {
        props: {
            postData,
        },
    };
}


const divContainer = styled.div`
  height: 100%;
`

const ContentAndTableOfContentContainer = styled.div`
  width: 100%;
  @media (min-width: 1220px) {
    width: 1460px;
    padding-right: 20%;
    margin-right: auto;
    margin-left: auto;
  }
`


const TableOfContentButton = styled.button`
  z-index: 1;
  position: sticky;
  position: -webkit-sticky; /* For Safari */
  top: 5px; /* How far down the page you want your ToC to live, this is trigger*/

  float: right;
  height: 30px;
  border-radius: 15px;
  background-color: darkred;
  color: white;
  font-size: 16px;
  display: none;
  @media (max-width: 1220px) {
    display: block;
  }
  //cursor:pointer;
  &:hover {
    background-color: firebrick;
  }

  @media (pointer: none), (pointer: coarse) {
    float: left;
  }
`

const BacktoHomeButton = styled.button`
  z-index: 1;
  margin-right: 0;
  position: sticky;
  position: -webkit-sticky; /* For Safari */
  top: 45px;
  float: left;
  height: 30px;

  border-radius: 15px;
  background-color: darkred;


  color: white;
  font-size: 16px;
  display: block;

  &:hover {
    background-color: firebrick;
  }

  @media (pointer: none), (pointer: coarse) {
    float: right;
  }
`

export default function Post({postData}) {
    const [tocActive, setTocActive] = useState(false);
    const [styleSubmenuActive,setStyleSubmenuActive] = useState(false);
    const [contextual,setContextual] = useState(false)
    return (
        <div>
            <Layout>
                <ContentAndTableOfContentContainer>
                    <ContentMenu
                        tocOnClick={() => {setTocActive(!tocActive)}}
                        styleSubmenuActive={styleSubmenuActive}
                        styleOnClick={()=>{setStyleSubmenuActive(!styleSubmenuActive)}}
                        contextualOnClick={()=>{setContextual(!contextual)}}
                    />
                    <TableOfContent active={tocActive}/>
                    <TitleColumn style={contextual?"contextual":"no-contextual"} title={postData.title} subtitle={postData.subtitle} date={postData.date}/>
                    <Content style={contextual?"contextual":"no-contextual"} onClick={() => {
                        setTocActive(false);
                        setStyleSubmenuActive(false);
                    }} content={postData.contentHtml}/>

                </ContentAndTableOfContentContainer>
            </Layout>
        </div>
    );
}
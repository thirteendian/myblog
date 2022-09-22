import React, {useCallback, useMemo, useState} from 'react';
import ReactFlow, {Background, MiniMap} from "react-flow-renderer";
import TechStackFlowNode from "../components/TechStackFlowNode";
import styled from "styled-components";
import {getSortedPostsData} from '../lib/posts';
import Link from "next/link";
import {nanoid} from "nanoid";
import Image from "next/image";
//Settings for CSS
const InsideBoarder = styled.section`
  margin-left: auto;
  margin-right: auto;
  position: relative;
  background-color: white;
  width: calc(100% - 100pt);
`;

const StackFlowContainer = styled.div`
  width: 100%;
  height: 200px;
  margin-left: auto;
  margin-right: auto;
  @media (pointer: none), (pointer: coarse) {
    height: 300px;

  }
`

const SectionContainer = styled.div`
  width: 100%;
  @media (min-width: 1220px) {
    width: 1220px;
    //padding-right: 20%;
    margin-right: auto;
    margin-left: auto;
  }
`
const LeftSection = styled.section`
  float: left;
  position: relative;
  width: 20%;
  height: 300pt;
  background-color: white;
  border-radius: 15px;
  @media (pointer: none), (pointer: coarse) {
    display: none;
  }
  //@media (min-width: 1220px) {
  //  width: 241px;
  //}
`;

const RightSection = styled.section`
  float: right;
  position: relative;
  background-color: black;
  width: 80%;
  @media (pointer: none), (pointer: coarse) {
    width: 150%;
  }
  //@media (min-width: 1220px) {
  //  width: 976px;
  //}
`;


const ListPost = styled.li`
  list-style-position: inside;
  //background-color: white;
  border: 4px solid black;
  border-radius: 15px;
  background-color: darkred;
  padding-left: 2em;
  overflow: visible;

  &:hover {
    background-color: firebrick;
    color: white;
    text-decoration: none;
  }
`

const PostTitle = styled.div`
  font-size: x-large;
  display: flex;
  justify-content: space-between;

  a {
    color: white;
    text-decoration: none;
  }
`

const TitleDate = styled.div`
  background-color: white;
  color: darkred;
  width: 14ex;
  overflow: auto;
  //width: 14ex;
  padding-left: 2ex;
  border-radius: 10px;
`

export async function getStaticProps({params}) {
    // Fetch necessary data for the blog post using params.id
    const allPostsData = getSortedPostsData();
    return {
        props: {
            allPostsData,
        },
    };
}
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

// const NavigationBack = styled.nav`
//   display: flex;
//   justify-content: space-between;
//   a {
//     background-color: #353637;
//     color: #fff;
//     padding: 0.5rem;
//     text-decoration: none;
//   }
//   a:hover{
//     background-color: #999999;
//     color: firebrick;
//   }
// `

const NavigationLabel = styled.label`
  background-color: #8c9898;
  margin-top: auto;
  margin-bottom: auto;
  height: 100%;
`
function Blog(props) {
    //Settings for StackFlow
    const onClickNodeHandler = (nodeName) => {
        setCurrLabel(nodeName)
    }
    const initialNodes = [
        {
            id: 'all',
            type: 'techStackFlowNode',
            data: {
                value: 'all',
                onClick: onClickNodeHandler,
            },
            position: {x: -100, y: 0}
        },
        {
            id: 'blog',
            type: 'techStackFlowNode',
            data: {
                value: 'blog',
                onClick: onClickNodeHandler,
            },
            position: {x: 0, y: -100},
        },

        {
            id: 'js',
            type: 'techStackFlowNode',
            data: {
                value: 'js',
                onClick: onClickNodeHandler,
            },
            position: {x: 0, y: 0},
        },

        {
            id: 'react',
            type: 'techStackFlowNode',
            data: {
                value: 'react',
                onClick: onClickNodeHandler,
            },
            position: {x: 100, y: 0},
        },

        {
            id: 'next',
            type: 'techStackFlowNode',
            data: {
                value: 'next',
                onClick: onClickNodeHandler,
            },
            position: {x: 200, y: 0},
        },

        {
            id: nanoid(),
            type: 'techStackFlowNode',
            data: {
                value: 'cpp',
                onClick: onClickNodeHandler,
            },
            position: {x: 0, y: 100},
        },

        {
            id: nanoid(),
            type: 'techStackFlowNode',
            data: {
                value: 'emacs',
                onClick: onClickNodeHandler,
            },
            position: {x: 0, y: 200},

        },
    ];
    const initialEdges = [
        // {id: 'e1-2', source: '1', target: '3', animated: true},
        {id: `ejs-react`, source: 'js', target: 'react', animated: true},
        {id: `ereact-next`, source: 'react', target: 'next', animated: true}

    ];
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [currLabel, setCurrLabel] = useState("all")


    //Instead of define node in global domain, we defined it use hock under function
    //to prevent the Re-rendering
    const nodetypes = useMemo(() => ({techStackFlowNode: TechStackFlowNode}), [])
    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]
    );

    return (
        <div>
            <NavigationBar>
                <NavigationProfile>
                    <Image src="/Profile_blog.png" width="40px" height="40px"
                           objectFit="cover"/>
                </NavigationProfile>
                <NavigationLabel>
                    Yuxuan Yang's Blog
                </NavigationLabel>
            </NavigationBar>

            <div>
                <StackFlowContainer>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodetypes}
                        fitView>
                        <MiniMap className="reactFlowMiniMapStyle"/>
                        <Background/>
                    </ReactFlow>
                </StackFlowContainer>
                <InsideBoarder>
                    <SectionContainer>
                        <LeftSection>
                            <p> Current Lable : {currLabel}</p>
                        </LeftSection>

                        <RightSection>
                            <ul style={{listStyle: "none"}}>
                                {props.allPostsData
                                    .filter(
                                        (allPostsData) => {//Note here you may write label in form of "label/label/label"
                                            if (currLabel === "all") {
                                                return allPostsData
                                            } else return allPostsData.label.split("/").includes(currLabel)
                                        }
                                    )
                                    .map(
                                        ({id, date, title}) => (
                                            <ListPost key={id}>
                                                <div>
                                                    <Link href={`/blog/${encodeURIComponent(id)}`}>
                                                        <PostTitle>
                                                            <a>
                                                                {title}
                                                                <TitleDate>
                                                                    {date}
                                                                </TitleDate>

                                                            </a>
                                                        </PostTitle>
                                                    </Link>
                                                </div>
                                            </ListPost>
                                        )
                                    )}
                            </ul>
                        </RightSection>
                    </SectionContainer>
                </InsideBoarder>
            </div>
        </div>
    );
}

export default Blog;
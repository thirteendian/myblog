import React, {useCallback, useMemo, useState} from 'react';
import ReactFlow, {Background, MiniMap} from "react-flow-renderer";
import TechStackFlowNode from "../components/TechStackFlowNode";
import styled from "styled-components";
import {getSortedPostsData} from '../lib/posts';
import Link from "next/link";
import {nanoid} from "nanoid";
//Settings for CSS
const InsideBoarder = styled.section`
  margin-left: auto;
  margin-right: auto;
  position: relative;
  background-color: white;
  width: calc(100% - 100pt);
`;

const LeftSection = styled.section`
  float: left;
  position: relative;
  width: 38%;
  height: 300pt;
  background-color: white;
  border-radius: 15px;
`;

const RightSection = styled.section`
  float: right;
  position: relative;
  background-color: black;
  width: 62%;
`;


const ListPost = styled.li`
  list-style-position: inside;
  background-color: white;
  border: 4px solid black;
  border-radius: 15px;
`

const PostTitle = styled.div`
  height: 70px;
  font-size: large;
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

function Blog(props) {


    //Settings for StackFlow
    const onClickNodeHandler = (nodeName) => {
        setCurrLabel(nodeName)
    }
    const initialNodes = [

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
        {id:`ejs-react`,source:'js',target:'react',animated:true},
        {id:`ereact-next`,source:'react',target:'next',animated:true}

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
            <div>
                <div className="reactFlowChartStyle">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodetypes}
                        fitView>
                        <MiniMap/>
                        <Background/>
                    </ReactFlow>
                </div>

                <InsideBoarder>
                    <LeftSection>
                        <p> Current Lable : {currLabel}</p>
                    </LeftSection>

                    <RightSection>
                        <ul style={{listStyle: "none"}}>
                            {props.allPostsData
                                .filter(
                                    (allPostsData) => {//Note here you may write label in form of "label/label/label"
                                        return allPostsData.label.split("/").includes(currLabel);
                                    }
                                )
                                .map(
                                    ({id, date, title}) => (
                                        <ListPost key={id}>
                                            <div style={{marginLeft: 20}}>
                                                <Link href={`/blog/${encodeURIComponent(id)}`}>
                                                    <PostTitle>
                                                        {title}
                                                    </PostTitle>
                                                </Link>
                                                {date}
                                            </div>
                                        </ListPost>
                                    )
                                )}
                        </ul>
                    </RightSection>
                </InsideBoarder>
            </div>
        </div>
    );
}

export default Blog;
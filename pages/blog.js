import React, {useCallback, useMemo, useState} from 'react';
import ReactFlow, {Background, MiniMap} from "react-flow-renderer";
import TechStackFlowNode from "../components/TechStackFlowNode";
import styled from "styled-components";
import {getSortedPostsData} from '../lib/posts';
import Link from "next/link";

//Settings for CSS
const LeftSection = styled.section`
  float: left;
  width: 38%;
`;

const RightSection = styled.section`
  float: right;
  width: 62%;
`;



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
            id: '1',
            type: 'techStackFlowNode',
            data: {
                value: 'cpp',
                onClick: onClickNodeHandler,
            },
            position: {x: 250, y: 25},
        },

        {
            id: '3',
            type: 'techStackFlowNode',
            data: {
                value: 'emacs',
                onClick: onClickNodeHandler,
            },
            position: {x: 500, y: 25},

        },
    ];
    const initialEdges = [
        {id: 'e1-2', source: '1', target: '3', animated: true},
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

            <LeftSection>
                <p> Current Lable : {currLabel}</p>
            </LeftSection>

            <RightSection>
                <ul>
                    {props.allPostsData
                        .filter(
                            (allPostsData) => {//Note here you may write label in form of "label/label/label"
                                return allPostsData.label.split("/").includes(currLabel);
                            }
                        )
                        .map(
                            ({id, date, title}) => (
                                <li key={id}>
                                    <Link href={`/blog/${encodeURIComponent(id)}`}>
                                        {title}
                                    </Link>
                                </li>
                            )
                        )}
                </ul>
            </RightSection>
        </div>
    );
}

export default Blog;
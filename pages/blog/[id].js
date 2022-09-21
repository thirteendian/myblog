import Layout from '../../components/Layouts';
import {getAllPostIds, getPostData} from '../../lib/posts';
import ReactFlow, {Background, MiniMap} from "react-flow-renderer";
import {useState, useCallback, useMemo, Fragment} from "react";
import Image from "next/image"
import TechStackFlowNode from "../../components/TechStackFlowNode";
import styled from "styled-components";
import TableOfContent from "../../components/TableOfContent";


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


//
const divContainer = styled.div`
  height: 100%;
`

const ContentContainer = styled.div`
  //width: calc(100% - 100px);
  //height: 100%;
  //margin-left: auto;
  //margin-right: auto;
  //@media (min-width: 1080px) {
  //  width: 1080px;
  //  margin-left: auto;
  //  margin-right: auto;
  //}
`

const MarkDownHtmlColumn = styled.div`
  height: 100%;
  width: 100%;
  background-color: white;
  border-radius: 15pt;
  @media (min-width: 960px) {
    width: 960px;
    margin-left: auto;
    margin-right: auto;
  }
`

const MarkDownHtmlContent = styled.div`
  //top: 20px;
  bottom: 20px;
  padding-top: 2em;
  padding-bottom: 2em;
  position: relative;
  overflow: auto;
  margin-left: 4%;
  margin-right: 4%;
  margin-bottom: 4%;
`

const TableOfContentColumn = styled.div`
  position: sticky;
  position: -webkit-sticky; /* For Safari */
  top: 24px; /* How far down the page you want your ToC to live, this is trigger*/
  overflow: auto;

  float: right;
  max-height: calc(100vh - 40px);
  width: 200px;
  background-color: white;
  color: #00BB33;
  border-radius: 15pt;

  @media (max-width: 1400px) {
    display: none;
    margin-left: auto;
    margin-right: auto;
  }
`

const TitleColumn = styled.div`
  padding-top: 3ex;
  height: 100%;
  width: 100%;
  border-radius: 15pt;
  font-size: xxx-large;
  @media (min-width: 960px) {
    width: 960px;
    margin-left: auto;
    margin-right: auto;
  }
`
const TitleSubColumn = styled.div`
  padding-left: 2em;
  padding-right: 2em;
  color: white;
  font-size: xxx-large;
  text-align: center;
`

const SubtitleSubColumn = styled.div`
  padding-left: 2em;
  padding-right: 2em;
  color: #888888;
  font-size: x-large;
  text-align: center;
`
const DateSubColumn = styled.div`
  margin-left: auto;
  background-color: firebrick;
  color: white;
  text-align: center;
  width: 12ex;
  border-radius: 15px;
  font-size: x-large;
`

const LableSubColumn = styled.div`
  color: firebrick;
`

export default function Post({postData}) {
    const onClickNodeHandler = () => {

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
    const nodetypes = useMemo(() => ({techStackFlowNode: TechStackFlowNode}), [])
    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]
    );
    return (
        <div>


            <Layout>
                {/*<div className="reactFlowChartStyle">*/}
                {/*    <ReactFlow*/}
                {/*        nodes={nodes}*/}
                {/*        edges={edges}*/}
                {/*        nodeTypes={nodetypes}*/}
                {/*        fitView>*/}
                {/*        <MiniMap/>*/}
                {/*        <Background/>*/}
                {/*    </ReactFlow>*/}
                {/*</div>*/}
                <TitleColumn>
                    <TitleSubColumn>
                        {postData.title}
                    </TitleSubColumn>
                    <SubtitleSubColumn>
                        {postData.subtitle}
                    </SubtitleSubColumn>
                    <DateSubColumn>
                        {postData.date}
                    </DateSubColumn>
                    {/*<LableSubColumn>*/}
                    {/*    {postData.label.split("/")}*/}
                    {/*</LableSubColumn>*/}
                </TitleColumn>


                <TableOfContentColumn>
                    <TableOfContent/>
                </TableOfContentColumn>

                <MarkDownHtmlColumn>
                    <MarkDownHtmlContent dangerouslySetInnerHTML={{__html: postData.contentHtml}}/>
                </MarkDownHtmlColumn>


            </Layout>
        </div>
    );
}
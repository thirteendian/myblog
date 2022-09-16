import Layout from '../../components/Layouts';
import {getAllPostIds, getPostData} from '../../lib/posts';
import ReactFlow, {Background, MiniMap} from "react-flow-renderer";
import {useState, useCallback, useMemo} from "react";
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
  margin-left: 4%;
  margin-right: 4%;
`

const TableOfContentColumn = styled.div`
  position: sticky;
  position: -webkit-sticky; /* For Safari */
  top: 24px; /* How far down the page you want your ToC to live, this is trigger*/
  overflow: auto;
  
  float:right;
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

                {postData.title}
                <br/>
                {postData.id}
                <br/>
                {postData.date}
                <br/>

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
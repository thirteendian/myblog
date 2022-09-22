import Layout from '../../components/Layouts';
import {getAllPostIds, getPostData} from '../../lib/posts';
import ReactFlow, {Background, MiniMap} from "react-flow-renderer";
import {useState, useCallback, useMemo, Fragment} from "react";
import Image from "next/image"
import TechStackFlowNode from "../../components/TechStackFlowNode";
import styled from "styled-components";
import TableOfContent from "../../components/TableOfContent";
import useHeadingsData from "../../components/useHeadingsData";


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

const ContentContainer = styled.div`
  height: 100%;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  @media (min-width: 1220px) {
    padding-right: 10%;
    width: 1050px;
  }
  //@media (min-width: 960px) {
  //  width: 960px;
  //}
`
const TitleColumn = styled.div`
  padding-top: 3ex;
  display: block;
  height: 100%;
  width: 100%;
  
  border-radius: 15pt;
  font-size: xxx-large;
  @media (min-width: 1220px) {
    //padding-right: 100px;
    //padding-right: 20%;
    //margin-left: auto;
    margin-right: auto;
    width: 960px;
  }
  //@media (min-width: 960px) {
  //  width: 960px;
  //  margin-left: auto;
  //  margin-right: auto;
  //}
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

const MarkDownHtmlColumn = styled.div`
  height: 100%;
  width: 100%;
  background-color: white;
  border-radius: 15pt;
  //@media (min-width: 960px) {
  //  width: 960px;
  //  margin-left: auto;
  //  margin-right: auto;
  //}
`

const MarkDownHtmlContent = styled.div`

  //top: 20px;
  bottom: 20px;
  padding-top: 2em;
  padding-bottom: 2em;
  position: relative;
  overflow: visible;
  margin-left: 4%;
  margin-right: 4%;
  margin-bottom: 4%;
`

const TableOfContentColumn = styled.div`
  z-index: 1;
  //display: ;

  overflow-wrap: break-word;
  position: sticky;
  position: -webkit-sticky; /* For Safari */
  top: 40px; /* How far down the page you want your ToC to live, this is trigger*/
  overflow: auto;
  display: block;
  position: fixed;
  
  margin-left: 1020px;
  margin-right: auto;

  max-height: calc(100vh - 40px);
  width: 240px;
  background-color: white;
  color: #00BB33;
  border-radius: 15pt;

  @media (max-width: 1220px) {
    display: ${props=>props.active?"block":"none"};
    //direction: rtl;
    margin-left: 74%;
    margin-right: auto;
  }
  @media (pointer:none), (pointer:coarse) {
    margin-left: auto;
    margin-right: auto;
  }
`

const TableOfContentButton = styled.button`
  z-index: 1;
  position: sticky;
  position: -webkit-sticky; /* For Safari */
  top: 5px; /* How far down the page you want your ToC to live, this is trigger*/


  float: right;
  height: 40px;
  border-radius: 15px;
  background-color: darkred;
  color: white;
  font-size: 16px;
  display: none;
  @media (max-width: 1220px) {
    display: flex;
  }
  //cursor:pointer;
  &:hover{
    background-color: firebrick;
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
    const [tocactive,setTocActive] = useState(false);

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
                <ContentAndTableOfContentContainer>
                    <TableOfContentButton onClick={()=>{setTocActive(!tocactive)}} onPress={()=>{setTocActive(!tocactive)}}>
                        ToC
                    </TableOfContentButton>
                    <TableOfContentColumn active={tocactive}>
                        <TableOfContent/>
                    </TableOfContentColumn>

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

                    <ContentContainer>
                        <MarkDownHtmlColumn onClick={()=>{setTocActive(false)}}>
                            <MarkDownHtmlContent dangerouslySetInnerHTML={{__html: postData.contentHtml}}/>
                        </MarkDownHtmlColumn>
                    </ContentContainer>
                </ContentAndTableOfContentContainer>


            </Layout>
        </div>
    );
}
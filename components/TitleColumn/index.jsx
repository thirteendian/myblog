import React from 'react';
import styled from "styled-components";

const TitleColumn = styled.div`
  padding-top: 3ex;
  display: block;
  height: 100%;
  width: 100%;
  border-radius: 15pt;
  font-size: xxx-large;
  @media (min-width: 1220px) {
    margin-right: auto;
    width: 960px;
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
function Index(props) {
    return (
        <div style={{fontVariantLigatures:props.style}}>
            <TitleColumn>
                <TitleSubColumn>
                    {props.title}
                </TitleSubColumn>
                <SubtitleSubColumn>
                    {props.subtitle}
                </SubtitleSubColumn>
                <DateSubColumn>
                    {props.date}
                </DateSubColumn>
                {/*<LableSubColumn>*/}
                {/*    {postData.label.split("/")}*/}
                {/*</LableSubColumn>*/}
            </TitleColumn>
        </div>

    );
}

export default Index;
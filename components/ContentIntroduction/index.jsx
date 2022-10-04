import React from 'react';
import styled from "styled-components";

const Introduction = styled.div`
  &::first-letter {
    font-family: goudy, serif;
    font-size: 5.5rem;
    font-weight: normal;
    color: firebrick;

    float: left;
    line-height: 0.9;
    margin-right: 0.01em;
`

function Index(props) {
    return (
        <Introduction>
            {props.children}
        </Introduction>
    );
}

export default Index;
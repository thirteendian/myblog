import React from 'react';
import styled from "styled-components";
import Link from "next/link";

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

const ListOfButtonButton = styled.button`
  border-radius: 15px;
  background-color: darkred;
  font-size: 16px;
  display: block;
  color: white;
  height: 30px;

  &:hover {
    background-color: firebrick;
  }
`

const ListOfButton = styled.ul`

  position: sticky;
  position: -webkit-sticky; /* For Safari */
  top: 5px; /* How far down the page you want your ToC to live, this is trigger*/

  z-index: 1;
  color: white;
  font-size: 16px;
  display: block;
  list-style: none;

  @media (pointer: none), (pointer: coarse) {
    float: right;
  }
`

const StyleSubmenu = styled.ul`
  float: left;
  list-style: none;
  display: ${props => props.active ? "block" : "none"};
`

function Index(props) {
    return (
        <ListOfButton>
            <TableOfContentButton onClick={props.tocOnClick} onPress={props.tocOnClick}>
                ToC
            </TableOfContentButton>
            <li>
                <Link href="/blog">
                    <ListOfButtonButton>
                        Home
                    </ListOfButtonButton>
                </Link>
            </li>
            <li>
                <ListOfButtonButton onClick={props.contextualOnClick} onPress={props.contextualOnClick}>
                    OldStyle
                </ListOfButtonButton>
            </li>

        </ListOfButton>
    );
}

export default Index;
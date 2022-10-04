import React, {useState} from 'react';
import useHeadingsData from "../useHeadingsData";
import useIntersectionObserver from "../useIntersectionObserver";
import styled from "styled-components";

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
    display: ${props => props.active ? "block" : "none"};
    //direction: rtl;
    margin-left: 74%;
    margin-right: auto;
  }
  @media (pointer: none), (pointer: coarse) {
    margin-left: auto;
    margin-right: auto;
  }
`
const Headings = ({headings, activeId}) => (
    <ul>
        {headings.map((heading) => (
            <li key={heading.id} className={heading.id === activeId ? "active" : ""}>
                <a href={`#${heading.id}`}
                   onClick=
                       {(e) => {
                           e.preventDefault();
                           document.querySelector(`#${heading.id}`).scrollIntoView({
                               behavior: "smooth"
                           });
                       }}
                >{heading.title}</a>
                {heading.items.length > 0 && (
                    <ul>
                        {heading.items.map((child) => (
                            <li key={child.id} className={child.id === activeId ? "active" : ""}>
                                <a href={`#${child.id}`}
                                   onClick={(e) => {
                                       e.preventDefault();
                                       document.querySelector(`#${child.id}`).scrollIntoView({
                                           behavior: "smooth"
                                       });
                                   }}
                                >{child.title}</a>
                            </li>
                        ))}
                    </ul>
                )}
            </li>
        ))}
    </ul>
);

function Index(props) {
    const [activeId, setActiveId] = useState();
    const {nestedHeadings} = useHeadingsData();
    useIntersectionObserver(setActiveId);
    return (
        <TableOfContentColumn active={props.active}>
            <nav aria-label="Table of contents">
                <Headings headings={nestedHeadings} activeId={activeId}/>
            </nav>
        </TableOfContentColumn>

    );
}

export default Index;
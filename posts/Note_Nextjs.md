---
title: Next.js Usage In This Blog
date: '2022-09-08'
label: js/react/next
---

<p class="intro">
After using single-page application,
the browser will not fetch the content inside the script of React,
event it will very intelligently analysis the whole document,
because the asychronized part will always be missed.
One of the pre-rendering technique Server-Side Rendering(SSR) should be used, generate html on each request.
Another one is called Static Generation(SG), generate html when build,
note that this technique will also be used in developing mode.

`next.js` served as a suitable light React SSR/SG framework. When a page is updating frequently,
one should choose SSR rather than SG. Otherwise should always try to use SG, for example,
if blog page was written ahead, a SG mode should be used.
</p>

## Create React App {#CreateReactApp}

After synchronizing git repo, start react app using tools

    $npx create-react-app blog

Other packages can be installed under react root folder(the one with package.json) by `npm install`, example:

    $npm install react
    $npm install react-dom

On next specifically, they introduce a way of create react next app by

    $npx create-next-app@latest

And the develop mode change from `npm start` to `npm run dev`.

All packages that have been installed in this project can be checked in `package.json` under `dependencies`.


<a id="org6be6926"></a>

## Server-side Rendering {#Server-sideRendering}

To make sure all dependencies will be resolved first before pre-rendering,
an async function `getStaticProps` should be called to generate global props,
and pass it to page rendering function that need those props

    export async function getStaticProps(){
        return{props:}
    }
    //...
    export default function Page(props){...}


<a id="orgf0adf1f"></a>

## The usage of `Next.js` elements {#TheusageofNextjselements}

Most of the replacements of original React elements such like `next/link`, `next/head` or `next/image`,
using next's logic to optimize the web page.

For example, `next/link` will do automatic splitting and prefetching,
by loading the home page but not the others to speed up,
but prefetching the link pages' content for browser.

Also, always wrap the main page with a `layout` component basically return it's children

      const Index = ({children}) => {
        return (
            <div>
                {children}
            </div>
        );
    };

The global css style are included by `_app.js` under "/pages",
if any css file need to be used as global style,
they should be included in this file


<a id="org2284765"></a>

## The usage of `meta` {#Theusageofmeta}


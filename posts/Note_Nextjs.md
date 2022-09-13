
# Table of Contents

1.  [Create React App](#org5f3b0ee)
2.  [Why Next.js](#org5b1243b)
3.  [The usage of `Next.js` elements](#org87fbf00)
4.  [The code bundling and splitting](#org000bb1a)
5.  [The API Routes](#org56d444c)



<a id="org5f3b0ee"></a>

# Create React App

After synchronizing git repo, start react app using tools

    $npx create-react-app blog

Other packages can be installed under react root folder(the one with package.json) by `npm install`, example:

    $npm install react
    $npm install react-dom

On next specifically, they introduce a way of create react next app by

    $npx create-next-app@latest

And the develop mode change from `npm start` to `npm run dev`.

All packages that have been installed in this project can be checked in `package.json` under `dependencies`.


<a id="org5b1243b"></a>

# Why Next.js

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

To make sure all dependencies will be resolved first before pre-rendering,
an async function `getStaticProps` should be called to generate global props,
and pass it to page rendering function that need those props

    export async function getStaticProps(){
        return{props:}
    }
    //...
    export default function Page(props){...}


<a id="org87fbf00"></a>

# The usage of `Next.js` elements

Most of the replacements of original React elements such like `next/link`, `next/head` or `next/image`,
using next's logic to optimize the web page.

For example, `next/link` will create `<a>` tag and do automatic splitting and prefetching,
by loading the home page but not the others to speed up,
but prefetching the link pages' content for browser.
Another routing way is to use `useRouter.push()` within a button,
next won't create `<a>` tag in the programming,
thus it won't be detected by SEO crawlers. If Single Page is used, one should use `<Link>`.

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


<a id="org000bb1a"></a>

# The code bundling and splitting

The traditional way is writing all script code into one JS file.
The module system was introduced since ES6 with `import` and `export`,
allowed us to seperate js into more maintainable different sets of files.
When App is built, the modules are bundled into minimum numbers of files by tools(Webpack etc.),
to reduce the loading time, which is called *Code Splitting*.
After Code Splitting, each page only load the required bundled files <sup><a id="fnr.1" class="footref" href="#fn.1" role="doc-backlink">1</a></sup>.
Next.js constantly improve the code-splitting strategy.

For example, obviouslym the file system package `"fs.js"` which is normally hold on Node server side will be ignored at front-end,
thus an error: `The Module not found: Can't resolve 'fs'.` will show in browser.
In this case,
Next.js provide *Tree Shaking* to eliminates the dead code,
but it requires all server side code should **only** be used in function file `getStaticProps` or `getServerSideProps`.

Here should pay attention, unused code will not participate tree shaking for server-side code,
thus if one imported an unused function contains packages such like `fs.js`,
the error will still show up.
Also, the recursive function will be eliminate correctly,
<sup><a id="fnr.2" class="footref" href="#fn.2" role="doc-backlink">2</a></sup>
so the following code can be added to the next.config.js:

      module.exports = {
      webpack: (config, { isServer }) => {
        // Fixes npm packages that depend on `fs` module
        if (!isServer) {
          config.node = {
            fs: 'empty'
          }
        }
    
        return config
      }
    }


<a id="org56d444c"></a>

# The API Routes

Must be written in `pages/api` folder, and will not be treated as normal page components.

Must `export default` and must have two parameters:

    export default function handler(req,res){...}

For example, as blogger, this endpoint can be used as *repository* to communicate with database:

    export default function handler(req,res){
        const data = req.body.data;
        //here write corresponding repository method to database
    }


# Footnotes

<sup><a id="fn.1" href="#fnr.1">1</a></sup> In next.js, it is called *chunks*

<sup><a id="fn.2" href="#fnr.2">2</a></sup> Described in [Maikelveen's blog: How To Solve Module Not Found Can’t Resolve ‘fs’ in Next.js](https://maikelveen.com/blog/how-to-solve-module-not-found-cant-resolve-fs-in-nextjs)

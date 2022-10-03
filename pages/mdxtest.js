import { MDXProvider } from '@mdx-js/react'

export default function Post(props){
    return(
        <MDXProvider>
           <main {...props}/>
        </MDXProvider>
    )
}
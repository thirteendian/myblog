import fs from 'fs';//Node.js file system
import path from 'path';//Node.js file path
import matter from 'gray-matter';//parse markdown meta data
import {remark} from 'remark';
import html from 'remark-html';
import prism from 'remark-prism';
import remarkToc from "remark-toc";
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";
import remarkHeadingId from 'remark-heading-id';
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import lazyloadPlugin from "rehype-plugin-image-native-lazy-loading";

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);
        // Combine the data with the id
        //matterResult structure:
        //{
        //  content:"...",
        //  data:{title,date,label, etc.}//The metadata that is defined
        //  isEmpty:,
        //  excerpt: ''
        //  orig:
        // }
        return {
            id,
            ...matterResult.data,
        };
    });

    // Sort posts by date
    return allPostsData.sort(({ date: a }, { date: b }) => {
        if (a < b) {
            return 1;
        } else if (a > b) {
            return -1;
        } else {
            return 0;
        }
    });
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);

    // Returns an array that looks like this:
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]
    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ''),
            },
        };
    });
}

export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        //Remark parse markdown
        .use(remarkParse)
        //Purse markdown Table
        .use(remarkGfm)
        //Purse markdown Coding block with style
        .use(prism,{plugins:["line-numbers"]})
        //Purse markdown Headings with custom heading ID
        .use(remarkHeadingId)
        //Purse markdown Math $$
        .use(remarkMath)
        //Rehype Purse HTML
        .use(remarkRehype,{allowDangerousHtml: true})
        //Purse HTML <img> with loading="lazy"
        .use(lazyloadPlugin)
        //Purse HTML <h> with auto ID
        .use(rehypeSlug)
        //Purse HTML math
        .use(rehypeKatex)
        //Purse HTML support for allowDangerouseHtml and stringfy
        .use(rehypeRaw)
        //Final Stringify to HTML
        .use(rehypeStringify)
        .processSync(matterResult.content);
    const contentHtml = processedContent
        .toString();

    // Combine the data with the id
    return {
        id,
        contentHtml,
        ...matterResult.data,
    };
}
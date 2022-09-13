import Head from 'next/head'
import Layout from '../components/Layouts'
import {getSortedPostsData} from '../lib/posts';

export async function getStaticProps({ params }) {
    // Fetch necessary data for the blog post using params.id
    const allPostsData = getSortedPostsData();
    return {
        props: {
            allPostsData,
        },
    };
}

export default function Home({allPostsData}) {
    return (
        <Layout home>
            <Head>
                <title>
                    Yuxuan's blog
                </title>
            </Head>
            <section>
                <p>
                    This is my blog
                </p>
            </section>
            <section>
                <ul>
                    {allPostsData.map(({id, date, title}) => (
                            <li key={id}>
                                {title}
                                <br/>
                                {id}
                                <br/>
                                {date}
                            </li>
                        )
                    )}
                </ul>
            </section>
        </Layout>
    )
}

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
                    Yuxuan Yang
                </title>
            </Head>
            <section>
                <p>
                    这里啥也没有
                </p>
            </section>

        </Layout>
    )
}

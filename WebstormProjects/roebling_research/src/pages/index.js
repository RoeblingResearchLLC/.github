// pages/index.js
import Head from 'next/head';
import ThreeJSComponent from '../components/ThreeJSComponent';
import Navbar from "@/components/Navbar";

const Home = () => {
    return (
        <div>
            <Head>
                <title>Roebling Research</title>
                <meta name="description" content="Quantitative trading firm and liquidity provider" />
            </Head>
            <ThreeJSComponent />
        </div>
    );
};

export default Home;

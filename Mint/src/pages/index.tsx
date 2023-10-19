import type { NextPage } from 'next';

import {
    Container,
    NFTGrid,
    Footer,
    Navbar,
  } from '../components';

const Home: NextPage = () => {


   
    return (
        <Container h="100%" minH="100vh" w="100%" minW="100vw">
        <Navbar />
        <NFTGrid/>
        <Footer />
      </Container>
    );
};

export default Home;

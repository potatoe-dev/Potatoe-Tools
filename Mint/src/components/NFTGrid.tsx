import * as anchor from "@project-serum/anchor";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";

import { useWallet } from '@solana/wallet-adapter-react';

import dynamic from 'next/dynamic';
const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export const NFTGrid = (props: any) => {
  const wallet = useWallet();
  const {fetching, userNFTs,userTokenBalance} = props;
  const [midTransaction, setMidTransaction] = useState(false);
  const toast = useToast();

  const upgradeAll = async () => {
    setMidTransaction(true);
    toast({
      title: `Upgrading ${userNFTs.length} NFTs!`,
      description: `We're upgrading your nfts.`,
      status: "info",
      duration: 4000,
      isClosable: true,
    });

    try {
    } catch (err) {
      setMidTransaction(false);
      toast({
        title: "Staking failed!",
        description: "Something went wrong. Please try again later.",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      width="100%"
      justifyContent={"center"}
      alignItems={["center"]}
      flexDirection={["column"]}
      px={["0", "2rem"]}
      py={["1rem", "2rem"]}
      mb={["1rem", "2rem"]}
    >
      <Flex
        width="100%"
        justifyContent={"center"}
        alignItems={["center"]}
        gap={[3]}
        flexDir="column"
        mb="45px"
      >
        <Text fontFamily="Lacquer-Regular" fontSize={["4xl", "5xl"]} mb="1.5rem" textAlign="center">
          Potatoe Mint
        </Text>
       
      </Flex>
      <Flex
        width="100%"
        justifyContent={"center"}
        alignItems={["center"]}
        flexDirection={["row"]}
        gap="3"
        flexWrap="wrap"
        px={["1rem", "2rem"]}
      >

      </Flex>
    </Flex>
  );
};

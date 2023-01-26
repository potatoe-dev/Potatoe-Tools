import type { NextPage } from 'next';
import { Button,Text } from '@chakra-ui/react'
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {getAccountInfo,closeAccounts} from '../utils'
import * as anchor from "@project-serum/anchor";

const WalletDisconnectButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletDisconnectButton,
    { ssr: false }
);
const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

const Home: NextPage = () => {
    const {publicKey,sendTransaction} = useWallet();
    const [tokenAccounts, setTokenAccounts] = useState<any[]>([])

    useEffect(() => {
		if(publicKey){
           console.log("tokenAccounts",tokenAccounts)
            const getTokens= async() =>{ 
                let tokens = await getAccountInfo(publicKey)
                if(tokens){
                    setTokenAccounts(tokens)
                }  
            }
            getTokens()        
        }
	}, [publicKey])

    const closeAccountsButton = () => {
        if(publicKey){
            closeAccounts(publicKey,tokenAccounts,sendTransaction)
        }
    }

    return (
        
        <>
        <WalletMultiButton />
        {tokenAccounts.length > 0 ? <Button onClick={(e)=>closeAccountsButton()}> Close {tokenAccounts.length} Accounts</Button>:<></>}
        {tokenAccounts.length > 0 ? (
            tokenAccounts.map((tokens) => {
             return(<Text key = {tokens.pubkey}>TokenAddress: {tokens.pubkey} MintAddress: {tokens.mint}</Text>)
            })) : <>Not Found</>
        }
        </>
    );
};

export default Home;

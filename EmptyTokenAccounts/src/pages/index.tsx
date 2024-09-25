import type { NextPage } from 'next';
import { Spinner,Box,Container, VStack,Button,Text,Heading,TableContainer,Table,Tbody,Thead,Tfoot,Tr,Th, Td,TableCaption } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {getAccountInfo,closeAccounts} from '../utils'


const Home: NextPage = () => {
    const {publicKey,sendTransaction, signAllTransactions} = useWallet();
    const [tokenAccounts, setTokenAccounts] = useState<any[]>([])
    const [load, setLoad] = useState<boolean>(false)

    useEffect(() => {
		if(publicKey){
           //console.log("tokenAccounts",tokenAccounts)
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
            try{
                setLoad(true)
                closeAccounts(publicKey,tokenAccounts,signAllTransactions,setLoad)
            }catch(e){
                console.log(e)
                setLoad(false)
            }
        }
    }

    const closeSingleAccountsButton = (pubkey:string, type:string) => {
        if(publicKey){
            try{
                setLoad(true)
                closeAccounts(publicKey,[{pubkey:pubkey,mint:"",type:type}],signAllTransactions,setLoad)
            }catch(e){
                console.log(e)
                setLoad(false)
            }
        }
    }

    return (
        
        <Container maxWidth = "100%" height = "100%">
            <VStack width="100%" maxWidth = "100%">

                <Heading fontSize='2xl' pt="2%"> Close your unsued Token Accounts for SOL. </Heading>
                <Text fontSize='lg' >Use this at your own risk! Deleting token accounts may affect 3rd party apps. </Text>
                <Text fontSize='lg' pb="2%">This is currently completly free service, Potatoe takes none off the top.</Text>           
                <Text fontSize='lg' pb="2%">Although feel free to send a tip: GXy1KcScRMfyZFcAM37GYiDYJfb8db6pqZ4ARKgMp2R.</Text>


                <WalletMultiButton />

                {load ? <Spinner size="lg"></Spinner> :
                <>
                {tokenAccounts.length > 0 ? <Button colorScheme='teal' variant='outline' onClick={(e)=>closeAccountsButton()}> Close All {tokenAccounts.length} Accounts</Button>:<Text >No Accounts Found</Text>}
                
                {tokenAccounts.length > 0 ? (
                <TableContainer>
                    <Table variant='simple'>
                        <TableCaption>Use at your own risk!</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Token Account</Th>
                                <Th>Token Mint</Th>
                                <Th>Single Close</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                                {tokenAccounts.map((tokens) => {
                                return(
                                    <Tr key={tokens.pubkey}>
                                        <Td> {tokens.pubkey}</Td>
                                        <Td>{tokens.mint}</Td>
                                        <Td><Button colorScheme='teal' variant='outline' onClick = {(e)=> closeSingleAccountsButton(tokens.pubkey, tokens.type)}> Close </Button></Td>
                                    </Tr>
                                    )})}
                        </Tbody>
                        <Tfoot>
                            <Tr>
                                <Th>Token Account</Th>
                                <Th>Token Mint</Th>
                                <Th>Single Close</Th>
                            </Tr>
                        </Tfoot>
                    </Table>
                </TableContainer>
                ) : <></>
            }
            </>}
            </VStack>
        </Container >
    );
};

export default Home;

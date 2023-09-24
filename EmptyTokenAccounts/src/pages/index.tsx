import type { NextPage } from 'next';
import { Box,Container, VStack,Button,Text,Heading,TableContainer,Table,Tbody,Thead,Tfoot,Tr,Th, Td,TableCaption } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {getAccountInfo,closeAccounts} from '../utils'


const Home: NextPage = () => {
    const {publicKey,sendTransaction, signAllTransactions} = useWallet();
    const [tokenAccounts, setTokenAccounts] = useState<any[]>([])

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
            closeAccounts(publicKey,tokenAccounts,signAllTransactions)
        }
    }

    const closeSingleAccountsButton = (pubkey:string) => {
        if(publicKey){
            closeAccounts(publicKey,[{pubkey:pubkey,mint:""}],signAllTransactions)
        }
    }

    return (
        
        <Container width = "100%" height = "100%" p="5%" centerContent>
            <VStack>

                
                <Heading fontSize='2xl' pt="2%"> Close your unsued Token Accounts for SOL. </Heading>
                <Text fontSize='lg' >Use this at your own risk! Deleting token accounts may affect 3rd party apps. </Text>
                <Text fontSize='lg' pb="2%">This is currently completly free service, Potatoe takes none off the top.</Text>
                
                <WalletMultiButton />

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
                                        <Td><Button colorScheme='teal' variant='outline' onClick = {(e)=> closeSingleAccountsButton(tokens.pubkey)}> Close </Button></Td>
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
            </VStack>
        </Container >
    );
};

export default Home;

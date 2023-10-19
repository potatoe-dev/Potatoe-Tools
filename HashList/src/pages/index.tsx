import type { NextPage } from 'next';
import { Divider ,HStack,Stack,Radio, RadioGroup,FormControl,FormLabel,Input,Spinner,Box,Container, VStack,Button,Text,Heading,TableContainer,Table,Tbody,Thead,Tfoot,Tr,Th, Td,TableCaption } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {getAccountInfo,closeAccounts} from '../utils'
import * as anchor from "@project-serum/anchor";
import { Metaplex } from "@metaplex-foundation/js";
import FileSaver from 'file-saver';

const Home: NextPage = () => {
    const {publicKey,sendTransaction, signAllTransactions} = useWallet();
    const [mintAccounts, setMintAccounts] = useState<any[]>([])
    const [final, setFinal] = useState<any[]>([])
    const [load, setLoad] = useState<any>("start")
    const [countJson, setcountJson] = useState<number>(0)
    const [holderFlag, setHolderFlag] = React.useState('1')
    const [entry, setEntry] = useState<any[]>([{"Trait":"Empty","Value":"Empty","Index":0}])
    const [junction, setJunction] = useState<any>('AND')
    const [outSetting, setOutSetting] = useState<any>('Single')

    const addEntry =  () => {
        let holdEntry = [...entry]
        holdEntry.push({"Trait":"Empty","Value":"Empty","Index":entry.length})
        setEntry(holdEntry)
    }

    const handleFileEvent =  (e:any) => {
        const chosenFiles = Array.prototype.slice.call(e.target.files)
        
        handleUploadFiles(chosenFiles[0]);
    }

    const handleTrait =  (e:any,index:any) => {
        let holdEntry = [...entry]
        holdEntry[index].Trait = e.target.value
        setEntry(holdEntry)
    }

    const handleValue =  (e:any,index:any) => {
        let holdEntry = [...entry]
        holdEntry[index].Value = e.target.value
        setEntry(holdEntry)
    }

    const remove =  (index:any) => {
        let holdEntry = entry.filter((ent:any) => ent.Index != index)
        setEntry(holdEntry)
    }

    const handleUploadFiles = (files:any) => {

        const fileReader = new FileReader();
        fileReader.readAsText(files, "UTF-8");
		fileReader.onload = async e => {
            
			if(e.target){
                if(e.target.result){
                    //@ts-ignore
                    setMintAccounts(JSON.parse(e.target.result!))
                }
            }
        }
    }

    const submitHandle = async () => {
        const connection = new anchor.web3.Connection("https://withered-aged-thunder.solana-mainnet.quiknode.pro/aa16db64656be77c0da04e5371a047436f9e6310/", "confirmed");
        const metaplex = new Metaplex(connection);
        setLoad("loading")
        let i = 1
        let rez = []
        for(const mint of mintAccounts){      
            let mintPub = new anchor.web3.PublicKey(mint)
            const nftMeta = await metaplex.nfts().findByMint({ mintAddress: mintPub });

            if(nftMeta.json){
                if(junction == "AND"){
                    let flag = true
                    for(const ent of entry){
                        let meta = nftMeta.json.attributes!.find((att:any) => att.trait_type == ent.Trait)
                        
                        if(meta?.value != ent.Value){              
                                flag = false       
                        }
                    }

                    if(flag){
                        if(holderFlag == "1"){
                            const largestAccounts = await connection.getTokenLargestAccounts(
                                mintPub
                              );
                              const largestAccountInfo = await connection.getParsedAccountInfo(
                                largestAccounts.value[0].address
                              );
                            //@ts-ignore
                            rez.push(largestAccountInfo.value.data.parsed.info.owner)
                            setFinal(rez)
                        }else{
                            rez.push(mint)
                            setFinal(rez)
                        }
                    }
                }else{
                    let flag = false
                    for(const ent of entry){
                        let meta = nftMeta.json.attributes!.find((att:any) => att.trait_type == ent.Trait)
                        if(meta?.value == ent.Value){              
                                flag = true       
                        }
                    }
                    if(flag){
                        if(holderFlag == "1"){
                            const largestAccounts = await connection.getTokenLargestAccounts(
                                mintPub
                              );
                              const largestAccountInfo = await connection.getParsedAccountInfo(
                                largestAccounts.value[0].address
                              );
                            //@ts-ignore
                            rez.push(largestAccountInfo.value.data.parsed.info.owner)
                            setFinal(rez)
                        }else{
                            rez.push(mint)
                            setFinal(rez)
                        }
                    }                    
                }
               
            }else{
                alert("NFT Meta Did Not Load For: " + mint)
            }
            setcountJson(i)
            i=i+1
        }

        setLoad("done")

    }

    const downloadJson =  () => {
        let finalOut:any = final
        if(outSetting == "Single"){
            let finalString = "[\n"
            finalOut = finalOut.filter((value:any, index:any, array:any) => array.indexOf(value) === index);  
            for(const mint of finalOut){
                finalString = finalString + "'" + mint + "',\n"  
            }
            finalString = finalString.slice(0, -2) + "\n]"
            finalOut= finalString
        }else if(outSetting == "Count"){
            let count:any = []
            let finalString = "[\n"
            for(const mint of finalOut){
                let ind = count.findIndex((c:any) => c.mint == mint)
                if(ind != -1){
                    count[ind].count = count[ind].count + 1
                }else{
                    count.push({"mint":mint,"count":1})
                }       
            }

            for(const countData of count){
                finalString = finalString + "{'" + countData.mint + "': " + countData.count + "},\n"
            }
            finalString = finalString.slice(0, -2) + "\n]"
            finalOut = finalString
        }else{
            let finalString = "[\n"
            for(const mint of finalOut){
                finalString = finalString + "'" + mint + "',\n"  
            }
            finalString = finalString.slice(0, -2) + "\n]"
            finalOut= finalString 
        }
    
        var blob = new Blob([finalOut], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "hash.txt");
    }

    return (
        
        <Container maxWidth = "100%" maxHeight="100vh" height="100vh"  backgroundColor="black"  p="0px"  >
            <VStack   backgroundColor="black"   >

                <Heading color="white"  fontSize='2xl' pt="20px">Amazing Hashlist Tool </Heading>
                <Text color="white" fontSize='lg' pb="20px">This is currently completly free service by Potatoe.</Text>           
                <Text color="white" fontSize='lg' pb="20px">Although feel free to send a tip: GXy1KcScRMfyZFcAM37GYiDYJfb8db6pqZ4ARKgMp2R.</Text>
                
                <Divider/>

                {load == "loading" ? 
                
                <VStack>
                <Text color="white">Total: {mintAccounts.length}</Text> 
                <Text color="white">Processed: {countJson}</Text> 
                <Text color="white">Found: {final.length}</Text>   
                <Spinner size="lg"></Spinner> 
                </VStack>
                
                : load == "start" ? <>
                
                <FormControl>
                            <FormLabel color="white">Upload Hashlist</FormLabel>
                            <Input color="white" type='file' multiple accept='.json'  onChange={handleFileEvent}/>
                </FormControl>

                <Text color="white" fontSize='lg' pb="2%" pt="2%">Number of NFTs: {mintAccounts.length}</Text>

                <Text color="white">Filter Options</Text>
            
                <RadioGroup onChange={setHolderFlag} value={holderFlag}>
                    <Stack color="white" direction='row'>
                        <Radio  value='1'>Holders</Radio>
                        <Radio value='2'>Mints</Radio>
                    </Stack>
                </RadioGroup>

                <RadioGroup onChange={setJunction} value={junction} >
                    <Stack color="white" direction='row'>
                        <Radio value='AND'>And</Radio>
                        <Radio value='OR'>Or</Radio>
                    </Stack>
                </RadioGroup>

                <RadioGroup onChange={setOutSetting} value={outSetting} pb="20px">
                    <Stack color="white" direction='row'>
                        <Radio value='Single'>No Duplicates</Radio>
                        <Radio value='Duplicates'>Duplicates</Radio>
                        <Radio value='Count'>Count</Radio>
                    </Stack>
                </RadioGroup>

                <Divider/>
                {entry.map((ent:any) => {
                                return(
                                    <VStack key={ent.Index}>
                        <FormControl>
                            <FormLabel color="white">Trait</FormLabel>
                            <Input type='text'  onChange={(e) => handleTrait(e,ent.Index)}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel color="white">Value</FormLabel>
                            <Input type='text'  onChange={(e) => handleValue(e,ent.Index)}/>
                        </FormControl>
                        <Button onClick={(e)=>remove(ent.Index)}>Remove</Button>
                        <Text color="white" pt="20px" pb="20px">{junction}</Text> 
                        </VStack>
                                    )})}

                <Button onClick={addEntry}>Add</Button>
                <div style={{"paddingTop":"50px"}}>
                <Button  onClick={submitHandle}>Submit</Button>
                </div>                    
                
                </>
                :
                
                <VStack> 
                    <Text color="white">Finished!</Text> 

                    <RadioGroup onChange={setOutSetting} value={outSetting} pb="20px">
                    <Stack color="white" direction='row'>
                        <Radio value='Single'>No Duplicates</Radio>
                        <Radio value='Duplicates'>Duplicates</Radio>
                        <Radio value='Count'>Count</Radio>
                    </Stack>
                </RadioGroup>

                    <Text color="white">Total: {mintAccounts.length}</Text> 
                    <Text color="white">Processed: {countJson}</Text> 
                    <Text color="white" pb="20px">Found: {final.length}</Text>

                    {entry.map((ent:any) => {
                                return(
                                    <VStack key={ent.Index}>
                                        <Text color="white" >Trait: {ent.Trait}</Text> 
                                        <Text color="white" >Value: {ent.Value}</Text> 
                                        <Divider/>                                                   
                                    </VStack>
                                    )})}
                    <Text color="white" pt="20px" pb="20px">Junction: {junction}</Text>

                    {holderFlag == "2" ? <Text size="lg" color="red">THESE ARE MINTS NOT HOLDERS</Text> : <></>}
                    <Button  onClick={downloadJson}>Download</Button>            
                </VStack>
            
            }


            </VStack>
        </Container >
    );
};

export default Home;

import type { NextPage } from 'next';
import {  Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Box,
    Container, 
    VStack,
    HStack,
    Button,
    Text,
    Heading,
    TableContainer,
    Table,
    Tbody,
    Thead,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    TabPanels, 
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Progress 
} from '@chakra-ui/react'
import React, { useState, useEffect } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {generate,findJsons} from '../utils'
import {TableMeta} from '../componenets/TableMeta'
import {ArtPanels} from '../componenets/ArtPanels'
import {AddLabelModal} from '../componenets/AddLabelModal'
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const Home: NextPage = () => {
    const [uploadedJSONS, setUploadedJSONS] = useState<any[]>([])
    const [uploadedArt, setUploadedArt] = useState<any[]>([])
    const [layerInput, setLayerInput] = useState<string>("")
    const [layers, setLayers] = useState(["Backgrounds","Accessories","Body","Clothes","Chain","Face Paints","Head","Mouth","Eyes"])
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [finalGenerated, setFinalGenerated] = useState<any[]>([])
    const [hits, setHits] = useState<number>(0)
    const [hash, setHash] = useState<string>("")
    const [find, setFind] = useState<boolean>(true)
    const [countJson, setcountJson] = useState<number>(0)
    const [generationCount, setGenerationCount] = useState<number>(0)

    useEffect(() => {
        if(hits>0){
            let myint = setInterval(function () {
                console.log("finalGenerated",finalGenerated)
                console.log("finalGenerated.length",finalGenerated.length)
                console.log("countJson",countJson)
                if(finalGenerated.length>0 && finalGenerated.length == countJson){
                    var zip = new JSZip();
                    var j = 1
                    const remoteZips = finalGenerated.map(async (pack) => {
                        zip.file(`${pack.name.split(".")[0]}.png`, pack.image.split('data:image/png;base64,')[1],{base64: true});
                        console.log("j",j)
                        j++
                        return pack;
                    })
                    Promise.all(remoteZips).then(() => {
                        zip.generateAsync({ type: "blob" }).then((content) => {
                        saveAs(content, `your-pack-name.zip`);
                        })
                    })
                    clearInterval(myint)
                }
            }, 2000);
            
        } else{
            setHits(1)
        }
	},[finalGenerated])

    const handleFileEvent =  (e:any) => {
        const chosenFiles = Array.prototype.slice.call(e.target.files)
        handleUploadFiles(chosenFiles);
    }

    const handleFileEventPng =  (e:any,layer:string) => {
        const chosenFiles = Array.prototype.slice.call(e.target.files)
        handleUploadFilesPng(chosenFiles,layer);
    }

    const handleHashEvent =  (e:any) => {
        const chosenFiles = Array.prototype.slice.call(e.target.files)
        const fileReader = new FileReader();
        //@ts-ignore
		fileReader.readAsText(chosenFiles[0], "UTF-8");
		fileReader.onload = async e => {
			if(e.target){
			const content = e.target.result;
			if(content){
				let metadata = JSON.parse(content.toString())
                findJsons(metadata)
            }
        }
    }
    }

    const handleUploadFiles = (files:any) => {
        const uploaded = [...uploadedJSONS];
        files.some((file:any) => {
            if (uploaded.findIndex((f) => f.name === file.name) === -1) {
                uploaded.push(file);
            }else{
                alert("Trying to upload files with the same name")
            }
        })

        setcountJson(uploaded.length)
        setUploadedJSONS(uploaded)

        console.log("uploaded",uploaded)

    }

    const handleUploadFilesPng = (files:any,layer:string) => {
        let allArt = [...uploadedArt]
        let layerArt = uploadedArt.filter((art)=> art.layer === layer);
        files.some((file:any) => {
            if (layerArt.filter((art)=> art.name === file.name).length === 0) {
                var img = new Image();
                img.src = (window.URL ? URL : webkitURL).createObjectURL(file);
                allArt.push({image:img,name: file.name.split(".")[0],size: file.size,layer: layer});
            }else{
                alert("Trying to upload layers with the same name")
            }
        })
        setUploadedArt(allArt)

    }

    const handleLayerAddition = () => {
        let layersNew = [...layers];
        if (layersNew.findIndex((layer) => layer === layerInput) === -1) {
            layersNew.push(layerInput)
            setLayers(layersNew)
            onClose
        }else{
            alert("Trying to upload files with the same name")
        }
    }

    const removeOneJson =  (name:any) => {
        let uploaded = [...uploadedJSONS];
        uploaded = uploaded.filter((file)=> file.name !== name)
        setUploadedJSONS(uploaded);
    }

    const removeAllJson =  (name:any) => {
        setUploadedJSONS([]);
    }

    const removeLabel =  (name:any) => {
        let layersNew = [...layers];
        layersNew = layersNew.filter((layer)=> layer !== name)
        setLayers(layersNew);
    }

    const removepng =  (name:string,layer:string) => {
        let allArt = [...uploadedArt]
        allArt = allArt.filter((art)=> !(art.name === name && art.layer === layer))
        setUploadedArt(allArt);
    }

    return ( 
        <>
            <VStack spacing='24px'>
                <Box>
                <Heading fontSize='2xl' pt="2%"> Tools For Art Upgrades</Heading>
                <Text fontSize='lg' >Use this at your own risk, not promising anything perfect!</Text>
                <Text fontSize='lg' pb="2%">This is currently completly free service, Potatoe takes none off the top.</Text>
                </Box>
                { uploadedJSONS.length > 0 ? <Button colorScheme='red' mr={3} onClick={removeAllJson}>
                                Remove All Meta Files
                                </Button> : <></>}
                <Box  maxHeight="400px" overflowY="auto">
                    {find ?
                        <>
                        <FormControl>
                            <FormLabel>Upload Old Metadata Files</FormLabel>
                            <Input type='file' multiple accept='.json'  onChange={handleFileEvent}/>
                        </FormControl>

                        <TableMeta uploadedJSONS = {uploadedJSONS} removeOne = {removeOneJson}></TableMeta>
                        </>:
                        <FormControl>
                            <FormLabel>Upload a Single Hashlist File-Automatically Download Metadata</FormLabel>
                            <Input type='file' multiple onChange={(e)=>handleHashEvent(e)}/>
                        </FormControl>
                    }

                </Box>

                <Button colorScheme='green' mr={3} onClick={(e)=>setFind(!find)}>
                    {find ? 'Hashlist Upload' : 'Metadata Upload'}
                </Button>
                <Box>
                    <Tabs variant='enclosed' isLazy>
                        <TabList>
                            {layers.map((layer) => {
                                return(
                                    <Tab key = {layer}>{layer}</Tab>
                                )})}
                            <Tab>Add Layer</Tab>                            
                        </TabList>
                        <TabPanels>
                            {layers.map((layer) => {
                                return(
                                <ArtPanels key={layer} uploadedArt ={uploadedArt} layer={layer} removeLabel={removeLabel} removepng={removepng} handleFileEventPng ={handleFileEventPng}></ArtPanels>
                                )})}
                            <TabPanel>                
                                <Button colorScheme='green' mr={3} onClick={onOpen}>
                                Add layer
                                </Button></TabPanel>
                        </TabPanels>
                    </Tabs>                
                </Box>

            <Button colorScheme='red' mr={3} onClick={(e)=>generate(uploadedJSONS,uploadedArt,layers,setFinalGenerated,setGenerationCount)}>
                GENERATE
            </Button>

            <>Current Generated: {generationCount} / {countJson}</>
            {generationCount > 0 ? <Progress hasStripe value={countJson*generationCount/countJson} />:<>Current Generated: {generationCount}</>}
            <canvas id="canvas" style={{visibility:"hidden"}}></canvas>

            </VStack>
          
          <AddLabelModal isOpen={isOpen} onClose={onClose} layerInput={layerInput} setLayerInput={setLayerInput} handleLayerAddition={handleLayerAddition} ></AddLabelModal>
           
        </>
    );
};

export default Home;

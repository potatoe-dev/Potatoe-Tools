import {  
    Button,
    TableContainer,
    Table,
    Tbody,
    Thead,
    Tfoot,
    Tr,
    Th,
    Td,
    TabPanel,
    FormControl,
    FormLabel,
    Input,
    Image 
} from '@chakra-ui/react'
import { useState,useEffect} from 'react';

export const ArtPanels = ( props: any ) => {
    const [previewImage, setPreviewImage] = useState<any>()
    const { uploadedArt, layer,removeLabel,removepng,handleFileEventPng} = props;
   
    useEffect(() => {
		setPreviewImage(null)
	},[uploadedArt])

    return (
        <TabPanel key = {layer}>
            <Button colorScheme='red' mr={3} onClick={(e)=>removeLabel(layer)}>
                                        Remove Layer
            </Button>
            {previewImage ? <Image src={previewImage} alt="Cannot Load Image" boxSize='200px'></Image>: <></>}
            <FormControl>
                <FormLabel>Upload Layer Files</FormLabel>
                <Input type='file' multiple onChange={(e)=>handleFileEventPng(e,layer)}/>
            </FormControl>  
            {uploadedArt.filter((art:any)=> art.layer === layer).length > 0 ? 
                   <TableContainer>
                   <Table variant='simple' >
                       <Thead>
                           <Tr>
                               <Th>File Name</Th>
                               <Th>File Size</Th>
                               <Th>View File</Th>
                               <Th>Remove File</Th>
                           </Tr>
                       </Thead>
                       <Tbody>
                       {uploadedArt.filter((art:any)=> art.layer === layer).map((file:any) => {
                           return(
                           <Tr key={file.name}>
                           <Td> {file.name}</Td>
                           <Td>{file.size}</Td>
                           <Td><Button colorScheme='teal' variant='outline' onClick= {(e)=> setPreviewImage(file.image.currentSrc)}> View </Button></Td>
                           <Td><Button colorScheme='teal' variant='outline' onClick= {(e)=> removepng(file.name,layer)}> Remove </Button></Td>
                           </Tr>
                           )})
                           }
                       </Tbody>
                   </Table>
                </TableContainer>  
             : 
                <></>
            }
                                      
        </TabPanel>
        
    )
}

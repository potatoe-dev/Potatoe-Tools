import {  
    Button,
    TableContainer,
    Table,
    Tbody,
    Thead,
    Tr,
    Th,
    Td,
    TableCaption,
} from '@chakra-ui/react'

export const TableMeta = ( props: any ) => {

    const { uploadedJSONS, removeOne} = props;

    return (
        <TableContainer>
            <Table variant='simple' >
                <TableCaption>Use at your own risk!</TableCaption>
                <Thead>
                    <Tr>
                        <Th>File Name</Th>
                        <Th>File Size</Th>
                        <Th>Remove File</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {uploadedJSONS.map((file:any) => {
                    return(
                    <Tr key={file.name}>
                    <Td> {file.name}</Td>
                    <Td>{file.size}</Td>
                    <Td><Button colorScheme='teal' variant='outline' onClick = {(e)=> removeOne(file.name)}> Remove </Button></Td>
                    </Tr>
                    )})}
                </Tbody>
            </Table>
         </TableContainer>
    )
}

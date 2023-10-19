import {  
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input
} from '@chakra-ui/react'

export const AddLabelModal = ( props: any ) => {

    const { isOpen, onClose,layerInput,setLayerInput,handleLayerAddition} = props;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Add Layer</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <FormControl>
                    <FormLabel>Layer Name</FormLabel>
                    <Input type = "text" value = { layerInput } onChange={(e)=>setLayerInput(e.target.value)}/>
                </FormControl>
                <Button colorScheme='blue' mr={3} onClick={handleLayerAddition}>
                    Add Layer
                </Button>
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
                </Button>     
            </ModalFooter>
        </ModalContent>
    </Modal>
    )
}

// Updated 13 Jul to Mages Staking Theming

import { Flex, useColorMode, FlexProps, Box, AspectRatio } from '@chakra-ui/react'

export const Container = (props: FlexProps) => {
    const { colorMode } = useColorMode()

    return (
        <Flex
          p="0"
          overflow="auto"
          bgColor="black"
          direction="column"
          alignItems="center"
          justifyContent="flex-start"
          bgPosition="center"

        >
            <Flex
                direction="column"
                alignItems="center"
                justifyContent="flex-start"
                color="gray.100"
                position="relative"
                {...props}
                // maxW="1400px"
                minW="300px"
            />
        </Flex>
    )
}

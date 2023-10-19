// Updated 13 Jul to Mages Staking Theming
// newFooter LINK VARIANT
// Mages Staking Updated

import { Flex, Text, Image, Link } from '@chakra-ui/react';

export const Footer = (props: any) => {
  return (
    <Flex
      pt={["2rem", "2.5rem"]}
      mt="auto"
      flexDir="column"
      width="100%"
      maxW={["100vw"]}
      gap="20px"
      alignItems={["center"]}
      justifyContent={["space-around"]}
      // bgImage="url(/images/footerbg.webp)"
      bgSize="cover"
      bgRepeat="no-repeat"
      bgPosition="center top"
    >
      <Flex
        flexDir={["column"]}
        mb="5"
        width="100%"
        maxW={["sm", "md", "lg", "1384px"]}
        gap="30px"
        alignItems={["center"]}
        justifyContent={["center"]}
      >
    
        <Text 
          fontFamily="Lacquer-Regular" 
          fontSize={["2.3rem", "2.9rem"]}
          textAlign="center"
          whiteSpace={["normal", null, "nowrap"]}
          letterSpacing="1px"
        >
          potatoe
        </Text>
      </Flex>
      <Flex
        flexDir={["row"]}
        width="100%"
        maxW={["sm", "md", "lg", "xl"]}
        gap={["30px", null, "60px"]}
        alignItems={["center"]}
        justifyContent={["center"]}
      >
       
        {/* <Link target="_blank" href='https://www.magiceden.io/creators/alderacademy' variant="newFooter"><Image h="45px" src="/images/magiceden.webp" /></Link>
        <Link target="_blank" href='https://twitter.com/AlderMages' variant="newFooter"><Image h="45px" src="/images/twitter.webp" /></Link>
        <Link target="_blank" href='https://discord.gg/alder' variant="newFooter"><Image h="45px" src="/images/discord.webp" /></Link> */}
      </Flex>
      <Flex 
        mt="15px" 
        p="10px" 
        // bgColor="#2a1533" 
        w="100%" 
        h="100%"
        justifyContent={["center"]}
      >
        <Text fontFamily="Lacquer-Regular" fontSize="1rem" textAlign="center">
          &copy; 2023 potatoe. All Rights Reserved
        </Text>
      </Flex>
    </Flex>
  )
}
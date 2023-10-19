import { Button,
  Flex,
  FlexProps,
  Text,
  Heading,
  Image,
  Box,
  HStack,
  Stack,

  // Accordions
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,

  // Modals
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import {
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import dynamic from 'next/dynamic';

const FAQ = {
  "How do I stake?": "Just connect your wallet, choose an NFT from your list below, and hit the 'Stake' button! Your wallet provider will prompt you to review and sign the transaction.",
  "How much does staking cost?": `
    One-time staking wallet cost: 0.00162 SOL
    Each NFT: 0.00206 SOL (REFUNDED ON UNSTAKE)
    SPL Token Account: 0.00204 SOL
  `,
  "I got an error!": "When we encounter an error, we raise a little toast message for you. Make sure you have enough SOL in your account to cover metadata account openings and other gas fees.",
  "My transaction timed out!": "More like SLOWlana! Check your transaction history or refresh the page.",
  // "What are my rewards?": "FILL IN FOR EACH PROJECT"
}

export const Navbar = (props: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {userTokenBalance} = props;
  const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
  );

  return (
    <Flex
      as="nav"
      p={["1rem", "2rem"]}
      flexDir="row"
      width="100%"
      alignItems={["center", "flex-start"]}
      justifyContent="space-between"
      flexWrap="wrap"
    >
      <Text fontSize="36px" fontWeight={800} > Potatoe Mint</Text>

      <Flex
        flexDir="row"
        justifyContent="flex-start"
        alignItems={"center"}
        flexWrap="wrap"
        gap="2"
      >

        <WalletMultiButtonDynamic />
      </Flex>
    </Flex>
  )
}

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { UnsafeBurnerWalletAdapter,AlphaWalletAdapter,AvanaWalletAdapter,BackpackWalletAdapter,
    BitKeepWalletAdapter,BitpieWalletAdapter,BloctoWalletAdapter,BraveWalletAdapter,BraveWalletAdapterConfig,
    CloverWalletAdapter,Coin98WalletAdapter, CoinbaseWalletAdapter,CoinhubWalletAdapter,ExodusWalletAdapter,
    FractalWalletAdapter,GlowWalletAdapter,HuobiWalletAdapter,HyperPayWalletAdapter,KeystoneWalletAdapter,
    KrystalWalletAdapter,LedgerWalletAdapter,MathWalletAdapter,MathWalletAdapterConfig,NekoWalletAdapter,
    NightlyWalletAdapter,NufiWalletAdapter,OntoWalletAdapter,ParticleAdapter,PhantomWalletAdapter,SafePalWalletAdapter,
    SaifuWalletAdapter,SalmonWalletAdapter,SkyWalletAdapter,SlopeWalletAdapter,SolflareWalletAdapter,SolletWalletAdapter,
    SolongWalletAdapter,SpotWalletAdapter,StrikeWalletAdapter,TokenaryWalletAdapter,TokenPocketWalletAdapter,TorusWalletAdapter,
    TrustWalletAdapter,WalletConnectWalletAdapter,XDEFIWalletAdapter} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import type { AppProps } from 'next/app';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import { ChakraBaseProvider, extendBaseTheme } from '@chakra-ui/react'
// `@chakra-ui/theme` is a part of the base install with `@chakra-ui/react`
import chakraTheme from '@chakra-ui/theme'

const { Container, Button,Table,Heading,Spinner  } = chakraTheme.components

const theme = extendBaseTheme({
  components: {
    Container, Button,Table,Heading,Spinner
  },
})

// Use require instead of import since order matters
require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');


const App: FC<AppProps> = ({ Component, pageProps }) => {
    // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
    const network = WalletAdapterNetwork.Mainnet;
    // You can also provide a custom RPC endpoint
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            /**
             * Wallets that implement either of these standards will be available automatically.
             *
             *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
             *     (https://github.com/solana-mobile/mobile-wallet-adapter)
             *   - Solana Wallet Standard
             *     (https://github.com/solana-labs/wallet-standard)
             *
             * If you wish to support a wallet that supports neither of those standards,
             * instantiate its legacy wallet adapter here. Common legacy adapters can be found
             * in the npm package `@solana/wallet-adapter-wallets`.
             */
            new AlphaWalletAdapter(),
            new AvanaWalletAdapter(),
            new BackpackWalletAdapter(),
            new BitKeepWalletAdapter(),
            new BitpieWalletAdapter(),
            new BloctoWalletAdapter(),
            new BraveWalletAdapter(),
            new BraveWalletAdapter(),
            new CloverWalletAdapter(),
            new Coin98WalletAdapter(),
            new  CoinbaseWalletAdapter(),
            new CoinhubWalletAdapter(),
            new ExodusWalletAdapter(),
            new FractalWalletAdapter(),
            new GlowWalletAdapter(),
            new HuobiWalletAdapter(),
            new HyperPayWalletAdapter(),
            new KeystoneWalletAdapter(),
            new KrystalWalletAdapter(),
            new LedgerWalletAdapter(),
            new MathWalletAdapter(),
            new MathWalletAdapter(),
            new NekoWalletAdapter(),
            new NightlyWalletAdapter(),
            new NufiWalletAdapter(),
            new OntoWalletAdapter(),
            new ParticleAdapter(),
            new PhantomWalletAdapter(),
            new SafePalWalletAdapter(),
            new SaifuWalletAdapter(),
            new SalmonWalletAdapter(),
            new SkyWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter(),
            new SolletWalletAdapter(),
            new SolongWalletAdapter(),
            new SpotWalletAdapter(),
            new StrikeWalletAdapter(),
            new TokenaryWalletAdapter(),
            new TokenPocketWalletAdapter(),
            new TorusWalletAdapter(),
            new TrustWalletAdapter(),
            new XDEFIWalletAdapter       
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ChakraBaseProvider theme={theme}>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        <Component {...pageProps} />
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </ChakraBaseProvider>
    );
};

export default App;

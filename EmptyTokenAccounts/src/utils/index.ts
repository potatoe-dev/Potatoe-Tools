import { e } from "@chakra-ui/toast/dist/toast.types-76829e6b";
import * as anchor from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID,createCloseAccountInstruction  } from "@solana/spl-token";

export const getAccountInfo = async (wallet: anchor.web3.PublicKey) => {
	try {
		const RPC = process.env.NEXT_PUBLIC_SOLANA_RPC!
		const connection = new anchor.web3.Connection(RPC)
		let accountInfo = await connection.getParsedTokenAccountsByOwner(wallet, {
			programId: TOKEN_PROGRAM_ID,
		  });
		let tokens = []

		for(const token of accountInfo.value){
			if(token.account.data.parsed.info.tokenAmount.uiAmount == 0){
				const mintToken = new anchor.web3.PublicKey(token.account.data.parsed.info.mint)
				tokens.push({pubkey:token.pubkey.toString(),mint:mintToken.toString()})
			}		
		}
		
		return(tokens)	
	} catch (error) {
		console.log(error)
		return([])
	}
}

export const closeAccounts = async (wallet: anchor.web3.PublicKey,tokens: any[], sendTransaction: any) => {
	try {
		console.log("IN CLOSE ACCOUNT REAL FUN")
		
		const RPC = process.env.NEXT_PUBLIC_SOLANA_RPC!
		const connection = new anchor.web3.Connection(RPC)
		const batchsize = 20
		
		let tx = new anchor.web3.Transaction()
		let j=1
		for(let i=0; i<tokens.length;i++){	
			tx.add(
				createCloseAccountInstruction(
					new anchor.web3.PublicKey(tokens[i].pubkey), // token account which you want to close
					wallet, // destination
					wallet // owner of token account
				  )
			)
			if(j == batchsize || i == tokens.length-1){
				const signature = await sendTransaction(tx, connection);
				tx = new anchor.web3.Transaction()
				j=0
			}
				j++		
		}
		
		return(tokens)	
	} catch (error) {
		console.log(error)
		return([])
	}
}

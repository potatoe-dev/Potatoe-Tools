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

export const closeAccounts = async (wallet: anchor.web3.PublicKey,tokens: any[], sendTransaction: any,setLoad:any) => {
	try {

		const RPC = process.env.NEXT_PUBLIC_SOLANA_RPC!
		const connection = new anchor.web3.Connection(RPC)
		const batchsize = 20
		const batchsize2 = 11
		let batches = []
		let bh = await connection.getLatestBlockhash()
		let tx = new anchor.web3.Transaction({ feePayer: wallet,recentBlockhash: bh.blockhash})
		let j=1
		let k=1
		for(let i=0; i<tokens.length;i++){	
			tx.add(
				createCloseAccountInstruction(
					new anchor.web3.PublicKey(tokens[i].pubkey), // token account which you want to close
					wallet, // destination
					wallet // owner of token account
				  )
			)
			if(j == batchsize || i == tokens.length-1){
				k=k+1
				batches.push(tx)
				//const signature = await sendTransaction(tx, connection);
				bh = await connection.getLatestBlockhash()
				tx = new anchor.web3.Transaction({feePayer: wallet,recentBlockhash: bh.blockhash})
				j=0
			}
			if(k==batchsize2 || i == tokens.length-1){
				k=0
				const tx2 = await sendTransaction(batches)
				//const sig = await connectionSolana.sendTransaction(t)
				for(let t of tx2){
				  //@ts-ignore
				  const sig = await connection.sendRawTransaction(t.serialize())
				  console.log("sig",sig)
				}
				batches=[]
			}
				j++		
		}
		setLoad(false)
		alert("Success")
		return(tokens)
		
	} catch (error) {
		setLoad(false)
		alert("Error")
		console.log(error)
		return([])
	}
}

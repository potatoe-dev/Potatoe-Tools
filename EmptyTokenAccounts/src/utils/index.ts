import * as anchor from "@project-serum/anchor";
import { TOKEN_2022_PROGRAM_ID,TOKEN_PROGRAM_ID,createCloseAccountInstruction} from "@solana/spl-token";

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
				tokens.push({pubkey:token.pubkey.toString(),mint:mintToken.toString(), type:"spl"})
			}		
		}

		let accountInfo2 = await connection.getParsedTokenAccountsByOwner(wallet, {
			programId: TOKEN_2022_PROGRAM_ID,
		  });

		for(const token of accountInfo2.value){
			let findStuff = token.account.data.parsed.info.extensions.find((ext:any)=>ext.extension=="transferFeeAmount")
			if(!findStuff){
				if(token.account.data.parsed.info.tokenAmount.uiAmount == 0){
					const mintToken = new anchor.web3.PublicKey(token.account.data.parsed.info.mint)
					tokens.push({pubkey:token.pubkey.toString(),mint:mintToken.toString(), type:"spl22"})
				}	
			}else{
				console.log("findStuff",findStuff)
			}	
		}
		
		return(tokens)	
	} catch (error) {
		console.log(error)
		return([])
	}
}

export const closeAccounts = async (wallet: anchor.web3.PublicKey,tokens: any[], signAllTransactions: any,setLoad:any) => {
	try {

		console.log("close",tokens)
		const RPC = process.env.NEXT_PUBLIC_SOLANA_RPC!
		const connection = new anchor.web3.Connection(RPC,"confirmed")
		const batchsize = 15
		const batchsize2 = 11
		let batches:any = []
		let ixHold:any = []
			
		let j=1
		let k=1
		for(let i=0; i<tokens.length;i++){	

			console.log("token",tokens[i])
			let splAddress = TOKEN_PROGRAM_ID
			if(tokens[i].type == "spl22"){
				splAddress = TOKEN_2022_PROGRAM_ID
			}
			console.log("splAddress",splAddress.toString())
			console.log("tokens[i].pubkey",tokens[i].type)

			ixHold.push(
				createCloseAccountInstruction(
					new anchor.web3.PublicKey(tokens[i].pubkey), // token account which you want to close
					wallet, // destination
					wallet, // owner of token account
					[],
					splAddress
				  )
			)

			if(j == batchsize || i == tokens.length-1){
				k=k+1
				const {
					context: { slot: minContextSlot },
							value: { blockhash, lastValidBlockHeight },
						  } = await connection.getLatestBlockhashAndContext()

				const messageV0 = new anchor.web3.TransactionMessage({
					payerKey: wallet,
					recentBlockhash: blockhash,
					instructions: ixHold,
				  }).compileToV0Message()
		  
				  const tx1 = new anchor.web3.VersionedTransaction(messageV0)
				  batches.push(tx1)
				ixHold=[]
				j=0
			}
			if(k==batchsize2 || i == tokens.length-1){
				k=0
				console.log("batches",batches)
				const tx2 = await signAllTransactions!(batches)
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

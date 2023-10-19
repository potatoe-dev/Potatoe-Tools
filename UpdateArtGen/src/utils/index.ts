import * as anchor from "@project-serum/anchor";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Metaplex} from "@metaplex-foundation/js";

const drawImage = async (allJson: any[],art: any[], layers: string[],setGenerationCount:any) => {

	let allGeneration:any[] = []
	let i = 0
	for(const meta of allJson){
		const fileReader = new FileReader();
		fileReader.readAsText(meta, "UTF-8");
		fileReader.onload = async e => {
			if(e.target){
			const content = e.target.result;
			if(content){
				let metadata = JSON.parse(content.toString())
				const canvas = <HTMLCanvasElement> document.getElementById('canvas');
				if(canvas){
					const ctx = canvas.getContext('2d');				
					if(ctx){
						ctx.canvas.width  = 5000;
						ctx.canvas.height = 5000;
						ctx.clearRect(0, 0, 5000, 5000);
						var finalImage = await canvasImage(metadata,ctx,canvas, layers,art)
						//console.log("finalImage",finalImage)
						allGeneration.push({image: finalImage,name:meta.name})
						console.log(i)
						i++
						setGenerationCount(i)
					}
				}
			}
			}
		  };
	}
	//console.log("RETURNING THIS SHIT allGeneration",allGeneration)
	return(allGeneration)
}

const canvasImage = async (metadata: any,ctx: any,canvas:any, layers: string[],art:any) => {
	for(const layer of layers){
		//console.log(layer)
		const value = metadata.attributes.find((attribute:any)=>attribute.trait_type == layer).value
		if(value){
			const image = art.find((a:any)=> (a.layer.toLowerCase() === layer.toLowerCase() && a.name.toLowerCase() === value.toLowerCase()))
			if(image){
				ctx.drawImage(image.image, 0, 0)
			}else{
				//console.log("value",value)
				//alert("Cannot Find Layer for:"+layer+"-"+value)
			}
		}else{
			console.log(metadata.attributes)
			alert("Metadata wrong")
		}						
		}
		var finalImage = canvas.toDataURL("image/jpg");
		return(finalImage)
}

export const generate = async (allJson: any[],art: any[], layers: string[],setFinalGenerated:any,setGenerationCount:any) => {
	try {

		const finalImages = await drawImage(allJson,art, layers,setGenerationCount)
		console.log("finalImages",finalImages)
		setFinalGenerated(finalImages)

	} catch (error) {
		console.log(error)
	
	}
}

export const findJsons = async (hash: any[]) => {
	try {
		console.log("hash",hash)
		let metadata = []
		for (let mint of hash) {
			console.log(mint)
			const mintAddress  = new anchor.web3.PublicKey(mint);
			const connection = new anchor.web3.Connection("https://withered-aged-thunder.solana-mainnet.quiknode.pro/aa16db64656be77c0da04e5371a047436f9e6310/", "confirmed");
			const metaplex = new Metaplex(connection);
			const nft = await metaplex.nfts().findByMint({mintAddress});
			metadata.push(nft.json)
			console.log("nft",nft)
		}

		return(metadata)

	} catch (error) {
		console.log(error)
	
	}
}

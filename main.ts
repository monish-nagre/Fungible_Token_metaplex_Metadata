import * as mpl from "@metaplex-foundation/mpl-token-metadata";
import * as web3 from "@solana/web3.js";
import * as anchor from '@project-serum/anchor';
import { PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@project-serum/anchor/dist/cjs/utils";
import {  PublicKey} from '@solana/web3.js';

export function loadWalletKey(keypairFile:string): web3.Keypair {
    const fs = require("fs");
    const loaded = web3.Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(fs.readFileSync(keypairFile).toString())),
    );
    return loaded;
  }

const INITIALIZE = true;
// /Mon9P9yMX8VSoVQDk61hSYpFFZzZDnwcumKmfVq42tt
async function main(){
    console.log("let's name some tokens!");
    const myKeypair = loadWalletKey("/home/monish/.config/solana/id.json");
    console.log(myKeypair.publicKey.toBase58())
    const mint = new web3.PublicKey("FUNWwYoCfQ7r9sc9S5ua7S1cBxBdFmhWp7JHCWypSwVy");
    const seed1 = Buffer.from(anchor.utils.bytes.utf8.encode("metadata"));
    const seed2 = Buffer.from(mpl.PROGRAM_ID.toBytes());
    const seed3 = Buffer.from(mint.toBytes());
    const signer = new PublicKey ("38J8f4VG8syxqWmRsYt8pbFf8Edeh1hoPvAuBnF4Vp6U")
    const [metadataPDA, _bump] = web3.PublicKey.findProgramAddressSync([seed1, seed2, seed3], mpl.PROGRAM_ID);
    const accounts = {
        metadata: metadataPDA,
        mint,
        mintAuthority: signer,
        payer: signer,
        updateAuthority: signer,
    }
    const dataV2 = {
        name: "Fake USD Token",
        symbol: "FUD",
        uri: "https://shdw-drive.genesysgo.net/ArP7jjhVZsp7vkzteU7mpKA1fyHRhv4ZBz6gR7MJ1JTC/metadata.json",
        // we don't need that
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null
    }

    const args = {
      createMetadataAccountArgsV3: {  // Use createMetadataAccountArgsV3 here
          data: dataV2,
          isMutable: true,
          collectionDetails: null
      }
  };
    const ix = mpl.createCreateMetadataAccountV3Instruction(accounts, args);
    const tx = new web3.Transaction();
    tx.add(ix);
    const connection = new web3.Connection("https://api.devnet.solana.com");
    const txid = await web3.sendAndConfirmTransaction(connection, tx, [myKeypair]);
    console.log(txid);
    // let ix;
    // if (INITIALIZE) {
    //     const args : mpl.CreateMetadataAccountV3InstructionArgs =  {
    //         createMetadataAccountArgsV3: {
    //             data: dataV2,
    //             isMutable: true,
    //             collectionDetails: null
    //         }
    //     };
    //     ix = mpl.createCreateMetadataAccountV3Instruction(accounts, args);
    // } else {
    //     const args =  {
    //         updateMetadataAccountArgsV2: {
    //             data: dataV2,
    //             isMutable: true,
    //             updateAuthority: myKeypair.publicKey,
    //             primarySaleHappened: true
    //         }
    //     };
    //     ix = mpl.createUpdateMetadataAccountV2Instruction(accounts, args)
    // }
    // const tx = new web3.Transaction();
    // tx.add(ix);
    // const connection = new web3.Connection("https://api.mainnet-beta.solana.com");
    // const txid = await web3.sendAndConfirmTransaction(connection, tx, [myKeypair]);
    // console.log(txid);

}

main();
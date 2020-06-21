import { Blockchain } from "./Blockchain.ts";
import { Block } from "./Block.ts";

const main = () => {
  const blockchain: Blockchain = new Blockchain();
  blockchain.Blockchain(1);
  blockchain.addBlock(blockchain.newBlock("Hello, World!"));
  blockchain.addBlock(blockchain.newBlock("Welcome,"));
  blockchain.addBlock(blockchain.newBlock("My name is Byron."));
  blockchain.addBlock(blockchain.newBlock("What is yours?"));

  console.log(blockchain.makeString());
  console.log(`Blockchain is valid: ${blockchain.isBlockchainValid()}\n\n\n`);

  // Add an invalid block to corrupt the blockchain
  const corruptBlock = new Block();
  corruptBlock.Block(15, Date.now(), "wrong", "Corrupt block.");
  blockchain.addBlock(corruptBlock);

  console.log(blockchain.makeString());
  console.log(`Blockchain is valid: ${blockchain.isBlockchainValid()}`);
};

main();

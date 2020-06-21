import { Block } from "./Block.ts";

export class Blockchain {
  private difficulty!: number;
  private blocks!: Array<Block>;

  public Blockchain(difficulty: number) {
    this.difficulty = difficulty;
    this.blocks = new Array<Block>();
    // Create the first block
    const b: Block = new Block();
    b.Block(0, Date.now(), null, "First Block");
    b.mineBlock(difficulty);
    this.blocks.push(b);
  }

  public getDifficulty = (): number => this.difficulty;

  public latestBlock = (): Block => this.blocks[this.blocks.length - 1];

  public newBlock = (data: string): Block => {
    const latestBlock: Block = this.latestBlock();
    const block = new Block();
    block.Block(
      latestBlock.getIndex() + 1,
      Date.now(),
      latestBlock.getHash(),
      data,
    );
    return block;
  };

  public addBlock = (b: Block): void => {
    if (b) {
      b.mineBlock(this.difficulty);
      this.blocks.push(b);
    }
  };

  public isFirstBlockValid = (): boolean => {
    const firstBlock: Block = this.blocks[0];
    if (firstBlock.getIndex() !== 0) return false;
    if (firstBlock.getPreviousHash()) return false;
    if (
      !firstBlock.getHash() ||
      Block.calculateHash(firstBlock) !== firstBlock.getHash()
    ) {
      return false;
    }
    return true;
  };

  public isValidNewBlock = (newBlock: Block, previousBlock: Block): boolean => {
    if (newBlock && previousBlock) {
      if (previousBlock.getIndex() + 1 !== newBlock.getIndex()) return false;
      if (
        !newBlock.getPreviousHash() ||
        newBlock.getPreviousHash() !== previousBlock.getHash()
      ) {
        return false;
      }
      if (
        !newBlock.getHash() ||
        Block.calculateHash(newBlock) !== newBlock.getHash()
      ) {
        return false;
      }
      return true;
    }
    return false;
  };

  public isBlockchainValid = (): boolean => {
    if (!this.isFirstBlockValid()) return false;
    for (let i = 1; i < this.blocks.length; i++) {
      let currentBlock: Block = this.blocks[i];
      let previousBlock: Block = this.blocks[i - 1];
      if (!this.isValidNewBlock(currentBlock, previousBlock)) return false;
    }
    return true;
  };

  public makeString = (): string => {
    let builder: string[] = [];
    this.blocks.forEach((block) => {
      builder.push(block.makeString());
    });
    return builder.toString();
  };
}

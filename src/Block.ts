import { HmacSha256 } from "https://deno.land/std/hash/sha256.ts";

export class Block {
  private index!: number;
  private timestamp!: number;
  private hash!: string | undefined;
  private previousHash!: string;
  private data!: string;
  private nonce!: number;

  public Block = (
    index: number,
    timestamp: number,
    previousHash: string,
    data: string,
  ) => {
    this.index = index;
    this.timestamp = timestamp;
    this.previousHash = previousHash;
    this.data = data;
    let nonce = 0;
    let hash = Block.calculateHash(this);
  };

  public getIndex = (): number => this.index;
  public getTimestamp = (): number => this.timestamp;
  public getHash = (): string | undefined => this.hash;
  public getPreviousHash = (): string => this.previousHash;
  public getData = (): string => this.data;

  public str = (): string => {
    return (
      this.index + this.timestamp + this.previousHash + this.data + this.nonce
    );
  };

  public makeString = (): string => {
    return `Block #${this.index} [previousHash : ${this.previousHash}, timestamp : ${new Date(
      this.timestamp,
    )}, data : ${this.data}, hash : ${this.hash}]`;
  };

  public static calculateHash = (block: Block): string | undefined => {
    if (block) {
      let digest: HmacSha256 | undefined = undefined;

      try {
        digest = new HmacSha256("");
      } catch (err) {
        return undefined;
      }

      let txt: string = block.str();
      let bytes: number[] = digest.update(txt).array();
      let builder: string[] = [];

      bytes.forEach((byte) => {
        let hex: string = escape(`0xff${byte}`);

        if (hex.length === 1) builder.push("0");

        builder.push(hex);
      });

      return builder.toString();
    }

    return undefined;
  };

  public mineBlock(difficulty: number): void {
    let nonce: number = 0;

    while (
      this.getHash()!.substring(0, difficulty) !==
        String.prototype.padStart(difficulty, "0").substring(0, difficulty)
    ) {
      nonce++;
      this.hash = Block.calculateHash(this);
    }
  }
}

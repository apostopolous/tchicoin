import { HmacSha256 } from "https://deno.land/std/hash/sha256.ts";

export class Block {
  private index!: number;
  private timestamp!: number;
  private hash: string = "";
  private previousHash!: string | null;
  private data!: string;
  private nonce!: number;

  public Block = (
    index: number,
    timestamp: number,
    previousHash: string | null,
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
  public getHash = (): string => this.hash;
  public getPreviousHash = (): string | null => this.previousHash;
  public getData = (): string => this.data;

  public str = (): string => {
    return (
      this.index + this.timestamp + this.previousHash! + this.data + this.nonce
    );
  };

  public makeString = (): string => {
    return `\nBlock #${this.index}   [\n   previousHash: "${
      this.previousHash?.substring(0, 10)
    }...",\n   timestamp: "${new Date(
      this.timestamp,
    )}",\n   data: "${this.data}",\n   hash: "${
      this.hash.substring(0, 10)
    }..."\n]`;
  };

  public static calculateHash = (block: Block): string | null => {
    if (block) {
      let digest: HmacSha256 | null = null;

      try {
        digest = new HmacSha256("");
      } catch (err) {
        return null;
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

    return null;
  };

  public mineBlock(difficulty: number): void {
    let nonce: number = 0;

    while (
      this.getHash().substring(0, difficulty) !==
        String.prototype.padStart(difficulty, "0").substring(0, difficulty)
    ) {
      nonce++;
      this.hash = Block.calculateHash(this)!;
    }
  }
}

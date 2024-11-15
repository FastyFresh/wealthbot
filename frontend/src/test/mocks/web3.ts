export class PublicKey {
  constructor(key: string) {
    return { toBase58: () => key };
  }
  static isPublicKey(obj: any): boolean {
    return obj && typeof obj.toBase58 === 'function';
  }
}

export class Transaction {
  constructor() {
    return {};
  }
}

export class Connection {
  constructor() {
    return {};
  }
}

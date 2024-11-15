export class Connection {
    constructor() {}
    getVersion() { return Promise.resolve({ 'feature-set': 0 }); }
    getBalance() { return Promise.resolve(1000000000); }
}

export class PublicKey {
    constructor(key) {
        this.key = key;
    }
    toString() { return this.key; }
}

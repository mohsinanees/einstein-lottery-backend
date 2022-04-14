const ethers = require("ethers");
const env = process.env.NODE_ENV || "development";
const config = require("../../config")[env];

// These constants must match the ones used in the smart contract.
const SIGNING_DOMAIN_NAME = "ELT-voucher";
const SIGNING_DOMAIN_VERSION = "1";

/**
 * JSDoc typedefs.
 *
 * @typedef {object} ELTVoucher
 * @property {ethers.address | string} recipient the id of the minted NFT
 * @property {ethers.BigNumber | number} amount  The nonce is the number of vocuhers created from a given address, onced claimed it can never be re used
 * @property {ethers.BigNumber | number} nonce the expiry of voucher, hence cannot be calaimed after the due limit
 * @property {ethers.BigNumber | number} expiry the expiry of voucher, hence cannot be calaimed after the due limit
 * @property {ethers.BytesLike} signature an EIP-712 signature of all fields in the NFTVoucher, apart from signature itself.
 */
class ClaimableVoucher {
    /**
     * Create a new LazyMinter targeting a deployed instance of the LazyNFT contract.
     *
     * @param {Object} options
     * @param {ethers.Contract} contract an ethers Contract that's wired up to the deployed contract
     * @param {ethers.Signer} signer a Signer whose account is authorized to transfer the NFTs on the deployed contract
     */
    constructor({ contract, signer }) {
        this.contract = contract;
        this.signer = signer;
    }

    /**
     * Creates a new NFTVoucher object and signs it using signing key provided.
     *
     * @param {ethers.address | string} recipient the id of the minted NFT
     * @param {ethers.BigNumber | number} amount  The nonce is the number of vocuhers created from a given address, onced claimed it can never be re used
     * @param {ethers.BigNumber | number} nonce The expiry of voucher, hence cannot be calaimed after the due limit
     * @param {ethers.BigNumber | number} expiry The expiry of voucher, hence cannot be calaimed after the due limit
     *
     * @returns {ELTVoucher}
     */
    async createVoucher(recipient, amount, nonce, expiry) {
        const voucher = { recipient, amount, nonce, expiry };
        const domain = await this._signingDomain();
        const types = {
            ELTVoucher: [
                { name: "recipient", type: "address" },
                { name: "amount", type: "uint256" },
                { name: "nonce", type: "uint256" },
                { name: "expiry", type: "uint256" },
            ],
        };
        const signature = await this.signer._signTypedData(domain, types, voucher);
        return {
            ...voucher,
            signature,
        };
    }

    /**
     * @private
     * @returns {object} the EIP-721 signing domain, tied to the chainId of the signer
     */
    async _signingDomain() {
        if (this._domain != null) {
            return this._domain;
        }
        const chainId = config.chainId;
        this._domain = {
            name: SIGNING_DOMAIN_NAME,
            version: SIGNING_DOMAIN_VERSION,
            verifyingContract: this.contract.address,
            chainId,
        };
        return this._domain;
    }
}

module.exports = {
    ClaimableVoucher,
};

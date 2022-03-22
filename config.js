const { mnemonic, test_mnemonic, bsc_quick_node_api_key, matic_quick_node_api_key, infura_key } = require("./secret.json");

module.exports = {
    rinkeby: {
        bsc_chainId: 4,
        matic_chainId: 4,
        bsc_rpc_provider:
            `https://rinkeby.infura.io/v3/${infura_key}`,
        matic_rpc_provider:
            `https://rinkeby.infura.io/v3/${infura_key}`,
        bsc_web_socket_provider: `wss://rinkeby.infura.io/ws/v3/${infura_key}`,
        matic_web_socket_provider: `wss://rinkeby.infura.io/ws/v3/${infura_key}`,
        bsc_mnemonic: test_mnemonic,
        matic_mnemonic: test_mnemonic,
        lottery_contract_address: "0x4fFd172b847f346Ece030591D5a4ddF637C211ee",
        nft_contract_address: "0x564B187e9243F7026b290fb9A6029d27bE1c64B8",
        bsc_signer_address: "0xa6510E349be7786200AC9eDC6443D09FE486Cb40",
        matic_signer_address: "0x1C4A0724DC884076B9196FFf7606623409613Adf",
        winner_cron_exp: "*/10 * * * * *",
        nft_cron_exp: "*/10 * * * * *",
        lottery_start_block_number: 24816676,
    },
    bscmainnet: {
        bsc_chainId: 56,
        bsc_rpc_provider:
            `https://cool-blue-resonance.bsc.quiknode.pro/${bsc_quick_node_api_key}/`,
        bsc_web_socket_provider: `wss://cool-blue-resonance.bsc.quiknode.pro/${bsc_quick_node_api_key}/`,
        bsc_mnemonic: mnemonic,
        lottery_contract_address: "0xc4a7BB05c222520f67c19984b9950CA694D2a113",
        bsc_signer_address: "0x1C4A0724DC884076B9196FFf7606623409613Adf",
        winner_cron_exp: "0 0 * * *",
        nft_cron_exp: "*/5 * * * *",
        lottery_start_block_number:
            16053906,
    },
    maticmainnet: {
        matic_chainId: 137,
        matic_rpc_provider:
            `https://snowy-late-dawn.matic.quiknode.pro/${matic_quick_node_api_key}/`,
        matic_web_socket_provider: `wss://snowy-late-dawn.matic.quiknode.pro/${matic_quick_node_api_key}/`,
        matic_mnemonic: mnemonic,
        nft_contract_address: "0x9CC4B1AC03287CCc8B7B1b27930D9c52feBeA940",
        matic_signer_address: "0x1C4A0724DC884076B9196FFf7606623409613Adf",
    }
};

const { mnemonic, test_mnemonic, bsc_quick_node_api_key, matic_quick_node_api_key, infura_key } = require("./secret.json");

module.exports = {
    development: {
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
        lottery_contract_address: "0xB6e3913386Fb676CE9bCAaF6D2AB1e1bF53654f4",
        nft_contract_address: "0x19cA5c1b9a783508D255DE6E82b0ca4792045C81",
        bsc_signer_address: "0x1C4A0724DC884076B9196FFf7606623409613Adf",
        matic_signer_address: "0x1C4A0724DC884076B9196FFf7606623409613Adf",
        winner_cron_exp: "*/10 * * * * *",
        lottery_start_block_number:
            10500424,
    },
    production: {
        bsc_chainId: 56,
        bsc_rpc_provider:
            `https://cool-blue-resonance.bsc.quiknode.pro/${bsc_quick_node_api_key}/`,
        bsc_web_socket_provider: `wss://cool-blue-resonance.bsc.quiknode.pro/${bsc_quick_node_api_key}/`,
        bsc_mnemonic: mnemonic,
        lottery_contract_address: "0x1789DaA4fb4E8e7807896dc3c02CdCceca64B23a",
        bsc_signer_address: "0x1C4A0724DC884076B9196FFf7606623409613Adf",
        winner_cron_exp: "*/1 * * * *",
        lottery_start_block_number:
            16929499,
        matic_chainId: 137,
        matic_rpc_provider:
            `https://snowy-late-dawn.matic.quiknode.pro/${matic_quick_node_api_key}/`,
        matic_web_socket_provider: `wss://snowy-late-dawn.matic.quiknode.pro/${matic_quick_node_api_key}/`,
        matic_mnemonic: mnemonic,
        nft_contract_address: "0x9CC4B1AC03287CCc8B7B1b27930D9c52feBeA940",
        matic_signer_address: "0x1C4A0724DC884076B9196FFf7606623409613Adf",
    }
};

import Eos = require('eosjs');
const { ecc } = Eos.modules;


const headers = {
    expiration: new Date().toISOString().split('.')[0],
    region: 0,
    ref_block_num: 1,
    ref_block_prefix: 452435776,
    context_free_cpu_bandwidth: 0,
    packed_bandwidth_words: 0,
    context_free_actions: []
}


let eos = null;
const initaPrivate = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3';
const initaPublic = 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV';
const keyProvider = initaPrivate;

const init = async () => {
    const privateKey = await ecc.unsafeRandomKey();
    const config = {
        keyProvider: privateKey,//['5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'], // WIF string or array of keys..
        httpEndpoint: 'http://192.168.2.148:8888',
        mockTransactions: () => 'pass', // or 'fail'
        transactionHeaders: (expireInSeconds, callback) => {
            console.log('=====IN transactionHeaders =====',expireInSeconds);
            callback(null/*error*/, headers)
        },
        expireInSeconds: 60,
        broadcast: false,
        debug: false,
        sign: true
    }
    eos = Eos.Localnet(config);
  

    // eos = Eos.Localnet({keyProvider})


    // eos.transfer();
   
    //const eos = Eos.Testnet();//
}






const newaccount = async () => {
    console.log('==== start new acount====');
    const result = await eos.newaccount({
        creator: 'inita',
        name: 'mynewacct',
        owner: initaPublic,
        active: initaPublic,
        recovery: 'inita'
    })

    console.log(result);
    const { transaction_id, transaction } = result;
    const { compression, data, signatures } = transaction;
    const { region, ref_block_num, actions } = data;
    console.log(`====new acount data :${ref_block_num}====`, actions);
    console.log('====end new acount====');
}
const getBlock = async () => {
    const result = await eos.getBlock({ block_num_or_id: '60' })
    console.log('====getBlock====');
    console.log(result);


}


const transfer = async () => {
    const options = { broadcast: false }
    const result = await eos.transfer({ from: 'inita', to: 'initb', quantity: '1 EOS', memo: '' }, options);
    console.log('====transfer====');
    console.log(result);
}


const test = async () => {
    try {
        await init();
        await newaccount();
        await getBlock();
        await transfer();
    }
    catch (err) {
        return Promise.reject(err);
    }
}

test()
    .catch(err => {
        console.error(err);
    })

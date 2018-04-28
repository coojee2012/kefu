import { AutoTrade } from './AutoTrade';



const privateKey = process.argv[2];
console.log('privateKey:',privateKey);
const run = async ()=>{
    try {
        const autoTrade = new AutoTrade(privateKey);
        await autoTrade.run();

    }catch(ex){
        console.error('run error:',ex);
    }
}
run()
.then(
    
)
.catch(err=>{

})
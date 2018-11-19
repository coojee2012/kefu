import { AutoTrade } from './AutoTrade';
const privateKey = process.argv[2];
const max$ = process.argv[3];
const run = async () => {
    try {
        const autoTrade = new AutoTrade(privateKey, max$);
        await autoTrade.run();

    } catch (ex) {
        console.error('run error:', ex);
    }
}
run()
    .then(
        () => {
            console.log('END!')
        }
    )
    .catch(err => {
        console.error('run error:', ex);
    })
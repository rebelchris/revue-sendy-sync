import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const callRevueAPI = async(endpoint) => {
    const response = await fetch(`https://www.getrevue.co/api/v2/${endpoint}`, {
        headers: {
            Authorization: `Token ${process.env.REVUE_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        method: 'GET',
    }).then((res) => res.json());
    return response;
}

(async () => {
    const revueUnsubscribed = await callRevueAPI('subscribers/unsubscribed');
    console.log(revueUnsubscribed);

    const revueSubscribed = await callRevueAPI('subscribers');
    console.log(revueSubscribed);
})();
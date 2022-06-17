import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const sendyDefaults = {
    api_key: process.env.SENDY_API_KEY,
    list: process.env.SENDY_LIST
}

const callRevueAPI = async (endpoint) => {
    const response = await fetch(`https://www.getrevue.co/api/v2/${endpoint}`, {
        headers: {
            Authorization: `Token ${process.env.REVUE_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        method: 'GET',
    }).then((res) => res.json());
    return response;
}

const callSendyAPI = async (endpoint, body) => {
    const response = await fetch(`https://sendy.daily-dev-tips.com/${endpoint}`, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body
    }).then((res) => res.status);
    return response;
}

const convertToFormData = (data) => {
    const formData = new URLSearchParams();
    Object.keys(data).forEach((key) => {
        formData.set(key, data[key]);
    });
    return formData;
}

(async () => {
    const revueUnsubscribed = await callRevueAPI('subscribers/unsubscribed');

    for (const unsubscriber of revueUnsubscribed) {
        const unsubscribeSendy = await callSendyAPI('/unsubscribe', convertToFormData({
            ...sendyDefaults,
            email: unsubscriber.email
        }))
        console.log(unsubscribeSendy);
    }

    const revueSubscribed = await callRevueAPI('subscribers');
    for (const subscriber of revueSubscribed) {
        const subscribeSendy = await callSendyAPI('/subscribe', convertToFormData({
            ...sendyDefaults,
            email: subscriber.email,
            silent: true,
        }))
        console.log(subscribeSendy);
    }
})();
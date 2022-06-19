import dotenv from 'dotenv';
import fetch from 'node-fetch';
import Fastify from 'fastify';

dotenv.config();
const fastify = Fastify({
    logger: true
})

const sendyDefaults = {
    api_key: process.env.SENDY_API_KEY,
    list: process.env.SENDY_LIST
}

fastify.post('/sendy-webhook', async function (request, reply) {
    const data = request.body;
    if (!data.trigger || !data.email) {
        throw new Error('Invalid data')
    }

    const {trigger, email} = data;
    if (['subscribe', 'unsubscribe'].includes(trigger)) {
        return reply.send({message: 'it works', trigger})
        // const url = `subscribers${trigger === 'unsubscribe' ? '/unsubscribe' : ''}`;
        // const status = await callRevueAPI(url, 'POST', convertToFormData({email}))
        // return reply.send(status);
    }

    throw new Error('Trigger not found')
})

fastify.listen({port: 3000}, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})

const callRevueAPI = async (endpoint, method = 'GET', body) => {
    const response = await fetch(`https://www.getrevue.co/api/v2/${endpoint}`, {
        headers: {
            Authorization: `Token ${process.env.REVUE_API_TOKEN}`,
            'Content-Type': body ? 'application/x-www-form-urlencoded' : 'application/json',
        },
        method,
        body,
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
    console.log('recurring script started')
    // const revueUnsubscribed = await callRevueAPI('subscribers/unsubscribed');
    //
    // for (const unsubscriber of revueUnsubscribed) {
    //     const unsubscribeSendy = await callSendyAPI('/unsubscribe', convertToFormData({
    //         ...sendyDefaults,
    //         email: unsubscriber.email
    //     }))
    //     console.log(unsubscribeSendy);
    // }
    //
    // const revueSubscribed = await callRevueAPI('subscribers');
    // for (const subscriber of revueSubscribed) {
    //     const subscribeSendy = await callSendyAPI('/subscribe', convertToFormData({
    //         ...sendyDefaults,
    //         email: subscriber.email,
    //         silent: true,
    //     }))
    //     console.log(subscribeSendy);
    // }
})();
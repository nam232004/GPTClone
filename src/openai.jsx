import { OpenAI } from 'openai';

const openai = new OpenAI({
    baseURL: 'https://yescale.one/v1',
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

export async function sendMsgToOpenAI(message) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: message }],
            // max_tokens: 256,
            temperature: 0.7,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
        throw error;
    }
}

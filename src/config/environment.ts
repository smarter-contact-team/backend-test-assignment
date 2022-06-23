import 'dotenv/config';

export const env = {
  get topicName() {
    return 'validate-document';
  },

  get veriphone() {
    const apiKey = process.env.VERIPHONE_API_KEY;
    const apiUrl = process.env.VERIPHONE_URL;

    if (!apiKey) {
      throw new Error('No API key provided');
    }

    if (!apiUrl) {
      throw new Error('No API url provided');
    }

    return {
      apiUrl,
      apiKey,
    };
  }
}

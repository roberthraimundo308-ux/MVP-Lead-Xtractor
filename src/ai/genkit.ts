import 'dotenv/config';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

if (!process.env.GEMINI_API_KEY) {
  console.warn(
    'A variável de ambiente GEMINI_API_KEY não foi definida. Os recursos de IA podem não funcionar corretamente no ambiente de produção. ' +
    'Por favor, configure-a nas variáveis de ambiente do seu provedor de hospedagem (ex: Vercel).'
  );
}

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});

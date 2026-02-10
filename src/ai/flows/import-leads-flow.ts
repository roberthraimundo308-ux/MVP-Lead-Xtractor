'use server';
/**
 * @fileOverview An AI flow for importing leads from a spreadsheet.
 *
 * - importLeadsFromString - A function that handles parsing spreadsheet data.
 * - ImportLeadsInput - The input type for the importLeadsFromString function.
 * - ImportLeadsOutput - The return type for the importLeadsFromString function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LeadSchema = z.object({
  id: z.string().describe('A unique identifier for the lead. Should be a random number as a string.'),
  title: z.string().describe('The name of the lead contact person.'),
  description: z.string().describe('A description, often including the monetary value of the lead (e.g., "Valor: R$ 25.000").'),
  company: z.string().describe("The lead's company name."),
  phone: z.string().describe("The lead's phone number."),
  instagram: z.string().describe("The lead's Instagram handle."),
  ownerInitials: z.string().describe('The initials of the lead owner. Pick one initial at random from A, C, M, S.'),
});

const ImportLeadsInputSchema = z.object({
  spreadsheetData: z.string().describe('The string content of a spreadsheet, likely in CSV format.'),
});
export type ImportLeadsInput = z.infer<typeof ImportLeadsInputSchema>;

const ImportLeadsOutputSchema = z.object({
  leads: z.array(LeadSchema),
});
export type ImportLeadsOutput = z.infer<typeof ImportLeadsOutputSchema>;

export async function importLeadsFromString(input: ImportLeadsInput): Promise<ImportLeadsOutput> {
  return importLeadsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'importLeadsPrompt',
  input: { schema: ImportLeadsInputSchema },
  output: { schema: ImportLeadsOutputSchema },
  prompt: `You are an expert data processor. Your task is to parse the provided spreadsheet data and extract lead information, converting it into a structured JSON format.

The data contains information about leads, which may include columns like 'Nome', 'Empresa', 'Email', 'Telefone', 'Website', 'Instagram', and 'Valor'. Your goal is to map this information to the specified JSON schema.

- The 'title' field should come from the 'Nome' (Name) column.
- The 'description' field should be constructed from the 'Valor' (Value) column, formatted as "Valor: R$ X.XXX". If no value is present, use an empty string.
- The 'company' field corresponds to the 'Empresa' (Company) column.
- The 'phone' field corresponds to the 'Telefone' (Phone) column.
- The 'instagram' field corresponds to the 'Instagram' column.
- For 'id', generate a unique random number as a string for each lead.
- For 'ownerInitials', randomly assign one of the following letters: 'A', 'C', 'M', 'S'.

The column order in the input data is not guaranteed. Some fields may be missing for some leads. Be robust to these variations.

Spreadsheet data:
{{{spreadsheetData}}}
`,
});

const importLeadsFlow = ai.defineFlow(
  {
    name: 'importLeadsFlow',
    inputSchema: ImportLeadsInputSchema,
    outputSchema: ImportLeadsOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) {
      return { leads: [] };
    }
    // Ensure IDs are unique in case the LLM messes up
    const uniqueLeads = output.leads.map((lead, index) => ({
        ...lead,
        id: `${new Date().getTime()}_${index}`
    }));
    return { leads: uniqueLeads };
  }
);

import Exa from 'exa-js';
import { SearchOptions, SearchResult, SearchSource } from '@/lib/search/search';
import { SearchCategory, TextSource } from '@/lib/types';
import { logError } from '@/lib/log';

const exa = new Exa(process.env.EXA_API_KEY);

export class EXASearch implements SearchSource {
    private options: SearchOptions;

    constructor(params?: SearchOptions) {
        this.options = params || {};
    }

    async search(query: string): Promise<SearchResult> {
        console.log('EXA search:', query);
        console.log('EXA search options:', this.options);
        try {
            const category = this.options.categories[0];
            const result = await exa.searchAndContents(query, {
                numResults: 10,
                category: category,
                type: 'neural',
                useAutoprompt: true,
            });
            let texts: TextSource[] = [];
            texts = result.results.map((c: any) => {
                return {
                    title: c.author,
                    url: c.url,
                    content: c.text,
                };
            });

            console.log('EXA search result:', texts);
            return { texts, images: [] };
        } catch (error) {
            logError(error, 'search-exa');
            return { texts: [], images: [] };
        }
    }
}

// Citation service to fetch citation counts from various sources

export interface CitationData {
  citationCount: number;
  source: 'semantic_scholar' | 'crossref' | 'manual';
  lastUpdated: Date;
}

export const citationService = {
  // Fetch citations from Semantic Scholar API (free, no API key needed)
  async fetchFromSemanticScholar(doi: string): Promise<number | null> {
    try {
      console.log(`Fetching citations for DOI: ${doi} from Semantic Scholar`);

      const response = await fetch(
        `https://api.semanticscholar.org/graph/v1/paper/DOI:${doi}?fields=citationCount`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        console.warn(`Semantic Scholar API error for ${doi}:`, response.status);
        return null;
      }

      const data = await response.json();
      console.log(`Semantic Scholar returned ${data.citationCount} citations for ${doi}`);
      return data.citationCount || 0;
    } catch (error) {
      console.error('Error fetching from Semantic Scholar:', error);
      return null;
    }
  },

  // Fetch citations from Crossref API (free, no API key needed)
  async fetchFromCrossref(doi: string): Promise<number | null> {
    try {
      console.log(`Fetching citations for DOI: ${doi} from Crossref`);

      const response = await fetch(
        `https://api.crossref.org/works/${doi}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        console.warn(`Crossref API error for ${doi}:`, response.status);
        return null;
      }

      const data = await response.json();
      const citationCount = data.message['is-referenced-by-count'] || 0;
      console.log(`Crossref returned ${citationCount} citations for ${doi}`);
      return citationCount;
    } catch (error) {
      console.error('Error fetching from Crossref:', error);
      return null;
    }
  },

  // Main function to fetch citations (tries multiple sources)
  async fetchCitationCount(doi: string | null): Promise<CitationData> {
    if (!doi) {
      return {
        citationCount: 0,
        source: 'manual',
        lastUpdated: new Date()
      };
    }

    // Clean DOI (remove any prefix like "https://doi.org/")
    const cleanDoi = doi.replace(/^https?:\/\/doi\.org\//, '').trim();

    if (!cleanDoi) {
      return {
        citationCount: 0,
        source: 'manual',
        lastUpdated: new Date()
      };
    }

    // Try Semantic Scholar first (usually more up-to-date)
    let citationCount = await this.fetchFromSemanticScholar(cleanDoi);

    // If Semantic Scholar fails, try Crossref
    if (citationCount === null) {
      citationCount = await this.fetchFromCrossref(cleanDoi);
    }

    // If both fail, return 0
    if (citationCount === null) {
      console.warn(`Could not fetch citations for DOI: ${cleanDoi}`);
      return {
        citationCount: 0,
        source: 'manual',
        lastUpdated: new Date()
      };
    }

    return {
      citationCount,
      source: 'semantic_scholar',
      lastUpdated: new Date()
    };
  },

  // Batch fetch citations for multiple publications
  async batchFetchCitations(dois: (string | null)[]): Promise<Map<string, number>> {
    const results = new Map<string, number>();

    // Add small delay between requests to avoid rate limiting
    for (const doi of dois) {
      if (doi) {
        const cleanDoi = doi.replace(/^https?:\/\/doi\.org\//, '').trim();
        const citationData = await this.fetchCitationCount(cleanDoi);
        results.set(cleanDoi, citationData.citationCount);

        // Wait 300ms between requests to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    return results;
  }
};

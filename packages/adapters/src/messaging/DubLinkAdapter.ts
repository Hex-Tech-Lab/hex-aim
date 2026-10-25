export interface DubLinkConfig {
  apiKey?: string;
  domain?: string;
}

export class DubLinkAdapter {
  private apiKey: string | null;
  private domain: string;

  constructor(config?: DubLinkConfig) {
    this.apiKey = config?.apiKey || process.env.DUB_API_KEY || null;
    this.domain = config?.domain || process.env.DUB_DOMAIN || 'aim.getvintel.com';
  }

  /**
   * Generates a trackable shortlink via Dub.co API with graceful fallback to targetUrl
   */
  public async createShortLink(targetUrl: string, key?: string): Promise<string> {
    if (!this.apiKey) {
      return targetUrl;
    }

    try {
      const res = await fetch('https://api.dub.co/links', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: targetUrl,
          key: key || undefined,
          domain: this.domain,
        }),
      });

      if (!res.ok) {
        return targetUrl;
      }

      const json = await res.json() as any;
      return json.shortLink || json.url || targetUrl;
    } catch {
      return targetUrl;
    }
  }
}

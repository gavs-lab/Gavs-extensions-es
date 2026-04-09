export default {
  name: "MangaOni",
  baseUrl: "https://mangaoni.com",

  headers: {
    "User-Agent": "Mozilla/5.0"
  },

  async request(url) {
    const res = await fetch(url, { headers: this.headers });
    return await res.text();
  },

  async search(query) {
    const html = await this.request(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);

    const results = [];
    const matches = html.matchAll(/href="(\/manga\/[^"]+)".*?title="([^"]+)"/g);

    for (const m of matches) {
      results.push({
        title: m[2],
        url: this.baseUrl + m[1]
      });
    }

    return results;
  },

  async getChapters(mangaUrl) {
    const html = await this.request(mangaUrl);

    const chapters = [];
    const matches = html.matchAll(/href="(\/chapter\/[^"]+)".*?>([^<]+)</g);

    for (const m of matches) {
      chapters.push({
        name: m[2].trim(),
        url: this.baseUrl + m[1]
      });
    }

    return chapters.reverse();
  },

  async getPages(chapterUrl) {
    const html = await this.request(chapterUrl);

    const pages = [];
    const matches = html.matchAll(/<img[^>]+src="([^"]+)"/g);

    for (const m of matches) {
      if (
        m[1].includes(".jpg") ||
        m[1].includes(".png") ||
        m[1].includes(".webp")
      ) {
        pages.push(m[1]);
      }
    }

    return pages;
  }
};

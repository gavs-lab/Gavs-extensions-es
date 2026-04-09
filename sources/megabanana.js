export default {
  name: "MegaBanana Comics",
  baseUrl: "https://megabanana.mx",

  headers: {
    "User-Agent": "Mozilla/5.0"
  },

  async request(url) {
    const res = await fetch(url, { headers: this.headers });
    return await res.text();
  },

  async search(query) {
    const html = await this.request(`${this.baseUrl}/?s=${encodeURIComponent(query)}`);

    const results = [];
    const matches = html.matchAll(/href="(https:\/\/megabanana\.mx\/[^"]+)".*?>([^<]+)<\/a>/g);

    for (const m of matches) {
      if (m[1].includes("leer")) {
        results.push({
          title: m[2].trim(),
          url: m[1]
        });
      }
    }

    return results;
  },

  async getChapters(mangaUrl) {
    // MegaBanana normalmente NO tiene capítulos
    return [
      {
        name: "Leer",
        url: mangaUrl
      }
    ];
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

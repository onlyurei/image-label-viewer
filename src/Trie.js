export const normalizeText = (text = '') =>
  text.replace(/\s+/g, ' ').trim().toLowerCase();

export default class Trie {
  constructor() {
    this.root = { children: {}, val: '' };
  }

  addWord(word, data) {
    if (typeof word !== 'string') return;
    const text = normalizeText(word);
    let p = this.root;
    for (let char of text) {
      if (!(char in p.children)) {
        p.children[char] = { val: char, children: {} };
      }
      p = p.children[char];
    }
    p.children = {};
    p.isEnd = true;
    if (data) {
      const { key, ...rest } = data;
      if (!p.data) p.data = {};
      if (!p.data[key]) p.data[key] = [];
      p.data[key].push(rest);
    }
  }

  getWordsWithPrefix(prefix) {
    if (typeof prefix !== 'string') return [];
    const text = normalizeText(prefix);

    let p1 = this.root;
    for (let char of text) {
      if (!(char in p1.children)) {
        return [];
      }
      p1 = p1.children[char];
    }

    if (p1.isEnd) return [{ word: prefix, data: p1.data }];

    const leafNodes = [];

    const q = [p1];
    while (q.length) {
      const { length } = q;
      for (let i = 0; i < length; i++) {
        const node = q.shift();
        const children = Object.values(node.children);
        for (let child of children) {
          child.parent = node;
          q.push(child);
        }
        if (!children.length) {
          leafNodes.push(node);
        }
      }
    }

    const words = [];
    for (let leafNode of leafNodes) {
      let p2 = leafNode;
      let affix = '';
      do {
        affix = p2.val + affix;
        p2 = p2.parent;
      } while (p2 !== p1 && p2);
      words.push({ word: prefix + affix, data: leafNode.data });
    }
    return words;
  }
}

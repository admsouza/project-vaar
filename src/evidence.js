export const maximumFileSize = 10 * 1024 * 1024;
export const maximumPages = 10;

export function normalize(value) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

const keywords = {
  I: ['gestores escolares', 'diretores escolares', 'diretor escolar', 'gestao escolar', 'merito e desempenho', 'selecao de gestores', 'selecao de diretores'],
  II: ['avaliacoes nacionais', 'participacao no saeb', 'taxa de participacao', 'avaliacao da educacao basica', 'saeb'],
  III: ['desigualdades educacionais', 'desigualdades raciais', 'equidade racial', 'desigualdades socioeconomicas'],
  IV: ['regime de colaboracao', 'reparticao do icms', 'icms educacao', 'icms educacional', 'cota parte do icms'],
  V: ['referencial curricular', 'referenciais curriculares', 'base nacional comum curricular', 'bncc'],
};

const stopWords = new Set([
  'a', 'as', 'ao', 'com', 'da', 'das', 'de', 'do', 'dos', 'e', 'em', 'um', 'uma', 'o', 'os',
  'no', 'na', 'nas', 'nos', 'por', 'para', 'qual', 'quais', 'que', 'como', 'onde', 'sobre',
  'encontro', 'buscar', 'exigencia', 'condicionalidade', 'vaar',
]);

export function matchesSearch(query, fields) {
  const terms = normalize(query).split(' ').filter(term => term && !stopWords.has(term));
  const text = normalize(fields.filter(Boolean).join(' '));
  return terms.every(term => text.includes(term));
}

export function matchesCondition(query, condition) {
  const number = /^(?:inciso )?(i|ii|iii|iv|v)$/.exec(normalize(query));
  if (number) return number[1] === condition.id.toLowerCase();
  return matchesSearch(query, [
    condition.id, condition.name, condition.description, condition.evidence,
    ...keywords[condition.id], 'lei 14113 lei 14.113 art artigo 14 inciso', '2026',
  ]);
}

function readDate(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})\b/.exec(value);
  if (!match) return '';
  const [, day, month, year] = match;
  const iso = `${year}-${month}-${day}`;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== iso ? '' : iso;
}

export function suggestEvidence(pages) {
  const lines = pages.flatMap(({ page, text }) => text.split(/\r?\n/)
    .map(line => line.trim()).filter(Boolean)
    .map(line => ({ page, line })).slice(0, 1500));
  const suggestions = {};

  function labeled(field, pattern, maxLength, transform = value => value) {
    const matches = lines.flatMap(({ line, page }) => {
      const match = pattern.exec(line);
      const value = match && transform(match[1].trim());
      return value && value.length <= maxLength && line.length <= 200 ? [{ value, page, excerpt: line }] : [];
    });
    if (matches.length && matches.every(match => normalize(match.value) === normalize(matches[0].value))) {
      suggestions[field] = matches[0];
    }
  }

  labeled('title', /^(?:t[ií]tulo|documento)\s*[:–-]\s*(.+)$/iu, 120);
  if (!suggestions.title) {
    const heading = lines.slice(0, 12).find(({ line }) =>
      /^(?:portaria|decreto|edital|resolu[çc][ãa]o|lei|instru[çc][ãa]o normativa)\s+(?:n[º°o.]?[.\s]*)?\d|^(?:relat[óo]rio|referencial curricular)\s+(?:de|da|do|das|dos)\s+/iu.test(line)
      && line.length <= 120);
    if (heading) suggestions.title = { value: heading.line, page: heading.page, excerpt: heading.line };
  }

  labeled('owner', /^respons[áa]vel\s*[:–-]\s*(.+)$/iu, 80);
  labeled('documentDate', /^(?:data do documento|data de emiss[ãa]o|emitido em)\s*[:–-]\s*(.+)$/iu, 10, readDate);
  labeled('protocol', /^(?:n[úu]mero do protocolo|protocolo)\s*[:–-]\s*(.+)$/iu, 50);

  const ranked = Object.entries(keywords).map(([id, phrases]) => {
    const matches = phrases.flatMap(phrase => {
      const entry = lines.find(({ line }) => line.length <= 220 && ` ${normalize(line)} `.includes(` ${phrase} `));
      return entry ? [{ ...entry, weight: phrase.includes(' ') ? 2 : 1 }] : [];
    });
    return { id, score: matches.reduce((score, item) => score + item.weight, 0), match: matches[0] };
  }).sort((first, second) => second.score - first.score);
  if (ranked[0].score >= 2 && ranked[0].score > ranked[1].score) {
    const { id, match } = ranked[0];
    suggestions.condition = { value: id, page: match.page, excerpt: match.line };
  }
  return suggestions;
}

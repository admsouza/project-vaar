export { municipalities } from './municipalities.js';

export const sources = {
  lista: {
    label: 'FNDE · Lista de beneficiários do VAAR 2026',
    url: 'https://www.gov.br/fnde/pt-br/acesso-a-informacao/acoes-e-programas/financiamento/fundeb/2026-1/listaentesbeneficiariosenaobeneficiariosacomplementacaovaardofundeb2026-i.pdf/@@display-file/file',
  },
  p11: {
    label: 'FNDE · P11, 3ª publicação · Portaria MEC/MF nº 11/2026',
    url: 'https://www.gov.br/fnde/pt-br/acesso-a-informacao/acoes-e-programas/financiamento/fundeb/2026-1/publicacoes-2026/3-publicacoes/6-redes-beneficiadas-coeficientes-de-distribuicao-e-complementacao-vaar-prevista-p11.pdf/@@display-file/file',
  },
  law: {
    label: 'Lei nº 14.113/2020 · art. 14, § 1º',
    url: 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/lei/l14113.htm#art14',
  },
};

export const conditions = [
  { id: 'I', name: 'Seleção de gestores escolares', description: 'Critérios técnicos de mérito e desempenho na seleção de gestores.', evidence: 'Ato normativo e documentação do processo seletivo.' },
  { id: 'II', name: 'Participação nas avaliações', description: 'Participação dos estudantes nas avaliações nacionais da educação básica.', evidence: 'Relatório de acompanhamento da participação da rede.' },
  { id: 'III', name: 'Redução das desigualdades', description: 'Redução das desigualdades educacionais, socioeconômicas e raciais.', evidence: 'Registro da análise dos resultados e ações da rede.' },
  { id: 'IV', name: 'Regime de colaboração e ICMS', description: 'Regime de colaboração entre estado e municípios e critérios para repartição do ICMS.', evidence: 'Ato estadual e registros do regime de colaboração.' },
  { id: 'V', name: 'Referenciais curriculares', description: 'Referenciais curriculares alinhados à Base Nacional Comum Curricular.', evidence: 'Referencial curricular e ato de aprovação.' },
];

export function initialRecords(code) {
  return code === '2507200' ? [{
    id: 'example-i', condition: 'I', title: 'Ato de seleção de gestores', owner: 'Equipe de gestão escolar',
    deadline: '', notes: 'Exemplo para testar a organização do dossiê.', file: '',
    history: [{ state: 'Pendente', at: '2026-11-23T09:00:00-03:00' }],
  }] : [];
}

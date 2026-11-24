# Rastreabilidade e validação do Gov App VAAR

**Revisão 0.1 · 24/11/2026 · Descoberta**

[Briefing v1.10](Briefing_VAAR_v1.10.docx) · [PRD v0.3](PRD-VAAR-v0.3.md) · [Protótipo v6](https://gov-app-vaar-prototipo.js-ads.chatgpt.site) · [Issue #1 — piloto e DDR](https://github.com/admsouza/project-vaar/issues/1)

## Evidências disponíveis

| ID | Evidência e alcance |
|---|---|
| EV01 | Publicação v6 concluída em 24/11/2026, commit `7c702062ec868a1ba721ddb79f5c72cc28cb83b9`. O build local desse commit passou e incluiu o PDF fictício. A revisão inspecionou o código desse commit. |
| EV02 | O briefing §5.3 registra teste anterior com PDF digitalizado fictício, correção do protocolo e recuperação após recarga. O teste interativo não foi repetido nesta revisão. |
| EV03 | GitHub Pages workflow #2. A captura mostra build aprovado e falha 404 no deploy. A evidência vale para o workflow do protótipo e não cobre os aceites funcionais abaixo. |

## Cenários de aceite

O status indica a evidência disponível. A issue #1 coordena o piloto e o DDR. Issues de implementação serão vinculadas por cenário após decisão sobre a baseline.

| ID | Briefing → PRD | Ação e resultado esperado | Evidência / situação |
|---|---|---|---|
| CT001 | §§5.3, 27.1 → RF001/RN001 | Trocar município. Conferir habilitação e benefício separados, fonte e edição. Para rede habilitada sem P11, mostrar ausência de linha preservando a habilitação. | EV01. Código inspecionado. Validar a interação e cenário de fonte ausente. |
| CT002 | §§26, 27.2 → RF003/RN003 | Buscar sinônimo e localizar ato, dispositivo, vigência, página, responsável, documento, passo e prazo. | EV01. Busca e checklist existem. Validar a consulta integrada e a referência por regra. |
| CT003 | §§26.1, 27.3 → RF004/RN004, IE001 | Submeter 5/10, 6/10, total zero, ausência, quantidades inválidas e divergência do Censo. Esperar falha de maioria, maioria atendida, revisão ou alerta conforme o RF004. No reaproveitamento, conferir novas perguntas. | EV01. Checklist manual. Aceite da pré-validação funcional pendente. |
| CT004 | §§26.2, 27.4 → RF005/RN005 | Conferir que II/III indicam aferição pelo Inep e IV comprovação estadual. Registro interno não altera a aferição. | EV01. Orientações demonstradas. Validar fontes e estados publicados por ciclo. |
| CT005 | §§26.1, 27.5 → RF006/RN005, IE001 | Reaproveitar BNCC geral e omitir Computação. A exigência de Computação continua visível e a validação funcional sinaliza a ausência. | EV01. Checklist demonstrado. Bloqueio funcional e perguntas impeditivas pendentes. |
| CT006 | §§5.3, 27.6 → RF007/RNF005, IE005 | Ler PDF fictício digitalizado, corrigir uma sugestão e descartar outra. Conferir página e trecho. PDF ilegível abre caminho manual e ausência ou divergência gera alerta quando aplicável. | EV01–EV02. OCR, revisão e recuperação têm registro técnico anterior. Cobertura ampliada de campos e alertas pendente. |
| CT007 | §27.7 → RF008/RF009/RN006, IE002 | Salvar pendência vinculada à evidência. Registrar diligências com comunicação anterior e posterior ao prazo geral, sem prazo oficial e com prazo vencido. Conferir prazo interno separado, histórico e alertas. | EV01. Há orientação sobre Simec. Registro, alertas e revisão da contagem pendentes. |
| CT008 | §§26.3, 27.8 → RF010/RF011/RN007, IE004 | Aprovação com inconsistência impeditiva é bloqueada. Devolver com justificativa e reenviar para revisão. O protocolo só entra como registro de situação conferida no Simec. | EV01. Há orientação do fluxo oficial. Aprovação interna, devolução e registro oficial estruturado pendentes. |
| CT009 | §§5.3, 27.9 → RF012/RNF002 | Salvar, recarregar e buscar evidência por protocolo. Exportar dossiê. Em fase funcional, trocar município/ciclo e verificar isolamento, versão, PDF original e SHA-256. | EV01–EV02. Histórico local demonstrado. Aceite funcional pendente. |
| CT010 | §§6.1, 18, 23.5 → RF013/RN001, IE003 | Reimportar arquivo sem duplicar publicação. Processar retificação sem sobrescrever edição anterior. Conferir divergências com fonte e hash. | Pendente de fonte, massa e teste de ingestão. |
| CT011 | §§7.2, 22, 27.10 → RNF001–RNF004, IE005 | Verificar transporte e armazenamento cifrados, autorização em cada endpoint, MFA para aprovação, minimização e tratamento de dados. Testar restauração, acessibilidade e observabilidade. | Aceite indispensável ao piloto funcional com dados reais. Evidências pendentes. |

## Roteiro para as redes

1. Antes da sessão, registrar rede, perfil, data, versão/commit, tarefa, fonte e autorização de uso do exemplo fictício ou anonimizado.
2. Pedir ao participante que encontre uma exigência, confira um comprovante e recupere o registro. Incluir I ou V, a responsabilidade pela IV e a ação do secretário em caso de diligência. Usar o mesmo material e critério de conclusão no fluxo atual e no protótipo.
3. Medir tempo total incluindo revisão, campos digitados, correções/devoluções e evidências com origem identificada. Anotar intervenções, erros e tarefas incompletas. Registrar um resultado por cenário e rede.
4. Consolidar os resultados na issue #1. Registrar decisão, responsável e evidência para cada IE001–IE006. Onde o escopo for reduzido, registrar a mudança aprovada. Só então consolidar e submeter o DDR à aprovação.

| Rede/perfil/data | Cenário e versão | Tempo atual / protótipo | Campos digitados atual / protótipo | Correções e devoluções | Evidências rastreáveis / avaliadas | Resultado, ajuda e referência |
|---|---|---|---|---|---|---|
| A preencher com sessão realizada | — | — | — | — | — | — |

## Passagem para a esteira

Para cada issue futura, incluir IDs do requisito e do caso de teste, dependências e checklist de aceite. Conferir issue aberta, label e status Ready no Project, ausência de PR relacionado e SHA base verificável antes do handoff. No fluxo assistido, registrar também hash do corpo da issue e caminhos autorizados. Entregar por PR draft, com resultados reais dos testes e do CI para revisão humana. A issue #1 permanece em descoberta.

# PRD — Gov App VAAR

**Versão 0.2 · 24/11/2026 · Em descoberta primária, para revisão de produto**  
**Projeto de referência** [admsouza/project-vaar](https://github.com/admsouza/project-vaar)

## 1. Problema e objetivo

A equipe municipal precisa localizar a exigência aplicável ao ciclo, conferir o comprovante, coordenar a revisão e recuperar o histórico quando houver cobrança ou diligência. O briefing mostra etapas, atores e fontes documentais distintos. A frequência do retrabalho, o esforço gasto e a disposição a pagar ainda precisam de evidência de campo.

**Resultado a testar** — O técnico consegue localizar uma exigência, registrar a evidência revisada e recuperar o registro com menos tempo total e menos digitação que no fluxo atual, mantendo a referência ao documento e à regra utilizada.

| Perfil | Trabalho a realizar |
|---|---|
| Técnico da Secretaria de Educação | Selecionar rede e ciclo, identificar o que comprovar, conferir documentos e preparar o dossiê. |
| Revisor municipal | Encontrar inconsistências, devolver com justificativa e conferir a correção. |
| Secretário de Educação | Revisar o trabalho interno e executar a confirmação e o envio no Simec, conforme o fluxo descrito no briefing. |
| Gestor/comprador | Avaliar valor operacional, adoção e viabilidade de contratação. Papéis, dotação e decisão de compra seguem em descoberta. |
| Especialista VAAR e jurídico, TI e encarregado municipal | Validar matriz normativa, critérios de aceite, dados, permissões e condições do piloto. |

## 2. Evidência e prioridades propostas

| ID | Categoria | Registro e origem |
|---|---|---|
| C01 | Certeza documental | O briefing §5.3 registra protótipo privado publicado em 23/11/2026, diagnóstico dos 223 municípios da PB para VAAR 2026, checklist de preparação 2027, OCR e histórico local. |
| C02 | Certeza documental | O teste técnico descrito no §5.3 usou PDF fictício digitalizado, com correção de protocolo e recuperação após recarga. |
| S01 / H01 | Suposição / hipótese | Referências pesquisáveis, leitura assistida e histórico poupam tempo e digitação na tarefa completa. Validar por comparação pareada (§§12.1, 23–24). |
| S02 / H02 | Suposição / hipótese | Pendências, diligências e revisão rastreável reduzem devoluções evitáveis e têm valor para a gestão. Validar em caso documentado e observado. |
| S03 / H03 | Suposição / hipótese | Redes adotariam e contratariam o fluxo integrado. Validar alternativas, fluxo de compra, custo de operação e interesse formal (§§19–24). |
| D01 | Dúvida | Quais exceções, documentos e permissões o fluxo real exige? Usar casos anonimizados e decisões nas pendências da seção 8. |

**Must proposto** para avaliação do fluxo principal: rede/ciclo e diagnóstico, manual, preparação I–V, leitura revisável e dossiê com histórico. **Should proposto** na sequência: pendências/diligências e revisão formal. O recorte operacional completo do §27 permanece no catálogo abaixo. A sequência é proposta para discussão com produto e não representa redução aprovada do escopo. Os controles para dados reais são condição de entrada no piloto funcional.

**Fora do escopo inicial:** plataforma pedagógica, cadastros nominais de alunos, PME e ICMS Educação como módulos próprios, reprodução integral dos cálculos Inep, IA generativa de acervo, envio automatizado ao Simec e previsão de benefício financeiro. O regime de colaboração e o ICMS Educação continuam visíveis como informação da condicionalidade IV.

## 3. Fluxo e fronteiras

1. Escolher município pelo código IBGE e exercício ou ciclo. Abrir **Diagnóstico 2026** para ver a publicação do exercício ou **Preparação 2027** para revisar a comprovação conduzida em 2026.
2. Localizar a condicionalidade por termo ou sinônimo. Conferir responsável, referência, vigência, documento, prazo e passo no Simec.
3. Informar os dados do checklist, importar o PDF, revisar as sugestões com página e trecho e salvar os campos confirmados. Registrar responsável e prazo interno.
4. Abrir pendência diante de problema interno. Caso haja diligência oficial, registrar comunicação, motivo, orientação e prazo em registro próprio e conferir o Simec.
5. Revisar, devolver para correção ou aprovar internamente. Acompanhar o envio feito pelo secretário no Simec e registrar protocolo, data e situação oficial quando disponíveis.
6. Recuperar evidência e versões no histórico. Exportar o dossiê interno em PDF.

**Estados internos de conferência** (§27.10): não conferido → incompleto ou inconsistente → pronto para revisão → aprovado internamente. A revisão formal registra rascunho, revisão, devolução e aprovação (§27.8). A devolução reabre a tarefa. O DDR deverá definir o relacionamento entre os dois conjuntos, permissões, transições e efeitos de alterações após aprovação. Situação oficial é um campo independente com origem e data.

## 4. Requisitos funcionais candidatos

IDs do catálogo DDR definidos na revisão **0.1**. A revisão **0.2** preserva os IDs dos requisitos vigentes. “Aceite” indica prova futura, com massa e decisão a registrar no DDR. As origens referem-se ao Briefing v1.9.

| ID | Função e ator | Aceite observável | Origem |
|---|---|---|---|
| RF001 | Consultar diagnóstico municipal e fontes. Técnico/gestor. | Selecionar um dos 223 municípios PB e exercício suportado. Mostrar habilitação, beneficiário, valor quando publicado, cinco condicionalidades e fonte/data/edição. Rede habilitada sem linha P11 conserva a habilitação e mostra “sem linha publicada nesta edição”. Troca de contexto atualiza o conjunto exibido. | §§5.3, 15, 23.5, 27.1 |
| RF003 | Buscar no manual interativo. Técnico. | Busca por termo ou sinônimo encontra a exigência e mostra ato/dispositivo, vigência, página, responsável, documento, passo no Simec e prazo aplicável. Distinguir registro completo e confirmação anterior autorizada. | §§26, 27.2 |
| RF004 | Pré-validar condicionalidade I. Técnico. | Conferir norma publicada, edital/equivalente, conclusão do processo antes do envio, quantitativos e reaproveitamento elegível. Testar 5/10 e 6/10, zero, ausência, não inteiro, negativo e selecionados acima do total. Na divergência com o Censo Escolar 2025, registrar alerta e justificativa, com parametrização das tolerâncias condicionada à IE001. | §§26.1, 27.3 |
| RF005 | Acompanhar II, III e IV. Técnico/gestor. | Mostrar situação e fonte da aferição do Inep para II/III e da comprovação estadual para IV. Upload municipal não altera a situação exibida. | §§26.2, 27.4 |
| RF006 | Pré-validar condicionalidade V. Técnico. | Exibir caminho de currículo próprio ou adesão estadual, datas e documentos aplicáveis. Se a BNCC geral for confirmada por reaproveitamento, mantém exigência de Computação, aprovação/adesão e perguntas aplicáveis. Campos bloqueados permanecem protegidos e resposta impeditiva gera alerta. | §§26.1, 27.5 |
| RF007 | Ler e revisar comprovante PDF. Técnico. | Até 10 MB e 10 páginas no piloto. Extrair texto/OCR e sugerir campos identificados com página e trecho. Confirmar, corrigir ou descartar por campo. PDF ilegível ou extração insuficiente encaminha para revisão manual. Indicativo de assinatura no texto fica como observação. | §§5.3, 27.6 |
| RF008 | Gerenciar pendência interna. Técnico/revisor. | Vincular município, ciclo, requisito, regra e evidência. Salvar risco, responsável, ação e prazo interno. Atualização conserva o histórico. | §27.7 |
| RF009 | Registrar diligência oficial. Técnico. | Registrar motivo, orientação, comunicação, prazo oficial, substituição, reenvio e resultado. Sem prazo oficial registrado, mostrar “prazo a conferir”. Validar alerta de prazo próximo/vencido segundo a configuração aprovada. Preservar versões e distinção do prazo interno. | §§23.5, 26.3, 27.7 |
| RF010 | Revisar e aprovar internamente. Revisor/perfil autorizado. | Inconsistência impeditiva em aberto bloqueia aprovação. Devolução com autor, data e justificativa reabre a tarefa. Corrigir e submeter novamente mantém decisões anteriores. | §§26.3, 27.8 |
| RF011 | Registrar envio oficial observado. Técnico/perfil autorizado. | Registrar protocolo, data e situação conferida no Simec, vinculados ao ciclo. Operação interna não atualiza o estado oficial automaticamente. | §§26.3, 27.8 |
| RF012 | Buscar histórico e exportar dossiê. Técnico/revisor. | Recuperar após recarga por protocolo, responsável ou documento dentro do município/ciclo. Exportar PDF com evidências, pendências, fontes, data, situação, versões, protocolos e histórico disponíveis. | §§5.3, 27.9 |
| RF013 | Incorporar e conciliar publicação oficial. Operação de dados a confirmar. | Reimportar o mesmo arquivo sem duplicar publicações; ao receber retificação, preservar edições, registrar diferenças e manter rastreável o valor exibido. Divergência de conciliação deve ficar disponível para revisão antes da publicação. | §§6.1, 15, 17–18, 23.5 |

## 5. Regras de negócio candidatas

| ID | Regra e condição de uso | Origem e funções |
|---|---|---|
| RN001 | Habilitação, situação de beneficiário, resultado de indicador e valor publicado são atributos independentes por exercício. Ausência de linha não é valor zero. Distinguir não publicado, não informado, não aplicável, a validar e fonte indisponível. | §§6.1, 17, 23.5 → RF001/RF005/RF013 |
| RN003 | Regra tem ato, dispositivo, exercício, vigência e fonte. Para preparação 2027, o briefing adota 15/09/2026 como fim do prazo geral, atualizado pela CIF nº 28/2026. O prazo de 31/08/2026 aparece no guia anterior. Curadoria valida os atos antes de liberar regras. | §§26–27.2 → RF003/RF009 |
| RN004 | Selecionados por mérito/desempenho devem superar metade do total válido, incluindo a escolha pela comunidade dentre os previamente aprovados quando aplicável. Fonte da comparação: Censo Escolar 2025. Faixas de tolerância registradas no guia: 1 diretor, um a mais; 2–8, dois a mais; 9–27, três a mais; acima de 27, 10%. Direção e arredondamento dependem de esclarecimento antes de automatizar. | §§26.1, 27.3 e guia pp. 9–14 e 50–56 → RF004 |
| RN005 | Inep afere II/III e indicadores. Estado comprova IV, cuja situação se aplica aos municípios. A confirmação de documentação elegível da BNCC geral mantém a comprovação da Computação. | §§26.1–26.2, 27.4–27.5 → RF005/RF006 |
| RN006 | Regra candidata de diligência para o ciclo 2026/2027: 15 dias contados da comunicação ou do fim do prazo de registro, o que ocorrer depois, conforme art. 7º citado no briefing. Testar comunicação antes e depois do fim do prazo. Exibir separadamente a data oficial informada no Simec e qualquer referência usada na conferência. | §§23.5, 26.3, 27.7 → RF009 |
| RN007 | Resultado de conferência do produto é interno. Sugestões documentais requerem revisão humana. Só o fluxo oficial conduz à confirmação do Termo de Veracidade e envio do secretário. | §§26.3, 27.6, 27.8–27.10 → RF007/RF010/RF011 |

## 6. Dados, persistência e qualidades

| Entidade ou fonte | Informação mínima e tratamento proposto |
|---|---|
| Município/ciclo | Código IBGE, rede, exercício financeiro e ano de referência. Usar a chave de município/ciclo no diagnóstico, checklist, busca, dossiê e evidências. |
| FNDE, Inep, IBGE e guia/atos | Vincular órgão, URL, edição/ato, exercício, data de publicação/coleta, arquivo bruto e SHA-256 quando houver arquivo de origem, chave e transformação. Conciliar FNDE/P11 com a edição fixada e testes do §23.5. Usar resultados agregados publicados e manter motivo oficial e estado de confiança quando disponíveis. |
| Evidência | Versão, nome, condicionalidade, campos revisados, página e trecho, responsável, prazo interno e vínculo à regra. No protótipo, metadados ficam no navegador e o original é guardado separadamente. Na fase funcional, armazenar o original de forma privada com SHA-256, preservando versões e aplicando política de retenção aprovada. |
| Diligência, decisões e auditoria | Referência do caso, data, autor, justificativa, evento, situação anterior/nova, versão de regra/base e proveniência. Simec é fonte para conferência manual. Disponibilidade de integração autenticada segue a confirmar. |

| ID | Requisito não funcional candidato | Evidência esperada |
|---|---|---|
| RNF001 | Autenticação e autorização por município e função, proteção do armazenamento e autenticação reforçada para aprovação no piloto funcional. | Testes de acesso cruzado negado em consulta, alteração, anexo e exportação. Matriz de papéis e política de MFA aprovadas. §§7, 22, 27.10. |
| RNF002 | Integridade, versionamento e auditoria para dados oficiais e registros internos. | Snapshot reproduzível pelo arquivo e metadados. Usuário comum não consegue apagar ou reescrever silenciosamente o histórico. §§6.1, 7, 18, 22. |
| RNF003 | Minimizar dados pessoais. Usar exemplos fictícios/anonimizados no protótipo e restringir o acesso a dados operacionais reais após validação de privacidade e segurança. | Mapa de dados, finalidade, papéis, retenção, descarte e procedimento de incidente acordados. §§8, 22, 27.9–27.10. |
| RNF004 | Acessibilidade, continuidade e observabilidade na fase funcional. | Verificar teclado, contraste e responsividade, com WCAG 2.2 AA como referência. Demonstrar restauração e exportação dos dados e identificar falha de ingestão. Metas de serviço e critérios completos seguem em IE005. §§7.2, 22. |
| RNF005 | Manter verificações determinísticas versionadas por ciclo e separar sugestões do leitor da decisão sobre a conferência. | Cenários automatizados de fronteira por edição. Testar PDF ilegível, sugestões corrigidas e regras com fonte/versão. §27.10. |

## 7. Métricas, plano de validação e gate

Usar a mesma tarefa, material e critério de conclusão no fluxo atual e no protótipo. Medir por caso e rede, incluindo revisão, correções e dúvidas. Registrar data, exercício, função do participante, autorização e fonte. A comparação é preliminar. O briefing não fixa metas numéricas de redução.

| Medida | Coleta |
|---|---|
| Tempo total | Do início da busca à recuperação do registro completo, incluindo revisão. |
| Campos digitados manualmente | Contar preenchimentos manuais e identificar correções de sugestões. |
| Correções e devoluções | Contar eventos, registrar motivo e distinguir correção antes do salvamento de devolução após revisão. |
| Rastreabilidade | Evidências com fonte identificada divididas pelo total de evidências avaliadas. Conferir página e trecho quando houver sugestão documental. |
| Adoção e mercado | Execução sem ajuda, intervenções, uso recorrente e interesse formal. Registrar interesse separadamente de contratação e pagamento. |

Primeira rodada proposta pelo briefing: João Pessoa, Patos e Cuitegi. Validar localização das exigências I/V, responsabilidade pela IV, ação do secretário, leitura revisada de PDF, recuperação do histórico e localização da orientação e do prazo em cenário de diligência. A preparação foi aprovada em 23/11/2026. Adesão e resultados das redes seguem em aberto.

**Antes de congelar o PRD** (§23.4): entrevistar 12–20 secretarias, obter 2–3 exemplos anonimizados, observar ao menos uma execução completa, testar o protótipo com três redes e buscar duas manifestações formais de interesse. Concluir demonstrações e comparação de alternativas, além de validar a matriz normativa, critérios de aceite, dados e premissas de contratação com os responsáveis. Registrar decisão por versão. A investigação comercial não comprova ganho operacional, e o teste técnico do protótipo não substitui observação de campo.

## 8. Informações a esclarecer

| ID | Pergunta | Responsável sugerido / impacto |
|---|---|---|
| IE001 | Qual direção e arredondamento adotar na comparação com o Censo, inclusive acima de 27? Quais regras e respostas são impeditivas a cada caminho I/V? | Especialista VAAR/jurídico. Bloqueia automação dos critérios ambíguos. |
| IE002 | Qual regra de contagem, referência de início e tratamento de calendário usar na conferência do prazo de diligência? Qual antecedência aciona alerta interno? | Especialista VAAR e redes piloto. Bloqueia homologação de prazo/alerta. |
| IE003 | Quais arquivos, colunas, chaves e frequência de coleta são verificáveis por exercício? Como tratar retificações e indisponibilidade de uma fonte? | Dados e domínio. Bloqueia homologação de ingestão. |
| IE004 | Quem cria, revisa, devolve, aprova e registra envio? Quais alterações reabrem revisão e geram nova versão? | Produto e secretaria piloto. Bloqueia fechamento da matriz e máquina de estados do DDR. |
| IE005 | Quais metas de desempenho, restauração, retenção, exclusão e acesso a documentos são exigidas? Como tratar PDF corrompido ou protegido e quais formatos de saída são necessários além do dossiê PDF? | TI, encarregado e produto. Bloqueia aceite para dados reais nos pontos aplicáveis. |
| IE006 | Qual linha de base por perfil e qual redução torna o piloto aceitável? Quem valida resultado e aprova a versão? | Produto e redes piloto. Bloqueia declaração de ganho e baseline aprovada. |

## 9. Handoff para DDR e esteira

1. Após o gate de descoberta, registrar versão acordada, aprovadores, evidências e mudanças de escopo. Manter histórico e IDs.
2. Detalhar no DDR fluxos, exceções, validações, estados, permissões, modelo de dados, integrações e testes por requisito. Para dados oficiais, fixar edição, arquivo e hash antes de homologar a importação.
3. Derivar issues com objetivo, IDs de origem, dependências, caminhos autorizados e checklist de aceite. Sequência proposta para decomposição: contexto e fontes → manual e pré-validação → evidência/dossiê → pendências/revisão. Segurança, persistência e auditoria entram antes de qualquer piloto com dados operacionais reais.
4. Tornar cada issue elegível após revisão independente: issue aberta, label e status Ready no Project, critérios em checklist, ausência de PR relacionado e SHA base verificável. O handoff assistido congela SHA, hash do corpo e caminhos autorizados. A entrega segue por PR draft, evidências de testes/CI e revisão humana.
5. Registrar após teste e publicação a versão, a data, as evidências e as lacunas no briefing §5.3. Comparar ao escopo §27 antes de declarar equivalência.

## Fontes

- [Briefing VAAR v1.9](https://chatgpt.com/library?file_id=libfile_44a91afd637c819198b17c671bcd7d56&account_id=personal). Base de produto, situação reportada e regras candidatas. Referências normativas e operacionais seguem os localizadores do briefing e aguardam o gate de curadoria.
- [Levantamento de requisitos v0.8](https://github.com/admsouza/levantamento-requisitos/blob/main/docs/framework.md), [identificadores](https://github.com/admsouza/levantamento-requisitos/blob/main/docs/identificadores.md) e [modelos](https://github.com/admsouza/levantamento-requisitos/blob/main/modelos/README.md). CSD, hipóteses, rastreabilidade, aceite, esclarecimentos e controle de versão.
- [Software Delivery Pipeline](https://github.com/admsouza/software-delivery-pipeline/blob/main/README.md) e [arquitetura da esteira](https://github.com/admsouza/software-delivery-pipeline/blob/main/ARCHITECTURE.md). Elegibilidade, handoff, PR draft, CI e revisão humana.
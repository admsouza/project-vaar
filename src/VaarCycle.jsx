import React, { useState } from 'react';
import cycle from './vaarCycle.json';

const storageKey = 'gov-app-vaar-cycle-2026-2027';

function loadChecklist(code) {
  try {
    return JSON.parse(localStorage.getItem(storageKey + ':' + code)) ?? {};
  } catch {
    return {};
  }
}

function OfficialLink({ href, children }) {
  return <a className="source underline" href={href} target="_blank" rel="noreferrer">{children}</a>;
}

export function VaarCycle({ code, municipality, selector }) {
  const [checklist, setChecklist] = useState(() => loadChecklist(code));
  const [storageError, setStorageError] = useState(false);

  function update(item, checked) {
    const next = { ...checklist, [item]: checked };
    setChecklist(next);
    try {
      localStorage.setItem(storageKey + ':' + code, JSON.stringify(next));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }

  return <>
    <div className="page-heading">
      <p>VAAR · Ciclo 2026/2027</p>
      <h1>Preparação para o Simec</h1>
      <p>Comprovação em 2026 para a complementação de 2027. O diagnóstico do Gov App mostra a publicação do VAAR 2026 em sua própria tela.</p>
    </div>
    <div className="scope-panel panel mb-4">{selector}</div>
    <section className="panel space-y-3 p-5 sm:p-6" aria-label="Prazo e fontes">
      <h2>Prazo geral de registro</h2>
      <p>{cycle.deadline}</p>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        <OfficialLink href={cycle.guide}>Guia do MEC 2026/2027</OfficialLink>
        <OfficialLink href={cycle.norm}>Resolução CIF nº 24/2026 atualizada</OfficialLink>
        <OfficialLink href={cycle.simec}>Abrir Simec</OfficialLink>
      </div>
    </section>
    <section className="mt-5" aria-labelledby="checklist-title">
      <h2 id="checklist-title">Conferência interna de {municipality}</h2>
      <p className="muted mt-1">Marque os itens que a equipe conferiu. As marcações ficam neste navegador e servem para organizar o trabalho. O envio e a análise acontecem no Simec.</p>
      {storageError && <p role="status">Não foi possível salvar as marcações neste navegador. Elas valem para esta sessão.</p>}
      <div className="mt-3 grid gap-4 lg:grid-cols-2">
        {cycle.sections.map(section => {
          const modeKey = section.id + ':reuse';
          const reuse = Boolean(checklist[modeKey]);
          const items = section.items.filter(item => !item.record || item.record === (reuse ? 'reuse' : 'full'));
          const checkedCount = items.filter(item => checklist[section.id + ':' + item.id]).length;
          return <fieldset className="panel space-y-3 p-5 sm:p-6" key={section.id}>
            <legend className="px-2 font-semibold">{section.title}</legend>
            <p className="muted"><OfficialLink href={cycle.guide}>Guia do MEC, {section.pages}</OfficialLink></p>
            <label className="flex items-start gap-2 rounded-md bg-slate-50 p-3">
              <input className="mt-1 size-4 shrink-0" type="checkbox" checked={reuse} onChange={event => update(modeKey, event.target.checked)} />
              <span>{section.reuseLabel}</span>
            </label>
            <p className="muted">{section.reuseNote}</p>
            <p className="font-semibold" aria-live="polite">{checkedCount} de {items.length} itens conferidos</p>
            {items.map(item => {
              const key = section.id + ':' + item.id;
              return <label className="flex items-start gap-2 border-t border-slate-200 pt-3" key={key}>
                <input className="mt-1 size-4 shrink-0" type="checkbox" checked={Boolean(checklist[key])} onChange={event => update(key, event.target.checked)} />
                <span>{item.text}</span>
              </label>;
            })}
          </fieldset>;
        })}
      </div>
    </section>
    <section className="panel mt-5 space-y-3 p-5 sm:p-6">
      <h2>Condições acompanhadas pela prefeitura</h2>
      {cycle.external.map(item => <div key={item.title}><h3 className="font-semibold">{item.title}</h3><p>{item.text}</p></div>)}
      <OfficialLink href={cycle.inep}>Resolução CIF nº 25/2026 sobre II e III</OfficialLink>
    </section>
    <section className="panel mt-5 space-y-3 p-5 sm:p-6">
      <h2>Envio e pedido de correção</h2>
      <p>{cycle.workflow}</p>
      <p>{cycle.diligence}</p>
      <OfficialLink href={cycle.guide}>Guia do MEC, pp. 64–81</OfficialLink>
    </section>
  </>;
}

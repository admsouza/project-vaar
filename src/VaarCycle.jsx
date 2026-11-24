import React, { useState } from 'react';
import { ArrowUpRight, FilePlus2, FolderOpen } from 'lucide-react';
import { Help } from './Help.jsx';
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

export function VaarCycle({ code, selector, records, onRegister, onDossier }) {
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
    <div className="page-heading flex flex-wrap items-end justify-between gap-3">
      <div><p>Ciclo 2026/2027</p><h1>Preparação para o Simec</h1></div>
      <button type="button" className="button secondary" onClick={onDossier}><FolderOpen size={17} aria-hidden="true" />Abrir dossiê 2027</button>
    </div>
    <section className="panel overview-actions" aria-label="Município e prazo">
      {selector}
      <div className="flex flex-wrap items-center gap-2">
        <span className="counter">Prazo geral · 15/09/2026</span>
        <Help title="Entenda o prazo de registro" preview={cycle.deadline}>
          <p>{cycle.deadline}</p>
          <OfficialLink href={cycle.guide}>Guia do MEC 2026/2027</OfficialLink><br />
          <OfficialLink href={cycle.norm}>Resolução CIF nº 24/2026 atualizada</OfficialLink>
        </Help>
      </div>
      <OfficialLink href={cycle.simec}>Abrir Simec <ArrowUpRight size={15} aria-hidden="true" /></OfficialLink>
    </section>
    <section className="mt-6" aria-labelledby="checklist-title">
      <div className="flex items-center gap-2">
        <h2 id="checklist-title">O que falta conferir</h2>
        <Help title="Como usar o checklist">
          <p>Marque os itens que a equipe conferiu. As marcações ficam neste navegador. O envio e a análise acontecem no Simec.</p>
          <p>Registrar um comprovante mantém o item disponível para conferência manual.</p>
        </Help>
      </div>
      {storageError && <p role="status">Não foi possível salvar as marcações neste navegador. Elas valem para esta sessão.</p>}
      <div className="mt-3 grid gap-4 xl:grid-cols-2">
        {cycle.sections.map(section => {
          const modeKey = section.id + ':reuse';
          const reuse = Boolean(checklist[modeKey]);
          const items = section.items.filter(item => !item.record || item.record === (reuse ? 'reuse' : 'full'));
          const checkedCount = items.filter(item => checklist[section.id + ':' + item.id]).length;
          const nextItem = items.find(item => !checklist[section.id + ':' + item.id]);
          return <section className="panel checklist-card" aria-label={section.title} key={section.id}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">{section.title}</h3>
              <span className="counter" aria-live="polite">{checkedCount} de {items.length} conferidos</span>
            </div>
            <div className="reuse-row">
              <label className="flex items-center gap-2"><input type="checkbox" checked={reuse} onChange={event => update(modeKey, event.target.checked)} />Reaproveitar no Simec</label>
              <Help title={`Reaproveitamento · ${section.id}`} preview={section.reuseNote}>
                <p>{section.reuseLabel}.</p><p>{section.reuseNote}</p>
                <OfficialLink href={cycle.guide}>Guia do MEC, {section.pages}</OfficialLink>
              </Help>
            </div>
            <ul>
              {items.map(item => {
                const key = section.id + ':' + item.id;
                const hasEvidence = records.some(record => record.requirement?.key === key);
                return <li className="checklist-row" key={key}>
                  <label><input type="checkbox" checked={Boolean(checklist[key])} onChange={event => update(key, event.target.checked)} />{item.label}</label>
                  {hasEvidence && <span className="evidence-tag">Comprovante salvo</span>}
                  <Help title={`Orientação · ${item.label}`} preview={item.text}>
                    <p>{item.text}</p><OfficialLink href={cycle.guide}>Guia do MEC, {section.pages}</OfficialLink>
                  </Help>
                  <button type="button" className="checklist-register" aria-label={`Registrar comprovante · ${item.label}`} onClick={() => onRegister(section.id, { key, label: item.label })}>
                    <FilePlus2 size={17} aria-hidden="true" /><span>Registrar</span>
                  </button>
                </li>;
              })}
            </ul>
            {nextItem && <p className="checklist-next">Próximo item: <strong>{nextItem.label}</strong></p>}
            {!nextItem && <p className="checklist-next">Todos os itens deste checklist foram conferidos.</p>}
          </section>;
        })}
      </div>
    </section>
    <section className="panel guidance-row mt-5" aria-label="Orientações do Simec">
      <div className="flex items-center gap-2">Quem comprova II, III e IV
        <Help title="Responsáveis por II, III e IV">
          {cycle.external.map(item => <div key={item.title}><h3 className="font-semibold">{item.title}</h3><p>{item.text}</p></div>)}
          <OfficialLink href={cycle.inep}>Resolução CIF nº 25/2026 sobre II e III</OfficialLink>
        </Help>
      </div>
      <div className="flex items-center gap-2">Envio e diligência
        <Help title="Como enviar e responder a diligências">
          <p>{cycle.workflow}</p><p>{cycle.diligence}</p>
          <OfficialLink href={cycle.guide}>Guia do MEC, pp. 64–81</OfficialLink>
        </Help>
      </div>
    </section>
  </>;
}

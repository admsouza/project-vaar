import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft, ArrowUpRight, BadgeCheck, BookOpen, Building2, CalendarDays, Check, ChevronDown,
  ChevronRight, CircleAlert, CircleHelp, ClipboardList, FileText, FolderOpen, History,
  LayoutDashboard, MapPin, Plus, Printer, ScanText, Search, ShieldCheck, X,
} from 'lucide-react';
import { conditions, initialRecords, municipalities, sources } from './data.js';
import { matchesCondition, matchesSearch } from './evidence.js';
import { VaarCycle } from './VaarCycle.jsx';
import './styles.css';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' });
const storageKey = 'gov-app-vaar-demo-v1';
const municipalityCollator = new Intl.Collator('pt-BR');
const municipalityOptions = Object.entries(municipalities)
  .sort(([, first], [, second]) => municipalityCollator.compare(first.name, second.name));
const tabs = [
  { id: 'overview', title: 'Diagnóstico', icon: LayoutDashboard },
  { id: 'conditions', title: 'Condicionalidades', icon: ClipboardList },
  { id: 'cycle', title: 'Preparação 2027', icon: BookOpen },
  { id: 'dossier', title: 'Dossiê', icon: FolderOpen },
];
const blank = { title: '', owner: '', deadline: '', documentDate: '', protocol: '', notes: '', file: '', state: 'Registrada' };
const evidenceFields = {
  condition: 'Condicionalidade', title: 'Documento ou evidência', owner: 'Responsável',
  documentDate: 'Data do documento', protocol: 'Protocolo',
};

function loadRecords() {
  try { return JSON.parse(localStorage.getItem(storageKey)) ?? {}; }
  catch { return {}; }
}

function MunicipalitySelect({ code, onChange }) {
  return <label className="field region-field">Município
    <span className="select-wrap">
      <MapPin size={17} aria-hidden="true" />
      <select value={code} onChange={event => onChange(event.target.value)}>
        {municipalityOptions.map(([id, item]) => <option key={id} value={id}>{item.name} · PB</option>)}
      </select>
      <ChevronDown size={16} aria-hidden="true" />
    </span>
  </label>;
}

function Status({ positive, children }) {
  const Icon = positive ? Check : CircleAlert;
  return <span className={`status ${positive ? 'positive' : 'neutral'}`}><Icon size={14} aria-hidden="true" />{children}</span>;
}

function Source({ source, suffix }) {
  return <a className="source" href={source.url} target="_blank" rel="noreferrer">{source.label}{suffix}<ArrowUpRight size={14} aria-hidden="true" /></a>;
}

function Modal({ title, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return <dialog ref={ref} className="modal" onCancel={event => { event.preventDefault(); onClose(); }} aria-labelledby="modal-title">
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
      <h2 id="modal-title">{title}</h2>
      <button className="icon-button" type="button" onClick={onClose} aria-label="Fechar"><X size={20} /></button>
    </div>
    {children}
  </dialog>;
}

function EvidenceForm({ onClose, onSave, editor, municipality }) {
  const record = editor.id ? editor : null;
  const [form, setForm] = useState({
    ...blank,
    ...editor,
    state: record?.history.at(-1).state ?? blank.state,
  });
  const [reading, setReading] = useState(false);
  const [message, setMessage] = useState('');
  const [suggestions, setSuggestions] = useState(record?.suggestions ?? {});
  const request = useRef(null);
  useEffect(() => () => request.current?.abort(), []);

  const hasSource = name => suggestions[name]?.value === form[name];
  const field = name => ({
    value: form[name],
    'aria-label': evidenceFields[name],
    'aria-describedby': hasSource(name) ? `source-${name}` : undefined,
    onChange: event => setForm(previous => ({ ...previous, [name]: event.target.value })),
  });
  const sourceHint = name => {
    const suggestion = suggestions[name];
    if (!suggestion || !hasSource(name)) return null;
    return <small id={`source-${name}`} className="muted font-normal break-words">Pág. {suggestion.page} · “{suggestion.excerpt}”</small>;
  };

  async function read(file, example = false) {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    const { signal } = controller;
    setReading(true);
    setMessage('Abrindo o PDF…');
    try {
      if (example) {
        const response = await fetch(`${import.meta.env.BASE_URL}comprovante-ficticio.pdf`, { signal });
        if (!response.ok) throw new Error('Exemplo indisponível');
        file = new File([await response.blob()], 'comprovante-ficticio.pdf', { type: 'application/pdf' });
      }
      signal.throwIfAborted();
      setForm(previous => {
        const next = { ...previous, file: file.name };
        for (const [name, suggestion] of Object.entries(suggestions)) {
          if (name === 'condition' && editor.condition) continue;
          if (next[name] === suggestion.value) next[name] = '';
        }
        return next;
      });
      setSuggestions({});
      const { readEvidencePdf } = await import('./readPdf.js');
      const result = await readEvidencePdf(file, text => {
        if (!signal.aborted) setMessage(text);
      }, signal);
      signal.throwIfAborted();
      if (result.message) {
        setMessage(result.message);
        return;
      }
      const suggested = result.suggestions;
      setSuggestions(suggested);
      setForm(previous => {
        const next = { ...previous };
        for (const [name, { value }] of Object.entries(suggested)) {
          if (!next[name]) next[name] = value;
        }
        return next;
      });
      setMessage(Object.keys(suggested).length
        ? 'Confira as sugestões e complete os campos antes de salvar.'
        : 'Nenhum campo foi identificado com os padrões do leitor. Preencha o formulário manualmente.');
    } catch {
      if (!signal.aborted) setMessage('Não foi possível ler este PDF. Tente outro arquivo ou preencha os campos manualmente.');
    } finally {
      if (!signal.aborted) setReading(false);
    }
  }

  return <Modal title={record ? 'Revisar evidência' : 'Registrar evidência'} onClose={onClose}>
    <form className="space-y-4 px-6 py-5" onSubmit={event => {
      event.preventDefault();
      if (reading || !form.condition || !form.title.trim() || !form.owner.trim()) return;
      const confirmed = { ...form, title: form.title.trim(), owner: form.owner.trim(), protocol: form.protocol.trim() };
      confirmed.suggestions = Object.fromEntries(Object.entries(suggestions)
        .filter(([name, suggestion]) => confirmed[name] === suggestion.value));
      onSave(confirmed);
    }}>
      <p className="muted">{municipality} · PB · Exercício 2026</p>
      <div className="reader-panel space-y-2">
        <h3 className="flex items-center gap-2 font-semibold"><ScanText size={19} aria-hidden="true" />Leitura de comprovante</h3>
        <p className="muted">Use um PDF fictício ou anonimizado de até 10 MB e 10 páginas. A leitura roda neste navegador.</p>
        <div className="flex flex-wrap gap-2">
          <label className="field min-w-0 flex-1">Selecionar PDF
            <input type="file" accept="application/pdf,.pdf" disabled={reading} onChange={event => {
              const file = event.target.files[0];
              if (file) void read(file);
              event.target.value = '';
            }} />
          </label>
          <button type="button" className="button secondary self-end min-h-[42px]" disabled={reading} onClick={() => void read(null, true)}>Testar com exemplo</button>
        </div>
        {form.file && <p className="muted break-all">Arquivo selecionado: {form.file}</p>}
        <p className="muted" role="status">{message}</p>
      </div>
      {record ? <p className="muted">Condicionalidade {form.condition} · {conditions.find(item => item.id === form.condition).name}{sourceHint('condition')}</p> : <label className="field">Condicionalidade<select required {...field('condition')}>
        <option value="">Selecione uma condicionalidade</option>
        {conditions.map(item => <option key={item.id} value={item.id}>{item.id} · {item.name}</option>)}
      </select>{sourceHint('condition')}
        {form.condition && suggestions.condition && form.condition !== suggestions.condition.value &&
          <small className="muted font-normal">Vínculo sugerido: {suggestions.condition.value} · Pág. {suggestions.condition.page} · “{suggestions.condition.excerpt}”</small>}
      </label>}
      <label className="field">Documento ou evidência<input required maxLength={120} {...field('title')} placeholder="Ex.: ato de seleção de gestores" />{sourceHint('title')}</label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field">Responsável<input required maxLength={80} {...field('owner')} placeholder="Ex.: Gestão escolar" />{sourceHint('owner')}</label>
        <label className="field">Data do documento<input type="date" {...field('documentDate')} />{sourceHint('documentDate')}</label>
        <label className="field">Protocolo<input maxLength={50} {...field('protocol')} />{sourceHint('protocol')}</label>
        <label className="field">Prazo interno<input type="date" {...field('deadline')} /></label>
      </div>
      <label className="field">Situação<select {...field('state')}><option>Pendente</option><option>Registrada</option><option>Revisada</option></select></label>
      <label className="field">Observação<textarea rows={2} maxLength={600} {...field('notes')} /></label>
      <p className="muted">O registro de teste guarda os campos, o nome do PDF e os trechos confirmados neste navegador.</p>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="button secondary" onClick={onClose}>Cancelar</button>
        <button type="submit" className="button primary" disabled={reading}>Salvar evidência</button>
      </div>
    </form>
  </Modal>;
}

function SearchField({ label, value, onChange, placeholder }) {
  return <label className="field print-hide">{label}
    <span className="relative block">
      <Search className="pointer-events-none absolute left-3 top-3 text-slate-500" size={17} aria-hidden="true" />
      <input type="search" className="!pl-9" value={value} placeholder={placeholder} onChange={event => onChange(event.target.value)} />
    </span>
  </label>;
}

function ConditionList({ municipality, records, openCondition }) {
  const [query, setQuery] = useState('');
  const matches = conditions.filter(condition => matchesCondition(query, condition));
  return <section className="panel table-panel" aria-labelledby="condition-list-heading">
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-6">
      <div><h2 id="condition-list-heading">Condicionalidades</h2><p className="muted mt-1">Situação da rede na publicação do FNDE de 2026.</p></div>
      <span className="counter">{conditions.length - municipality.unmet.length} de 5 atendidas</span>
    </div>
    <div className="px-5 pb-4 sm:px-6">
      <SearchField label="Encontrar exigência" value={query} onChange={setQuery} placeholder="Ex.: diretor escolar, SAEB ou BNCC" />
    </div>
    <div className="hidden grid-cols-[minmax(0,1fr)_135px_150px_24px] gap-4 border-y border-slate-200 bg-slate-50 px-6 py-3 text-[13px] font-semibold text-slate-600 md:grid">
      <span>Condicionalidade</span><span>Situação oficial</span><span>Evidências de teste</span><span />
    </div>
    {!matches.length && <p className="empty" role="status">Nenhuma condicionalidade encontrada. Tente outra palavra.</p>}
    {matches.map(condition => {
      const met = !municipality.unmet.includes(condition.id);
      const count = records.filter(item => item.condition === condition.id).length;
      return <button type="button" className="condition-row" key={condition.id} onClick={() => openCondition(condition.id)} aria-label={`Abrir detalhe de ${condition.name}`}>
        <span className="flex min-w-0 items-center gap-3">
          <span className="roman">{condition.id}</span>
          <span className="min-w-0"><strong className="block">{condition.name}</strong><span className="muted mt-0.5 block">{condition.description}</span></span>
        </span>
        <Status positive={met}>{met ? 'Atendida' : 'Não atendida'}</Status>
        <span className="muted">{count} {count === 1 ? 'registro' : 'registros'}</span>
        <ChevronRight className="row-chevron" size={18} aria-hidden="true" />
      </button>;
    })}
    <div className="flex flex-wrap gap-x-4 gap-y-2 px-5 py-4 sm:px-6"><Source source={sources.law} /><Source source={sources.lista} /></div>
  </section>;
}

function EvidenceList({ records, onEdit, showHistory }) {
  if (!records.length) return <p className="empty"><FileText size={22} aria-hidden="true" />Nenhuma evidência registrada para este recorte.</p>;
  return <ul className="divide-y divide-slate-200">
    {records.map(record => <li key={record.id} className="px-5 py-4 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words font-semibold">{record.title}</h3>
          <p className="muted mt-1 break-words">{record.condition} · {record.owner}{record.deadline ? ` · Prazo ${record.deadline.split('-').reverse().join('/')}` : ''}</p>
          {record.notes && <p className="muted mt-1 break-words">{record.notes}</p>}
          {record.documentDate && <p className="muted mt-1">Data do documento: {record.documentDate.split('-').reverse().join('/')}</p>}
          {record.protocol && <p className="muted mt-1 break-words">Protocolo: {record.protocol}</p>}
          {record.file && <p className="muted mt-1 break-all">Arquivo informado: {record.file}</p>}
          {Object.keys(record.suggestions ?? {}).length > 0 && <details className="mt-2">
            <summary className="muted cursor-pointer">Trechos usados no cadastro</summary>
            <ul className="mt-1 space-y-1">{Object.entries(record.suggestions).map(([field, { page, excerpt }]) =>
              <li className="muted break-words" key={field}>{evidenceFields[field]} · Pág. {page} · “{excerpt}”</li>)}</ul>
          </details>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Status positive={record.history.at(-1).state === 'Revisada'}>{record.history.at(-1).state}</Status>
          {onEdit && <button type="button" className="button secondary" onClick={() => onEdit(record)}>Revisar</button>}
        </div>
      </div>
      {showHistory && <ol className="mt-3 space-y-1 border-l-2 border-slate-200 pl-3">
        {record.history.map((entry, index) => <li className="muted flex items-center gap-2" key={index}><History size={14} aria-hidden="true" />{dateTime.format(new Date(entry.at))} · {entry.state}</li>)}
      </ol>}
    </li>)}
  </ul>;
}

function EvidenceHistory({ records, onEdit }) {
  const [query, setQuery] = useState('');
  const matches = records.filter(record => matchesSearch(query, [
    record.title, record.owner, record.file, record.protocol, record.notes, record.documentDate,
    record.documentDate?.split('-').reverse().join('/'),
    record.condition, conditions.find(item => item.id === record.condition)?.name,
    ...record.history.map(entry => entry.state),
  ]));
  return <section className="panel mt-5">
    <div className="space-y-3 border-b border-slate-200 p-5 sm:px-6">
      <h2>Registros e histórico</h2>
      <SearchField label="Buscar no histórico" value={query} onChange={setQuery} placeholder="Ex.: protocolo, responsável ou nome do documento" />
    </div>
    {query.trim() && matches.length === 0
      ? <p className="empty" role="status">Nenhum registro encontrado neste município.</p>
      : <EvidenceList records={matches} showHistory onEdit={onEdit} />}
  </section>;
}

function App() {
  const [code, setCode] = useState('2507200');
  const [view, setView] = useState('overview');
  const [selected, setSelected] = useState(null);
  const [from, setFrom] = useState('overview');
  const [saved, setSaved] = useState(loadRecords);
  const [editor, setEditor] = useState(null);
  const [showSources, setShowSources] = useState(false);
  const [notice, setNotice] = useState('');
  const municipality = municipalities[code];
  const records = saved[code] ?? initialRecords(code);
  const condition = conditions.find(item => item.id === selected);
  const { eligible } = municipality;
  const value = municipality.value === null ? 'Sem linha publicada nesta edição' : money.format(municipality.value);
  const missing = conditions.filter(item => !records.some(record => record.condition === item.id && record.history.at(-1).state !== 'Pendente'));

  function changeMunicipality(nextCode) {
    setCode(nextCode);
    setNotice('');
  }

  function navigate(next) {
    setView(next);
    setSelected(null);
    setNotice('');
    window.scrollTo(0, 0);
  }

  function openCondition(id) {
    setFrom(view);
    setView('conditions');
    setSelected(id);
    setNotice('');
    window.scrollTo(0, 0);
  }

  function saveEvidence(form) {
    const entry = { state: form.state, at: new Date().toISOString() };
    const { condition, title, owner, deadline, documentDate, protocol, notes, file, suggestions } = form;
    const record = {
      id: editor.id ?? crypto.randomUUID(),
      condition, title, owner, deadline, documentDate, protocol, notes, file, suggestions,
      history: [...(editor.history ?? []), entry],
    };
    const updated = editor.id ? records.map(item => item.id === editor.id ? record : item) : [...records, record];
    const next = { ...saved, [code]: updated };
    setSaved(next);
    setEditor(null);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setNotice('Evidência salva no cenário de teste.');
    } catch {
      setNotice('Evidência registrada nesta sessão. O armazenamento local está indisponível.');
    }
  }

  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><Building2 size={22} aria-hidden="true" /></span><span>Gov App<small>Gestão do VAAR</small></span></div>
      <nav className="navigation" aria-label="Seções do Gov App">
        {tabs.map(({ id, title, icon: Icon }) => <button key={id} type="button" className={view === id ? 'active' : ''} aria-current={view === id ? 'page' : undefined} onClick={() => navigate(id)}>
          <Icon size={19} aria-hidden="true" />{title}
        </button>)}
      </nav>
      <div className="sidebar-bottom">
        <button type="button" onClick={() => setShowSources(true)}><CircleHelp size={18} />Fontes e dados de teste</button>
        <div className="workspace"><span className="workspace-mark">PB</span><span>Paraíba<small>{municipalityOptions.length} municípios</small></span></div>
      </div>
    </aside>

    <div className="main-shell">
      <header className="topbar">
        <div className="breadcrumbs"><span>Fundeb</span><ChevronRight size={14} /><strong>VAAR</strong></div>
        <span className="demo-label"><span />Protótipo</span>
      </header>
      <main className="content">
        {notice && <p role="status" className="notice"><Check size={18} />{notice}<button type="button" className="ml-auto" aria-label="Dispensar mensagem" onClick={() => setNotice('')}><X size={17} /></button></p>}
        {view === 'overview' && <>
          <section className="hero" aria-labelledby="main-title">
            <div className="hero-pattern" aria-hidden="true"><span /><span /><span /><ShieldCheck size={103} strokeWidth={1.05} /></div>
            <div className="relative">
              <div className="hero-kicker"><Building2 size={16} aria-hidden="true" />FINANCIAMENTO DA EDUCAÇÃO</div>
              <h1 id="main-title">Diagnóstico do VAAR</h1>
              <p>Consulte o resultado publicado para o VAAR 2026 e organize suas evidências.</p>
            </div>
          </section>
          <section className="panel scope-panel" aria-label="Recorte da consulta">
            <MunicipalitySelect code={code} onChange={changeMunicipality} />
            <label className="field year-field">Exercício
              <span className="select-wrap"><CalendarDays size={17} /><select defaultValue="2026"><option>2026</option></select><ChevronDown size={16} /></span>
            </label>
            <span className="data-context"><span>Publicações do FNDE</span><small>Consulta em 23/11/2026</small></span>
            <button type="button" className="button primary" onClick={() => setEditor({ condition: '' })}><ScanText size={18} aria-hidden="true" />Ler comprovante</button>
          </section>
          <div className="panel mt-4 flex flex-wrap items-center justify-between gap-3 p-4">
            <div><h2>Comprovação para o VAAR 2027</h2><p className="muted">Confira documentos, responsáveis e orientações do Simec.</p></div>
            <button type="button" className="button secondary" onClick={() => navigate('cycle')}>Abrir preparação 2027</button>
          </div>
          <div className="summary-grid">
            <section className="panel metric"><span className="metric-icon teal"><ShieldCheck size={22} /></span><div><h2>Habilitação</h2><strong>{eligible ? 'Habilitada' : 'Não habilitada'}</strong><p>{conditions.length - municipality.unmet.length} de 5 condicionalidades atendidas</p></div></section>
            <section className="panel metric"><span className="metric-icon amber"><BadgeCheck size={22} /></span><div><h2>Benefício</h2><strong>{municipality.benefited ? 'Beneficiária' : 'Não beneficiária'}</strong><p>Situação na lista oficial do FNDE</p></div></section>
            <section className="panel metric"><span className="metric-icon blue"><FileText size={22} /></span><div><h2>Valor previsto</h2><strong className={municipality.value === null ? 'missing-value' : ''}>{value}</strong><p>FNDE · P11, 3ª publicação</p></div></section>
          </div>
          {municipality.reason && <p className="reason"><CircleAlert size={18} aria-hidden="true" /><span><strong>Motivo informado pelo FNDE.</strong> {municipality.reason}</span></p>}
          <ConditionList municipality={municipality} records={records} openCondition={openCondition} />
        </>}
        {view === 'cycle' && <VaarCycle key={code} code={code} municipality={municipality.name} selector={<MunicipalitySelect code={code} onChange={changeMunicipality} />} />}
        {view === 'conditions' && !condition && <>
          <div className="page-heading"><p>{municipality.name} · PB / Exercício 2026</p><h1>Condicionalidades da rede</h1></div>
          <ConditionList municipality={municipality} records={records} openCondition={openCondition} />
        </>}
        {view === 'conditions' && condition && <>
          <button type="button" className="back" onClick={() => navigate(from)}><ArrowLeft size={17} />Voltar</button>
          <div className="page-heading"><p>{municipality.name} · PB / Exercício 2026</p><h1>{condition.id} · {condition.name}</h1><p>{condition.description}</p></div>
          <button type="button" className="button secondary mb-4" onClick={() => navigate('cycle')}>Consultar regras do ciclo 2026/2027</button>
          <div className="grid gap-4 lg:grid-cols-2">
            <section className="panel p-5 sm:p-6"><h2 className="flex items-center gap-2"><BookOpen size={20} />Fundamento</h2><p className="my-3 muted">Art. 14, § 1º, inciso {condition.id}. Exemplo de evidência para o teste: {condition.evidence}</p><Source source={sources.law} /></section>
            <section className="panel p-5 sm:p-6"><h2>Situação oficial</h2><div className="my-3"><Status positive={!municipality.unmet.includes(condition.id)}>{municipality.unmet.includes(condition.id) ? 'Não atendida' : 'Atendida'}</Status></div><Source source={sources.lista} /></section>
          </div>
          <section className="panel mt-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5 sm:p-6"><div><h2>Evidências de teste</h2><p className="muted mt-1">Use o leitor de PDF ou registre os campos manualmente.</p></div><button type="button" className="button primary" onClick={() => setEditor({ condition: condition.id })}><Plus size={18} />Registrar evidência</button></div>
            <EvidenceList records={records.filter(item => item.condition === condition.id)} showHistory onEdit={setEditor} />
          </section>
        </>}
        {view === 'dossier' && <>
          <div className="page-heading flex flex-wrap items-end justify-between gap-4"><div><p>{municipality.name} · PB / Exercício 2026</p><h1>Dossiê de acompanhamento</h1><p>Prévia com situação oficial, evidências simuladas e histórico.</p></div><button type="button" className="button primary print-hide" onClick={() => window.print()}><Printer size={18} />Imprimir / salvar PDF</button></div>
          <section className="panel p-5 sm:p-6"><h2>Dados oficiais</h2><dl className="mt-4 grid gap-4 sm:grid-cols-3">
            <div><dt className="muted">Habilitação</dt><dd className="font-semibold">{eligible ? 'Habilitada' : 'Não habilitada'}</dd></div><div><dt className="muted">Benefício</dt><dd className="font-semibold">{municipality.benefited ? 'Beneficiária' : 'Não beneficiária'}</dd></div><div><dt className="muted">Valor previsto</dt><dd className="font-semibold">{value}</dd></div>
          </dl><div className="mt-4 flex flex-wrap gap-x-5 gap-y-2"><Source source={sources.lista} /><Source source={sources.p11} /></div></section>
          <section className="panel mt-5 p-5 sm:p-6"><h2>Evidências a completar</h2><p className="muted mt-1">Condicionalidades sem registro demonstrativo preenchido.</p>{missing.length ? <ul className="mt-3 flex flex-wrap gap-2">{missing.map(item => <li key={item.id}><button type="button" className="counter hover:bg-slate-200" onClick={() => openCondition(item.id)}>{item.id} · {item.name}</button></li>)}</ul> : <p className="mt-3"><Status positive>Todas as condicionalidades têm registro de teste</Status></p>}</section>
          <EvidenceHistory key={code} records={records} onEdit={setEditor} />
        </>}
      </main>
    </div>
    {editor && <EvidenceForm editor={editor} municipality={municipality.name} onClose={() => setEditor(null)} onSave={saveEvidence} />}
    {showSources && <Modal title="Fontes e dados de teste" onClose={() => setShowSources(false)}>
      <div className="space-y-4 px-6 py-5"><p>Os dados de habilitação e benefício são do exercício de 2026. Use documentos fictícios ou anonimizados. Os registros de teste e os trechos confirmados ficam neste navegador.</p>
        <ul className="space-y-3">{Object.values(sources).map(source => <li key={source.url}><Source source={source} /></li>)}</ul>
      </div>
    </Modal>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);

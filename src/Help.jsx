import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CircleAlert, X } from 'lucide-react';

export function Modal({ title, onClose, children }) {
  const ref = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return <dialog ref={ref} className="modal" onCancel={event => { event.preventDefault(); onClose(); }} aria-labelledby={titleId}>
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
      <h2 id={titleId}>{title}</h2>
      <button className="icon-button" type="button" onClick={onClose} aria-label="Fechar"><X size={20} /></button>
    </div>
    {children}
  </dialog>;
}

export function Help({ title, preview, children }) {
  const [open, setOpen] = useState(false);
  return <span className="help-wrap print-hide">
    <button type="button" className="help-button" aria-label={title} aria-haspopup="dialog" onClick={() => setOpen(true)}>
      <CircleAlert size={18} aria-hidden="true" />
    </button>
    <span className="help-tooltip" aria-hidden="true">{preview ?? title}</span>
    {open && createPortal(<Modal title={title} onClose={() => setOpen(false)}>
      <div className="help-content space-y-3 px-6 py-5">{children}</div>
    </Modal>, document.body)}
  </span>;
}

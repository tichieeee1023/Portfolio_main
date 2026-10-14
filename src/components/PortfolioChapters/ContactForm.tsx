import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { createPortal } from 'react-dom';
import './ContactForm.css';

const EMAILJS = {
  service_id: 'service_62khcli',
  template_id: 'template_gbl0x0a',
  user_id: '4Ztz17aIDBsQqsLqF',
};

export default function ContactForm() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const sendingRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => {
      requestRef.current?.abort();
      sendingRef.current = false;
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sendingRef.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (String(data.get('website') || '')) return;
    const name = String(data.get('from_name') || '').trim();
    const email = String(data.get('reply_to') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!name || !email || !message) {
      setStatus('failed');
      return;
    }
    sendingRef.current = true;
    setStatus('sending');
    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...EMAILJS, template_params: { from_name: name, reply_to: email, message } }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Email delivery failed');
      setStatus('sent');
      form.reset();
    } catch {
      // A closed dialog aborts silently; a timeout keeps the draft available.
      if (dialogRef.current?.open) setStatus('failed');
    } finally {
      window.clearTimeout(timeout);
      if (requestRef.current === controller) {
        requestRef.current = null;
        sendingRef.current = false;
      }
    }
  };

  return <>
    <button className="contactMail" type="button" aria-haspopup="dialog" onClick={() => { setStatus('idle'); setOpen(true); }}>
      이메일 보내기 <span aria-hidden="true">↗</span>
    </button>
    {createPortal(<dialog className="contactFormDialog" ref={dialogRef} aria-labelledby="contact-form-title"
      onCancel={() => setOpen(false)} onClose={() => setOpen(false)}
      onWheel={event => event.stopPropagation()}>
      <div className="contactFormHeader">
        <span>LET’S TALK / CONTACT</span>
        <button className="contactFormClose" type="button" onClick={() => setOpen(false)} aria-label="문의창 닫기">×</button>
      </div>
      <h2 id="contact-form-title">어떤 이야기를<br /><span>나누고 싶으세요?</span></h2>
      <p className="contactFormIntro">이유진에게 메시지를 보내세요.<br />남겨주신 이메일로 답변드릴게요.</p>
      {status === 'sent' ? <div className="contactFormSuccess" role="status">
        <span aria-hidden="true">✓</span><h3>메시지를 보냈습니다.</h3>
        <p>연락해 주셔서 감사합니다.</p>
        <button type="button" onClick={() => setOpen(false)}>닫기</button>
      </div> : <form onSubmit={submit} aria-busy={status === 'sending'}>
        <div className="contactFormFields">
          <label>이름<input name="from_name" autoComplete="name" required maxLength={80} placeholder="이름 또는 회사명" disabled={status === 'sending'} /></label>
          <label>회신받을 이메일<input name="reply_to" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" disabled={status === 'sending'} /></label>
        </div>
        <label>메시지<textarea name="message" required maxLength={5000} rows={5} placeholder="함께 나누고 싶은 이야기를 적어주세요." disabled={status === 'sending'} /></label>
        <div className="contactFormTrap" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <p className="contactFormStatus" role={status === 'failed' ? 'alert' : 'status'}>
          {status === 'failed' ? '전송하지 못했어요. 입력 내용을 확인하고 다시 시도하거나 아래 이메일로 연락해 주세요.' : status === 'sending' ? '메시지를 보내고 있습니다.' : ''}
        </p>
        <button className="contactFormSubmit" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? '전송 중…' : '메시지 보내기'} <span aria-hidden="true">↗</span>
        </button>
        <div className="contactFormFooter"><a className="contactFormFallback" href="mailto:curencandy001@gmail.com">메일 앱으로 보내기</a><span>TO. LEE YOOJIN</span></div>
      </form>}
    </dialog>, document.body)}
  </>;
}

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import './AuthModal.css'

function AuthModal({ onClose }) {
  const { signUp, signIn } = useAuth()
  const { t } = useLanguage()
  const [mode, setMode] = useState('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  // Lock background scroll while the modal is open, and render it via a
  // portal straight into <body>. Without the portal, this "position: fixed"
  // overlay inherits whatever containing block its React parent happens to
  // sit inside (e.g. the page-transition wrapper's entrance-animation
  // transform), which can trap it away from the real viewport and make the
  // page appear to "jump" when an input inside it is focused.
  useEffect(() => {
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [])

  const submit = (e) => {
    e.preventDefault()
    setError('')
    if (mode === 'signup') {
      const result = signUp(name, email)
      if (result.ok) onClose()
      else setError('exists')
    } else {
      const result = signIn(email)
      if (result.ok) onClose()
      else setError('not-found')
    }
  }

  return createPortal(
    <div className="auth-modal__overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="auth-modal__close" onClick={onClose} aria-label={t('auth_close')}>
          ×
        </button>
        <h2>{mode === 'signup' ? t('sign_up') : t('sign_in')}</h2>

        <form onSubmit={submit} className="auth-modal__form">
          {mode === 'signup' && (
            <label className="auth-modal__field">
              <span>{t('auth_name')}</span>
              <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
            </label>
          )}
          <label className="auth-modal__field">
            <span>{t('auth_email')}</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </label>

          {error === 'exists' && <p className="auth-modal__error">{t('auth_email_taken')}</p>}
          {error === 'not-found' && <p className="auth-modal__error">{t('auth_no_account')}</p>}

          <button type="submit" className="auth-modal__submit">
            {mode === 'signup' ? t('auth_submit_signup') : t('auth_submit_signin')}
          </button>
        </form>

        <button
          type="button"
          className="auth-modal__switch"
          onClick={() => {
            setMode((m) => (m === 'signup' ? 'signin' : 'signup'))
            setError('')
          }}
        >
          {mode === 'signup' ? t('auth_switch_to_signin') : t('auth_switch_to_signup')}
        </button>
      </div>
    </div>,
    document.body
  )
}

export default AuthModal

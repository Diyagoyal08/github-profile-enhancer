import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from '../store/githubSlice';

export default function TokenModal({ onClose }) {
  const dispatch = useDispatch();
  const [val, setVal] = useState('');

  const handleSave = () => {
    dispatch(setToken(val.trim()));
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">🔑 Add GitHub Token</div>
        <div className="modal-desc">
          A Personal Access Token lets you make more API requests without hitting rate limits.
          Your token is stored only in memory and never sent anywhere except GitHub's API.
          <br /><br />
          To create one: <strong>GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)</strong> → Generate new token. Only the <code>public_repo</code> scope is needed.
        </div>
        <input
          className="modal-input"
          type="password"
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          autoFocus
        />
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save token</button>
        </div>
      </div>
    </div>
  );
}

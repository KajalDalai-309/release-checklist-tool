import React, { useState, useEffect } from 'react';
import { X, Save, Edit3 } from 'lucide-react';

export default function EditInfoModal({ isOpen, release, onClose, onSave }) {
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [name, setName] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (release) {
      setAdditionalInfo(release.additionalInfo || '');
      setName(release.name || '');
      if (release.targetDate) {
        setTargetDate(new Date(release.targetDate).toISOString().slice(0, 16));
      }
    }
  }, [release]);

  if (!isOpen || !release) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Release name cannot be empty');
      return;
    }

    try {
      setIsSaving(true);
      await onSave(release.id, {
        name: name.trim(),
        targetDate: new Date(targetDate).toISOString(),
        additionalInfo: additionalInfo.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update release information');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Edit Release Details</h3>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '16px',
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Release Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Release Date</label>
            <input
              type="datetime-local"
              className="form-input"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Additional Information / Release Notes</label>
            <textarea
              className="form-textarea"
              placeholder="Enter release notes, change log, or environment notes..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={4}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

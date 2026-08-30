import React, { useState } from 'react';
import { X, Calendar, FileText, Tag, PlusCircle } from 'lucide-react';

export default function CreateReleaseModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('');
  // Default to today + 7 days
  const defaultDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
  const [targetDate, setTargetDate] = useState(defaultDate);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Release name is required.');
      return;
    }
    if (!targetDate) {
      setError('Release target date is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreate({
        name: name.trim(),
        targetDate: new Date(targetDate).toISOString(),
        additionalInfo: additionalInfo.trim(),
      });
      setName('');
      setAdditionalInfo('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create release');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Create New Release</h3>
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Release Name <span className="required">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Release 2026.11 - Payment Gateway v3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Target Release Date & Time <span className="required">*</span>
            </label>
            <input
              type="datetime-local"
              className="form-input"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Additional Information (Optional)</label>
            <textarea
              className="form-textarea"
              placeholder="Add release notes, rollout links, JIRA tickets, or deployment instructions..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              <PlusCircle size={16} />
              {isSubmitting ? 'Creating...' : 'Create Release'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

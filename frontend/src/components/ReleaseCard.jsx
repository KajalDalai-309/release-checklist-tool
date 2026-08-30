import React, { useState } from 'react';
import { Calendar, Clock, Edit3, Trash2, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';
import StepChecklist from './StepChecklist';

export default function ReleaseCard({ release, onToggleStep, onEdit, onDelete }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedDate = new Date(release.targetDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleStepToggle = async (stepId, completed) => {
    try {
      setIsUpdating(true);
      await onToggleStep(release.id, stepId, completed);
    } catch (err) {
      console.error('Failed to toggle step:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${release.name}"?`)) {
      try {
        setIsDeleting(true);
        await onDelete(release.id);
      } catch (err) {
        console.error('Failed to delete release:', err);
        setIsDeleting(false);
      }
    }
  };

  const cardClass = `release-card ${release.status}-card`;

  return (
    <div className={cardClass}>
      <div className="card-header">
        <div>
          <h3 className="release-title">{release.name}</h3>
          <div className="release-meta">
            <Calendar className="meta-icon" />
            <span>{formattedDate}</span>
          </div>
        </div>
        <StatusBadge status={release.status} />
      </div>

      <ProgressBar
        completedCount={release.completedCount}
        totalSteps={release.totalSteps}
        status={release.status}
      />

      <StepChecklist
        steps={release.steps}
        onToggleStep={handleStepToggle}
        disabled={isUpdating || isDeleting}
      />

      {release.additionalInfo ? (
        <div className="additional-info-box">
          <div className="info-content">
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px', fontSize: '0.78rem' }}>
              Notes:
            </strong>
            {release.additionalInfo}
          </div>
          <button
            className="info-edit-btn"
            onClick={() => onEdit(release)}
            title="Edit additional information"
            aria-label="Edit notes"
          >
            <Edit3 size={14} />
          </button>
        </div>
      ) : (
        <div
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            marginBottom: '16px',
            fontStyle: 'italic',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Info size={14} />
          <span>No additional info provided</span>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-primary)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              textDecoration: 'underline',
            }}
            onClick={() => onEdit(release)}
          >
            Add notes
          </button>
        </div>
      )}

      <div className="card-footer">
        <button
          className="btn btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.825rem' }}
          onClick={() => onEdit(release)}
          disabled={isDeleting}
        >
          <Edit3 size={14} />
          Edit Info
        </button>
        <button
          className="btn btn-danger"
          style={{ padding: '6px 12px', fontSize: '0.825rem' }}
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete release"
        >
          <Trash2 size={14} />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

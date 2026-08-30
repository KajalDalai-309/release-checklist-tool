import React from 'react';

export default function ProgressBar({ completedCount, totalSteps, status }) {
  const percentage = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;
  const normalizedStatus = (status || 'planned').toLowerCase();

  return (
    <div className="progress-container">
      <div className="progress-labels">
        <span>Completion Progress</span>
        <span>
          {completedCount} of {totalSteps} steps ({percentage}%)
        </span>
      </div>
      <div className="progress-track">
        <div
          className={`progress-fill ${normalizedStatus}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

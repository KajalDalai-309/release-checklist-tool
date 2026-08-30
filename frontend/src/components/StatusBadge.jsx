import React from 'react';

export default function StatusBadge({ status }) {
  const normalizedStatus = (status || 'planned').toLowerCase();
  
  const labels = {
    planned: 'Planned',
    ongoing: 'Ongoing',
    done: 'Done'
  };

  return (
    <span className={`status-badge ${normalizedStatus}`}>
      <span className="status-dot"></span>
      {labels[normalizedStatus] || normalizedStatus}
    </span>
  );
}

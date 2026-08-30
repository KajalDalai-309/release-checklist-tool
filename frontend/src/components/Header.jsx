import React from 'react';
import { Layers, Plus, CheckCircle, Clock, Calendar } from 'lucide-react';

export default function Header({ onOpenCreate, counts, activeFilter, onSelectFilter }) {
  return (
    <>
      <header className="header-wrapper">
        <div className="brand-section">
          <div className="brand-icon">
            <Layers size={24} />
          </div>
          <div>
            <h1 className="brand-title">Release Checklist Tool</h1>
            <p className="brand-subtitle">
              Orchestrate and track software release readiness in real time
            </p>
          </div>
        </div>

        <div className="header-actions">
          <button className="btn btn-primary" onClick={onOpenCreate}>
            <Plus size={18} />
            New Release
          </button>
        </div>
      </header>

      <div className="stats-filter-bar">
        <div
          className={`stat-card ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => onSelectFilter('all')}
        >
          <div className="stat-icon total">
            <Layers size={20} />
          </div>
          <div>
            <div className="stat-number">{counts.total}</div>
            <div className="stat-label">All Releases</div>
          </div>
        </div>

        <div
          className={`stat-card ${activeFilter === 'planned' ? 'active' : ''}`}
          onClick={() => onSelectFilter('planned')}
        >
          <div className="stat-icon planned">
            <Calendar size={20} />
          </div>
          <div>
            <div className="stat-number">{counts.planned}</div>
            <div className="stat-label">Planned</div>
          </div>
        </div>

        <div
          className={`stat-card ${activeFilter === 'ongoing' ? 'active' : ''}`}
          onClick={() => onSelectFilter('ongoing')}
        >
          <div className="stat-icon ongoing">
            <Clock size={20} />
          </div>
          <div>
            <div className="stat-number">{counts.ongoing}</div>
            <div className="stat-label">Ongoing</div>
          </div>
        </div>

        <div
          className={`stat-card ${activeFilter === 'done' ? 'active' : ''}`}
          onClick={() => onSelectFilter('done')}
        >
          <div className="stat-icon done">
            <CheckCircle size={20} />
          </div>
          <div>
            <div className="stat-number">{counts.done}</div>
            <div className="stat-label">Done</div>
          </div>
        </div>
      </div>
    </>
  );
}

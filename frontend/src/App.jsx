import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, AlertCircle, RefreshCw, Layers, X, Check } from 'lucide-react';
import Header from './components/Header';
import ReleaseCard from './components/ReleaseCard';
import CreateReleaseModal from './components/CreateReleaseModal';
import EditInfoModal from './components/EditInfoModal';
import * as api from './services/api';

export default function App() {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRefreshToast, setShowRefreshToast] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRelease, setEditingRelease] = useState(null);

  const loadReleases = async (isManual = false) => {
    try {
      if (isManual) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');
      const data = await api.fetchReleases();
      setReleases(data);
      if (isManual) {
        setShowRefreshToast(true);
        setTimeout(() => setShowRefreshToast(false), 2000);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load releases. Please check the backend connection.');
    } finally {
      // Keep refresh spin for at least 400ms so user sees clear feedback
      setTimeout(() => {
        setLoading(false);
        setIsRefreshing(false);
      }, isManual ? 400 : 0);
    }
  };

  useEffect(() => {
    loadReleases();
  }, []);

  const handleCreateRelease = async (releaseData) => {
    const created = await api.createRelease(releaseData);
    setReleases((prev) => [created, ...prev]);
  };

  const handleSaveRelease = async (id, updateData) => {
    const updated = await api.updateRelease(id, updateData);
    setReleases((prev) => prev.map((r) => (r.id === id ? updated : r)));
  };

  const handleToggleStep = async (releaseId, stepId, completed) => {
    // Optimistic UI update
    setReleases((prev) =>
      prev.map((rel) => {
        if (rel.id !== releaseId) return rel;

        const updatedSteps = rel.steps.map((s) =>
          s.id === stepId ? { ...s, completed } : s
        );
        const completedCount = updatedSteps.filter((s) => s.completed).length;
        const total = updatedSteps.length;
        let nextStatus = 'ongoing';
        if (completedCount === 0) nextStatus = 'planned';
        if (completedCount === total) nextStatus = 'done';

        return {
          ...rel,
          steps: updatedSteps,
          completedCount,
          status: nextStatus,
          progressPercentage: Math.round((completedCount / total) * 100),
          completedStepIds: updatedSteps.filter((s) => s.completed).map((s) => s.id),
        };
      })
    );

    try {
      const serverUpdated = await api.toggleStep(releaseId, stepId, completed);
      setReleases((prev) => prev.map((r) => (r.id === releaseId ? serverUpdated : r)));
    } catch (err) {
      console.error('Failed to toggle step on server, rolling back:', err);
      // Reload on failure
      loadReleases();
    }
  };

  const handleDeleteRelease = async (id) => {
    await api.deleteRelease(id);
    setReleases((prev) => prev.filter((r) => r.id !== id));
  };

  // Counts for filter tabs
  const counts = useMemo(() => {
    return {
      total: releases.length,
      planned: releases.filter((r) => r.status === 'planned').length,
      ongoing: releases.filter((r) => r.status === 'ongoing').length,
      done: releases.filter((r) => r.status === 'done').length,
    };
  }, [releases]);

  // Filtered releases
  const filteredReleases = useMemo(() => {
    return releases.filter((rel) => {
      const matchesFilter =
        activeFilter === 'all' || rel.status === activeFilter;
      const matchesSearch =
        !searchQuery ||
        rel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rel.additionalInfo &&
          rel.additionalInfo.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [releases, activeFilter, searchQuery]);

  return (
    <div className="app-container">
      <Header
        onOpenCreate={() => setIsCreateOpen(true)}
        counts={counts}
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
      />

      <div className="controls-row">
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search releases by name or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => loadReleases(true)}
          disabled={loading || isRefreshing}
          title="Refresh releases from database"
        >
          <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
          {isRefreshing ? 'Syncing...' : 'Refresh'}
        </button>
      </div>

      {showRefreshToast && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            backgroundColor: 'var(--status-done-bg)',
            color: 'var(--status-done-text)',
            border: '1px solid var(--status-done-border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            fontSize: '0.85rem',
            fontWeight: '600',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <Check size={16} />
          Synced with database!
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '14px 18px',
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger)',
            border: '1px solid var(--danger-border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <AlertCircle size={20} />
          <div>{error}</div>
        </div>
      )}

      {loading && releases.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          <RefreshCw size={32} className="spin" style={{ marginBottom: '12px' }} />
          <p>Loading releases and checklists...</p>
        </div>
      ) : filteredReleases.length === 0 ? (
        <div className="empty-state">
          <Layers className="empty-icon" />
          <h3 className="empty-title">
            {searchQuery || activeFilter !== 'all'
              ? 'No matching releases found'
              : 'No releases created yet'}
          </h3>
          <p className="empty-desc">
            {searchQuery || activeFilter !== 'all'
              ? 'Try adjusting your search query or status filter to see releases.'
              : 'Create your first release checklist to start tracking deployment steps.'}
          </p>
          {!searchQuery && activeFilter === 'all' && (
            <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
              <Plus size={16} />
              Create First Release
            </button>
          )}
        </div>
      ) : (
        <div className="releases-grid">
          {filteredReleases.map((release) => (
            <ReleaseCard
              key={release.id}
              release={release}
              onToggleStep={handleToggleStep}
              onEdit={setEditingRelease}
              onDelete={handleDeleteRelease}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateReleaseModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateRelease}
      />

      {/* Edit Modal */}
      <EditInfoModal
        isOpen={!!editingRelease}
        release={editingRelease}
        onClose={() => setEditingRelease(null)}
        onSave={handleSaveRelease}
      />
    </div>
  );
}

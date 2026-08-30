const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchReleases() {
  const res = await fetch(`${API_BASE}/releases`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch releases');
  }
  const data = await res.json();
  return data.data || [];
}

export async function fetchSteps() {
  const res = await fetch(`${API_BASE}/steps`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch steps');
  }
  const data = await res.json();
  return data.data || [];
}

export async function createRelease({ name, targetDate, additionalInfo, completedStepIds = [] }) {
  const res = await fetch(`${API_BASE}/releases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, targetDate, additionalInfo, completedStepIds }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create release');
  }
  return data.data;
}

export async function updateRelease(id, { name, targetDate, additionalInfo }) {
  const res = await fetch(`${API_BASE}/releases/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, targetDate, additionalInfo }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update release');
  }
  return data.data;
}

export async function toggleStep(id, stepId, completed) {
  const res = await fetch(`${API_BASE}/releases/${id}/toggle-step`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stepId, completed }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update step state');
  }
  return data.data;
}

export async function updateSteps(id, completedStepIds) {
  const res = await fetch(`${API_BASE}/releases/${id}/steps`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completedStepIds }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update steps');
  }
  return data.data;
}

export async function deleteRelease(id) {
  const res = await fetch(`${API_BASE}/releases/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete release');
  }
  return data.data;
}

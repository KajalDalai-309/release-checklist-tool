import React from 'react';

export default function StepChecklist({ steps, onToggleStep, disabled }) {
  return (
    <div className="steps-section">
      <div className="steps-list">
        {steps.map((step) => (
          <label
            key={step.id}
            className={`step-item ${step.completed ? 'checked' : ''}`}
          >
            <input
              type="checkbox"
              className="step-checkbox"
              checked={step.completed}
              disabled={disabled}
              onChange={(e) => onToggleStep(step.id, e.target.checked)}
            />
            <div className="step-details">
              <div className="step-title">{step.title}</div>
              {step.description && (
                <div className="step-desc">{step.description}</div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import './CP-Checklist.css';

const CPChecklist = () => {
  const [activities, setActivities] = useState([
    {
      id: 1,
      name: 'piling',
      unitOfCount: 'No of trackers',
      subActivities: [
        {
          id: 11,
          name: 'pile install',
          unit: 'Piers',
          weight: 20
        },
        {
          id: 12,
          name: 'pile distribution',
          unit: 'Piers',
          weight: 57
        }
      ]
    },
    {
      id: 2,
      name: 'module',
      unitOfCount: 'No of trackers',
      subActivities: [
        {
          id: 21,
          name: 'module install',
          unit: 'Modules',
          weight: 30
        }
      ]
    }
  ]);

  const unitOptions = [
    'No of trackers',
    'Piers',
    'Modules',
    'Components',
    'Units',
    'Select Unit'
  ];

  // Calculate parent activity weights and total weight
  const calculateWeights = (activities) => {
    return activities.map(activity => {
      const subWeight = activity.subActivities.reduce((sum, sub) => {
        const weight = parseFloat(sub.weight) || 0;
        return sum + weight;
      }, 0);
      return { ...activity, weight: Math.round(subWeight * 100) / 100 };
    });
  };

  const activitiesWithWeights = calculateWeights(activities);
  const totalWeight = Math.round(activitiesWithWeights.reduce((sum, activity) => sum + activity.weight, 0) * 100) / 100;

  // Add new parent activity
  const addActivity = () => {
    const newId = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;
    const newActivity = {
      id: newId,
      name: `Activity ${newId}`,
      unitOfCount: 'No of trackers',
      subActivities: [
        {
          id: newId * 10 + 1,
          name: '',
          unit: 'Select Unit',
          weight: 0
        }
      ]
    };
    setActivities([...activities, newActivity]);
  };

  // Delete parent activity
  const deleteActivity = (activityId) => {
    setActivities(activities.filter(activity => activity.id !== activityId));
  };

  // Add sub-activity to a parent activity
  const addSubActivity = (activityId) => {
    const newActivities = activities.map(activity => {
      if (activity.id === activityId) {
        const maxSubId = activity.subActivities.length > 0 
          ? Math.max(...activity.subActivities.map(s => s.id)) 
          : activityId * 10;
        const newSubId = maxSubId + 1;
        return {
          ...activity,
          subActivities: [
            ...activity.subActivities,
            {
              id: newSubId,
              name: '',
              unit: 'Select Unit',
              weight: 0
            }
          ]
        };
      }
      return activity;
    });
    setActivities(newActivities);
  };

  // Delete sub-activity
  const deleteSubActivity = (activityId, subActivityId) => {
    const newActivities = activities.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          subActivities: activity.subActivities.filter(sub => sub.id !== subActivityId)
        };
      }
      return activity;
    });
    setActivities(newActivities);
  };

  // Update sub-activity fields
  const updateSubActivity = (activityId, subActivityId, field, value) => {
    const newActivities = activities.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          subActivities: activity.subActivities.map(sub => {
            if (sub.id === subActivityId) {
              const newValue = field === 'weight' 
                ? (value === '' ? 0 : parseFloat(value) || 0) 
                : value;
              return { ...sub, [field]: newValue };
            }
            return sub;
          })
        };
      }
      return activity;
    });
    setActivities(newActivities);
  };

  // Update parent activity fields (name and unit)
  const updateActivity = (activityId, field, value) => {
    const newActivities = activities.map(activity => {
      if (activity.id === activityId) {
        return { ...activity, [field]: value };
      }
      return activity;
    });
    setActivities(newActivities);
  };

  const handleSave = () => {
    console.log('Saving checklist:', activitiesWithWeights);
    alert('Checklist saved successfully!');
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      console.log('Cancelled');
    }
  };

  return (
    <div className="cp-checklist-container">
      <div className="cp-checklist-wrapper">
        {/* Header */}
        <div className="cp-header">
          <div className="cp-header-content">
            <h1 className="cp-title">NX 23-05 - CP Checklist</h1>
            <div className="cp-header-actions">
              <span className="cp-weight-display">Weight: {totalWeight}%</span>
              <button
                onClick={addActivity}
                className="cp-btn cp-btn-add"
                title="Add New Activity"
              >
                <span className="cp-plus-icon">+</span>
              </button>
              <button
                onClick={handleSave}
                className="cp-btn cp-btn-save"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="cp-btn cp-btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="cp-activities-list">
          {activitiesWithWeights.length === 0 ? (
            <div className="cp-empty-state">
              <div className="cp-empty-content">
                <div className="cp-empty-icon">+</div>
                <p className="cp-empty-title">No activities yet</p>
                <p className="cp-empty-subtitle">Click the + button to add your first activity</p>
              </div>
            </div>
          ) : (
            activitiesWithWeights.map((activity, activityIndex) => (
              <div key={activity.id} className="cp-activity-card">
                {/* Parent Activity Header */}
                <div className="cp-activity-header">
                  <div className="cp-activity-header-content">
                    <div className="cp-activity-number">
                      {activityIndex + 1}
                    </div>
                    <div className="cp-activity-form">
                      <div className="cp-form-group">
                        <label className="cp-label">Activity Name</label>
                        <input
                          type="text"
                          value={activity.name}
                          onChange={(e) => updateActivity(activity.id, 'name', e.target.value)}
                          className="cp-input"
                          placeholder="Enter activity name"
                        />
                      </div>
                      <div className="cp-form-group">
                        <label className="cp-label">Unit of Count</label>
                        <select
                          value={activity.unitOfCount}
                          onChange={(e) => updateActivity(activity.id, 'unitOfCount', e.target.value)}
                          className="cp-select"
                        >
                          {unitOptions.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </div>
                      <div className="cp-form-group">
                        <label className="cp-label">Total Weight</label>
                        <div className="cp-weight-input">
                          <input
                            type="number"
                            value={activity.weight}
                            readOnly
                            className="cp-input cp-input-readonly"
                          />
                          <span className="cp-weight-unit">%</span>
                        </div>
                        <p className="cp-help-text">Auto-calculated from sub-activities</p>
                      </div>
                      <div className="cp-form-actions">
                        <button
                          onClick={() => deleteActivity(activity.id)}
                          className="cp-btn cp-btn-delete"
                          title="Delete Activity"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-Activities */}
                <div className="cp-subactivities">
                  <div className="cp-subactivities-list">
                    {activity.subActivities.length === 0 ? (
                      <div className="cp-no-subactivities">
                        <p>No sub-activities</p>
                        <button
                          onClick={() => addSubActivity(activity.id)}
                          className="cp-btn cp-btn-link"
                        >
                          Add the first sub-activity
                        </button>
                      </div>
                    ) : (
                      activity.subActivities.map((subActivity, subIndex) => (
                        <div key={subActivity.id} className="cp-subactivity-item">
                          <div className="cp-subactivity-number">
                            {activityIndex + 1}.{subIndex + 1}
                          </div>
                          <div className="cp-subactivity-form">
                            <div className="cp-form-group">
                              <label className="cp-label">Sub-activity Name</label>
                              <input
                                type="text"
                                value={subActivity.name}
                                onChange={(e) => updateSubActivity(activity.id, subActivity.id, 'name', e.target.value)}
                                placeholder="Enter sub-activity name"
                                className="cp-input"
                              />
                            </div>
                            <div className="cp-form-group">
                              <label className="cp-label">Unit</label>
                              <select
                                value={subActivity.unit}
                                onChange={(e) => updateSubActivity(activity.id, subActivity.id, 'unit', e.target.value)}
                                className="cp-select"
                              >
                                {unitOptions.map(unit => (
                                  <option key={unit} value={unit}>{unit}</option>
                                ))}
                              </select>
                            </div>
                            <div className="cp-form-group">
                              <label className="cp-label">Weight</label>
                              <div className="cp-weight-input">
                                <input
                                  type="number"
                                  value={subActivity.weight}
                                  onChange={(e) => updateSubActivity(activity.id, subActivity.id, 'weight', e.target.value)}
                                  min="0"
                                  step="0.01"
                                  className="cp-input"
                                  placeholder="0"
                                />
                                <span className="cp-weight-unit">%</span>
                              </div>
                            </div>
                            <div className="cp-form-actions">
                              <button
                                onClick={() => deleteSubActivity(activity.id, subActivity.id)}
                                className="cp-btn cp-btn-delete"
                                title="Delete Sub-activity"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Add Sub-activity Button */}
                  <div className="cp-add-subactivity">
                    <button
                      onClick={() => addSubActivity(activity.id)}
                      className="cp-btn cp-btn-add-sub"
                    >
                      <span className="cp-plus-icon">+</span>
                      <span>Add Sub-activity</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Footer */}
        {activitiesWithWeights.length > 0 && (
          <div className="cp-summary">
            <div className="cp-summary-content">
              <div className="cp-summary-info">
                <h3 className="cp-summary-title">Summary</h3>
                <p className="cp-summary-details">
                  Total Activities: {activitiesWithWeights.length} | 
                  Total Sub-activities: {activitiesWithWeights.reduce((sum, act) => sum + act.subActivities.length, 0)}
                </p>
              </div>
              <div className="cp-summary-weight">
                <p className="cp-total-weight">{totalWeight}%</p>
                <p className="cp-weight-label">Total Weight</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CPChecklist;
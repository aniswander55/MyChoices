// TeenRewards - A Progressive Web App for tracking daily activities, goals, rewards, notes, and mood
// Features: PWA support, offline functionality, data export, SMS sharing, and responsive design

// Global helper function for feeling emojis
function getFeelingEmoji(value) {
  if (value <= 2) return '😢';
  if (value <= 4) return '😐';
  if (value <= 6) return '🙂';
  if (value <= 8) return '😊';
  return '😄';
}

// Global data structure
const STORAGE_KEY = 'teenrewards-data-v1';
const DEFAULT_COLORS = {
  primary: '#6c63ff',
  secondary: '#e75480', 
  accent: '#28a745',
  background: '#f8f9fa'
};

const COLOR_PRESETS = {
  default: { name: 'Default', primary: '#6c63ff', secondary: '#e75480', accent: '#28a745', background: '#f8f9fa', 
    primaryLight: '#b6e0fe', primaryDark: '#4536b8', 
    secondaryLight: '#ffe6f2', secondaryDark: '#8b1a4b', 
    accentLight: '#d2f8b6', accentDark: '#225c1c' },
  ocean: { name: 'Ocean Blue', primary: '#1e3a8a', secondary: '#0ea5e9', accent: '#10b981', background: '#f0f9ff' },
  sunset: { name: 'Sunset', primary: '#f97316', secondary: '#ec4899', accent: '#f59e0b', background: '#fef3c7' },
  forest: { name: 'Forest Green', primary: '#166534', secondary: '#16a34a', accent: '#84cc16', background: '#f0fdf4' },
  lavender: { name: 'Lavender', primary: '#7c3aed', secondary: '#a855f7', accent: '#ec4899', background: '#faf5ff' },
  coral: { name: 'Coral', primary: '#dc2626', secondary: '#f97316', accent: '#f59e0b', background: '#fef2f2' },
  midnight: { name: 'Midnight', primary: '#1e293b', secondary: '#475569', accent: '#0ea5e9', background: '#f1f5f9' },
  rose: { name: 'Rose Gold', primary: '#be185d', secondary: '#e11d48', accent: '#f97316', background: '#fdf2f8' },
  autumn: { name: 'Autumn', primary: '#d97706', secondary: '#b45309', accent: '#dc2626', background: '#fef3c7' },
  spring: { name: 'Spring', primary: '#059669', secondary: '#10b981', accent: '#fbbf24', background: '#f0fdf4' },
  berry: { name: 'Berry', primary: '#7c2d12', secondary: '#dc2626', accent: '#ec4899', background: '#fef2f2' },
  sky: { name: 'Sky', primary: '#0ea5e9', secondary: '#38bdf8', accent: '#06b6d4', background: '#f0f9ff' },
  earth: { name: 'Earth', primary: '#92400e', secondary: '#a16207', accent: '#16a34a', background: '#fef3c7' },
  neon: { name: 'Neon', primary: '#06b6d4', secondary: '#8b5cf6', accent: '#ec4899', background: '#f0fdf4' },
  pastel: { name: 'Pastel', primary: '#f472b6', secondary: '#a78bfa', accent: '#34d399', background: '#fdf2f8' },
  vintage: { name: 'Vintage', primary: '#9a3412', secondary: '#7c2d12', accent: '#a16207', background: '#fef3c7' },
  defaultdark: {
    name: 'Default Dark',
    primary: '#667eea', // blue from settings gradient
    secondary: '#764ba2', // purple from settings gradient
    accent: '#28a745', // keep green accent for continuity
    background: '#232136', // dark background
    primaryLight: '#a3bffa', // lighter blue
    primaryDark: '#3b4899', // darker blue
    secondaryLight: '#a084ca',
    secondaryDark: '#4b3264',
    accentLight: '#5be584',
    accentDark: '#1b5e20'
  },
};

let data = {
  activities: [
    { name: 'Movie with family', reward: 5, icon: '🎬' },
    { name: 'Walked dogs', reward: 5, icon: '🐕‍🦺' },
    { name: 'Helped outside', reward: 5, icon: '🌳' },
    { name: 'Cleaned pond', reward: 5, icon: '🪣' },
    { name: 'Pulled weeds front of house', reward: 5, icon: '🌱' },
    { name: 'Helped a struggling friend', reward: 5, icon: '🤗' },
    { name: 'Read (20 minutes)', reward: 5, icon: '📚' },
    { name: 'Cleaned room', reward: 5, icon: '🧹' },
    { name: 'Helped with chickens', reward: 5, icon: '🐔' },
    { name: 'Practice driving', reward: 5, icon: '🚗' },
    { name: 'Played game with someone', reward: 5, icon: '🎲' },
    { name: 'Asleep by 12', reward: 5, icon: '😴' },
    { name: 'School activity', reward: 5, icon: '🏫' },
    { name: 'Did Dishes', reward: 5, icon: '🍽️' },
    { name: 'Did Laundry', reward: 5, icon: '🧺' }
  ],
  rewards: [], // { activity, reward, date }
};

// Global state for phone view settings panel
let phoneSettingsOpen = false;

// Global state for modal goal tracking
let modalGoalState = false;

function todayStr() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateForDisplay(dateStr) {
  // Parse as local date, not UTC
  const [year, month, day] = dateStr.split('-');
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const monthName = date.toLocaleDateString('en-US', { month: 'long' });
  return `${monthName} ${date.getDate()}`;
}

function lightenColor(color, amount) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * amount * 100);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function darkenColor(color, amount) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * amount * 100);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
    (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
    (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
}

function getColorTheme() {
  const savedColors = localStorage.getItem('teenrewards-colors');
  if (savedColors) {
    return JSON.parse(savedColors);
  }
  return DEFAULT_COLORS;
}

function saveColorTheme(colors) {
  localStorage.setItem('teenrewards-colors', JSON.stringify(colors));
  applyColorTheme(colors);
}

function applyColorTheme(colors) {
  const root = document.documentElement;
  
  // Use preset light/dark colors if available, otherwise generate them
  const primaryLight = colors.primaryLight || lightenColor(colors.primary, 0.7);
  const primaryDark = colors.primaryDark || darkenColor(colors.primary, 0.3);
  const secondaryLight = colors.secondaryLight || lightenColor(colors.secondary, 0.8);
  const secondaryDark = colors.secondaryDark || darkenColor(colors.secondary, 0.2);
  const accentLight = colors.accentLight || lightenColor(colors.accent, 0.7);
  const accentDark = colors.accentDark || darkenColor(colors.accent, 0.3);
  
  // Set all color variables
  root.style.setProperty('--primary-color', colors.primary);
  root.style.setProperty('--secondary-color', colors.secondary);
  root.style.setProperty('--accent-color', colors.accent);
  root.style.setProperty('--background-color', colors.background);
  root.style.setProperty('--primary-color-light', primaryLight);
  root.style.setProperty('--primary-color-dark', primaryDark);
  root.style.setProperty('--secondary-color-light', secondaryLight);
  root.style.setProperty('--secondary-color-dark', secondaryDark);
  root.style.setProperty('--accent-color-light', accentLight);
  root.style.setProperty('--accent-color-dark', accentDark);
  
  // Also update specific elements that might not use CSS variables
  const elements = document.querySelectorAll('.action-btn, .progress-label, .feeling-number, .activities-title, .activity-mini-points, .progress-bar-fill');
  elements.forEach(el => {
    if (el.classList.contains('action-btn') || el.classList.contains('progress-bar-fill')) {
      el.style.background = colors.primary;
    } else {
      el.style.color = colors.primary;
    }
  });
  
  // Update buttons with secondary color
  const secondaryButtons = document.querySelectorAll('#phone-save-name-btn, #phone-add-activity-btn');
  secondaryButtons.forEach(btn => {
    btn.style.background = colors.secondary;
  });
  
  // Update accent colored elements
  const accentElements = document.querySelectorAll('.accomplished-mini-points, .accomplishments-title');
  accentElements.forEach(el => {
    el.style.color = colors.accent;
  });
  
  // Update card backgrounds
  const activitiesCard = document.querySelector('.activities-card');
  if (activitiesCard) {
    activitiesCard.style.background = primaryLight;
    activitiesCard.style.color = primaryDark;
  }
  
  const goalsCard = document.querySelector('.goals-card');
  if (goalsCard) {
    goalsCard.style.background = secondaryLight;
    goalsCard.style.color = secondaryDark;
  }
  
  const accomplishmentsCard = document.querySelector('.accomplishments-card');
  if (accomplishmentsCard) {
    accomplishmentsCard.style.background = accentLight;
    accomplishmentsCard.style.color = accentDark;
  }
}

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    data = JSON.parse(saved);
  }
  
  console.log('Loaded data:', data);
  // Ensure all activities have the goal property
  data.activities.forEach(activity => {
    if (!('goal' in activity)) {
      activity.goal = false;
    }
  });
  // Double-check that all activities have the goal property
  data.activities.forEach((activity, index) => {
    if (typeof activity.goal !== 'boolean') {
      console.log('Fixing goal property for activity at index', index, ':', activity.name);
      activity.goal = false;
    }
  });
  console.log('After ensuring goal property:', data.activities);
}

function saveData() {
  console.log('Saving data:', data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// --- Modal Elements ---
const activityModal = document.getElementById('activity-modal');
const modalTitle = document.getElementById('modal-title');
const modalForm = document.getElementById('modal-activity-form');
const modalName = document.getElementById('modal-activity-name');
const modalReward = document.getElementById('modal-activity-reward');
const modalIcon = document.getElementById('modal-activity-icon');
const modalGoal = document.getElementById('modal-activity-goal');
const iconPicker = document.getElementById('icon-picker');
const modalSave = document.getElementById('modal-save');
const modalCancel = document.getElementById('modal-cancel');
const modalCardPreview = null; // This element doesn't exist in the HTML
const modalDelete = document.getElementById('modal-delete');

// Debug modal elements
console.log('Modal elements found:', {
  modalGoal: !!modalGoal,
  modalName: !!modalName,
  modalForm: !!modalForm
});

let modalEditIdx = null;

function updateModalCardPreview() {
  // This function is not needed since modalCardPreview doesn't exist
  // Keeping it for compatibility but making it a no-op
}

// These event listeners are not needed since modalCardPreview doesn't exist
// modalName.addEventListener('input', updateModalCardPreview);
// modalReward.addEventListener('input', updateModalCardPreview);
// modalIcon.addEventListener('input', updateModalCardPreview);

function openActivityModal({title, name, reward, icon, goal, idx}) {
  console.log('=== OPEN ACTIVITY MODAL ===');
  console.log('Received parameters:', {title, name, reward, icon, goal, idx});
  console.log('Goal parameter:', goal);
  console.log('Goal type:', typeof goal);
  console.log('=======================');
  
  modalTitle.textContent = title;
  modalName.value = name || '';
  modalReward.value = reward || 5;
  modalIcon.value = icon || '✨';
  modalEditIdx = idx;
  modalGoalState = goal || false; // Track the goal state
  renderIconPicker(icon || '✨');
  activityModal.style.display = '';
  modalName.focus();
  if (modalDelete) {
    modalDelete.style.display = (idx !== null) ? '' : 'none';
  }
  // Add/Remove Goal button logic
  const goalToggleRow = document.getElementById('modal-goal-toggle-row');
  console.log('Goal toggle row found:', !!goalToggleRow);
  if (goalToggleRow) {
    goalToggleRow.innerHTML = '';
    
    // Add a label
    const label = document.createElement('label');
    label.textContent = 'Goal Status:';
    label.style.display = 'block';
    label.style.marginBottom = '0.5em';
    label.style.fontWeight = '600';
    label.style.color = '#333';
    goalToggleRow.appendChild(label);
    
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.style.background = modalGoalState ? '#e75480' : '#b6e0fe';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '8px';
    btn.style.padding = '0.5em 1.2em';
    btn.style.fontSize = '1em';
    btn.style.fontWeight = '600';
    btn.style.cursor = 'pointer';
    btn.style.marginBottom = '0.2em';
    btn.style.width = '100%';
    btn.textContent = modalGoalState ? 'Remove from Goal' : 'Add Goal';
    console.log('Created goal button with text:', btn.textContent);
    btn.onclick = function() {
      console.log('Goal button clicked!');
      // Toggle the goal property
      if (typeof modalEditIdx === 'number' && data.activities[modalEditIdx]) {
        // Editing existing activity
        data.activities[modalEditIdx].goal = !data.activities[modalEditIdx].goal;
        saveData();
        // Re-open modal with updated goal state
        openActivityModal({
          title,
          name: data.activities[modalEditIdx].name,
          reward: data.activities[modalEditIdx].reward,
          icon: data.activities[modalEditIdx].icon,
          goal: data.activities[modalEditIdx].goal,
          idx: modalEditIdx
        });
        renderPhoneView();
      } else {
        // Creating new activity - toggle the goal state
        modalGoalState = !modalGoalState;
        openActivityModal({
          title,
          name,
          reward,
          icon,
          goal: modalGoalState,
          idx: null
        });
      }
    };
    goalToggleRow.appendChild(btn);
    console.log('Goal button added to DOM');
  } else {
    console.error('Goal toggle row not found!');
  }
}

function closeActivityModal() {
  activityModal.style.display = 'none';
  modalEditIdx = null;
  modalGoalState = false; // Reset goal state
}

function renderIconPicker(selected) {
  iconPicker.innerHTML = '';
  const ICONS = [
    '🎬','🐕‍🦺','🌳','🪣','🌱','🤗','📚','🧹','🐔','🚗','🎲','😴','🏫','🍽️','🧺','✨','⭐','💡','🏆','🎵','🎨','🏃‍♀️','🧘‍♀️','🛒','🧁'
  ];
  ICONS.forEach(ic => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'icon-option' + (ic === selected ? ' selected' : '');
    btn.textContent = ic;
    btn.addEventListener('click', () => {
      modalIcon.value = ic;
      renderIconPicker(ic);
    });
    iconPicker.appendChild(btn);
  });
}

modalIcon.addEventListener('input', () => {
  renderIconPicker(modalIcon.value);
});

if (modalCancel) {
  modalCancel.addEventListener('click', e => {
    e.preventDefault();
    renderPhoneView();
    closeActivityModal();
  });
}

modalForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = modalName.value.trim();
  const reward = parseInt(modalReward.value, 10);
  const icon = modalIcon.value.trim() || '✨';
  // Use the current goal value from the data array if editing, or the tracked state if new
  const goal = (typeof modalEditIdx === 'number' && data.activities[modalEditIdx])
    ? data.activities[modalEditIdx].goal
    : modalGoalState;
  console.log('Saving activity with goal:', goal);
  if (!name || !reward) return;
  if (modalEditIdx !== null) {
    console.log('Updating activity at index:', modalEditIdx, 'with goal:', goal);
    data.activities[modalEditIdx] = { name, reward, icon, goal };
    console.log('Updated activity:', data.activities[modalEditIdx]);
  } else {
    console.log('Adding new activity with goal:', goal);
    data.activities.push({ name, reward, icon, goal });
  }
  saveData();
  
  renderPhoneView();
  closeActivityModal();
});

if (modalDelete) {
  modalDelete.addEventListener('click', () => {
    if (modalEditIdx !== null) {
      const pw = prompt('Enter admin password to delete:');
      if (pw === 'Password1') {
        data.activities.splice(modalEditIdx, 1);
        saveData();
        renderPhoneView();
      } else {
        alert('Incorrect password.');
      }
    }
  });
}

// --- Utility Functions ---
function getAccomplishedToday() {
  return data.rewards.filter(r => r.date === todayStr()).map(r => r.activity);
}

function getAccomplishedForDate(dateStr) {
  return data.rewards.filter(r => r.date === dateStr).map(r => r.activity);
}

function getRewardsForDate(dateStr) {
  return data.rewards.filter(r => r.date === dateStr);
}

function getPointsForDate(dateStr) {
  return getRewardsForDate(dateStr).reduce((sum, r) => sum + (r.reward || 0), 0);
}

// --- Add Reward ---
function addReward(activity, dateStr) {
  const reward = data.activities.find(a => a.name === activity);
  if (reward) {
    data.rewards.push({ activity, reward: reward.reward, date: dateStr });
    saveData();
    renderPhoneView();
  }
}

// --- Export Functions ---
function createExportCard(dateToExport = null) {
  const exportDate = dateToExport || todayStr();
  
  // Create a temporary container for the export card
  const exportContainer = document.createElement('div');
  exportContainer.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: 600px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    padding: 30px;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  `;

  // Parse exportDate as local date (not UTC)
  const [year, month, day] = exportDate.split('-');
  const today = new Date(Number(year), Number(month) - 1, Number(day));
  console.log('Export date:', exportDate, 'Parsed as:', today, 'Locale string:', today.toLocaleDateString());
  const dateStr = today.toLocaleDateString(undefined, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Get data for the export date
  const dayRewards = data.rewards.filter(r => r.date === exportDate);
  const points = dayRewards.reduce((sum, r) => sum + (r.reward || 0), 0);
  const notes = localStorage.getItem('notes-' + exportDate) || '';
  const feeling = localStorage.getItem('feeling-' + exportDate);
  const todayGoal = parseInt(localStorage.getItem('todays-goal'), 10) || 100;
  const progressPercent = Math.min(100, Math.round((points / todayGoal) * 100));
  
  // Get user's name from settings
  const userName = localStorage.getItem('user-name') || '';
  const nameDisplay = userName ? ` - ${userName}` : '';

  // Create the card content
  exportContainer.innerHTML = `
    <div style="text-align: center; margin-bottom: 25px;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${dateStr}</h1>
      <div style="font-size: 18px; opacity: 0.9; margin-top: 5px;">Daily Progress Report${nameDisplay}</div>
    </div>

    <div style="display: flex; gap: 20px; margin-bottom: 25px;">
      ${feeling ? `
        <div style="flex: 1;">
          <div style="font-size: 16px; font-weight: 600; margin-bottom: 10px;">Feeling: ${feeling}</div>
          <div style="background: rgba(255,255,255,0.2); border-radius: 10px; height: 20px; overflow: hidden;">
            <div style="background: linear-gradient(90deg, #FF6B6B, #FFE66D); height: 100%; width: ${(parseInt(feeling) / 10) * 100}%; transition: width 0.3s ease;"></div>
          </div>
          <div style="text-align: center; font-size: 14px; margin-top: 5px; opacity: 0.8;">${feeling}/10</div>
        </div>
      ` : ''}

      <div style="flex: 1;">
        <div style="font-size: 16px; font-weight: 600; margin-bottom: 10px;">Progress: ${points} Points (${todayGoal} Goal)</div>
        <div style="background: rgba(255,255,255,0.2); border-radius: 10px; height: 20px; overflow: hidden;">
          <div style="background: linear-gradient(90deg, #4CAF50, #8BC34A); height: 100%; width: ${progressPercent}%; transition: width 0.3s ease;"></div>
        </div>
        <div style="text-align: center; font-size: 14px; margin-top: 5px; opacity: 0.8;">${progressPercent}% of daily goal</div>
      </div>
    </div>

    ${notes ? `
      <div style="margin-bottom: 25px;">
        <div style="font-size: 16px; font-weight: 600; margin-bottom: 10px;">Notes</div>
        <div style="background: rgba(255,255,255,0.1); border-radius: 10px; padding: 15px; font-size: 14px; line-height: 1.4;">${notes}</div>
      </div>
    ` : ''}

    ${dayRewards.length > 0 ? `
      <div style="margin-bottom: 25px;">
        <div style="font-size: 16px; font-weight: 600; margin-bottom: 15px;">Activities Completed: ${dayRewards.length}</div>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          ${dayRewards.map(r => {
            const act = data.activities.find(a => a.name === r.activity);
            const isGoal = act && act.goal;
            return `<div style="background: ${isGoal ? 'rgba(76,175,80,0.3)' : 'rgba(255,255,255,0.15)'}; border-radius: 10px; padding: 8px 12px; font-size: 14px; display: flex; align-items: center; gap: 5px; border: 2px solid ${isGoal ? '#4CAF50' : 'rgba(255,255,255,0.3)'};">
              <span style="font-size: 16px;">${(act && act.icon) || '✨'}</span>
              <span>${r.activity}</span>
              <span style="opacity: 0.8;">+${r.reward}</span>
              ${isGoal ? '<span style="color: #4CAF50; font-weight: bold;">✓</span>' : ''}
            </div>`;
          }).join('')}
        </div>
      </div>
    ` : ''}

    <div style="text-align: center; margin-top: 30px; opacity: 0.7; font-size: 12px;">
      Generated with TeenRewards • ${today.toLocaleDateString()}
    </div>
  `;

  return exportContainer;
}

function exportAsImage(dateToExport = null) {
  return new Promise((resolve, reject) => {
    const exportContainer = dateToExport ? createExportCard(dateToExport) : createExportCard();
    document.body.appendChild(exportContainer);

    // Get the true width of the export container
    const trueWidth = exportContainer.scrollWidth;
    const trueHeight = exportContainer.scrollHeight;

    // Use html2canvas to convert to image
    if (typeof html2canvas !== 'undefined') {
      html2canvas(exportContainer, {
        width: trueWidth,
        height: trueHeight,
        backgroundColor: null,
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true
      }).then(canvas => {
        // Store the canvas data URL for sharing
        const dataUrl = canvas.toDataURL('image/png');
        const dateStr = dateToExport || todayStr();
        
        // Clean up
        document.body.removeChild(exportContainer);
        
        // Resolve with the data URL and filename
        resolve({
          dataUrl: dataUrl,
          filename: `daily-report-${dateStr}.png`
        });
      }).catch(error => {
        console.error('Error generating image:', error);
        document.body.removeChild(exportContainer);
        reject(error);
      });
    } else {
      // Fallback if html2canvas is not available
      document.body.removeChild(exportContainer);
      reject(new Error('html2canvas library not available'));
    }
  });
}

// Export Modal Functions
function showExportModal() {
  const exportModal = document.getElementById('export-modal');
  const singleDateInput = document.getElementById('export-single-date');
  
  if (exportModal) {
    // Set default dates
    if (singleDateInput) singleDateInput.value = todayStr();
    
    exportModal.style.display = 'flex';
  }
}

function hideExportModal() {
  const exportModal = document.getElementById('export-modal');
  if (exportModal) {
    exportModal.style.display = 'none';
  }
}

// Notes Modal Functions
function showNotesModal() {
  const notesModal = document.getElementById('notes-modal');
  const notesTextarea = document.getElementById('notes-textarea');
  
  if (notesModal && notesTextarea) {
    const currentNotes = localStorage.getItem('notes-' + todayStr()) || '';
    notesTextarea.value = currentNotes;
    notesModal.style.display = '';
    notesTextarea.focus();
    // Add click-away to close
    notesModal.addEventListener('mousedown', notesModal._clickAwayHandler = function(e) {
      if (e.target === notesModal) hideNotesModal();
    });
  }
}

function hideNotesModal() {
  const notesModal = document.getElementById('notes-modal');
  if (notesModal) {
    notesModal.style.display = 'none';
    // Remove click-away handler
    if (notesModal._clickAwayHandler) {
      notesModal.removeEventListener('mousedown', notesModal._clickAwayHandler);
      delete notesModal._clickAwayHandler;
    }
  }
}

// Feeling Modal Functions
function showFeelingModal() {
  const feelingModal = document.getElementById('feeling-modal');
  const feelingSlider = document.getElementById('feeling-slider');
  const feelingSliderValue = document.getElementById('feeling-slider-value');
  
  if (feelingModal && feelingSlider && feelingSliderValue) {
    const selected = parseInt(localStorage.getItem('feeling-' + todayStr()), 10) || 5;
    feelingSlider.value = selected;
    feelingSliderValue.textContent = selected;
    feelingModal.style.display = '';
    // Add click-away to close
    feelingModal.addEventListener('mousedown', feelingModal._clickAwayHandler = function(e) {
      if (e.target === feelingModal) hideFeelingModal();
    });
  }
}

function hideFeelingModal() {
  const feelingModal = document.getElementById('feeling-modal');
  if (feelingModal) {
    feelingModal.style.display = 'none';
    // Remove click-away handler
    if (feelingModal._clickAwayHandler) {
      feelingModal.removeEventListener('mousedown', feelingModal._clickAwayHandler);
      delete feelingModal._clickAwayHandler;
    }
  }
}

// Phone View rendering logic
function renderPhoneView() {
  const phoneRoot = document.getElementById('phone-view-root');
  if (!phoneRoot) return;
  phoneRoot.style.display = '';
  
  // Clear any existing content completely
  phoneRoot.innerHTML = '';

  // --- Data ---
  // Summary
  const activeDate = window.activeDate || todayStr();
  const feelingKey = 'feeling-' + activeDate;
  const feeling = localStorage.getItem(feelingKey) || '5';
  const todayGoal = parseInt(localStorage.getItem('todays-goal'), 10) || 100;
  const todayPoints = getPointsForDate(activeDate);
  const weekGoal = parseInt(localStorage.getItem('weeks-goal'), 10) || 700;
  const selected = new Date(activeDate);
  const dayOfWeek = selected.getDay();
  const weekType = localStorage.getItem('week-type') || 'monday-sunday';
  const weekStart = new Date(selected);
  weekStart.setDate(selected.getDate() - ((dayOfWeek + 6) % 7));
  weekStart.setHours(0,0,0,0);
  const weekEnd = new Date(weekStart);
  if (weekType === 'monday-friday') {
    weekEnd.setDate(weekStart.getDate() + 4);
  } else {
    weekEnd.setDate(weekStart.getDate() + 6);
  }
  weekEnd.setHours(23,59,59,999);
  const weekPoints = data.rewards.filter(r => r.date >= weekStart.toISOString().slice(0, 10) && r.date <= weekEnd.toISOString().slice(0, 10)).reduce((sum, r) => sum + (r.reward || 0), 0);

  // Notes
  const notesKey = 'notes-' + activeDate;
  const notes = localStorage.getItem(notesKey) || '';

  // Activities
  const accomplished = getAccomplishedForDate(activeDate);
  const availableActivities = data.activities.filter(a => !accomplished.includes(a.name));
  // Accomplished
  const accomplishedRewards = getRewardsForDate(activeDate);

  // --- HTML ---
  console.log('renderPhoneView called, phoneSettingsOpen:', phoneSettingsOpen);
  if (phoneSettingsOpen) {
    phoneRoot.innerHTML = `
      <div class="phone-container phone-settings-view" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div style="text-align: center; margin-bottom: 1em; padding-top: 1em;">
          <h1 style="margin: 0; color: white; font-size: 1.8em; font-weight: 700;">⚙️ Settings</h1>
        </div>
        
        <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 1.5em; margin-bottom: 1em; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          <h3 style="margin: 0 0 1em 0; color: #6c63ff; font-size: 1.2em; display: flex; align-items: center; gap: 0.5em;">
            👤 My Name
          </h3>
          <div style="display: flex; gap: 0.5em; align-items: center;">
            <input id="phone-user-name" type="text" placeholder="Enter your name"
                   style="flex: 1; padding: 0.8em 1em; border: 2px solid #e0e7ff; border-radius: 12px; font-size: 1em; background: #f8f8ff;"
                   value="${localStorage.getItem('user-name')||''}">
            <button id="phone-save-name-btn"
                    style="background: #6c63ff; color: white; border: none; border-radius: 12px; padding: 0.8em 1.5em; font-size: 1em; font-weight: 600; cursor: pointer; white-space: nowrap;">
              Save
            </button>
          </div>
        </div>
        
        <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 1.5em; margin-bottom: 1em; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          <h3 style="margin: 0 0 1em 0; color: #6c63ff; font-size: 1.2em; display: flex; align-items: center; gap: 0.5em;">
            📅 Weekly Points Calculation
          </h3>
          <div>
            <select id="phone-week-type" 
                    style="width: 100%; background: #f8f8ff; color: #333; border: 2px solid #e0e7ff; border-radius: 12px; padding: 0.8em 1em; font-size: 1em; font-weight: 600; cursor: pointer;">
              <option value="monday-sunday" ${weekType==='monday-sunday'?'selected':''}>Monday - Sunday (7 days)</option>
              <option value="monday-friday" ${weekType==='monday-friday'?'selected':''}>Monday - Friday (5 days)</option>
            </select>
          </div>
        </div>
        
        <!-- Expandable Color Theme Section -->
        <div style="background: rgba(255,255,255,0.95); border-radius: 20px; margin-bottom: 1em; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          <h3 class="expandable-heading" id="color-theme-heading" style="margin: 0 0 1em 0; color: #6c63ff; font-size: 1.2em; text-align: center; cursor: pointer;">
            🎨 Color Theme
          </h3>
          <div class="expandable-section" id="color-theme-section" style="display:none; padding: 1.5em 1.5em 0 1.5em;">
            <label style="display: block; margin-bottom: 0.8em; font-weight: 600; color: #333;">Choose Your Theme</label>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5em;">
              ${Object.entries(COLOR_PRESETS).map(([key, preset]) => `
                <button class="preset-btn" data-preset="${key}" style="
                  background: linear-gradient(135deg, ${preset.primary} 0%, ${preset.secondary} 100%);
                  color: white;
                  border: 2px solid #e0e7ff;
                  border-radius: 8px;
                  padding: 0.6em 0.4em;
                  font-size: 0.7em;
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.2s ease;
                  min-height: 45px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  text-align: center;
                  line-height: 1.1;
                " title="${preset.name}">
                  ${preset.name}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
        
        <!-- Expandable Activities Section -->
        <div style="background: rgba(255,255,255,0.95); border-radius: 20px; margin-bottom: 1em; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          <h3 class="expandable-heading" id="activities-heading" style="margin: 0 0 1em 0; color: #6c63ff; font-size: 1.2em; text-align: center; cursor: pointer;">
              🎯 Manage Activities
            </h3>
          <div class="expandable-section" id="activities-section" style="display:none; padding: 1.5em 1.5em 0 1.5em;">
            <button id="phone-add-activity-btn" 
                    style="background: #e75480; color: white; border: none; border-radius: 8px; padding: 0.5em 1em; font-size: 0.9em; font-weight: 600; cursor: pointer; box-shadow: 0 2px 8px rgba(231,84,128,0.3); margin-bottom: 1em;">
              ➕ Add
            </button>
          <div class="settings-activities-grid">
            ${data.activities.map((a, idx) => `
              <div class="settings-activity-mini" data-index="${idx}">
                <div class="settings-activity-mini-icon-row">
                  <span class="settings-activity-mini-icon">${a.icon || '✨'}</span>
                  <span class="settings-activity-mini-points">+${a.reward}</span>
                </div>
                <span class="settings-activity-mini-name">${a.name}</span>
              </div>
            `).join('')}
            </div>
          </div>
        </div>
        
        <!-- Expandable History Section -->
        <div style="background: rgba(255,255,255,0.95); border-radius: 20px; margin-bottom: 1em; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          <h3 class="expandable-heading" id="history-heading" style="margin: 0 0 1em 0; color: #6c63ff; font-size: 1.2em; text-align: center; cursor: pointer;">
            📅 History
          </h3>
          <div class="expandable-section" id="settings-history-section" style="display:none; padding: 1.5em 1.5em 0 1.5em;"></div>
        </div>
        <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 1.5em; margin-bottom: 1em; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          <div style="display: flex; gap: 1em;">
            <button id="phone-export-btn" 
                    style="flex: 1; background: #28a745; color: white; border: none; border-radius: 12px; padding: 1em; font-size: 1em; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(40,167,69,0.3);">
              📊 Reports
            </button>
            <button id="phone-main-btn" 
                    style="flex: 1; background: #6c63ff; color: white; border: none; border-radius: 12px; padding: 1em; font-size: 1em; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(108,99,255,0.3);">
              🏠 Back to Main
            </button>
          </div>
        </div>
      </div>
    `;
    // Render history section in settings panel (only if expanded)
    const settingsHistorySection = document.getElementById('settings-history-section');
    if (settingsHistorySection) {
      // Only render if visible
      if (settingsHistorySection.style.display !== 'none') {
        renderRecentHistoryList(getAllDatesWithData().slice(0, 10), settingsHistorySection);
  } else {
        settingsHistorySection.innerHTML = '';
      }
    }
    // Add expand/collapse logic for all expandable sections
    [
      { heading: 'color-theme-heading', section: 'color-theme-section' },
      { heading: 'activities-heading', section: 'activities-section' },
      { heading: 'history-heading', section: 'settings-history-section' }
    ].forEach(({ heading, section }) => {
      const headingEl = document.getElementById(heading);
      const sectionEl = document.getElementById(section);
      if (headingEl && sectionEl) {
        headingEl.addEventListener('click', () => {
          const expanded = sectionEl.style.display !== 'none';
          sectionEl.style.display = expanded ? 'none' : 'block';
          // If expanding history, render it
          if (!expanded && section === 'settings-history-section') {
            renderRecentHistoryList(getAllDatesWithData().slice(0, 10), sectionEl);
          }
        });
        // Fix: Color theme buttons should save/apply theme and not close section
        if (heading === 'color-theme-heading') {
          sectionEl.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', e => {
              e.stopPropagation();
              const presetKey = btn.dataset.preset;
              const preset = COLOR_PRESETS[presetKey];
              if (preset) {
                saveColorTheme(preset);
                renderPhoneView();
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                  btn.style.transform = 'scale(1)';
                }, 150);
              }
            });
          });
        }
      }
    });
    return;
  }
    // Main View
    phoneRoot.innerHTML = `
      <div class="phone-container phone-main-view">
        <div class="summary-bar">
        <div class="summary-item" id="phone-name" style="font-weight: 600; color: #6c63ff; text-align: left; justify-content: flex-start; display: flex; align-items: center;">
          ${(() => {
            const name = localStorage.getItem('user-name') || 'Name';
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const active = window.activeDate || todayStr();
            const d = new Date(active);
            const dayName = days[d.getDay()];
            return `Happy ${dayName}, ${name}`;
          })()}
        </div>
          <div class="summary-item" id="phone-feeling" title="Edit Feeling" tabindex="0">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 0.1em;">
              <span>${getFeelingEmoji(parseInt(feeling))}</span>
              <span style="font-size: 0.9em;">${feeling}</span>
            </div>
          </div>
          <div class="summary-item" id="phone-today-goal" title="Edit Today's Goal" tabindex="0">🎯 ${todayPoints}/${todayGoal}</div>
          <div class="summary-item" id="phone-week-goal" title="Edit Week's Goal" tabindex="0">📅 ${weekPoints}/${weekGoal}</div>
        </div>
        <div class="notes-card" id="phone-notes-card" title="Click to edit notes">
        <div class="notes-preview">${notes ? notes : '<span style=\'color:#bbb\'>Add any notes about today here</span>'}</div>
        </div>
        
        <div class="goals-card">
        <div class="goals-title" id="goals-title-heading" style="color: #fff;">My Goals</div>
          <div class="goals-grid">
            ${data.activities.filter(a => a.goal).map(a => `
              <div class="goal-mini">
                <div class="goal-mini-icon-row">
                  <span class="goal-mini-icon">${a.icon || '✨'}</span><span class="goal-mini-points">+${a.reward}</span>
                </div>
                <span class="goal-mini-name">${a.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="activities-card">
          <div class="activities-title">Activities</div>
          <div class="activities-grid">
            ${availableActivities.map(a => `
              <div class="activity-mini" tabindex="0">
                <div class="activity-mini-icon-row">
                  <span class="activity-mini-icon">${a.icon || '✨'}</span><span class="activity-mini-points">+${a.reward}</span>
                </div>
                <span class="activity-mini-name">${a.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="accomplishments-card">
        <div class="accomplishments-title" id="accomplishments-title-heading">Things Done Today</div>
          <div class="accomplishments-grid">
            ${accomplishedRewards.map(r => {
              const act = data.activities.find(a => a.name === r.activity);
              const isGoal = act && act.goal;
              return `<div class="accomplished-mini ${isGoal ? 'goal-accomplished' : ''}" tabindex="0" style="${isGoal ? 'background: rgba(76,175,80,0.15); border: 2px solid #4CAF50;' : ''}">
                <div class="accomplished-mini-icon-row">
                  <span class="accomplished-mini-icon">${(act && act.icon) || '✨'}</span><span class="accomplished-mini-points">+${r.reward}</span>${isGoal ? '<span style="color: #4CAF50; font-weight: bold; margin-left: 0.2em;">✓</span>' : ''}
                </div>
                <span class="accomplished-mini-name">${r.activity}</span>
              </div>`;
            }).join('')}
          </div>
        </div>
      <!-- Insert History Section Here -->
      <div id="main-history-section"></div>
        <div class="bottom-actions">
          <button class="action-btn" id="phone-send-report">📊 Report</button>
          <div id="phone-date-picker-container" style="background: #fff; border: 2px solid #e0e7ff; border-radius: 12px; padding: 6px 10px; font-size: 13px; color: #333; cursor: pointer; min-width: 100px; max-width: 120px; height: 32px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;">
            <input type="date" id="phone-date-picker" style="position: absolute; opacity: 0; pointer-events: none;">
            <span id="phone-date-display" style="font-size: 13px; color: #333; font-weight: 500;">${formatDateForDisplay(activeDate)}</span>
          </div>
          <button class="action-btn settings" id="phone-settings-btn">⚙️ Settings</button>
        </div>
      </div>
    `;
  // Restore main view interactivity
  // Example: clicking activities adds reward
  phoneRoot.querySelectorAll('.activity-mini').forEach((el, idx) => {
    el.addEventListener('click', () => {
      const a = availableActivities[idx];
      if (a) {
        addReward(a.name, activeDate);
        renderPhoneView();
      }
    });
  });
  // Example: clicking accomplished removes reward
  phoneRoot.querySelectorAll('.accomplished-mini').forEach((el, idx) => {
    el.addEventListener('click', () => {
      const r = accomplishedRewards[idx];
      if (r) {
        const i = data.rewards.findIndex(rr => rr.date === activeDate && rr.activity === r.activity && rr.reward === r.reward);
        if (i !== -1) {
          data.rewards.splice(i, 1);
          saveData();
          renderPhoneView();
        }
      }
    });
  });
  // Example: clicking notes card opens notes modal
  const notesCard = phoneRoot.querySelector('#phone-notes-card');
  if (notesCard) {
    notesCard.addEventListener('click', showNotesModal);
  }
  // Example: summary bar interactivity
  const feelingBtn = phoneRoot.querySelector('#phone-feeling');
  if (feelingBtn) feelingBtn.addEventListener('click', showFeelingModal);
  // Goal editing functionality
  const todayGoalBtn = phoneRoot.querySelector('#phone-today-goal');
  if (todayGoalBtn) {
    todayGoalBtn.addEventListener('click', function() {
      const currentGoal = parseInt(localStorage.getItem('todays-goal'), 10) || 100;
      makeGoalEditable(todayGoalBtn, 'todays-goal', currentGoal, '🎯', todayPoints);
    });
  }
  const weekGoalBtn = phoneRoot.querySelector('#phone-week-goal');
  if (weekGoalBtn) {
    weekGoalBtn.addEventListener('click', function() {
      const currentGoal = parseInt(localStorage.getItem('weeks-goal'), 10) || 700;
      makeGoalEditable(weekGoalBtn, 'weeks-goal', currentGoal, '📅', weekPoints);
    });
  }
  // Helper function to make goals editable
  function makeGoalEditable(element, storageKey, currentGoal, emoji, currentPoints) {
    const input = document.createElement('input');
    input.type = 'number';
    input.min = 1;
    input.max = 9999;
    input.value = currentGoal;
    input.style.cssText = `
      width: 60px;
      text-align: center;
      border: 2px solid #6c63ff;
      border-radius: 6px;
      padding: 4px;
      font-size: 1em;
      font-weight: 600;
      background: white;
      color: #333;
    `;
    // Store original content
    const originalContent = element.innerHTML;
    // Replace content with input
    element.innerHTML = '';
    element.appendChild(input);
    input.focus();
    input.select();
    function saveGoal() {
      let newGoal = parseInt(input.value, 10);
      if (isNaN(newGoal) || newGoal < 1) newGoal = 1;
      if (newGoal > 9999) newGoal = 9999;
      localStorage.setItem(storageKey, newGoal);
      element.innerHTML = `${emoji} ${currentPoints}/${newGoal}`;
      renderPhoneView();
    }
    input.addEventListener('blur', saveGoal);
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        saveGoal();
      } else if (e.key === 'Escape') {
        element.innerHTML = originalContent;
      }
    });
  }
  // Apply current color theme after rendering
  applyColorTheme(getColorTheme());
  // Special heading style for Default Dark
  const colors = getColorTheme();
  if (colors.name === 'Default Dark') {
    const goalsHeading = document.getElementById('goals-title-heading');
    if (goalsHeading) {
      goalsHeading.style.fontFamily = 'Segoe UI, Arial, sans-serif';
      goalsHeading.style.fontWeight = '800';
      goalsHeading.style.letterSpacing = '0.02em';
      goalsHeading.style.fontSize = '1.1em'; // Match Activities heading
      goalsHeading.style.color = '#fff';
      goalsHeading.style.textShadow = '0 2px 8px rgba(102,126,234,0.15)';
    }
    const accHeading = document.getElementById('accomplishments-title-heading');
    if (accHeading) {
      accHeading.style.fontFamily = 'Segoe UI, Arial, sans-serif';
      accHeading.style.fontWeight = '800';
      accHeading.style.letterSpacing = '0.02em';
      accHeading.style.fontSize = '1.1em'; // Match Activities heading
      accHeading.style.color = '#fff';
      accHeading.style.textShadow = '0 2px 8px rgba(102,126,234,0.15)';
    }
    // Update background for green goal-accomplished boxes
    document.querySelectorAll('.accomplished-mini.goal-accomplished').forEach(box => {
      box.style.background = 'rgba(0, 255, 180, 0.18)'; // teal-green, semi-transparent
      box.style.border = '2px solid #00e6a8'; // brighter teal border
    });
  }
}

// 1. Add utility to get all unique dates with data
function getAllDatesWithData() {
  const rewardDates = [...new Set(data.rewards.map(r => r.date))];
  const storageDates = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('notes-') || key.startsWith('feeling-'))) {
      const date = key.replace('notes-', '').replace('feeling-', '');
      if (date && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        storageDates.push(date);
      }
    }
  }
  const allDates = [...new Set([...rewardDates, ...storageDates])];
  return allDates.sort((a, b) => new Date(b) - new Date(a));
}

// 2. Render history list for given dates
function renderRecentHistoryList(dates, parentEl) {
  let historyDiv = document.getElementById('recent-history-list');
  if (!historyDiv) {
    historyDiv = document.createElement('div');
    historyDiv.id = 'recent-history-list';
    historyDiv.style.marginTop = '1.5em';
    if (parentEl) {
      parentEl.appendChild(historyDiv);
    } else {
      const settingsPanel = document.querySelector('.phone-settings-view');
      if (settingsPanel) {
        settingsPanel.appendChild(historyDiv);
      }
    }
  }
  historyDiv.innerHTML = '';
  dates.forEach(dateStr => {
    const dayRewards = data.rewards.filter(r => r.date === dateStr);
    const notes = localStorage.getItem('notes-' + dateStr) || '';
    const feeling = localStorage.getItem('feeling-' + dateStr) || '';
    if (dayRewards.length === 0 && !notes && !feeling) return;
    const points = dayRewards.reduce((sum, r) => sum + (r.reward || 0), 0);
    const activities = dayRewards.map(r => {
      const act = data.activities.find(a => a.name === r.activity);
      return `<span style=\"background:#f3f6ff; color:#6c63ff; border-radius:8px; padding:0.2em 0.7em; margin:0 0.2em 0.2em 0; display:inline-block; font-size:0.98em;\">${(act && act.icon) || '✨'} ${r.activity} <span style='color:#aaa;'>+${r.reward}</span></span>`;
    }).join(' ');
    const dateLabel = new Date(dateStr).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    const row = document.createElement('div');
    row.style.marginBottom = '0.5em';
    row.style.borderRadius = '10px';
    row.style.boxShadow = '0 1px 4px rgba(108,99,255,0.07)';
    row.style.background = '#fff';
    row.style.overflow = 'hidden';
    // Summary: just the date, small font, clickable
    const summary = document.createElement('div');
    summary.style.cursor = 'pointer';
    summary.style.padding = '0.5em 1em';
    summary.style.display = 'flex';
    summary.style.alignItems = 'center';
    summary.style.fontWeight = '500';
    summary.style.color = '#333';
    summary.style.background = '#f3f6ff';
    summary.style.fontSize = '0.98em';
    summary.innerHTML = `<span>${dateLabel}</span>`;
    // Details: everything else, hidden by default
    const details = document.createElement('div');
    details.style.display = 'none';
    details.style.padding = '0.7em 1em 0.7em 1em';
    details.style.borderTop = '1px solid #e0e7ff';
    let detailsContent = '';
    detailsContent += `<div style=\"margin-bottom:0.5em; color:#6c63ff; font-weight:600;\">${points} points${dayRewards.length ? ` • ${dayRewards.length} activities` : ''}</div>`;
    if (activities) detailsContent += `<div style=\"margin-bottom:0.5em;\">${activities}</div>`;
    if (notes) detailsContent += `<div style='margin-bottom:0.5em; color:#333; background:#f3f6ff; border-radius:8px; padding:0.5em 0.8em; font-size:0.98em;'><strong>Notes:</strong> ${notes}</div>`;
    if (feeling && feeling.trim() !== '') detailsContent += `<div style='margin-bottom:0.5em; color:#333; background:#f3f6ff; border-radius:8px; padding:0.5em 0.8em; font-size:0.98em;'><strong>Feeling:</strong> ${feeling}/10</div>`;
    detailsContent += `<button class=\"history-report-btn\" data-date=\"${dateStr}\" style=\"margin-top:0.5em; background:#6c63ff; color:#fff; border:none; border-radius:6px; padding:0.3em 0.9em; font-size:0.95em; cursor:pointer;\">📊 Report</button>`;
    details.innerHTML = detailsContent;
    summary.addEventListener('click', function(e) {
      if (details.style.display === 'none') {
        details.style.display = '';
      } else {
        details.style.display = 'none';
      }
    });
    row.appendChild(summary);
    row.appendChild(details);
    historyDiv.appendChild(row);
  });
  // Add event listeners for report buttons
  historyDiv.querySelectorAll('.history-report-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const date = btn.getAttribute('data-date');
      if (date) {
        exportAsImage(date).then(result => {
          const link = document.createElement('a');
          link.download = result.filename;
          link.href = result.dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }).catch(error => {
          alert('Failed to generate report. Please try again.');
        });
      }
    });
  });
}

// 3. Add to settings panel rendering
const origRenderPhoneView = renderPhoneView;
renderPhoneView = function() {
  origRenderPhoneView.apply(this, arguments);
  // No longer render history in settings
};

// --- Event Listeners for Settings and Other Functionality ---

// Settings button functionality
document.addEventListener('click', function(e) {
  if (e.target.id === 'phone-settings-btn') {
    phoneSettingsOpen = true;
    renderPhoneView();
  } else if (e.target.id === 'phone-main-btn') {
    phoneSettingsOpen = false;
    renderPhoneView();
  } else if (e.target.id === 'phone-save-name-btn') {
    const nameInput = document.getElementById('phone-user-name');
    if (nameInput) {
      localStorage.setItem('user-name', nameInput.value);
      e.target.textContent = 'Saved!';
      renderPhoneView();
      setTimeout(() => {
        e.target.textContent = 'Save';
      }, 2000);
    }
  } else if (e.target.id === 'phone-add-activity-btn') {
    openActivityModal({title: 'Add New Activity', name: '', reward: 5, icon: '✨', goal: false});
  } else if (e.target.id === 'phone-export-btn') {
    showExportModal();
  } else if (e.target.id === 'phone-send-report') {
    // Directly generate today's report without modal
    const today = todayStr();
    exportAsImage(today).then(result => {
      // Create download link
      const link = document.createElement('a');
      link.download = result.filename;
      link.href = result.dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }).catch(error => {
      console.error('Export failed:', error);
      alert('Failed to generate report. Please try again.');
    });
  }
});

// Settings activity editing
document.addEventListener('click', function(e) {
  if (e.target.closest('.settings-activity-mini')) {
    const activityIndex = parseInt(e.target.closest('.settings-activity-mini').dataset.index);
    const activity = data.activities[activityIndex];
    if (activity) {
      openActivityModal({
        title: 'Edit Activity',
        name: activity.name,
        reward: activity.reward,
        icon: activity.icon,
        goal: activity.goal,
        idx: activityIndex
      });
    }
  }
});

// Modal event listeners
document.addEventListener('click', function(e) {
  if (e.target.id === 'modal-cancel' || e.target.id === 'notes-cancel-btn' || e.target.id === 'feeling-cancel-btn' || e.target.id === 'export-cancel-btn') {
    closeActivityModal();
    hideNotesModal();
    hideFeelingModal();
    hideExportModal();
  }
});

// Notes functionality
document.addEventListener('click', function(e) {
  if (e.target.id === 'notes-save-btn') {
    const textarea = document.getElementById('notes-textarea');
    if (textarea) {
      const activeDate = window.activeDate || todayStr();
      const notesKey = 'notes-' + activeDate;
      localStorage.setItem(notesKey, textarea.value);
      hideNotesModal();
      renderPhoneView();
    }
  }
});

// Feeling functionality
document.addEventListener('click', function(e) {
  if (e.target.id === 'feeling-save-btn') {
    const slider = document.getElementById('feeling-slider');
    if (slider) {
      const activeDate = window.activeDate || todayStr();
      const feelingKey = 'feeling-' + activeDate;
      localStorage.setItem(feelingKey, slider.value);
      hideFeelingModal();
      renderPhoneView();
    }
  }
});

// Date picker functionality
document.addEventListener('change', function(e) {
  if (e.target.id === 'phone-date-picker') {
    window.activeDate = e.target.value;
    const dateDisplay = document.getElementById('phone-date-display');
    if (dateDisplay) {
      dateDisplay.textContent = formatDateForDisplay(e.target.value);
    }
    renderPhoneView();
  }
});

// Make entire date picker container clickable
document.addEventListener('click', function(e) {
  if (e.target.id === 'phone-date-picker-container') {
    const dateInput = document.getElementById('phone-date-picker');
    if (dateInput) {
      dateInput.showPicker();
    }
  }
});

// Color customization
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('preset-btn')) {
    const presetKey = e.target.dataset.preset;
    const preset = COLOR_PRESETS[presetKey];
    
    if (preset) {
      // Apply the preset immediately
      saveColorTheme(preset);
      renderPhoneView();
      
      // Visual feedback
      e.target.style.transform = 'scale(0.95)';
      setTimeout(() => {
        e.target.style.transform = 'scale(1)';
      }, 150);
    }
  }
});

// Week type change
document.addEventListener('change', function(e) {
  if (e.target.id === 'phone-week-type') {
    localStorage.setItem('week-type', e.target.value);
    renderPhoneView();
  }
});

// Activity modal form submission
document.addEventListener('submit', function(e) {
  if (e.target.id === 'modal-activity-form') {
    e.preventDefault();
    
    const name = modalName.value.trim();
    const reward = parseInt(modalReward.value);
    const icon = modalIcon.value.trim() || '✨';
    const goal = modalGoal.checked;
    
    if (!name) return;
    
    if (modalForm.dataset.editIndex !== undefined) {
      // Editing existing activity
      const idx = parseInt(modalForm.dataset.editIndex);
      data.activities[idx] = { name, reward, icon, goal };
    } else {
      // Adding new activity
      data.activities.push({ name, reward, icon, goal });
    }
    
    saveData();
    closeActivityModal();
    renderPhoneView();
  }
});

// Feeling slider update
document.addEventListener('input', function(e) {
  if (e.target.id === 'feeling-slider') {
    const value = e.target.value;
    const display = document.getElementById('feeling-slider-value');
    if (display) {
      display.textContent = value;
    }
  }
});

// Export functionality
document.addEventListener('click', function(e) {
  if (e.target.id === 'export-generate-btn') {
    const exportType = document.querySelector('input[name="export-type"]:checked').value;
    
    if (exportType === 'single') {
      const date = document.getElementById('export-single-date').value;
      if (date) {
        exportAsImage(date).then(result => {
          // Create download link
          const link = document.createElement('a');
          link.download = result.filename;
          link.href = result.dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          hideExportModal();
        }).catch(error => {
          console.error('Export failed:', error);
          alert('Failed to generate report. Please try again.');
        });
      }
    } else {
      const startDate = document.getElementById('export-start-date').value;
      const endDate = document.getElementById('export-end-date').value;
      if (startDate && endDate) {
        // For now, just export the start date
        exportAsImage(startDate).then(result => {
          // Create download link
          const link = document.createElement('a');
          link.download = result.filename;
          link.href = result.dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          hideExportModal();
        }).catch(error => {
          console.error('Export failed:', error);
          alert('Failed to generate report. Please try again.');
        });
      }
    }
  }
});

// Export type toggle
document.addEventListener('change', function(e) {
  if (e.target.name === 'export-type') {
    const singleSection = document.getElementById('single-date-section');
    const rangeSection = document.getElementById('date-range-section');
    
    if (e.target.value === 'single') {
      singleSection.style.display = 'block';
      rangeSection.style.display = 'none';
    } else {
      singleSection.style.display = 'none';
      rangeSection.style.display = 'block';
    }
  }
});

  // Initialize the app
  loadData();
  renderPhoneView();
  applyColorTheme(getColorTheme());

// Set initial date picker value
document.addEventListener('DOMContentLoaded', function() {
  const datePicker = document.getElementById('phone-date-picker');
  if (datePicker) {
    datePicker.value = todayStr();
  }
});
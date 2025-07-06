// Device fingerprinting utility to create unique device identifiers
export const generateDeviceFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Canvas fingerprinting
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
  }
  const canvasFingerprint = canvas.toDataURL();
  
  // Collect device characteristics
  const deviceInfo = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    maxTouchPoints: navigator.maxTouchPoints || 0,
    screenResolution: `${screen.width}x${screen.height}`,
    screenColorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvas: canvasFingerprint.slice(-50), // Last 50 chars of canvas fingerprint
  };
  
  // Create a hash from device info
  const deviceString = JSON.stringify(deviceInfo);
  let hash = 0;
  
  for (let i = 0; i < deviceString.length; i++) {
    const char = deviceString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to positive hex string
  const deviceId = Math.abs(hash).toString(16);
  
  console.log('🔍 Device fingerprint generated:', deviceId);
  return deviceId;
};

// Get or create device ID with multiple storage methods
export const getDeviceId = (): string => {
  const DEVICE_ID_KEY = 'renda_device_id';
  const BACKUP_KEY = 'rd_backup_id';
  
  // Try to get existing device ID from multiple sources
  let deviceId = localStorage.getItem(DEVICE_ID_KEY) || 
                 sessionStorage.getItem(DEVICE_ID_KEY) ||
                 localStorage.getItem(BACKUP_KEY);
  
  if (!deviceId) {
    // Generate new device ID
    deviceId = generateDeviceFingerprint();
    
    // Store in multiple places for persistence
    try {
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
      sessionStorage.setItem(DEVICE_ID_KEY, deviceId);
      localStorage.setItem(BACKUP_KEY, deviceId);
      
      // Also store with timestamp
      const timestamp = Date.now();
      localStorage.setItem(`${DEVICE_ID_KEY}_created`, timestamp.toString());
    } catch (error) {
      console.warn('⚠️ Could not store device ID in storage:', error);
    }
  }
  
  return deviceId;
};

// Check if device has reached consultation limit
export const checkDeviceLimit = (): { 
  isLimited: boolean; 
  consultationsUsed: number; 
  deviceId: string;
} => {
  const deviceId = getDeviceId();
  const CONSULTATION_KEY = `consultations_${deviceId}`;
  const BACKUP_CONSULTATION_KEY = `rd_cons_${deviceId.slice(-8)}`;
  
  // Get consultation count from multiple sources
  const consultationsStr = localStorage.getItem(CONSULTATION_KEY) || 
                          localStorage.getItem(BACKUP_CONSULTATION_KEY) || 
                          '0';
  
  const consultationsUsed = parseInt(consultationsStr, 10) || 0;
  const isLimited = consultationsUsed >= 10;
  
  console.log(`🔒 Device ${deviceId} has used ${consultationsUsed}/10 consultations`);
  
  return {
    isLimited,
    consultationsUsed,
    deviceId
  };
};

// Increment consultation count for device
export const incrementDeviceConsultations = (): number => {
  const deviceId = getDeviceId();
  const CONSULTATION_KEY = `consultations_${deviceId}`;
  const BACKUP_CONSULTATION_KEY = `rd_cons_${deviceId.slice(-8)}`;
  
  const currentCount = parseInt(localStorage.getItem(CONSULTATION_KEY) || '0', 10);
  const newCount = currentCount + 1;
  
  try {
    // Store in multiple places
    localStorage.setItem(CONSULTATION_KEY, newCount.toString());
    localStorage.setItem(BACKUP_CONSULTATION_KEY, newCount.toString());
    
    // Also store timestamp of last consultation
    localStorage.setItem(`${CONSULTATION_KEY}_last`, Date.now().toString());
    
    console.log(`📊 Device consultation count updated: ${newCount}/10`);
  } catch (error) {
    console.warn('⚠️ Could not update consultation count:', error);
  }
  
  return newCount;
};

// Get device consultation history
export const getDeviceConsultationHistory = () => {
  const deviceId = getDeviceId();
  const CONSULTATION_KEY = `consultations_${deviceId}`;
  
  const count = parseInt(localStorage.getItem(CONSULTATION_KEY) || '0', 10);
  const lastConsultation = localStorage.getItem(`${CONSULTATION_KEY}_last`);
  const deviceCreated = localStorage.getItem(`renda_device_id_created`);
  
  return {
    deviceId,
    consultationsUsed: count,
    lastConsultationTime: lastConsultation ? new Date(parseInt(lastConsultation)) : null,
    deviceCreatedTime: deviceCreated ? new Date(parseInt(deviceCreated)) : null,
    isLimited: count >= 10
  };
};
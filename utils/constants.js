// Chemin du fichier de métadonnées
export const METADATA_PATH = '/simulation_metadata.json';

// Tailles des différents types de données
export const TYPE_SIZES = {
    'float32': 4,
    'float64': 8,
    'int32': 4,
    'int16': 2,
    'int8': 1
};

// Types d'arrays correspondants
export const TYPE_ARRAYS = {
    'float32': Float32Array,
    'float64': Float64Array,
    'int32': Int32Array,
    'int16': Int16Array,
    'int8': Int8Array
};

// Conditions de route disponibles avec leurs labels
export const ROAD_CONDITIONS = {
    dirt: "Dirt",
    snow: "Snow",
    asphalt: "Asphalt",
    wet_asphalt: "Wet asphalt"
};

// Types de véhicules disponibles avec leurs labels
export const VEHICLE_TYPES = {
    front_wheel_drive: "FWD",
    four_wheel_drive: "4WD",
    front_engine_rear_drive: "RWD"
};

// Valeurs par défaut pour les contrôles combinés
export const COMBINED_CONTROL_RANGES = {
    min: -200,
    max: 100,
    neutral: 0
};

// États des contrôles
export const CONTROL_STATES = {
    HANDBRAKE: 'handbrake',
    BRAKE: 'brake',
    NEUTRAL: 'neutral',
    THROTTLE: 'throttle'
};

// Configuration des seuils pour les contrôles
export const CONTROL_THRESHOLDS = {
    handbrake: -100,
    brake: 0,
    throttle: 0
};

// Configuration de l'API
export const API_CONFIG = {
    baseUrl: 'https://www.dvf.ovh',
    trajectoryLength: 100
};

// Messages d'erreur
export const ERROR_MESSAGES = {
    METADATA_LOAD: 'Failed to load metadata',
    TRAJECTORY_LOAD: 'Unable to load trajectory.',
    API_FETCH: 'Failed to fetch from API'
};

// Labels des contrôles combinés
export const COMBINED_CONTROL_LABELS = {
    handbrake: 'Handbrake',
    brake: 'Brake',
    neutral: 'Neutral',
    throttle: 'Throttle'
};

// Configuration des paramètres de vue
export const VIEW_CONFIG = {
    defaultScale: 1,
    minScale: 0.5,
    maxScale: 2,
    scaleStep: 0.1
};

// Configuration du rendu
export const RENDER_CONFIG = {
    fps: 60,
    updateInterval: 1000 / 60
};

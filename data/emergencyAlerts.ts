export interface EmergencyAlert {
  id: string;
  title: string;
  description: string;
  severity: 'warning' | 'watch' | 'advisory' | 'emergency';
  type: 'flood' | 'tornado' | 'hurricane' | 'earthquake' | 'wildfire' | 'severe-weather';
  location: {
    name: string;
    coordinates: [number, number]; // [latitude, longitude]
    polygon?: [number, number][]; // For area-based alerts
  };
  issuedAt: string;
  expiresAt: string;
  instructions: string[];
  isActive: boolean;
}

export const emergencyAlerts: EmergencyAlert[] = [
  {
    id: 'flood-baltimore-001',
    title: 'Flash Flood Warning',
    description: 'Flash flooding is occurring or imminent. Move to higher ground immediately.',
    severity: 'warning',
    type: 'flood',
    location: {
      name: 'Baltimore, MD',
      coordinates: [39.2904, -76.6122],
      polygon: [
        [39.3000, -76.6200],
        [39.3000, -76.6000],
        [39.2800, -76.6000],
        [39.2800, -76.6200],
        [39.3000, -76.6200]
      ]
    },
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    instructions: [
      'Move to higher ground immediately',
      'Do not walk or drive through flood waters',
      'Turn around, don\'t drown',
      'Stay tuned to local weather updates'
    ],
    isActive: true
  },
  {
    id: 'tornado-watch-001',
    title: 'Tornado Watch',
    description: 'Conditions are favorable for tornado development. Be prepared to take shelter.',
    severity: 'watch',
    type: 'tornado',
    location: {
      name: 'Baltimore County, MD',
      coordinates: [39.4015, -76.6019],
      polygon: [
        [39.4200, -76.6500],
        [39.4200, -76.5500],
        [39.3800, -76.5500],
        [39.3800, -76.6500],
        [39.4200, -76.6500]
      ]
    },
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
    instructions: [
      'Be prepared to take shelter immediately',
      'Identify your safe room or basement',
      'Keep emergency supplies ready',
      'Monitor weather conditions closely'
    ],
    isActive: true
  },
  {
    id: 'severe-weather-001',
    title: 'Severe Thunderstorm Warning',
    description: 'Severe thunderstorms with damaging winds and hail are approaching.',
    severity: 'warning',
    type: 'severe-weather',
    location: {
      name: 'Washington, DC Metro Area',
      coordinates: [38.9072, -77.0369],
      polygon: [
        [38.9200, -77.0500],
        [38.9200, -77.0200],
        [38.8900, -77.0200],
        [38.8900, -77.0500],
        [38.9200, -77.0500]
      ]
    },
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour from now
    instructions: [
      'Seek shelter indoors immediately',
      'Stay away from windows',
      'Avoid using electrical equipment',
      'Do not go outside until the storm passes'
    ],
    isActive: true
  },
  {
    id: 'hurricane-watch-001',
    title: 'Hurricane Watch',
    description: 'Hurricane conditions are possible within 48 hours. Prepare now.',
    severity: 'watch',
    type: 'hurricane',
    location: {
      name: 'Virginia Beach, VA',
      coordinates: [36.8529, -75.9780],
      polygon: [
        [36.8700, -76.0000],
        [36.8700, -75.9500],
        [36.8300, -75.9500],
        [36.8300, -76.0000],
        [36.8700, -76.0000]
      ]
    },
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours from now
    instructions: [
      'Review your hurricane preparedness plan',
      'Stock up on emergency supplies',
      'Secure outdoor furniture and objects',
      'Consider evacuation if in flood-prone areas'
    ],
    isActive: true
  },
  {
    id: 'wildfire-warning-001',
    title: 'Wildfire Warning',
    description: 'Active wildfire in the area. Evacuation may be required.',
    severity: 'emergency',
    type: 'wildfire',
    location: {
      name: 'Shenandoah National Park, VA',
      coordinates: [38.2921, -78.6796],
      polygon: [
        [38.3100, -78.7000],
        [38.3100, -78.6500],
        [38.2700, -78.6500],
        [38.2700, -78.7000],
        [38.3100, -78.7000]
      ]
    },
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
    instructions: [
      'Be ready to evacuate immediately',
      'Pack essential items and documents',
      'Follow evacuation routes',
      'Stay informed about fire conditions'
    ],
    isActive: true
  },
  {
    id: 'flood-singapore-001',
    title: 'Flash Flood Warning',
    description: 'Heavy rainfall causing flash flooding in Singapore. Avoid low-lying areas.',
    severity: 'warning',
    type: 'flood',
    location: {
      name: 'Singapore Central',
      coordinates: [1.431462, 103.831442], // Your exact coordinates
      polygon: [
        [1.4400, 103.8400], // North-East
        [1.4400, 103.8200], // North-West  
        [1.4200, 103.8200], // South-West
        [1.4200, 103.8400], // South-East
        [1.4400, 103.8400]  // Close the polygon
      ]
    },
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
    instructions: [
      'Avoid low-lying areas and underpasses',
      'Do not walk or drive through flood waters',
      'Stay indoors if possible',
      'Monitor local weather updates',
      'Keep emergency supplies ready'
    ],
    isActive: true
  }
];

// Helper function to get alerts near a location
export function getAlertsNearLocation(
  userLat: number, 
  userLon: number, 
  radiusKm: number = 50
): EmergencyAlert[] {
  return emergencyAlerts.filter(alert => {
    const [alertLat, alertLon] = alert.location.coordinates;
    const distance = calculateDistance(userLat, userLon, alertLat, alertLon);
    return distance <= radiusKm && alert.isActive;
  });
}

// Helper function to check if point is in polygon
export function pointInPolygon(
  point: [number, number], 
  polygon: [number, number][]
): boolean {
  const [x, y] = point;
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
}

// Helper function to calculate distance between two points
function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

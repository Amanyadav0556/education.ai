'use client';
// ════════════════════════════════════════════════════════════════════════════
// INTERACTIVE INDIA MAP — Leaflet + bundled state-boundary GeoJSON
// Rendered client-only (see IndiaMapSim.tsx) since Leaflet needs `window`.
// ════════════════════════════════════════════════════════════════════════════
import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Feature, FeatureCollection, Geometry } from 'geojson';

interface StateInfo { capital: string; pos: [number, number]; population: number } // population in millions

const STATE_INFO: Record<string, StateInfo> = {
    'Arunachal Pradesh': { capital: 'Itanagar', pos: [27.10, 93.62], population: 1.4 },
    'Assam': { capital: 'Dispur', pos: [26.14, 91.79], population: 31.2 },
    'Chandigarh': { capital: 'Chandigarh', pos: [30.74, 76.79], population: 1.1 },
    'Karnataka': { capital: 'Bengaluru', pos: [12.97, 77.59], population: 61.1 },
    'Manipur': { capital: 'Imphal', pos: [24.82, 93.94], population: 2.9 },
    'Meghalaya': { capital: 'Shillong', pos: [25.57, 91.88], population: 3.0 },
    'Mizoram': { capital: 'Aizawl', pos: [23.73, 92.72], population: 1.1 },
    'Nagaland': { capital: 'Kohima', pos: [25.67, 94.11], population: 2.0 },
    'Punjab': { capital: 'Chandigarh', pos: [30.74, 76.79], population: 27.7 },
    'Rajasthan': { capital: 'Jaipur', pos: [26.91, 75.79], population: 68.5 },
    'Sikkim': { capital: 'Gangtok', pos: [27.33, 88.61], population: 0.6 },
    'Tripura': { capital: 'Agartala', pos: [23.83, 91.28], population: 3.7 },
    'Uttarakhand': { capital: 'Dehradun', pos: [30.32, 78.03], population: 10.1 },
    'Telangana': { capital: 'Hyderabad', pos: [17.39, 78.49], population: 35.0 },
    'Bihar': { capital: 'Patna', pos: [25.59, 85.14], population: 104.1 },
    'Kerala': { capital: 'Thiruvananthapuram', pos: [8.52, 76.94], population: 33.4 },
    'Madhya Pradesh': { capital: 'Bhopal', pos: [23.26, 77.41], population: 72.6 },
    'Andaman & Nicobar': { capital: 'Port Blair', pos: [11.62, 92.73], population: 0.38 },
    'Gujarat': { capital: 'Gandhinagar', pos: [23.22, 72.68], population: 60.4 },
    'Lakshadweep': { capital: 'Kavaratti', pos: [10.57, 72.64], population: 0.064 },
    'Odisha': { capital: 'Bhubaneswar', pos: [20.30, 85.82], population: 42.0 },
    'Dadra and Nagar Haveli and Daman and Diu': { capital: 'Daman', pos: [20.40, 72.83], population: 0.59 },
    'Ladakh': { capital: 'Leh', pos: [34.16, 77.58], population: 0.29 },
    'Jammu & Kashmir': { capital: 'Srinagar', pos: [34.08, 74.80], population: 12.5 },
    'Chhattisgarh': { capital: 'Raipur', pos: [21.25, 81.63], population: 25.5 },
    'Delhi': { capital: 'New Delhi', pos: [28.61, 77.21], population: 16.8 },
    'Goa': { capital: 'Panaji', pos: [15.49, 73.83], population: 1.5 },
    'Haryana': { capital: 'Chandigarh', pos: [30.74, 76.79], population: 25.4 },
    'Himachal Pradesh': { capital: 'Shimla', pos: [31.10, 77.17], population: 6.9 },
    'Jharkhand': { capital: 'Ranchi', pos: [23.34, 85.31], population: 33.0 },
    'Tamil Nadu': { capital: 'Chennai', pos: [13.08, 80.27], population: 72.1 },
    'Uttar Pradesh': { capital: 'Lucknow', pos: [26.85, 80.95], population: 199.8 },
    'West Bengal': { capital: 'Kolkata', pos: [22.57, 88.36], population: 91.3 },
    'Andhra Pradesh': { capital: 'Amaravati', pos: [16.51, 80.52], population: 49.4 },
    'Puducherry': { capital: 'Puducherry', pos: [11.94, 79.83], population: 1.4 },
    'Maharashtra': { capital: 'Mumbai', pos: [19.08, 72.88], population: 112.4 },
};

const INDIA_CENTER: [number, number] = [22.9, 79.0];
const DEFAULT_ZOOM = 5;

function capitalIcon() {
    return L.divIcon({
        className: '',
        html: `<div style="width:10px;height:10px;border-radius:50%;background:#8B4A35;border:2px solid #FDFAF5;box-shadow:0 0 0 1px #8B4A35;"></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
    });
}

function populationColor(pop: number): string {
    if (pop >= 90) return '#3D5445';
    if (pop >= 50) return '#4E6B57';
    if (pop >= 20) return '#7E9686';
    if (pop >= 5) return '#C4D4CA';
    return '#E4EDE7';
}

function FlyToState({ feature }: { feature: Feature<Geometry> | null }) {
    const map = useMap();
    useEffect(() => {
        if (feature) {
            const bounds = L.geoJSON(feature).getBounds();
            if (bounds.isValid()) map.flyToBounds(bounds, { padding: [24, 24], duration: 0.6 });
        } else {
            map.flyTo(INDIA_CENTER, DEFAULT_ZOOM, { duration: 0.6 });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [feature]);
    return null;
}

export default function IndiaMapInner() {
    const [geojson, setGeojson] = useState<FeatureCollection | null>(null);
    const [selectedName, setSelectedName] = useState('');
    const [showCapitals, setShowCapitals] = useState(true);
    const [showPopulation, setShowPopulation] = useState(false);
    const geoLayerRef = useRef<L.GeoJSON | null>(null);

    useEffect(() => {
        fetch('/data/india-states.geojson').then(r => r.json()).then(setGeojson).catch(() => setGeojson(null));
    }, []);

    const stateNames = useMemo(() => {
        if (!geojson) return [];
        return geojson.features
            .map(f => (f.properties as { ST_NM?: string })?.ST_NM ?? '')
            .filter(Boolean)
            .sort();
    }, [geojson]);

    const selectedFeature = useMemo(() => {
        if (!geojson || !selectedName) return null;
        return (geojson.features.find(f => (f.properties as { ST_NM?: string })?.ST_NM === selectedName) as Feature<Geometry>) ?? null;
    }, [geojson, selectedName]);

    const capitalIconRef = useRef(capitalIcon());

    const style = (feature?: Feature) => {
        const name = (feature?.properties as { ST_NM?: string })?.ST_NM ?? '';
        const isSelected = name === selectedName;
        const info = STATE_INFO[name];
        const fill = showPopulation && info ? populationColor(info.population) : (isSelected ? '#A5614A' : '#C4D4CA');
        return {
            fillColor: fill,
            fillOpacity: isSelected ? 0.75 : 0.55,
            color: isSelected ? '#8B4A35' : '#524035',
            weight: isSelected ? 2.5 : 1,
        };
    };

    return (
        <div style={{
            background: 'var(--cream-50)', border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)', overflow: 'hidden', fontFamily: 'DM Sans, sans-serif',
        }}>
            <div style={{ height: 420, width: '100%' }}>
                <MapContainer center={INDIA_CENTER} zoom={DEFAULT_ZOOM} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {geojson && (
                        <GeoJSON
                            ref={geoLayerRef as never}
                            key={showPopulation ? 'pop' : selectedName || 'base'}
                            data={geojson}
                            style={style as never}
                            onEachFeature={(feature, layer) => {
                                const name = (feature.properties as { ST_NM?: string })?.ST_NM ?? '';
                                layer.on('click', () => setSelectedName(name));
                                layer.bindTooltip(name, { sticky: true });
                            }}
                        />
                    )}
                    {showCapitals && Object.entries(STATE_INFO).map(([name, info]) => (
                        <Marker key={name} position={info.pos} icon={capitalIconRef.current}>
                            <Popup>
                                <strong>{info.capital}</strong> — capital of {name}<br />
                                Population: ~{info.population} million
                            </Popup>
                        </Marker>
                    ))}
                    <FlyToState feature={selectedFeature} />
                </MapContainer>
            </div>

            <div style={{ padding: '18px 24px', borderTop: '2px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ flex: '1 1 220px' }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-600)', display: 'block', marginBottom: 6 }}>
                            Highlight State
                        </label>
                        <select value={selectedName} onChange={e => setSelectedName(e.target.value)} style={{
                            width: '100%', padding: '8px 10px', borderRadius: 8, fontSize: 13,
                            border: '1px solid var(--border-medium)', background: 'var(--cream-50)', color: 'var(--stone-800)',
                        }}>
                            <option value="">Select a state / UT…</option>
                            {stateNames.map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--stone-600)', cursor: 'pointer' }}>
                        <input type="checkbox" checked={showCapitals} onChange={e => setShowCapitals(e.target.checked)} style={{ accentColor: 'var(--stone-800)' }} />
                        Show Capitals
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--stone-600)', cursor: 'pointer' }}>
                        <input type="checkbox" checked={showPopulation} onChange={e => setShowPopulation(e.target.checked)} style={{ accentColor: 'var(--stone-800)' }} />
                        Show Population
                    </label>
                    <button onClick={() => setSelectedName('')} style={{
                        padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                        background: 'var(--cream-200)', color: 'var(--stone-700)',
                        border: '1px solid var(--border-medium)', cursor: 'pointer', marginLeft: 'auto',
                    }}>↺ Reset Zoom</button>
                </div>

                {selectedName && STATE_INFO[selectedName] && (
                    <div style={{ padding: '12px 16px', background: 'var(--cream-200)', borderRadius: 8, fontSize: 12, color: 'var(--stone-600)' }}>
                        <strong style={{ color: 'var(--stone-800)' }}>{selectedName}</strong> — Capital: {STATE_INFO[selectedName].capital} · Population: ~{STATE_INFO[selectedName].population} million (approx.)
                    </div>
                )}
            </div>
        </div>
    );
}

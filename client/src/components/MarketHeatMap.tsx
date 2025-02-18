import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

interface MarketDataPoint {
  lat: number;
  lng: number;
  price: number;
  rent: number;
  capRate: number;
}

interface MarketHeatMapProps {
  center: [number, number];
  zoom?: number;
  dataPoints: MarketDataPoint[];
}

function HeatmapLayer({ dataPoints, metric }: { dataPoints: MarketDataPoint[], metric: 'price' | 'rent' | 'capRate' }) {
  const map = useMap();

  useEffect(() => {
    if (!dataPoints.length) return;

    // Load the heat map library dynamically
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet.heat';
    script.async = true;

    script.onload = () => {
      // Normalize values for heat map intensity
      const values = dataPoints.map(point => point[metric]);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const range = max - min;

      const heatPoints = dataPoints.map(point => {
        const normalizedIntensity = (point[metric] - min) / range;
        return [point.lat, point.lng, normalizedIntensity];
      });

      // @ts-ignore - leaflet.heat adds this to L
      const heatLayer = L.heatLayer(heatPoints, {
        radius: 25,
        blur: 15,
        maxZoom: 10,
        gradient: {
          0.0: '#3b82f6', // blue
          0.5: '#f59e0b', // amber
          1.0: '#ef4444'  // red
        }
      });

      heatLayer.addTo(map);

      return () => {
        map.removeLayer(heatLayer);
      };
    };

    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [map, dataPoints, metric]);

  return null;
}

export function MarketHeatMap({ center, zoom = 13, dataPoints }: MarketHeatMapProps) {
  const [selectedMetric, setSelectedMetric] = useState<'price' | 'rent' | 'capRate'>('price');

  const metricLabels = {
    price: 'Property Price',
    rent: 'Monthly Rent',
    capRate: 'Cap Rate'
  };

  // Log data points for debugging
  console.log('Heat map data points:', dataPoints);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>New York City Market Heat Map</CardTitle>
          <div className="flex items-center gap-4">
            <Select value={selectedMetric} onValueChange={(value: 'price' | 'rent' | 'capRate') => setSelectedMetric(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Property Price</SelectItem>
                <SelectItem value="rent">Monthly Rent</SelectItem>
                <SelectItem value="capRate">Cap Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] relative">
          <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <HeatmapLayer dataPoints={dataPoints} metric={selectedMetric} />
          </MapContainer>

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
            <h4 className="font-semibold mb-2">{metricLabels[selectedMetric]} Intensity</h4>
            <div className="flex items-center gap-2">
              <div className="w-24 h-4 bg-gradient-to-r from-blue-500 via-amber-500 to-red-500 rounded" />
              <div className="flex justify-between w-full text-sm">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
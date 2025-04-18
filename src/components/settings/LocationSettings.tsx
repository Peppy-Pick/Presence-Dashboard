import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import MapComponent from "./MapComponent";
import { useAppContext } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { updateConfigData, getConfigData } from "@/lib/api/config";
import { Loader2 } from "lucide-react";

const LocationSettings = () => {
  const { updateOfficeLocation, officeLocation } = useAppContext();
  const [latitude, setLatitude] = useState<number>(officeLocation?.latitude || 0);
  const [longitude, setLongitude] = useState<number>(officeLocation?.longitude || 0);
  const [radius, setRadius] = useState<number>(officeLocation?.radius || 100);
  const [radiusInput, setRadiusInput] = useState<string>(String(officeLocation?.radius || 100));
  const [locationUpdated, setLocationUpdated] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (officeLocation) {
      setLatitude(officeLocation.latitude);
      setLongitude(officeLocation.longitude);
      setRadius(officeLocation.radius);
      setRadiusInput(String(officeLocation.radius));
      setLocationUpdated(false);
    }
  }, [officeLocation]);

  const handleLocationSelect = (lat: number, lng: number) => {
    console.log("Location selected:", lat, lng);
    setLatitude(lat);
    setLongitude(lng);
    setLocationUpdated(true);
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    setRadiusInput(value);
    
    if (value && !isNaN(parseInt(value))) {
      const numericValue = parseInt(value);
      if (numericValue > 0) {
        setRadius(numericValue);
        setLocationUpdated(true);
      }
    } else if (value === '') {
      setLocationUpdated(true);
    }
  };

  const handleSave = async () => {
    if (!radiusInput || isNaN(parseInt(radiusInput)) || parseInt(radiusInput) <= 0) {
      toast.error("Please enter a valid attendance radius greater than 0");
      return;
    }
    
    if (!updateOfficeLocation) {
      toast.error("Failed to save office location settings");
      return;
    }

    setIsSaving(true);

    try {
      const validRadius = parseInt(radiusInput);
      
      updateOfficeLocation({
        latitude,
        longitude,
        radius: validRadius
      });
      
      console.log("Calling updateConfigData API with:", {
        latitude, longitude, radius: validRadius / 1000
      });
      
      const configData = await updateConfigData({
        office_location: {
          latitude,
          longitude
        },
        allowed_radius_km: validRadius / 1000
      });
      
      console.log("Config updated successfully:", configData);
      setLocationUpdated(false);
      toast.success("Office location settings saved successfully");
    } catch (error) {
      console.error("Error updating config:", error);
      toast.error("Failed to save office location settings to server");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1">
        <Card className="h-full">
          <MapComponent 
            initialLat={latitude}
            initialLng={longitude}
            onLocationSelect={handleLocationSelect}
            key={`map-${latitude}-${longitude}`}
          />
        </Card>
      </div>
      
      <div className="flex-1 space-y-4">
        <Card className="p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                value={latitude}
                onChange={(e) => {
                  const newLat = parseFloat(e.target.value);
                  if (!isNaN(newLat)) {
                    setLatitude(newLat);
                    setLocationUpdated(true);
                  }
                }}
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                value={longitude}
                onChange={(e) => {
                  const newLng = parseFloat(e.target.value);
                  if (!isNaN(newLng)) {
                    setLongitude(newLng);
                    setLocationUpdated(true);
                  }
                }}
                className="bg-muted"
              />
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <Label htmlFor="radius">Attendance Radius (meters)</Label>
            <Input
              id="radius"
              type="text"
              value={radiusInput}
              onChange={handleRadiusChange}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Employees within this radius will be considered as present at the office.
            </p>
          </div>
          
          <Button 
            onClick={handleSave} 
            className={`mt-6 w-full ${locationUpdated ? "bg-green-500 hover:bg-green-600" : ""}`}
            disabled={!locationUpdated || isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : locationUpdated ? (
              "Save New Location Settings"
            ) : (
              "No Changes to Save"
            )}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default LocationSettings;

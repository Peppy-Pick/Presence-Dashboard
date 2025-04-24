import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/context/AppContext";
import LocationSettings from "@/components/settings/LocationSettings";
import ThemeSettings from "@/components/settings/ThemeSettings";
import AppSettings from "@/components/settings/AppSettings";
import { getConfigData } from "@/lib/api/config";
import { toast } from "sonner";

const Settings = () => {
  const { setCurrentPage, updateOfficeLocation, setGoogleMapsApiKey } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);

  useEffect(() => {
    setCurrentPage("settings");
    
    const loadConfig = async () => {
      if (configLoaded) return;
      
      setIsLoading(true);
      try {
        console.log("Fetching config data...");
        const configData = await getConfigData();
        console.log("Config data loaded:", configData);
        
        if (configData) {
          if (configData.googleMapsApiKey && setGoogleMapsApiKey) {
            setGoogleMapsApiKey(configData.googleMapsApiKey);
          }
          
          if (configData.office_location && updateOfficeLocation) {
            const radiusInMeters = configData.allowed_radius_km ? configData.allowed_radius_km * 1000 : 100;
            
            updateOfficeLocation({
              latitude: configData.office_location.latitude,
              longitude: configData.office_location.longitude,
              radius: radiusInMeters
            });
          }
          
          setConfigLoaded(true);
        }
      } catch (error) {
        console.error("Failed to load config:", error);
        toast.error("Failed to load configuration data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConfig();
  }, [setCurrentPage, updateOfficeLocation, setGoogleMapsApiKey, configLoaded]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your application settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="location" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="app">App Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="location" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Office Location</CardTitle>
              <CardDescription>
                Set your office location and attendance radius. Search for a location or use your current 
                position to easily set the office coordinates. The radius determines if employees are 
                considered at the office when they clock in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LocationSettings />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the appearance of your application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="app" className="space-y-4">
          <AppSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
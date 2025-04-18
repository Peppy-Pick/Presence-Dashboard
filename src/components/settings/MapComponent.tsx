
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAppContext } from "@/context/AppContext";
import { Loader2, Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// MapComponent properties
interface MapComponentProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const MapComponent = ({ initialLat, initialLng, onLocationSelect }: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const marker = useRef<any>(null);
  const searchBoxRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const { googleMapsApiKey } = useAppContext();
  const [mapLoadingStatus, setMapLoadingStatus] = useState<string>("Initializing map...");
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [initializedPosition, setInitializedPosition] = useState(false);

  // Load Google Maps with API key
  useEffect(() => {
    const loadMap = () => {
      // Only proceed if we have an API key and we're not already loading
      if (!googleMapsApiKey) {
        console.log("Waiting for Google Maps API key...");
        setMapLoadingStatus("Waiting for Google Maps API key...");
        return;
      }
      
      if (window.google) {
        console.log("Google Maps already loaded, initializing map");
        setIsMapLoaded(true);
        setMapLoadingStatus("");
        return;
      }
      
      setMapLoadingStatus("Loading Google Maps...");
      
      // Clean up any existing script tags
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
      
      // Define the callback function that will be called when the Google Maps script loads
      window.initMap = () => {
        console.log("Google Maps script loaded successfully");
        setIsMapLoaded(true);
        setMapLoadingStatus("");
      };

      // Load the Google Maps script with places library
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=initMap&libraries=places`;
      script.async = true;
      script.defer = true;
      
      // Add referrer restrictions to script (helps a bit with security)
      script.referrerPolicy = "strict-origin-when-cross-origin";

      // Handle script loading errors
      script.onerror = () => {
        console.error("Failed to load Google Maps script with key:", googleMapsApiKey);
        toast.error("Failed to load Google Maps. Please check your internet connection.");
        setMapLoadingStatus("Network error loading map. Please try again.");
        
        // Remove the script to allow for retrying
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
        scriptRef.current = null;
      };
      
      document.head.appendChild(script);
      scriptRef.current = script;
    };
    
    loadMap();
    
    return () => {
      // Cleanup
      window.initMap = undefined;
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
      }
    };
  }, [googleMapsApiKey]);

  // Initialize the map
  useEffect(() => {
    if (isMapLoaded && mapRef.current && !map.current && googleMapsApiKey) {
      try {
        // Use provided coordinates or fallback to defaults
        const defaultLat = initialLat !== undefined && initialLat !== null ? initialLat : 11.2588;
        const defaultLng = initialLng !== undefined && initialLng !== null ? initialLng : 75.7804;
        
        console.log("Initializing the map with coordinates:", defaultLat, defaultLng);
        setIsLoadingLocation(false);
        
        // Create the map
        map.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: defaultLat, lng: defaultLng },
          zoom: 14,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        // Add a marker at the initial position
        marker.current = new window.google.maps.Marker({
          position: { lat: defaultLat, lng: defaultLng },
          map: map.current,
          draggable: true,
          animation: window.google.maps.Animation.DROP,
        });
        
        // Mark that we've initialized with the provided position
        setInitializedPosition(true);

        // Update coordinates when marker is dragged
        marker.current.addListener('dragend', () => {
          const position = marker.current.getPosition();
          const lat = position.lat();
          const lng = position.lng();
          console.log("Marker dragged to:", lat, lng);
          onLocationSelect(lat, lng);
        });

        // Add click event to set marker position
        map.current.addListener('click', (e: any) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          console.log("Map clicked at:", lat, lng);
          marker.current.setPosition(e.latLng);
          onLocationSelect(lat, lng);
        });

        // Initialize the search box
        if (window.google.maps.places) {
          const inputElement = document.getElementById('map-search-input') as HTMLInputElement;
          if (inputElement) {
            searchBoxRef.current = new window.google.maps.places.SearchBox(inputElement);
            
            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBoxRef.current.addListener('places_changed', () => {
              const places = searchBoxRef.current.getPlaces();
              
              if (places.length === 0) {
                return;
              }
              
              // For each place, get the location.
              const bounds = new window.google.maps.LatLngBounds();
              
              places.forEach((place: any) => {
                if (!place.geometry || !place.geometry.location) {
                  console.log("Returned place contains no geometry");
                  return;
                }
                
                // Update marker position and notify parent
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                marker.current.setPosition(place.geometry.location);
                onLocationSelect(lat, lng);
                
                // Add the place to the map bounds
                if (place.geometry.viewport) {
                  bounds.union(place.geometry.viewport);
                } else {
                  bounds.extend(place.geometry.location);
                }
              });
              
              map.current.fitBounds(bounds);
              map.current.setZoom(15); // Zoom in a bit after search
            });
          }
        }

        console.log("Map initialized successfully");
      } catch (err) {
        console.error("Error initializing map:", err);
        toast.error("Failed to initialize map. Please check your internet connection.");
      }
    }
  }, [isMapLoaded, googleMapsApiKey, onLocationSelect]);
  
  // When initialLat/initialLng change after initial map load, update the marker and center
  useEffect(() => {
    if (isMapLoaded && map.current && marker.current && initializedPosition) {
      if (initialLat !== undefined && initialLat !== null && 
          initialLng !== undefined && initialLng !== null) {
        console.log("Updating map with new position:", initialLat, initialLng);
        const newPosition = new window.google.maps.LatLng(initialLat, initialLng);
        marker.current.setPosition(newPosition);
        map.current.setCenter(newPosition);
      }
    }
  }, [initialLat, initialLng, isMapLoaded, initializedPosition]);

  // Get current location
  const getCurrentLocation = () => {
    if (!isMapLoaded || !map.current) {
      toast.error("Map not loaded yet. Please try again later.");
      return;
    }

    setIsLoadingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          console.log("Current location:", lat, lng);
          
          // Update map center and marker
          const latLng = new window.google.maps.LatLng(lat, lng);
          map.current.setCenter(latLng);
          map.current.setZoom(15);
          marker.current.setPosition(latLng);
          
          // Call the callback
          onLocationSelect(lat, lng);
          
          // Animate marker
          marker.current.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(() => {
            marker.current.setAnimation(null);
          }, 1500);
          
          setIsLoadingLocation(false);
          toast.success("Current location detected");
        },
        (error) => {
          console.error("Error getting current location:", error);
          setIsLoadingLocation(false);
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              toast.error("Location permission denied. Please allow location access in your browser settings.");
              break;
            case error.POSITION_UNAVAILABLE:
              toast.error("Location information is unavailable. Please try again later.");
              break;
            case error.TIMEOUT:
              toast.error("Location request timed out. Please try again.");
              break;
            default:
              toast.error("An unknown error occurred while getting location.");
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setIsLoadingLocation(false);
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The places SearchBox will handle the search via its 'places_changed' event
  };

  return (
    <div className="relative">
      <div className="mb-3 space-y-2">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="map-search-input"
              placeholder="Search for a location..."
              className="pl-9"
              value={searchQuery}
              onChange={handleSearchChange}
              disabled={!isMapLoaded}
            />
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            onClick={getCurrentLocation}
            disabled={!isMapLoaded || isLoadingLocation}
            title="Use my current location"
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </form>
      </div>
      <div 
        ref={mapRef} 
        className="w-full h-[350px] rounded-md border overflow-hidden"
      />
      {(mapLoadingStatus || !isMapLoaded || isLoadingLocation) && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="animate-spin h-6 w-6 text-primary" />
            <p className="text-center px-4">
              {mapLoadingStatus || (isLoadingLocation ? "Getting your location..." : "Loading map...")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;

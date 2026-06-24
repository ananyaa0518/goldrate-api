import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/features/home/HeroSection';
import { CitiesGrid } from './components/features/home/CitiesGrid';
import { TickerBar } from './components/features/home/TickerBar';
import { PriceChart } from './components/features/home/PriceChart';
import { CalculatorCard } from './components/features/home/CalculatorCard';
import { InsightsGrid } from './components/features/home/InsightsGrid';
import { AlertSection } from './components/features/home/AlertSection';
import { Footer } from './components/layout/Footer';
import { AlertModal } from './components/features/alerts/AlertModal';
import { goldApi } from './services/api';
import type { HomeResponse, CityResponse } from './services/api';
import { RefreshCw } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function GoldRateDashboard() {
  const [selectedCity, setSelectedCity] = useState('bangalore');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // Fetch general home screen rates
  const {
    data: homeData,
    isLoading: isHomeLoading,
    error: homeError,
    isError: isHomeError,
  } = useQuery<HomeResponse, any>({
    queryKey: ['homeData'],
    queryFn: goldApi.getHomeData,
  });

  // Fetch detailed rates for currently active city (if it's not Bangalore, or to get fresh specific city data)
  const {
    data: cityData,
    isLoading: isCityLoading,
  } = useQuery<CityResponse>({
    queryKey: ['cityData', selectedCity],
    queryFn: () => goldApi.getCityData(selectedCity),
    enabled: !!selectedCity,
  });

  const getErrorMessage = (err: any): string => {
    if (err?.response) {
      const errorType = err.response.data?.errorType;
      if (errorType === 'KEY_MISSING') {
        return 'Gold API key not configured.';
      }
      if (errorType === 'QUOTA_EXCEEDED') {
        return 'Gold price provider limit reached. Please try again later.';
      }
      return 'Unable to fetch latest gold prices.';
    }
    return 'Backend service unavailable.';
  };

  if (isHomeLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white gap-4">
        <RefreshCw className="h-8 w-8 animate-spin text-amber-500" />
        <span className="text-xs font-semibold text-navy-800 tracking-wider">Loading Live Gold Rates...</span>
      </div>
    );
  }

  if (isHomeError || !homeData) {
    const errorMsg = getErrorMessage(homeError);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white gap-4 p-4 text-center">
        <div className="rounded-full bg-rose-50 p-3 text-danger-red">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-base font-extrabold text-navy-900 tracking-tight">{errorMsg}</h3>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 rounded-lg bg-navy-900 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-800 transition-all cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Resolve current active rates
  // Defaults to homeData Bangalore details unless a city detailed response has been retrieved
  const currentCityRates = cityData?.cityDetails || {
    city: selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1),
    price24K: homeData.livePrice.price24K,
    price22K: homeData.livePrice.price22K,
    change: homeData.livePrice.change,
    timestamp: homeData.livePrice.timestamp,
  };

  const currentChartData = cityData?.chartData || homeData.chartData;

  const handleCitySelect = (city: string) => {
    setSelectedCity(city.toLowerCase());
  };

  // Convert major cities into options list for calculator dropdown
  const calculatorCityOptions = homeData.majorCities.map((c) => ({
    name: c.city,
    value: c.city.toLowerCase(),
  }));

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-amber-100 selection:text-amber-800">
      
      {/* 1. Sticky Navbar */}
      <Navbar
        onSelectCity={handleCitySelect}
        onOpenAlertModal={() => setIsAlertModalOpen(true)}
      />

      {/* Main Page Layout Wrapper */}
      <main className="flex-grow">
        
        {/* 2. Hero Section */}
        <HeroSection
          selectedCity={currentCityRates.city}
          price24K={currentCityRates.price24K}
          price22K={currentCityRates.price22K}
          change={currentCityRates.change}
          timestamp={currentCityRates.timestamp}
          onSelectCity={handleCitySelect}
          onOpenAlertModal={() => setIsAlertModalOpen(true)}
        />

        {/* 3. Major Cities Grid */}
        <CitiesGrid
          cities={homeData.majorCities}
          onSelectCity={handleCitySelect}
        />

        {/* 4. Live Ticker */}
        <TickerBar
          items={homeData.ticker}
          onSelectCity={handleCitySelect}
        />

        {/* 5. Price Trends Chart */}
        <PriceChart
          city={currentCityRates.city}
          data={currentChartData}
        />

        {/* 6. Gold Calculator */}
        <div className="relative">
          {isCityLoading && (
            <div className="absolute inset-0 bg-white/40 z-10 flex items-center justify-center backdrop-blur-[1px]">
              <RefreshCw className="h-6 w-6 animate-spin text-amber-500" />
            </div>
          )}
          <CalculatorCard
            initialCity={selectedCity}
            cities={calculatorCityOptions}
          />
        </div>

        {/* 7. Investment Insights */}
        <InsightsGrid />

        {/* 8. Price Alert Section */}
        <AlertSection currentCity={currentCityRates.city} />

      </main>

      {/* 9. Footer */}
      <Footer onSelectCity={handleCitySelect} />

      {/* Set Alert Popup Modal */}
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        currentCity={currentCityRates.city}
      />

    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GoldRateDashboard />
    </QueryClientProvider>
  );
}

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useVolunteerHours } from '@/hooks/useVolunteerHours';
import SearchForm from '@/components/SearchForm';
import ResultsCard from '@/components/ResultsCard';
import Logo from '@/components/Logo';
import volunteerHoursLog from '@/assets/volunteer-hours-log.png';

const Index = () => {
  const { isLoading, searchHours, searchResult, dataReady } = useVolunteerHours();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-background via-background to-purple-100/50 p-4 sm:p-6 relative overflow-hidden">
      {/* Back to stemsters.org link */}
      <a 
        href="https://stemsters.org" 
        className="fixed top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-1.5 sm:gap-2 text-primary hover:text-primary/80 transition-colors z-20"
      >
        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="text-xs sm:text-sm font-medium hidden sm:inline">stemsters.org</span>
      </a>


      <div className="w-full max-w-md flex flex-col items-center pt-10 sm:pt-12">
        <div className="mb-3 sm:mb-4 text-center">
          <Logo />
          <img 
            src={volunteerHoursLog} 
            alt="Volunteer Hours Log" 
            className="h-8 sm:h-10 w-auto mb-1.5 sm:mb-2 animate-fade-in animation-delay-100"
          />
          <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto animate-fade-in animation-delay-200">
            Check your verified volunteer hours.
          </p>
        </div>

        <SearchForm
          onSearch={searchHours} 
          isLoading={isLoading} 
          dataReady={dataReady} 
        />

        {searchResult && (
          <ResultsCard 
            found={searchResult.found} 
            totalHours={searchResult.totalHours}
            isLoading={searchResult.isLoading}
            hoursByDateAndType={searchResult.hoursByDateAndType}
          />
        )}

        <footer className="mt-6 sm:mt-8 text-center animate-fade-in animation-delay-300">
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            If you believe your hours are incorrect, please contact <span className="text-primary font-medium">stemstersmanagement@gmail.com</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;

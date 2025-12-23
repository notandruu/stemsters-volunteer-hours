import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface SearchFormProps {
  onSearch: (name: string, id: string, highSchool: string) => void;
  isLoading: boolean;
  dataReady: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading, dataReady }) => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [highSchool, setHighSchool] = useState('');
  const [bypassId, setBypassId] = useState(false);

  // Form validation state
  const [errors, setErrors] = useState({
    name: false,
    id: false,
    highSchool: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = {
      name: !name.trim(),
      id: !bypassId && !id.trim(),
      highSchool: !highSchool.trim()
    };
    
    setErrors(newErrors);
    
    // If any errors, don't proceed
    if (Object.values(newErrors).some(isError => isError)) {
      return;
    }
    
    onSearch(name.trim(), bypassId ? '' : id.trim(), highSchool.trim());
  };

  const handleBypassClick = () => {
    setBypassId(true);
    setId('');
    setErrors(prev => ({ ...prev, id: false }));
  };

  return (
    <Card className="w-full max-w-md glass animate-scale-in">
      <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6 px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
          <div className="space-y-1.5 sm:space-y-2 animate-slide-up">
            <Label htmlFor="name" className={`text-xs sm:text-sm font-medium ${errors.name ? 'text-destructive' : ''}`}>
              Full Name*
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!dataReady || isLoading}
              className={`h-9 sm:h-11 text-sm sm:text-base bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                errors.name ? 'border-destructive focus:ring-destructive/30' : 'border-input/60 focus:border-primary/40 focus:ring-1 focus:ring-primary/30'
              }`}
            />
            {errors.name && (
              <p className="text-[10px] sm:text-xs text-destructive mt-1">Full name is required</p>
            )}
          </div>
          
          <div className="space-y-1.5 sm:space-y-2 animate-slide-up animation-delay-100">
            <Label htmlFor="highSchool" className={`text-xs sm:text-sm font-medium ${errors.highSchool ? 'text-destructive' : ''}`}>
              High School*
            </Label>
            <Input
              id="highSchool"
              type="text"
              placeholder="Enter your high school name"
              value={highSchool}
              onChange={(e) => setHighSchool(e.target.value)}
              disabled={!dataReady || isLoading}
              className={`h-9 sm:h-11 text-sm sm:text-base bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                errors.highSchool ? 'border-destructive focus:ring-destructive/30' : 'border-input/60 focus:border-primary/40 focus:ring-1 focus:ring-primary/30'
              }`}
            />
            {errors.highSchool && (
              <p className="text-[10px] sm:text-xs text-destructive mt-1">High school name is required</p>
            )}
          </div>

          {!bypassId && (
            <div className="space-y-1.5 sm:space-y-2 animate-slide-up animation-delay-150">
              <Label htmlFor="id" className={`text-xs sm:text-sm font-medium ${errors.id ? 'text-destructive' : ''}`}>
                ID Number*
              </Label>
              <Input
                id="id"
                type="text"
                placeholder="Enter your ID number"
                value={id}
                onChange={(e) => setId(e.target.value)}
                disabled={!dataReady || isLoading}
                className={`h-9 sm:h-11 text-sm sm:text-base bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                  errors.id ? 'border-destructive focus:ring-destructive/30' : 'border-input/60 focus:border-primary/40 focus:ring-1 focus:ring-primary/30'
                }`}
              />
              {errors.id && (
                <p className="text-[10px] sm:text-xs text-destructive mt-1">ID number is required</p>
              )}
            </div>
          )}

          {bypassId && (
            <div className="text-xs sm:text-sm text-muted-foreground animate-slide-up animation-delay-150 p-2.5 sm:p-3 bg-secondary/50 rounded-lg">
              <span>Searching without ID number. </span>
              <button
                type="button"
                onClick={() => setBypassId(false)}
                className="text-primary hover:underline font-medium"
              >
                Use ID instead
              </button>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full h-10 sm:h-12 text-sm sm:text-base font-medium mt-4 sm:mt-6 rounded-xl bg-primary hover:bg-primary/90 transition-all duration-300 animate-slide-up animation-delay-200"
            disabled={!dataReady || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-t-transparent border-white/80 animate-spin" />
                <span>Searching...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Check Hours</span>
              </div>
            )}
          </Button>

          {!bypassId && (
            <p className="text-[10px] sm:text-xs text-center text-muted-foreground mt-2 sm:mt-3 animate-slide-up animation-delay-200">
              Don't have an ID number at your school?{' '}
              <button
                type="button"
                onClick={handleBypassClick}
                className="text-primary hover:underline font-medium"
              >
                Click here
              </button>
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchForm;

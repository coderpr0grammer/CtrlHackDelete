'use client'
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useCallback } from "react";
import { useDebouncedCallback } from 'use-debounce';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setIsSearching(false);
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }

    router.push(`/discover?${params.toString()}`);
  }, 300);

  const handleSearch = (value: string) => {
    setIsSearching(true);
    debouncedSearch(value);
  };

  return (
    <div className="relative w-[300px]">
      <Input
        defaultValue={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full pl-8" 
        placeholder="Search projects..."
      />
      {isSearching ? (
        <Loader2 className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      )}
    </div>
  );
}
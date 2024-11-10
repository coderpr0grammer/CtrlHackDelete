'use client'
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation"

// Create a new Search component
export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }

    // Update the URL with the new search params
    router.push(`/discover?${params.toString()}`);
  };

  return (
    <div className="relative">
      <Input
        defaultValue={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full pl-8" 
        placeholder="Search projects..."
      />
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-800" />
    </div>
  );
}
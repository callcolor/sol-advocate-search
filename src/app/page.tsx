"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  Search,
  MapPin,
  GraduationCap,
  Award,
  Calendar,
  Star,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { specialties } from "@/db/seed/advocates";
import { Badge } from "./components/ui/badge";

enum Degree {
  "MSW" = "MSW",
  "MD" = "MD",
  "PhD" = "PhD",
}

interface Advocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  yearsOfExperience: number;
  specialties: string[];
  phoneNumber: string;
}

interface AdvocateRequestParams {
  firstName: string;
  lastName: string;
  city: string;
  yearsOfExperience: Number;
  degree: string;
  specialties: string[];
}

const fetchAdvocates = async (
  advocateRequestParams: AdvocateRequestParams
): Promise<Advocate[]> => {
  console.log("fetching advocates...");
  const searchParams = new URLSearchParams({
    firstName: advocateRequestParams.firstName,
    lastName: advocateRequestParams.lastName,
    city: advocateRequestParams.city,
    degree: advocateRequestParams.degree,
    yearsOfExperience: advocateRequestParams.yearsOfExperience.toString(),
  });
  for (const specialty of advocateRequestParams.specialties) {
    searchParams.append("specialties", specialty);
  }
  const response = await fetch("/api/advocates?" + searchParams.toString());
  const jsonResponse = await response.json();
  const data: Advocate[] = jsonResponse.data;
  return data;
};

const getInitialFilter = (): AdvocateRequestParams => ({
  firstName: "",
  lastName: "",
  city: "",
  degree: "",
  specialties: [],
  yearsOfExperience: 0,
});

export default function Home() {
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [filter, setFilter] = useState<AdvocateRequestParams>(
    getInitialFilter()
  );

  useEffect(() => {
    (async () => {
      const advocates = await fetchAdvocates(filter);
      setFilteredAdvocates(advocates);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = async (params: AdvocateRequestParams) => {
    console.log("filtering advocates...");
    const advocates = await fetchAdvocates(params);

    setFilteredAdvocates(advocates);
    setFilter(params);
  };

  const clearFilters = async () => {
    const params = getInitialFilter();
    const advocates = await fetchAdvocates(params);

    setFilter(params);
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto p-6 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Find Your Solace Advocate
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with experienced healthcare professionals who can guide
              you through your medical journey
            </p>
          </div>

          {/* Search Filters */}
          <Card className="mb-8 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Search Filters
              </CardTitle>
              <CardDescription>
                Find the perfect medical advocate for your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Name Search */}
                <div className="space-y-2">
                  <label htmlFor="name">Name</label>
                  <Input
                    id="firstName"
                    placeholder="Search by name..."
                    value={filter.firstName}
                    onChange={(e) =>
                      handleFilterChange({
                        ...filter,
                        firstName: e.target.value,
                      })
                    }
                  />
                </div>

                {/* City Search */}
                <div className="space-y-2">
                  <label htmlFor="city">City</label>
                  <Input
                    id="city"
                    placeholder="Enter city..."
                    value={filter.city}
                    onChange={(e) =>
                      handleFilterChange({ ...filter, city: e.target.value })
                    }
                  />
                </div>

                {/* Minimum Experience */}
                <div className="space-y-2">
                  <label htmlFor="experience">
                    Minimum Years of Experience
                  </label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={filter.yearsOfExperience.toString() || ""}
                    onChange={(e) =>
                      handleFilterChange({
                        ...filter,
                        yearsOfExperience: Number(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                {/* Degree Filter */}
                <div className="space-y-2">
                  <label htmlFor="degree">Degree</label>
                  <Select
                    value={filter.degree}
                    onValueChange={(value) =>
                      handleFilterChange({ ...filter, degree: value as Degree })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select degree" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border z-50">
                      {Object.keys(Degree).map((degree) => (
                        <SelectItem key={degree} value={degree}>
                          {degree}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Specialty Filter */}
                <div className="space-y-2">
                  <label htmlFor="specialty">Specialty</label>
                  <Select
                    value={filter.specialties?.[0] || ""}
                    onValueChange={(value) =>
                      handleFilterChange({ ...filter, specialties: [value] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border z-50">
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="search" onClick={() => {}}>
                  <Search className="h-4 w-4" />
                  Search Advocates
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {filteredAdvocates.length} Medical Advocates Found
            </h2>
            <p className="text-muted-foreground">
              Featured advocates are listed first
            </p>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdvocates.map((advocate, index) => {
              const featured = index < 2;
              return (
                <Card
                  key={advocate.id}
                  className={`shadow-card hover:shadow-lg transition-shadow ${
                    featured ? "ring-2 ring-featured shadow-featured" : ""
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg">{`${advocate.firstName} ${advocate.lastName}`}</CardTitle>
                      {featured && (
                        <Badge
                          variant="secondary"
                          className="bg-featured text-featured-foreground"
                        >
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">5</span>
                        <span>(5 reviews)</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Lorem ipsum advocate short bio. Phone:{" "}
                      {advocate.phoneNumber}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{advocate.city}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        <span>{advocate.degree}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>
                          {advocate.yearsOfExperience} years experience
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Award className="h-4 w-4 text-accent" />
                        Certifications
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {advocate.specialties.map((cert, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        className="w-full"
                        variant={featured ? "featured" : "default"}
                      >
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredAdvocates.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No advocates found</h3>
                <p>Try adjusting your search criteria to find more results.</p>
              </div>
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* 
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input
          style={{ border: "1px solid black" }}
          value={filter.searchTerm}
          onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
        />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            return (
              <tr key={advocate.id}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s, index) => (
                    <div key={`${s} - ${index}`}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table> */}
    </main>
  );
}

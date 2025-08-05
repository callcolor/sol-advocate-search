"use client";

import { useEffect, useState } from "react";

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
  searchTerm: string;
}

const fetchAdvocates = async (): Promise<Advocate[]> => {
  console.log("fetching advocates...");
  const response = await fetch("/api/advocates");
  const jsonResponse = await response.json();
  const data: Advocate[] = jsonResponse.data;
  return data;
};

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [filter, setFilter] = useState<AdvocateRequestParams>({
    searchTerm: "",
  });

  useEffect(() => {
    (async () => {
      const advocates = await fetchAdvocates();
      setAdvocates(advocates);
      setFilteredAdvocates(advocates);
    })();
  }, []);

  const handleFilterChange = (params: AdvocateRequestParams) => {
    const { searchTerm } = params;

    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.includes(searchTerm) ||
        advocate.lastName.includes(searchTerm) ||
        advocate.city.includes(searchTerm) ||
        advocate.degree.includes(searchTerm) ||
        advocate.specialties.includes(searchTerm) ||
        advocate.yearsOfExperience >= Number(searchTerm)
      );
    });

    setFilter({ ...filter, searchTerm });
    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
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
      </table>
    </main>
  );
}

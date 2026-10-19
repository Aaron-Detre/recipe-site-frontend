
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { FaMagnifyingGlass } from "react-icons/fa6";
import type { ChangeEvent, KeyboardEvent } from "react";

export default function SearchBar({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const [query, setQuery] = useState("");
  const onSearchQueryChanges = (e: ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value);
  const searchRoute = `/search?tab=${tab}&criteria=${query}`;
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) =>
    e.key === "Enter" && router.push(searchRoute);

  return (
    <div className="wdf-search-bar">
      <InputGroup className="me-2">
        <InputGroupText>
          <FaMagnifyingGlass />
        </InputGroupText>
        <FormControl
          placeholder={placeholder}
          onChange={onSearchQueryChanges}
          onKeyDown={handleKeyDown}
        />
      </InputGroup>
      <Button
        className="wdf-search-button"
        onClick={async () => router.push(searchRoute)}
      >
        Search
      </Button>
    </div>
  );
}

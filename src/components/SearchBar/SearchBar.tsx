"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";

import axios from "axios";
import { Users } from "lucide-react";
import debounce from "lodash.debounce";
import { useQuery } from "@tanstack/react-query";
import { Prisma, Subconvo } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/Command";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();

  // to remove the output of the search when we click outside
  const commandRef = useRef<HTMLDivElement>(null);

  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryKey: ["search-query"],
    enabled: false,
    queryFn: async () => {
      if (!searchInput) return [];
      const { data } = await axios.get(`/api/search?q=${searchInput}`);
      return data as (Subconvo & {
        _count: Prisma.SubconvoCountOutputType;
      })[];
    },
  });

  const request = debounce(async () => {
    refetch();
  }, 600);

  const requestDebounce = useCallback(() => {
    request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useOnClickOutside(commandRef, () => setSearchInput(""));

  // to fix the issue of the search bar output not being removed when we
  // navigate to subconvos using keydown.
  useEffect(() => {
    setSearchInput("");
  }, [pathname]);

  return (
    <Command
      ref={commandRef}
      className="relative z-50 max-w-2xl overflow-visible rounded-full border"
    >
      <CommandInput
        value={searchInput}
        onValueChange={(text) => {
          setSearchInput(text);
          requestDebounce();
        }}
        placeholder="Search subconvos..."
        className="border-none outline-none ring-0 focus:border-none focus:outline-none"
        aria-label="Search subconvos"
      />

      {/* if we fetched the query but there is not result */}
      {searchInput.length > 0 ? (
        <CommandList className="absolute inset-x-0 top-12 rounded-lg bg-white shadow-md">
          {isFetched && <CommandEmpty>No results found..</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading="Subconvos">
              {queryResults?.map((subconvo, index) => (
                <CommandItem
                  key={subconvo.id}
                  onSelect={(e) => {
                    router.push(`/cc/${e}`);
                    router.refresh();
                  }}
                  value={subconvo.name}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <a href={`/cc/${subconvo.name}`}>cc/{subconvo.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
    </Command>
  );
};

export default SearchBar;

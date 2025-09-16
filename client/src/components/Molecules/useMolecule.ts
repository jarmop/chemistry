import { useQuery } from "@tanstack/react-query";
import { fetchMol } from "./pubChemApi.ts";
import { Molecule } from "./types.ts";
import { parse } from "./molParser.ts";

const ONE_HOUR_MS = 60 * 60 * 1000;

export function useMolecule(name: string) {
  const { isPending, isSuccess, error, data } = useQuery({
    queryKey: [name],
    queryFn: () => {
      return name.length > 0 ? fetchMol(name) : "";
    },
    staleTime: ONE_HOUR_MS,
  });

  let molecule: Molecule | undefined;
  if (isSuccess && data !== undefined && data.length > 0) {
    molecule = parse(data);
  }

  return { isPending, error, molecule };
}

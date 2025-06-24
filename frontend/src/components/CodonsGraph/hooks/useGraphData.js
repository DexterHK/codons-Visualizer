import { useStore } from "../../../store";

export const useGraphData = () => {
  const originalCodons = useStore((state) => state.originalCodons);
  const alphaOne = useStore((state) => state.alphaOne);
  const alphaTwo = useStore((state) => state.alphaTwo);
  const alphaThree = useStore((state) => state.alphaThree);
  const eigenschaften = useStore((state) => state.eigenschaften);
  const eigenschaftenAlphaOne = useStore((state) => state.eigenschaftenAlphaOne);
  const eigenschaftenAlphaTwo = useStore((state) => state.eigenschaftenAlphaTwo);
  const eigenschaftenAlphaThree = useStore((state) => state.eigenschaftenAlphaThree);
  const c3 = useStore((state) => state.c3);
  const numOfCodons = useStore((state) => state.numOfCodons);

  return {
    originalCodons,
    alphaOne,
    alphaTwo,
    alphaThree,
    eigenschaften,
    eigenschaftenAlphaOne,
    eigenschaftenAlphaTwo,
    eigenschaftenAlphaThree,
    c3,
    numOfCodons,
  };
};

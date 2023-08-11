import { DecisionTreePath } from '@/utils/parsePath';
import { create } from 'zustand';

interface ProjectState {
  selectedDataOID: number | undefined;
  target: string | undefined;
  features: string[] | undefined;
  selectedPathID: string | undefined;
  selectedPath: DecisionTreePath | undefined;
  setTarget: (target: string | undefined) => void;
  setFeatures: (features: string[] | undefined) => void;
  setDataOID: (oid: number) => void;
  setPath: (path: DecisionTreePath) => void;
  setPathID: (pathID: string) => void;
  clear: () => void;
}

export const useProjectStore = create<ProjectState>()((set, get) => ({
  selectedDataOID: undefined,
  target: undefined,
  features: undefined,
  selectedPathID: undefined,
  selectedPath: undefined,
  setTarget: (target: string | undefined) => set({ target: target }),
  setFeatures: (features: string[] | undefined) => set({ features: features }),
  setDataOID: (oid: number) => set({ selectedDataOID: oid }),
  setPath: (path: DecisionTreePath) => set({ selectedPath: path }),
  setPathID: (pathID: string) => set({ selectedPathID: pathID }),
  clear: () =>
    set({
      selectedDataOID: undefined,
      target: undefined,
      features: undefined,
      selectedPathID: undefined,
      selectedPath: undefined,
    }),
}));

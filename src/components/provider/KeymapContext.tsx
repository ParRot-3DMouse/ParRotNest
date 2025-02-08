"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { KeymapCollection } from "../../lib/device/types";
import { initialState } from "../../lib/device/reducer";

interface KeymapContextType {
  keymapCollection: KeymapCollection;
  setKeymapCollection: React.Dispatch<React.SetStateAction<KeymapCollection>>;
}

const KeymapContext = createContext<KeymapContextType | undefined>(undefined);

export const KeymapProvider = ({ children }: { children: ReactNode }) => {
  const [keymapCollection, setKeymapCollection] = useState<KeymapCollection>({
    appName: "",
    layer1: initialState,
    layer2: initialState,
    layer3: initialState,
  });

  return (
    <KeymapContext.Provider value={{ keymapCollection, setKeymapCollection }}>
      {children}
    </KeymapContext.Provider>
  );
};

export const useKeymap = () => {
  const context = useContext(KeymapContext);
  if (!context) {
    throw new Error("useKeymap must be used within a KeymapProvider");
  }
  return context;
};

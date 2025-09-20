import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  useOfflineMode: boolean;
  modelDownloaded: boolean;
  modelLoaded: boolean;
  packageAvailable: boolean;
  setUseOfflineMode: (value: boolean) => void;
  setModelDownloaded: (value: boolean) => void;
  setModelLoaded: (value: boolean) => void;
  setPackageAvailable: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      useOfflineMode: false,
      modelDownloaded: false,
      modelLoaded: false,
      packageAvailable: false,
      setUseOfflineMode: (value) => set({ useOfflineMode: value }),
      setModelDownloaded: (value) => set({ modelDownloaded: value }),
      setModelLoaded: (value) => set({ modelLoaded: value }),
      setPackageAvailable: (value) => set({ packageAvailable: value }),
    }),
    {
      name: 'resq-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

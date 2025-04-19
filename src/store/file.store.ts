/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, Dispatch, SetStateAction } from "react";

export const FilesContext = createContext<{
  files: any | null;
  setFiles: Dispatch<SetStateAction<any | null>>;
  isFilesLoading: boolean;
  setIsFilesLoading: Dispatch<SetStateAction<boolean>>;
}>({
  files: null,
  setFiles: () => {},
  isFilesLoading: false,
  setIsFilesLoading: () => {}
});

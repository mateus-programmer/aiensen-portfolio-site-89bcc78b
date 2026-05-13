export interface SubFolderInfo {
  name: string;
  slug: string;
  code: string;
  accentHsl: string;
  description: string;
  tag: string;
}

export interface FolderInfo {
  name: string;
  slug: string;
  code: string;
  accentHsl: string;
  description: string;
  tag: string;
  subfolders: SubFolderInfo[];
}

export const foldersBySemester: Record<string, FolderInfo[]> = {};

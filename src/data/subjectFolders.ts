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

// Keyed by `${semesterSlug}/${subjectSlug}`
export const foldersBySubject: Record<string, FolderInfo[]> = {
  "1s-2026/sistemas-informacao-sociedade": [
    {
      name: "Sistemas de Informação",
      slug: "sistemas-informacao",
      code: "SI.DIR",
      accentHsl: "190 95% 60%",
      description: "Diretório dedicado aos fundamentos de Sistemas de Informação.",
      tag: "Sistemas de Informação",
      subfolders: [
        {
          name: "Introdução",
          slug: "introducao",
          code: "SI.INTRO",
          accentHsl: "280 90% 65%",
          description: "Conceitos iniciais e visão geral de Sistemas de Informação.",
          tag: "Sistemas de Informação · Introdução",
        },
      ],
    },
  ],
};

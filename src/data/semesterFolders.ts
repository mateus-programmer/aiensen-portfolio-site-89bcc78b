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

export const foldersBySemester: Record<string, FolderInfo[]> = {
  "1s-2026": [
    {
      name: "Sistemas de Informação",
      slug: "sistemas-informacao",
      code: "SI.MOD.01",
      accentHsl: "190 95% 60%",
      description:
        "Núcleo dedicado ao estudo de sistemas de informação, suas dimensões organizacionais e tecnológicas.",
      tag: "Sistemas de Informação",
      subfolders: [
        {
          name: "Introdução",
          slug: "introducao",
          code: "SI.INTRO.00",
          accentHsl: "55 100% 55%",
          description:
            "Conceitos iniciais, panorama histórico e fundamentos dos sistemas de informação.",
          tag: "Sistemas de Informação · Introdução",
        },
      ],
    },
  ],
};

export type Paper = {
  title: string;
  year: string;
  summary: string;
  authors: string;
  slug: string;
  pdfUrl: string;
};

export const papers: Paper[] = [
  {
    title: "Impact of Native Language Instruction on Tech Education Outcomes",
    year: "2026",
    summary:
      "A study examining how teaching programming in native languages affects learning outcomes.",
    authors: "Dr. Amina Mohammed, Ibrahim Zubairu",
    slug: "impact-native-language-tech-education",
    pdfUrl: "/research-native-language.pdf",
  },
  {
    title: "Adoption Patterns of AI Technologies in Developing Economies",
    year: "2025",
    summary:
      "Analysis of how AI technologies are being adopted in emerging markets.",
    authors: "Prof. John Okonkwo, Ibrahim Zubairu",
    slug: "ai-adoption-developing-economies",
    pdfUrl: "/ai-adoption-patterns.pdf",
  },
  {
    title: "Survey of Open Source Contributions from West African Developers",
    year: "2025",
    summary:
      "A comprehensive survey of open source contribution patterns among West African developers.",
    authors: "Ibrahim Zubairu, Sarah Adebayo",
    slug: "open-source-west-africa-survey",
    pdfUrl: "/opensource-survey-west-africa.pdf",
  },
];

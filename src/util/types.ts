type Content = {
  name: string;
  dir: string;
  content: string;
};

type Component = {
  name: string;
  label: string;
  description: string;
  dependencies: string[];
  demo: string;
  files: Content[];
};

type RegistryItem = {
  name: string;
  label: string;
  type: string;
  author: string;
  github: string;
};

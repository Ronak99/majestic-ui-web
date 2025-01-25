type WidgetFile = {
  name: string;
  dir: string;
  content: string;
};

type Widget = {
  name: string;
  label: string;
  description: string;
  demo: string;
  dependencies: string[];
  files: WidgetFile[];
  type: string;
};

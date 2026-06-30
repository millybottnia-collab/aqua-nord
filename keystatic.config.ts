import { config, fields, singleton } from "@keystatic/core";

type ItemLabelProps<FieldName extends string> = {
  fields: Record<FieldName, { value: string }>;
};

export default config({
  storage: {
    kind: "local",
  },
  singletons: {
    home: singleton({
      label: "Home",
      path: "content/pages/home",
      format: {
        data: "json",
      },
      schema: {
        hero: fields.object(
          {
            headline: fields.text({ label: "Headline" }),
            subtext: fields.text({ label: "Subtext", multiline: true }),
          },
          { label: "Hero" },
        ),
        stats: fields.array(
          fields.object({
            value: fields.text({ label: "Value" }),
            label: fields.text({ label: "Label" }),
          }),
          {
            label: "Stats",
            itemLabel: (props: ItemLabelProps<"label">) => props.fields.label.value,
            validation: { length: { min: 3, max: 3 } },
          },
        ),
        features: fields.array(
          fields.object({
            title: fields.text({ label: "Title" }),
            description: fields.text({ label: "Description", multiline: true }),
          }),
          {
            label: "Features",
            itemLabel: (props: ItemLabelProps<"title">) => props.fields.title.value,
            validation: { length: { min: 3, max: 3 } },
          },
        ),
        cta: fields.object(
          {
            headline: fields.text({ label: "Headline" }),
            subtext: fields.text({ label: "Subtext", multiline: true }),
          },
          { label: "CTA" },
        ),
      },
    }),
  },
});

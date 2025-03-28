export const draggableFormItems = [
  {
    id: "draggableInput",
    type: "input",
    name: "name",
    key: "draggableInput",
    label: "Draggable Input",
    placeholder: "Enter your name",
  },
  {
    id: "draggableDate",
    type: "date",
    name: "date",
    key: "draggableDate",
    label: "Draggable Date",
    placeholder: "Enter your birth date",
  },
  {
    id: "draggableSelect",
    type: "select",
    name: "country",
    key: "draggableSelect",
    label: "Draggable Select",
    placeholder: "Select a country",
    options: [
      {
        id: "country1",
        label: "Country 1",
      },
      {
        id: "country2",
        label: "Country 2",
      },
      {
        id: "country3",
        label: "Country 3",
      },
    ],
  },
  {
    id: "draggableTextarea",
    type: "textarea",
    name: "message",
    key: "draggableTextarea",
    label: "Draggable Textarea",
    placeholder: "Enter your message",
  },
]

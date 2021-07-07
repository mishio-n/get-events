export type Label = {
  id: string;
  type: string;
  attributes: {
    name: string;
    color: string;
  };
};

export type Labels = {
  data: Label[];
};

export type Event = {
  id: string;
  type: string;
  attributes: {
    title: string;
    allDay: string;
  };
  relationships: {
    label: {
      data: {
        id: string;
        type: string;
      };
    };
    creator: {
      id: string;
      type: string;
    };
    attendees: {
      id: string;
      type: string;
    };
  };
};

export type Events = {
  data: Event[];
};

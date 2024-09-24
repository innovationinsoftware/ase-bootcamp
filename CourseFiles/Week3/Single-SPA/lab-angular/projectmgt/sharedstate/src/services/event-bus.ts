export const eventBus = new EventTarget();

export const emitEvent = (eventName: string, detail: any) => {
  const event = new CustomEvent(eventName, { detail });
  eventBus.dispatchEvent(event);
};

export const onEvent = (eventName: string, callback: any) => {
  eventBus.addEventListener(eventName, callback);
};

export const removeEvent = (eventName: string, callback: any) => {
  eventBus.removeEventListener(eventName, callback);
};

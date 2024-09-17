export const DEFAULT_LIST = {
  id: 'default',
  key: 'Sample Grocery List',
  items: [
    { id: '1', key: 'Bread', isObject: false },
    { id: '2', key: 'Milk', isObject: false },
    { id: '3', key: 'Eggs', isObject: false },
    {
      id: '4', key: 'Fruits', isObject: true, items: [
        { id: '5', key: 'Apples', isObject: false },
        { id: '6', key: 'Bananas', isObject: false },
        { id: '7', key: 'Carrots', isObject: false },
      ]
    },
  ],
};

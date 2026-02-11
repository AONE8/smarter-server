export default class Mapper {
  firstObject = {};
  secondObject = {};

  firstObjArr = [];
  secondObjArr = [];

  mapping = new Map();

  static createArrayMapper(firstObjArr, secondObjArr) {
    const mapper = new Mapper();

    mapper.firstObjArr = firstObjArr;
    mapper.secondObjArr = secondObjArr;

    return mapper;
  }

  static createObjectMapper(firstObject, secondObject) {
    const mapper = new Mapper();

    mapper.firstObject = firstObject;
    mapper.secondObject = secondObject;

    return mapper;
  }

  build(firstObjectKey, secondObjectKey, cb, i = null) {
    let firstObj, secondObj;

    if (i !== null) {
      firstObj = this.firstObjArr[i];
      secondObj = this.secondObjArr[i];
    } else {
      firstObj = this.firstObject;
      secondObj = this.secondObject;
    }

    const [firstObjectValue, secondObjectValue] = cb(
      firstObj[firstObjectKey],
      secondObj[secondObjectKey],
    );

    this.mapping.set(firstObjectKey, [
      firstObjectValue,
      {
        [secondObjectKey]: secondObjectValue,
      },
    ]);
    return this;
  }

  map(objectToMap) {
    const result = {};

    for (const key of Object.keys(objectToMap)) {
      const [firstValue, secondObject] = this.mapping.get(key);

      const secondObjectKey = Object.keys(secondObject)[0];

      if (Array.isArray(objectToMap[key])) {
        const indices = objectToMap[key].map((value) =>
          firstValue.indexOf(value),
        );

        result[secondObjectKey] = secondObject[secondObjectKey].filter(
          (_, index) => indices.includes(index),
        );

        continue;
      }

      const index = firstValue.indexOf(objectToMap[key]);

      result[secondObjectKey] = secondObject[secondObjectKey][index];
    }

    return result;
  }
}

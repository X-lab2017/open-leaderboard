const expandObject = (object) => {
  let obj = {},
    newobj;
  Object.keys(object).map((key) => {
    if (object[key] instanceof Object) {
      newobj = expandObject(object[key]);
    } else {
      obj[key] = object[key];
    }
  });
  return { ...newobj, ...obj };
};
export default expandObject;

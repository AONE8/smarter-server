export default function stringifyIntoQuery(resultBody) {
  let queryString = "";

  for (const [key, value] of Object.entries(resultBody)) {
    queryString += `${key}=${
      Array.isArray(value)
        ? value.reduce(
            (acc, current, currIndex, arr) =>
              acc + current + (currIndex !== arr.length - 1 ? "," : ""),
            ""
          )
        : value
    }`;
    queryString += ";";
  }

  return queryString + "sort=cheap/";
}

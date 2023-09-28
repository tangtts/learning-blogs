function insertStyles(serialized) {
  const className = "css" + "-" + serialized.name;
  const rule = "." + className + "{" + serialized.styles + "}";
  const tag = document.createElement("style");
  tag.setAttribute("data-emotion", "css");
  tag.appendChild(document.createTextNode(rule));
  document.head.appendChild(tag);
}

function hashString(keys) {
  let val = 10000000;
  for (let i = 0; i < keys.length; i++) {
    val += keys.charCodeAt(i);
  }
  return val.toString(16).slice(0, 6);
}

function serializeStyles(args) {
  let styles = "";
  const strings = args[0];
  styles += strings[0];
  const name = hashString(styles);
  return { name, styles };
}

function css(...args) {
  const serialized = serializeStyles(args);
  insertStyles(serialized);
  return "css" + "-" + serialized.name;
}

const className = css({
  color: "red",
});

console.log("🚀 ~ file: index.js:40 ~ className:", className);

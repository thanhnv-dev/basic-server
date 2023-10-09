const separation2 = () => {
  console.log('================================================');
};
const separation1 = () => {
  console.log('|-----------------------------------------------');
};

const path = ({method, url}) => {
  console.log(`| [${method}] ${url}`);
};

const text = data => {
  if (typeof data === 'array') {
    data.forEach(element => {
      console.log(`| ${element}`);
    });
  }
  if (typeof data === 'string') {
    console.log(`| ${data}`);
  }
};

const status = code => {
  if (code === 200) {
    console.log('| Successfully!');
  }
  if (code === 400) {
    console.log('| Failure!');
  }
};

const request = ({req, msg, code}) => {
  console.log(req.body);
  separation2();
  path({method: req.method, url: req.originalUrl});
  separation1();
  req.body ? params(req.body) : null;
  code ? separation1() : null;
  msg ? text(msg) : null;
  code ? status(code) : null;
  separation2();
};

const params = data => {
  if (typeof data === 'object') {
    const keysArray = Object.keys(data);
    const valuesArray = Object.values(data);
    keysArray?.forEach((_, i) => {
      console.log(`| ${keysArray[i]}: ${valuesArray[i]}`);
    });
  }
};

export {separation2, path, text, request, separation1, params};

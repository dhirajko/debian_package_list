const exec = require("child_process").exec;
function execute(command) {
  return new Promise(function(resolve, reject) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

//all packages
const packageList = () => {
  return execute("dpkg-query -f '${binary:Package}\n' -W").then(data =>
    data.split("\n")
  );
};

//get details
const packageDetails = package => {
  return execute("dpkg -s " + package).then(data => {
    return data.split("\n");
  });
};

//get all dependencies
const dependencies = package => {
  return execute("apt-cache depends " + package).then(data => {
    let allDependenciesDetail = data.split("\n");
    let dependentPackage = allDependenciesDetail.filter(eachLine =>
      eachLine.includes("  Depends:")
    );
    return dependentPackage.map(
      package =>
        package.split("  Depends: ")[1] || package.split("|Depends: ")[1]
    );
  });
};

//reverse dependencies
const reverseDependencies = package => {
  return execute("apt-cache rdepends " + package).then(data => {
    let allDependenciesDetail = data.split("\n");
    return allDependenciesDetail
      .filter(package => package.includes("  "))
      .map(package => package.trim());
  });
};

Promise.all([
  packageList(),
  packageDetails("xxd"),
  dependencies("xxd"),
  reverseDependencies("xxd")
]).then(data => console.log(data));

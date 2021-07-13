const download = require("download");
const fs = require("fs");
const semver = require("semver");
const axios = require("axios");

function github(version, type = "npm") {
  let url;
  if (version[0] === "v" || version[0] === "V") {
    version = version.substr(1);
  }

  if (type === "github") {
    version = "v" + version;
    url = "https://github.com/yapi-pro/yapi/archive/" + version + ".zip";
  } else {
    url = `http://registry.npm.taobao.org/yapi-pro/download/yapi-pro-${version}.tgz`;
  }
  return url;
}
module.exports = {
  message: {
    fount_project_path_error:
      "项目目录找不到配置文件 config.json, 请确认当前目录是否为项目目录",
  },

  getVersions: async function () {
    let info = await axios.get("http://registry.npm.taobao.org/yapi-pro");
    return Object.keys(info.data.versions).filter(
      (item) => item.indexOf("beta") === -1
    );
  },

  log: function (msg) {
    console.log(msg);
  },
  error: function (error) {
    console.error(error);
  },
  wget: function (dest, v, type) {
    const url = github(v, type);
    const cmd = download(url, dest, { extract: true, strip: 1 });
    console.log(url);
    cmd.stdout = process.stdout;
    return cmd;
  },
  fileExist: function (filePath) {
    try {
      return fs.statSync(filePath).isFile();
    } catch (err) {
      return false;
    }
  },
  compareVersion: function compareVersion(version, bigVersion) {
    version = version.split(".");
    bigVersion = bigVersion.split(".");
    for (let i = 0; i < version.length; i++) {
      version[i] = +version[i];
      bigVersion[i] = +bigVersion[i];
      if (version[i] > bigVersion[i]) {
        return false;
      } else if (version[i] < bigVersion[i]) {
        return true;
      }
    }
    return true;
  },
  handleVersion: function (version) {
    if (!version) return version;
    version = version + "";
    if (version[0] === "v") {
      return version.substr(1);
    }
    return version;
  },
};

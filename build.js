const path = require("path");
const fs = require("fs");
const { log } = require("console");

function walkSync(dir, res, ext) {
	res = res || [];
	let files = fs.readdirSync(dir);
	for (let f of files) {
		if (f.charAt(0) === ".") {
			continue;
		}
		let p = path.join(dir, f);
		let stat = fs.lstatSync(p);
		if (stat.isDirectory()) {
			walkSync(p, res, ext);
		} else if (stat.isFile()) {
			let extF = path.extname(f);
			if (typeof ext === "string") {
				if (extF !== ext) {
					continue;
				}
			} else if (Array.isArray(ext)) {
				if (ext.indexOf(extF) < 0) {
					continue;
				}
			}
			res.push(p);
		}
	}
	return res;
}

const url = __dirname;
const replaceUrl = "https://zhengpj95.github.io/imgdepot";

const list = [];
walkSync(url, list, ".png");

const urlAry = ["# img depot\n"];
for (let item of list) {
	item = path.join(item).replace(url, replaceUrl).replaceAll("\\", "/");
	urlAry.push(item);
	// console.log(item);
}

urlAry.push("");
fs.writeFileSync(path.join(__dirname, "README.md"), urlAry.join("\n\n"));

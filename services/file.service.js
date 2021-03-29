const fs = require("fs");
const path = require("path");
const { NotFoundError } = require("../src/errors");
const mkdir = require("mkdirp").sync;
const mime = require("mime-types");
const cloudinary = require('cloudinary') 

const uploadDir = path.join(__dirname, "__uploads");
mkdir(uploadDir);

cloudinary.config({
    cloud_name: 'do3we3jk1',
    api_key: 554259798325127,
    api_secret: 'EidUs6TZ54dIS1HRxdurHuQS4hw'
});

module.exports = {
	name: "file",
	actions: {
		image: {
			handler(ctx) {
				ctx.meta.$responseType = "image/png";
				// Return as stream
				return fs.createReadStream(path.join(__dirname, "full", "assets", "images", "logo.png"));
			}
		},

		html: {
			handler(ctx) {
				ctx.meta.$responseType = "text/html";
				return Buffer.from(`
                <html>
                <body>
                    <h1>Hello API Gateway!</h1>
                    <img src="/api/file.image" />
                </body>
                </html>
                                `);
			}
		},

		save: {
			handler(ctx) {
				return this.test(ctx);
			}
		},

		saveParams: {
			handler(ctx) {
				// get params from url
				return ctx.params.$params;
			}
		}
	},
	methods: {
		randomName() {
			return "unnamed_" + Date.now() + ".png";
		},
		test(ctx) {
			return new this.Promise((resolve, reject) => {
				//reject(new Error("Disk out of space"));
			//	console.log('test:',ctx.params.name)
				const filePath = path.join(uploadDir, ctx.meta.filename || this.randomName());
				const f = fs.createWriteStream(filePath);
				f.on("close", () => {
					this.logger.info(`Uploaded file stored in '${filePath}'`);
					resolve('done');
				});
				f.on("error", err => reject(err));

				//ctx.params.pipe(f);
			});
		}
	}
};
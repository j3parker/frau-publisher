'use strict';

var vfs = require('vinyl-fs'),
	proxyquire = require('proxyquire');

var client = {
	list: function(object, cb) {
		console.log('!!!!!!! list');
		cb(null, { Contents: [] });
	},
	putBuffer: function(contents, uploadPath, headers, cb) {
		console.log('!!!!!!! putBuffer');
		cb(null, { statusCode: 200 });
	}
};

var publisher = proxyquire('../src/publisher', {
	knox: {
		createClient: () => client,
		'@global': true
	}
});

describe('publisher', function() {
	it('should publish semver appconfigs', function(done) {
		var opts = {
			initialPath: 'foo',
			targetDirectory: 'bar',
			version: '1.2.3',
			creds: {
				key: 'myKey',
				secret: 'mySecret'
			}
		};

		var publishStream = publisher.app(opts).getStream();

		vfs.src(['./test/support/file.js', './test/support/appconfig.json'])
			.pipe(publishStream)
			.on('data', function() {
				console.log('!!!!!!! data');
				try {
					done();
				} catch (e) {
					done(e);
				}
			})
			.on('end', function() {
				console.log('!!!!!!! end');
				try {
					done();
				} catch (e) {
					done(e);
				}
			});
	});
});

const fs = require('fs')
const path = require('path')
const rollup = require('rollup')
const pkg = require('../package.json')
const buble = require('rollup-plugin-buble');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('uglify-js')
const zlib = require('zlib')

const exists = fs.existsSync;
const name = pkg.name;
const version = pkg.version;
let modulePath = process.env.npm_config_bz_mod;

if (typeof modulePath === 'undefined') {
  console.log('请先配置模块所在目录');
  console.log('Example: npm config set bz-mod "D:\\source"');
  throw new Error('没有配置模块路径');
} else if (!exists(modulePath)) {
  throw new Error('模块目录不存在，请检查配置的模块目录是否正确');
} else {
  modulePath = path.join(modulePath, name);
  if (!exists(modulePath)) {
    fs.mkdirSync(modulePath);
  }
  modulePath = path.join(modulePath, version);
  if (!exists(modulePath)) {
    fs.mkdirSync(modulePath);
  }
}

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}


const buildList = {
  'umd': {
    plugins: [
      resolve(),
      commonjs()
    ],
    format: 'umd',
    output: 'dist/Bzswipe.umd.js',
  },
  'esm': {
    plugins: [
      resolve(),
      commonjs()
    ],
    format: 'es',
    output: 'dist/Bzswipe.esm.js',
  },
  'mod-min': {
    output: path.join(modulePath, 'Bzswipe.min.js'),
    format: 'umd'
  },
  'mod': {
    output: path.join(modulePath, 'Bzswipe.js'),
    format: 'umd'
  }
}

function getConfig(opts) {
  const config = {
    input: {
      input: 'src/index.js',
      plugins: [
        buble()
      ].concat(opts.plugins || [])
    },
    output: {
      file: opts.output,
      format: opts.format,
      name: 'Bzswipe'
    }
  };

  return config;
}
const getAllBuilds = () => Object.keys(buildList).map(name => getConfig(buildList[name]));
const builds = getAllBuilds();


function build(builds) {
  let built = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++
      if (built < total) {
        next()
      }
    }).catch(logError)
  }
  next()
}

async function buildEntry(config) {
  const isProd = /min\.js$/.test(config.output.file)
  const bundle = await rollup.rollup(config.input);
  await bundle.generate(config.output).then(function (result) {
    const code = result.code;
    if (isProd) {
      var minified = uglify.minify(code, {
        output: {
          ascii_only: true
        },
        compress: {
          pure_funcs: ['makeMap']
        }
      }).code
      return write(config.output.file, minified, true)
    } else {
      return write(config.output.file, code)
    }
  })
}

function write(dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report(extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }

    fs.writeFile(dest, code, (err) => {
      if (err) {
        return reject(err)
      }
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      } else {
        report()
      }
    })
  })
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}

function logError(e) {
  console.log(e)
}

build(builds)

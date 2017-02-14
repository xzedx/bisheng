const assert = require('assert');
const path = require('path');
const { escapeWinPath } = require('../../lib/utils/escape-win-path');
const sourceData = require('../../lib/utils/source-data');

const sourcePath = path.join(__dirname, '../fixtures/posts');
const transformers = [{
  test: /\.md$/.toString(),
  use: path.join(__dirname, '..', '..', 'lib', 'transformers', 'markdown'),
}];

describe('bisheng/utils/source-data', () => {
  describe('#generate', () => {
    it('should generate a files tree from `config.source`', () => {
      const filesTree = sourceData.generate(sourcePath, transformers);
      assert.deepEqual(filesTree, {
        a: {
          'en-US': path.join(sourcePath, 'a.en-US.md'),
          'zh-CN': path.join(sourcePath, 'a.zh-CN.md'),
        },
        b: path.join(sourcePath, 'b.md'),
      });
    });

    it('should generate a files tree from `config.source`', () => {
      const filesTree = sourceData.generate([sourcePath], transformers);
      assert.deepEqual(filesTree, {
        a: {
          'en-US': path.join(sourcePath, 'a.en-US.md'),
          'zh-CN': path.join(sourcePath, 'a.zh-CN.md'),
        },
        b: path.join(sourcePath, 'b.md'),
      });
    });

    it('should generate files trees while `config.source` is an object', () => {
      const filesTree = sourceData.generate({ mockData: sourcePath }, transformers);
      assert.deepEqual(filesTree, {
        mockData: {
          a: {
            'en-US': path.join(sourcePath, 'a.en-US.md'),
            'zh-CN': path.join(sourcePath, 'a.zh-CN.md'),
          },
          b: path.join(sourcePath, 'b.md'),
        },
      });
    });
  });

  describe('#stringify', () => {
    const sourceLoaderPath = path.join(__dirname, '..', '..', 'lib', 'loaders', 'source-loader');
    const loaderString = `${sourceLoaderPath}?config=aaa&isBuild=true!`;

    it('should stringify value to `require` sentence', () => {
      const filesTree = sourceData.generate(sourcePath, transformers);
      const stringified = sourceData.stringify(filesTree, { configFile: 'aaa', isBuild: true });
      assert.strictEqual(stringified, '{\n' +
                         '  \'a\': {\n' +
                         `    'en-US': require('${loaderString}${escapeWinPath(path.join(sourcePath, 'a.en-US.md'))}'),\n` +
                         `    'zh-CN': require('${loaderString}${escapeWinPath(path.join(sourcePath, 'a.zh-CN.md'))}'),\n` +
                         '  },\n' +
                         `  'b': require('${loaderString}${escapeWinPath(path.join(sourcePath, 'b.md'))}'),\n` +
                         '}');
    });
  });
});
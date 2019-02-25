module.exports = {
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        // options placed here will be merged with default
        // configuration and passed to electron-builder
        directories: {
          buildResources: 'build',
        },
        appId: 'com.github.rapgru.dreamalyze',
        win: {
          target: [
            {
              target: 'nsis',
              arch: ['x64', 'ia32'],
            },
          ],
        },
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true,
          artifactName: '${productName}_Setup_${version}.${ext}',
        },
        publish: [
          'github',
        ],
      },
    },
  },
};

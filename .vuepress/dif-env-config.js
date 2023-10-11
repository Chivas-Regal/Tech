const args = process.argv.slice(2); // 去除前两个默认参数
let version;

// 遍历命令行参数，查找--version参数并获取其值
args.forEach(arg => {
  if (arg.startsWith('--version=')) {
    version = arg.split('=')[1];
  }
});

let OauthConfig = {
    clientId: '',
    clientSecret: ''
};

// 根据版本选择不同的主机
if (version === 'development') {
  // 使用开发环境主机
  OauthConfig.clientId = 'd2375c81f1a1b41ba479';
  OauthConfig.clientSecret = '5667588b98b5e33039b9f49bc589ea4f42b9b03d';
} else if (version === 'production') {
    OauthConfig.clientId = '8235fb8e1f8936b95c49';
    OauthConfig.clientSecret = '237105ee4e21bd033ba547003938ee60abedbe4c';
}

module.exports = {
    OauthConfig
}
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/public/js/map.js',  // 클라이언트 측 엔트리 파일 경로
  output: {
    filename: 'bundle.js',  // 번들된 파일 이름
    path: path.resolve(__dirname, 'src/dist'),  // 번들 파일이 저장될 경로
    publicPath: '/dist/',  // 정적 파일의 공개 경로
  },
  module: {
    rules: [
      {
        test: /\.js$/,  // .js 파일을 대상으로
        exclude: /node_modules/,  // node_modules 제외
        use: {
          loader: 'babel-loader',  // Babel 로더를 사용하여 트랜스파일
        },
      },
    ],
  },
  devServer: {
    static: path.join(__dirname, 'src/public'),  // 정적 파일 경로
    compress: true,
    port: 3000,  // 개발 서버 포트
  },
};
/* eslint-disable */
var path, node_ssh, ssh, fs

fs = require('fs')
path = require('path')
node_ssh = require('node-ssh')
ssh = new node_ssh()
const password = '~!@@!~JIUDUOjiuduo'
const failed = []
const successful = []

// connect sftp
ssh.connect({
  host: '139.196.212.249',
  username: 'root',
  port: 22,
  password,
  tryKeyboard: true,
  onKeyboardInteractive: (name, instructions, instructionsLang, prompts, finish) => {
    if (prompts.length > 0 && prompts[0].prompt.toLowerCase().includes('password')) {
      finish([password])
    }
  }
}).then(function() {
  ssh.putDirectory('./dist', '/var/www/ldsadmin', {
    recursive: true,
    concurrency: 10,
    validate: function(itemPath) {
      const baseName = path.basename(itemPath)
      return baseName.substr(0, 1) !== '.' && // do not allow dot files
        baseName !== 'node_modules' // do not allow node_modules
    },
    tick: function(localPath, remotePath, error) {
      if (error) {
        failed.push(localPath)
      } else {
        successful.push(localPath)
      }
    }
  }).then(function(status) {
    console.log('the directory transfer was', status ? 'successful' : 'unsuccessful')
  }).catch(e => {
    console.error(e)
  }).finally(function() {
    process.exit(1)
  })
})

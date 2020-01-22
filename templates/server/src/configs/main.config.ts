import {Config} from 'zation-server';

module.exports = Config.mainConfig(
    {
        port: {{port}},
        appName: '{{name}}',
        usePanel: true,
        panelUser: {username: 'admin', password: 'admin'},
    });
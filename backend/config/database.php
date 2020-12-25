<?php
return [
    'default' => 'mongodb',
    'connections' => [

        'mongodb' => [
            'driver' => 'mongodb',
            'host' => 'localhost',
            'port' => 27017,
            'database' => 'quizapp',
            'username' => '',
            'password' => '',
            'options' => [
                'database' => 'admin'
            ]
        ],

        'mysql' => [
            'driver' => 'mysql',
            'host' => 'localhost',
            'database' => 'demo',
            'username' => 'root',
            'password' => null,
            'charset'   => 'utf8',
            'collation' => 'utf8_unicode_ci',
        ],
    ]
];

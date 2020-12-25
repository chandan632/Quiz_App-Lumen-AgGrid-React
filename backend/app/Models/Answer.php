<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;

class Answer extends Model
{

    protected $connection = 'mongodb';
    protected $collection = 'answers';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'answers',
    ];
}

<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;

class Questions extends Model
{

    protected $connection = 'mongodb';
    protected $collection = 'questions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'category', 'subCategory', 'questions',
    ];
}

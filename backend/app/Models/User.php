<?php

namespace App\Models;

// use Illuminate\Auth\Authenticatable;
// use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
// use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
// use Laravel\Lumen\Auth\Authorizable;

use Jenssegers\Mongodb\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class User extends Model
{

    protected $connection = 'mongodb';
    protected $collection = 'users';
    public function __construct()
    {
        $this->dbconnection = DB::connection("mongodb");
        $this->collection = "users";
    }
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'number', 'password',
    ];

    public function allUsers()
    {
        $result = $this->dbconnection->collection($this->collection)->get();
        return $result;
    }

    public function deleteUser($data)
    {
        $result = $this->dbconnection->collection($this->collection)->where("_id", $data["id"])->delete();
        return $result;
    }

    public function register($data)
    {
        $result = $this->dbconnection->collection($this->collection)->insertGetId($data);
        return $result;
    }

    public function pagedUsers($data)
    {
        $result = $this->dbconnection->collection($this->collection)->offset($data["offset"])->limit($data["limit"])->get();
        echo json_encode($result);
    }
}

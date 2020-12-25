<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Jenssegers\Mongodb\Eloquent\Model;

class SubCategory extends Model
{

    // protected $connection = 'mongodb';
    // protected $collection = 'sub-categories';
    public function __construct()
    {
        $this->dbConnection = DB::connection("mongodb");
        $this->collection = "sub-categories";
    }
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'subCategory', 'category', 'subcategoryId',
    ];


    public function addSubCategory($data)
    {
        $result = $this->dbConnection->collection($this->collection)->insertAndGetId($data);
        return $result;
    }
    public function allSubCategories()
    {
        $result = $this->dbConnection->collection($this->collection)->get();
        return $result;
    }
    public function deleteSubCategory($data)
    {

        $subCat = $this->dbConnection->collection($this->collection)->where("subCategoryId", $data["subCategoryId"])->get();

        $this->dbConnection->collection("questions")->where("subCategory", $subCat[0]["subCategory"])->delete();

        $result = $this->dbConnection->collection($this->collection)->where("subCategoryId", $data["subCategoryId"])->delete();
        return $result;
    }

    public function editSubCategory($data)
    {
        $result = $this->dbConnection->collection($this->collection)->where("subCategoryId", $data["subCategoryId"])->update(["category" => $data["category"], "subCategory" => $data["subCategory"]]);
        return $result;
    }

    public function findSubCategories($data)
    {
        $result = $this->dbConnection->collection($this->collection)->where("category", $data["category"])->get();
        return $result;
    }
}

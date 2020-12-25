<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
// use Illuminate\Database\Eloquent\Model;
use Jenssegers\Mongodb\Eloquent\Model;

class Category extends Model
{

    public function __construct()
    {
        $this->dbConnection = DB::connection("mongodb");
        $this->collection = "categories";
    }
    protected $fillable = [
        'category',
    ];
    public function pagedCategory($data)
    {
        $filterModel = isset($data["filterModel"]["category"]) ? $data["filterModel"]["category"] : 0;
        $this->filterModel = $filterModel;
        $sortModel = isset($data["sortModel"][0]) ? $data["sortModel"][0] : 0;
        $notLike = "not like";
        $this->sortModel = $sortModel;
        if (isset($filterModel["condition1"]) && isset($filterModel["condition2"]) && isset($filterModel["operator"])) {
            $condition1Filter = $filterModel["condition1"]["filter"];
            $condition1Type = $filterModel["condition1"]["type"];

            $condition2Filter = $filterModel["condition2"]["filter"];
            $condition2Type = $filterModel["condition2"]["type"];

            $operator = $filterModel["operator"];
            $query =
                $this->dbConnection->collection($this->collection);
            switch ($condition1Type) {
                case 'contains':
                    $query->where("category", "like", "%" . $condition1Filter . "%");
                    break;
                case 'notContains':
                    $query->where("category", $notLike, "%" . $condition1Filter . "%");
                    break;
                case 'equals':
                    $query->where("category", "=", $condition1Filter);
                    break;
                case 'notEqual':
                    $query->where("category", "!=", $condition1Filter);
                    break;
                case 'startsWith':
                    $query->where("category", "like",  $condition1Filter . "%");
                    break;
                case 'endsWith':
                    $query->where("category", "like", "%" . $condition1Filter);
                    break;

                default:
                    # code...
                    break;
            }
            if ($operator == "AND") {
                switch ($condition2Type) {
                    case 'contains':
                        $query->where("category", "like", "%" . $condition2Filter . "%");
                        break;
                    case 'notContains':
                        $query->where("category", $notLike, "%" . $condition2Filter . "%");
                        break;
                    case 'equals':
                        $query->where("category", "=", $condition2Filter);
                        break;
                        // case 'notEqual':
                        // $query->where("category", "!=", $condition2Filter);
                        break;
                    case 'startsWith':
                        $query->where("category", "like",  $condition2Filter . "%");
                        break;
                    case 'endsWith':
                        $query->where("category", "like", "%" . $condition2Filter);
                        break;

                    default:
                        # code...
                        break;
                }
                // echo "exec";
                if ($this->sortModel) {
                    $query->orderBy("category", $this->sortModel["sort"]);
                }
                $result = $query->skip($data["offset"])->limit($data["limit"])->get();
                return json_encode($result);
            } else {
                $query->where(function ($q) {
                    $condition2Filter = $this->filterModel["condition2"]["filter"];
                    $condition2Type = $this->filterModel["condition2"]["type"];
                    switch ($condition2Type) {
                        case 'contains':
                            $q->where("category", "like", "%" . $condition2Filter . "%");
                            break;
                        case 'notContains':
                            $q->where("category", $notLike, "%" . $condition2Filter . "%");
                            break;
                        case 'equals':
                            $q->where("category", "=", $condition2Filter);
                            break;
                        case 'notEqual':
                            $q->where("category", "!=", $condition2Filter);
                            break;
                        case 'startsWith':
                            $q->where("category", "like",  $condition2Filter . "%");
                            break;
                        case 'endsWith':
                            $q->where("category", "like", "%" . $condition2Filter);
                            break;

                        default:
                            # code...
                            break;
                    }
                });
                if ($this->sortModel) {
                    $query->orderBy("category", $this->sortModel["sort"]);
                }
                $result = $query->skip($data["offset"])->take($data["limit"])->get();
                return json_encode($result);
            }
        }
        if (isset($filterModel["filter"]) && isset($filterModel["filterType"]) && isset($filterModel["type"])) {
            $filter = $filterModel["filter"];
            $filterType = $filterModel["filterType"];
            $type = $filterModel["type"];
            $query =
                $this->dbConnection->collection($this->collection);
            switch ($type) {
                case 'contains':
                    $query->where("category", "like", "%" . $filter . "%");
                    break;
                case 'notContains':
                    $query->where("category", $notLike, "%" . $filter . "%");
                    break;
                case 'equals':
                    $query->where("category", "=", $filter);
                    break;
                case 'notEqual':
                    $query->where("category", "!=", $filter);
                    break;
                case 'startsWith':
                    $query->where("category", "like",  $filter . "%");
                    break;
                case 'endsWith':
                    $query->where("category", "like", "%" . $filter);
                    break;

                default:
                    # code...
                    break;
            }
            $result = $query->skip($data["offset"])->take($data["limit"])->get();
            return json_encode($result);
        }
        if ($this->sortModel) {
            $result =
                $this->dbConnection->collection($this->collection)->orderBy("category", $this->sortModel["sort"])->skip($data["offset"])->take($data["limit"])->get();
            return json_encode($result);
        }
        $result =
            $this->dbConnection->collection($this->collection)->skip($data["offset"])->take($data["limit"])->get();
        return json_encode($result);
    }
    public function deleteCategory($data)
    {
        $cat = $this->dbConnection->collection($this->collection)->where("categoryId", $data["categoryId"])->get();
        $this->dbConnection->collection('sub-categories')->where('category', $cat[0]['category'])->delete();
        $this->dbConnection->collection('questions')->where('category', $cat[0]['category'])->delete();
        $result = $this->dbConnection->collection($this->collection)->where("categoryId", $data["categoryId"])->delete();
        return $result;
    }
    public function addCategory($data)
    {
        $result = $this->dbConnection->collection($this->collection)->insertGetId($data);
        return $result;
    }

    public function editCategory($data)
    {
        $result = $this->dbConnection->collection($this->collection)->where("categoryId", $data["categoryId"])->update(["category" => $data["category"]]);
        return $result;
    }
    public function allCategories()
    {
        $result = $this->dbConnection->collection($this->collection)->get();
        return json_encode($result);
    }
}

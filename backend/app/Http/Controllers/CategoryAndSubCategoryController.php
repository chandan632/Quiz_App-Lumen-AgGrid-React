<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\SubCategory;

class CategoryAndSubCategoryController extends BaseController
{
    public function addCategory(Request $request)
    {
        $category = new Category;

        $categoryModal = $category->addCategory(["category" => $request->input("category"), "categoryId" => $request->input("categoryId")]);

        if ($categoryModal) {
            return response()->json([
                "msg" => "Category saved successfully."
            ], 200);
        } else {
            return response()->json([
                "error" => "Can't save category."
            ], 400);
        }
    }

    public function allCategories()
    {
        $category = new Category;

        return $category->allCategories();

        // return response()->json($categories, 200);
    }

    public function editCategory(Request $request)
    {

        $category = new Category;

        $categoryIns = $request->input("category");
        $categoryId = $request->input("categoryId");

        $categoryModel = $category->editCategory(["category" => $categoryIns, "categoryId" => $categoryId]);

        // $categoryModel = Category::where("categoryId", $categoryId)->update(array("category" => $category));

        if ($categoryModel) {
            return response()->json([
                "msg" => "Category Updated Successfully!"
            ], 200);
        } else {
            return response()->json([
                "error" => "Can't update!"
            ], 400);
        }
    }

    public function deleteCategory(Request $request)
    {
        $categoryId = $request->input("categoryId");

        $category = new Category;

        $categoryModel = $category->deleteCategory(["categoryId" => $categoryId]);

        if ($categoryModel) {
            return response()->json([
                "msg" => "Category Deleted Successfully!"
            ], 200);
        } else {
            return response()->json([
                "error" => "Can't delete!"
            ], 400);
        }
    }

    public function pagedCategory(Request $request)
    {
        $limit = $request->input("limit");
        $offset = $request->input("offset");
        $filterModel = $request->input("filterModel");
        $sortModel = $request->input("sortModel");

        $category = new Category;

        return $category->pagedCategory(["limit" => $limit, "offset" => $offset, "filterModel" => $filterModel, "sortModel" => $sortModel]);
    }
    public function test(Request $request)
    {
        $filterModel = $request->input("filterModel");
        print_r($filterModel["category"]);
    }


    // Sub-Category
    public function addSubCategory(Request $request)
    {
        $subCategory = new SubCategory;

        $result = $subCategory->addSubCategory(["subCategory" => $request->input("subCategory"), "category" => $request->input("category"), "subCategoryId" => $request->input("subCategoryId")]);

        if ($result) {
            return response()->json([
                "msg" => "SubCategory saved successfully."
            ], 200);
        } else {
            return response()->json([
                "error" => "Can't save subCategory."
            ], 400);
        }
    }

    public function allSubCategories()
    {
        $subCategories = new SubCategory;

        return response()->json($subCategories->allSubCategories(), 200);
    }

    public function deleteSubCategory(Request $request)
    {
        $subCategories = new SubCategory;

        $subCategoryId = $request->input("subCategoryId");

        $result = $subCategories->deleteSubCategory(["subCategoryId" => $subCategoryId]);

        if ($result) {
            return response()->json([
                "msg" => "Sub-Category Deleted Successfully!"
            ], 200);
        } else {
            return response()->json([
                "error" => "Can't delete!"
            ], 400);
        }
    }
    public function editSubCategory(Request $request)
    {
        $subCategories = new SubCategory;

        $category = $request->input("category");
        $subCategory = $request->input("subCategory");
        $subCategoryId = $request->input("subCategoryId");

        $result = $subCategories->editSubCategory(["subCategoryId" => $subCategoryId, "category" => $category, "subCategory" => $subCategory]);

        // $subCategoryModel = SubCategory::where("subCategoryId", $subCategoryId)->update(array("category" => $category, "subCategory" => $subCategory));

        if ($result) {
            return response()->json([
                "msg" => "Sub-Category Updated Successfully!"
            ], 200);
        } else {
            return response()->json([
                "error" => "Can't update!"
            ], 400);
        }
    }
    public function findSubCategories(Request $request)
    {

        $subCategories = new SubCategory;

        $category = $request->input("category");

        $result = $subCategories->findSubCategories(["category" => $category]);

        return response()->json($result, 200);
    }
}

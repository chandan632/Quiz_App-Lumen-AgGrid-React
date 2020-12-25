<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->post("/register", "UserController@register");
$router->post("/login", "UserController@login");

// Category
$router->post("/addcategory", "CategoryAndSubCategoryController@addCategory");
$router->get("/allcategories", "CategoryAndSubCategoryController@allCategories");
$router->patch("/editcategory", "CategoryAndSubCategoryController@editCategory");
$router->delete("/deletecategory", "CategoryAndSubCategoryController@deleteCategory");
$router->post("/pagedcategory", "CategoryAndSubCategoryController@pagedCategory");


// Sub-Category
$router->post("/addsubcategory", "CategoryAndSubCategoryController@addSubCategory");
$router->get("/allsubcategories", "CategoryAndSubCategoryController@allSubCategories");
$router->delete("/deletesubcategory", "CategoryAndSubCategoryController@deleteSubCategory");
$router->patch("/editsubcategory", "CategoryAndSubCategoryController@editSubCategory");
$router->post("/findsubcategories", "CategoryAndSubCategoryController@findSubCategories");

// Users
$router->get("/allusers", "UserController@allUsers");
$router->delete("/deleteuser", "UserController@deleteUser");
$router->post("/pagedusers", "UserController@pagedUsers");

// Questions 
$router->post("/addquestions", "QuestionsController@addQuestions");
$router->get("/getquestionssets", "QuestionsController@getQuestionSets");
$router->post("/result", "QuestionsController@result");
$router->delete("/deletesetofquestion", "QuestionsController@deleteSet");

$router->post("/editquestionset", "QuestionsController@editQuestionset");


$router->post("/test", "CategoryAndSubCategoryController@test");

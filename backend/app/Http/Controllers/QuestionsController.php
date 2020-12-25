<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Models\Questions;
use App\Models\Answer;
use Symfony\Component\Console\Question\Question;

class QuestionsController extends BaseController
{
    public function addQuestions(Request $request)
    {
        $questionsModel = new Questions;

        $category = $request->input("category");
        $subCategory = $request->input("subCategory");
        $questions = $request->input("questions");
        $setId = $request->input("setId");
        $tagline = $request->input("tagline");

        $questionsModel->category = $category;
        $questionsModel->subCategory = $subCategory;
        $questionsModel->questions = $questions;
        $questionsModel->setId = $setId;
        $questionsModel->tagline = $tagline;

        if ($questionsModel->save()) {
            return response()->json(["msg" => "Questions saved successfully!"], 200);
        } else {
            return response()->json(["error" => "Questions saved successfully!"], 400);
        }
    }
    public function getQuestionSets()
    {
        $questionsSets = Questions::all();

        return response()->json($questionsSets, 200);
    }

    public function result(Request $request)
    {
        $answerModel = new Answer;
        $answers = $request->input("allAnswers");
        $user = $request->input("user");

        $answerModel->answers = $answers;
        $answerModel->user = $user;

        if ($answerModel->save()) {
            return response()->json([
                "msg" => "Answers saved successfully"
            ], 200);
        } else {
            return response()->json([
                "error" => "Can't save"
            ], 400);
        }
    }

    public function deleteSet(Request $request)
    {
        $setId = $request->input("setId");
        $deleteResult = Questions::where("setId", $setId)->delete();
        if ($deleteResult) {
            return response()->json([
                "msg" => "Deleted successfully!"
            ], 200);
        } else {
            return response()->json(["error" => "Can't delete!"], 4000);
        }
    }

    public function editQuestionset(Request $request)
    {
        $setId = $request->input("setId");
        $setOfQuestion = $request->input("setOfQuestion");

        $result = Questions::where("setId", $setId)->update(["questions" => $setOfQuestion["questions"], "tagline" => $setOfQuestion["tagline"], "category" => $setOfQuestion["category"], "subCategory" => $setOfQuestion["subCategory"]]);

        if ($result) {
            return response()->json(["msg" => "Updated successfully!"], 200);
        } else {
            return response()->json(["msg" => "Can't update!"], 400);
        }
    }
}

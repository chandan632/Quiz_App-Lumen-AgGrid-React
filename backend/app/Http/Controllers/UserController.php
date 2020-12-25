<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Firebase\JWT\JWT;
use Laravel\Lumen\Routing\Controller as BaseController;

class UserController extends BaseController
{
    public function register(Request $request)
    {

        $user = new User;

        $name = $request->input("name");
        $email = $request->input("email");
        $number = $request->input("number");
        $password = Hash::make($request->input("password"));

        $result = $user->register(["name" => $name, "email" => $email, "number" => $number, "password" => $password]);

        if ($result) {
            return response()->json([
                "msg" => "User saved successfully."
            ], 200);
        } else {
            return response()->json([
                "error" => "Can't save successfully."
            ], 400);
        }
    }

    public function login(Request $request)
    {
        $email = $request->input("email");
        $password = $request->input("password");
        if ($email == "admin@gmail.com" && $password == "admin@123") {
            $payload = [
                "name" => "Admin",
                "userEmail" => "admin@gmail.com",
                "exp" => time() + 60 * 60
            ];
            $token = JWT::encode($payload, env('JWT_SECRET'));
            return response()->json([
                "token" => $token
            ], 200);
        } else {
            $user = User::where('email', $email)->first();
            if (!$user) {
                return response()->json([
                    "error" => "Email does not exist."
                ], 401);
            }

            if (Hash::check($password, $user->password)) {
                $payload = [
                    "name" => $user->name,
                    "userID" => $user->_id,
                    "userEmail" => $user->email,
                    "exp" => time() + 60 * 60
                ];
                $token = JWT::encode($payload, env('JWT_SECRET'));
                return response()->json([
                    "token" => $token
                ], 200);
            }

            return response()->json([
                'error' => 'Email or password is wrong.'
            ], 400);
        }
    }


    // Show All User
    public function allUsers()
    {
        $users = new User;

        return response()->json($users->allUsers(), 200);
    }
    public function deleteUser(Request $request)
    {
        try {

            $user = new User;

            $id = $request->input("_id");

            $result = $user->deleteUser(["id" => $id]);

            // $result = User::where("_id", $id)->delete();

            if ($result) {
                return response()->json([
                    "msg" => "User deleted successfully!"
                ]);
            } else {
                return response()->json([
                    "error" => "can't delete user"
                ], 400);
            }
        } catch (\Throwable $th) {
            return response()->json([
                "error" => "can't delete user!"
            ], 400);
        }
    }

    public function pagedUsers(Request $request)
    {
        $limit = $request->input("limit");
        $offset = $request->input("offset");

        $user = new User;

        $user->pagedUsers(["limit" => $limit, "offset" => $offset]);
    }
}

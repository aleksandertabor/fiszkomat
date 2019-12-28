<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use \Cviebrock\EloquentSluggable\Services\SlugService;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $loginType = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $input = [
            $loginType => $request->login,
            'password' => $request->password,
        ];

        $validator = Validator::make($input, [
            'username' => ['required_without:email', 'string', 'nullable', 'exists:users'],
            'email' => ['required_without:username', 'string', 'nullable', 'exists:users'],
            'password' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 401);
        } else {
            $credentials = $input;
        }

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('FlashcardsUserToken')->accessToken;
            return response()->json([
                // 'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'token' => $token,
            ])->cookie('token', $token, 30, null, null, null, true);
        }

        return response()->json(['errors' => ['login' => [0 => 'Credentials are not valid.']]], 401);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 401);
        }

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        // preg_match('/([^@]{1,50}+)/m', $input['email'], $matches);

        // username - max 50 characters length, if too short, randoms
        $username = Str::limit(Str::before($input['email'], '@'), 50, '');
        $usernameSize = mb_strlen($username);
        if ($usernameSize < 3) {
            $username .= Str::random(3);
        }
        $username = SlugService::createSlug(User::class, 'username', $username);

        $input['username'] = $username;

        $user = User::create($input);
        $token = $user->createToken('FlashcardsUserToken')->accessToken;

        return response()->json([
            'username' => $user->username,
            'email' => $user->email,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        // auth()->user()->tokens->each(function ($token, $key) {
        //     $token->delete();
        // });
        // auth()->user()->token()->revoke();

        // $value = $request->bearerToken();

        // $id = (new Parser())->parse($value)->getHeader('jti');
        // dd($id);
        // $token = $request->user()->tokens->find($id);
        // $token->revoke();
        // dd($token);

        // dd($request->user('api'));

        if ($request->user('api')) {
            $request->user('api')->token()->revoke();
            return response()->json('Logged out', 200);
        }

        return response()->json(['errors' => ['Unauthorized']], 403);
    }
}